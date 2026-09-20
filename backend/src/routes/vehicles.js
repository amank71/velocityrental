const express = require("express");
const { pool } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    const [vehicles] = await pool.execute(
      `
      SELECT *
      FROM vehicle_availability
      ORDER BY availability_status, daily_rate, registration_number
      `,
    );

    response.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (request, response, next) => {
  const {
    registrationNumber,
    make,
    model,
    vehicleType,
    manufactureYear,
    seats,
    dailyRate,
    operationalStatus,
    odometerKm,
  } = request.body;

  if (!registrationNumber || !make || !model || !vehicleType || !manufactureYear || !seats || !dailyRate) {
    response.status(400).json({ message: "Vehicle details are incomplete." });
    return;
  }

  try {
    const [result] = await pool.execute(
      `
      INSERT INTO vehicles (
        registration_number,
        make,
        model,
        vehicle_type,
        manufacture_year,
        seats,
        daily_rate,
        operational_status,
        odometer_km
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        registrationNumber,
        make,
        model,
        vehicleType,
        manufactureYear,
        seats,
        dailyRate,
        operationalStatus || "available",
        odometerKm || 0,
      ],
    );

    response.status(201).json({ vehicleId: result.insertId });
  } catch (error) {
    next(error);
  }
});

router.patch("/:vehicleId/status", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { vehicleId } = request.params;
  const { operationalStatus } = request.body;

  if (!["available", "maintenance", "retired"].includes(operationalStatus)) {
    response.status(400).json({ message: "Invalid vehicle status." });
    return;
  }

  try {
    await pool.execute(
      `
      UPDATE vehicles
      SET operational_status = ?
      WHERE vehicle_id = ?
      `,
      [operationalStatus, vehicleId],
    );

    response.json({ message: "Vehicle status updated." });
  } catch (error) {
    next(error);
  }
});

router.put("/:vehicleId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { vehicleId } = request.params;
  const {
    registrationNumber, make, model, vehicleType,
    manufactureYear, seats, dailyRate, operationalStatus, odometerKm
  } = request.body;

  try {
    const [result] = await pool.execute(
      `
      UPDATE vehicles
      SET
        registration_number = COALESCE(?, registration_number),
        make = COALESCE(?, make),
        model = COALESCE(?, model),
        vehicle_type = COALESCE(?, vehicle_type),
        manufacture_year = COALESCE(?, manufacture_year),
        seats = COALESCE(?, seats),
        daily_rate = COALESCE(?, daily_rate),
        operational_status = COALESCE(?, operational_status),
        odometer_km = COALESCE(?, odometer_km)
      WHERE vehicle_id = ?
      `,
      [registrationNumber, make, model, vehicleType, manufactureYear, seats, dailyRate, operationalStatus, odometerKm, vehicleId]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Vehicle not found." });
    }
    response.json({ message: "Vehicle updated successfully." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:vehicleId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { vehicleId } = request.params;

  try {
    // Check if vehicle has any active bookings
    const [bookings] = await pool.execute(
      `SELECT 1 FROM bookings WHERE vehicle_id = ? AND booking_status IN ('reserved', 'active') LIMIT 1`,
      [vehicleId]
    );

    if (bookings.length > 0) {
      return response.status(400).json({ message: "Cannot delete a vehicle with active bookings. Please retire it instead." });
    }

    const [result] = await pool.execute(`DELETE FROM vehicles WHERE vehicle_id = ?`, [vehicleId]);
    
    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Vehicle not found." });
    }
    
    response.json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
