const express = require("express");
const { pool } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", requireAuth, requireRole("admin"), async (request, response, next) => {
  try {
    const [[vehicleStats]] = await pool.execute(
      `
      SELECT
        COUNT(*) AS totalVehicles,
        SUM(availability_status = 'available') AS availableVehicles,
        SUM(availability_status = 'rented') AS rentedVehicles,
        SUM(availability_status = 'maintenance') AS maintenanceVehicles
      FROM vehicle_availability
      `,
    );

    const [[bookingStats]] = await pool.execute(
      `
      SELECT
        COUNT(*) AS totalBookings,
        SUM(booking_status = 'reserved') AS reservedBookings,
        SUM(booking_status = 'active') AS activeBookings,
        SUM(amount_due > 0) AS dueBookings,
        COALESCE(SUM(amount_paid), 0) AS revenue
      FROM booking_payment_summary
      `,
    );

    response.json({
      stats: {
        ...vehicleStats,
        ...bookingStats,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/customers", requireAuth, requireRole("admin"), async (request, response, next) => {
  try {
    const [customers] = await pool.execute(
      `
      SELECT c.*, u.status as account_status 
      FROM customers c
      JOIN users u ON c.user_id = u.user_id
      `
    );
    response.json({ customers });
  } catch (error) {
    next(error);
  }
});

router.put("/customers/:customerId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { customerId } = request.params;
  const { first_name, last_name, phone, licence_number, address, account_status } = request.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [custResult] = await connection.execute(
      `
      UPDATE customers
      SET first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          phone = COALESCE(?, phone),
          licence_number = COALESCE(?, licence_number),
          address = COALESCE(?, address)
      WHERE customer_id = ?
      `,
      [first_name, last_name, phone, licence_number, address, customerId]
    );

    if (account_status) {
      await connection.execute(
        `UPDATE users SET status = ? WHERE user_id = (SELECT user_id FROM customers WHERE customer_id = ?)`,
        [account_status, customerId]
      );
    }

    await connection.commit();
    response.json({ message: "Customer updated successfully." });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

router.delete("/customers/:customerId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { customerId } = request.params;

  try {
    const [bookings] = await pool.execute(
      `SELECT 1 FROM bookings WHERE customer_id = ? LIMIT 1`,
      [customerId]
    );

    if (bookings.length > 0) {
      return response.status(400).json({ message: "Cannot delete a customer with rental history." });
    }

    await pool.execute(`DELETE FROM users WHERE user_id = (SELECT user_id FROM customers WHERE customer_id = ?)`, [customerId]);
    // The CASCADE in sqlite triggers customer deletion, but let's be explicit
    await pool.execute(`DELETE FROM customers WHERE customer_id = ?`, [customerId]);

    response.json({ message: "Customer deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
