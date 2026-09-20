const express = require("express");
const { pool } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (request, response, next) => {
  try {
    if (request.user.role === "admin") {
      const [payments] = await pool.execute(
        `
        SELECT
          p.*,
          s.customer_name,
          s.registration_number,
          s.vehicle_name
        FROM payments p
        JOIN booking_payment_summary s ON s.booking_id = p.booking_id
        ORDER BY p.payment_date DESC
        `,
      );

      response.json({ payments });
      return;
    }

    const [payments] = await pool.execute(
      `
      SELECT
        p.*,
        s.customer_name,
        s.registration_number,
        s.vehicle_name
      FROM payments p
      JOIN booking_payment_summary s ON s.booking_id = p.booking_id
      JOIN customers c ON c.customer_id = s.customer_id
      WHERE c.user_id = ?
      ORDER BY p.payment_date DESC
      `,
      [request.user.userId],
    );

    response.json({ payments });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (request, response, next) => {
  const {
    bookingId,
    amount,
    paymentMethod,
    paymentStatus,
    transactionReference,
    notes,
  } = request.body;

  if (!bookingId || !amount || !paymentMethod || !paymentStatus) {
    response.status(400).json({ message: "Payment details are incomplete." });
    return;
  }

  try {
    const [result] = await pool.execute(
      `
      INSERT INTO payments (
        booking_id,
        amount,
        payment_method,
        payment_status,
        transaction_reference,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        bookingId,
        amount,
        paymentMethod,
        paymentStatus,
        transactionReference || null,
        notes || null,
      ],
    );

    response.status(201).json({
      paymentId: result.insertId,
      message: "Payment recorded.",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:paymentId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { paymentId } = request.params;
  const { amount, paymentMethod, paymentStatus, transactionReference, notes } = request.body;

  try {
    const [result] = await pool.execute(
      `
      UPDATE payments
      SET
        amount = COALESCE(?, amount),
        payment_method = COALESCE(?, payment_method),
        payment_status = COALESCE(?, payment_status),
        transaction_reference = COALESCE(?, transaction_reference),
        notes = COALESCE(?, notes)
      WHERE payment_id = ?
      `,
      [amount, paymentMethod, paymentStatus, transactionReference, notes, paymentId]
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Payment not found." });
    }
    response.json({ message: "Payment updated successfully." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:paymentId", requireAuth, requireRole("admin"), async (request, response, next) => {
  const { paymentId } = request.params;

  try {
    const [result] = await pool.execute(`DELETE FROM payments WHERE payment_id = ?`, [paymentId]);
    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Payment not found." });
    }
    response.json({ message: "Payment deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
