const express = require("express");
const { pool } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function daysBetweenInclusive(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / dayMs) + 1;
}

async function getCustomerIdForUser(userId) {
  const [rows] = await pool.execute(
    "SELECT customer_id FROM customers WHERE user_id = ? LIMIT 1",
    [userId],
  );

  return rows[0]?.customer_id;
}

router.get("/", requireAuth, async (request, response, next) => {
  try {
    let bookings;

    if (request.user.role === "admin") {
      [bookings] = await pool.execute(
        `
        SELECT *
        FROM booking_payment_summary
        ORDER BY start_date DESC, booking_id DESC
        `,
      );
    } else {
      const customerId = await getCustomerIdForUser(request.user.userId);

      [bookings] = await pool.execute(
        `
        SELECT *
        FROM booking_payment_summary
        WHERE customer_id = ?
        ORDER BY start_date DESC, booking_id DESC
        `,
        [customerId],
      );
    }

    response.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (request, response, next) => {
  const { vehicleId, startDate, endDate, customerId } = request.body;

  if (!vehicleId || !startDate || !endDate) {
    response.status(400).json({ message: "Vehicle and rental dates are required." });
    return;
  }

  const rentalDays = daysBetweenInclusive(startDate, endDate);

  if (rentalDays <= 0) {
    response.status(400).json({ message: "End date cannot be before start date." });
    return;
  }

  try {
    const targetCustomerId =
      request.user.role === "admin"
        ? customerId
        : await getCustomerIdForUser(request.user.userId);

    if (!targetCustomerId) {
      response.status(400).json({ message: "Customer profile not found." });
      return;
    }

    const [vehicleRows] = await pool.execute(
      `
      SELECT vehicle_id, daily_rate, operational_status
      FROM vehicles
      WHERE vehicle_id = ?
      LIMIT 1
      `,
      [vehicleId],
    );

    const vehicle = vehicleRows[0];

    if (!vehicle || vehicle.operational_status !== "available") {
      response.status(400).json({ message: "Vehicle is not available." });
      return;
    }

    const totalAmount = rentalDays * vehicle.daily_rate;

    const [result] = await pool.execute(
      `
      INSERT INTO bookings (
        customer_id,
        vehicle_id,
        start_date,
        end_date,
        booking_status,
        total_amount
      )
      VALUES (?, ?, ?, ?, 'reserved', ?)
      `,
      [targetCustomerId, vehicleId, startDate, endDate, totalAmount],
    );

    response.status(201).json({
      bookingId: result.insertId,
      totalAmount,
      message: "Booking created.",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:bookingId/status", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { bookingId } = request.params;
  const { bookingStatus, pickupOdometerKm, returnOdometerKm } = request.body;

  if (!["reserved", "active", "completed", "cancelled"].includes(bookingStatus)) {
    response.status(400).json({ message: "Invalid booking status." });
    return;
  }

  try {
    await pool.execute(
      `
      UPDATE bookings
      SET
        booking_status = ?,
        pickup_odometer_km = COALESCE(?, pickup_odometer_km),
        return_odometer_km = COALESCE(?, return_odometer_km)
      WHERE booking_id = ?
      `,
      [bookingStatus, pickupOdometerKm || null, returnOdometerKm || null, bookingId],
    );

    if (bookingStatus === "completed" && returnOdometerKm) {
      await pool.execute(
        `
        UPDATE vehicles v
        JOIN bookings b ON b.vehicle_id = v.vehicle_id
        SET v.odometer_km = ?
        WHERE b.booking_id = ?
        `,
        [returnOdometerKm, bookingId],
      );
    }

    response.json({ message: "Booking status updated." });
  } catch (error) {
    next(error);
  }
});

router.put("/:bookingId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { bookingId } = request.params;
  const { vehicleId, startDate, endDate, totalAmount } = request.body;

  try {
    const [result] = await pool.execute(
      `
      UPDATE bookings
      SET
        vehicle_id = COALESCE(?, vehicle_id),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        total_amount = COALESCE(?, total_amount)
      WHERE booking_id = ?
      `,
      [vehicleId, startDate, endDate, totalAmount, bookingId]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Booking not found." });
    }
    response.json({ message: "Booking updated successfully." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:bookingId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { bookingId } = request.params;

  try {
    const [result] = await pool.execute(`DELETE FROM bookings WHERE booking_id = ?`, [bookingId]);
    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Booking not found." });
    }
    response.json({ message: "Booking deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
