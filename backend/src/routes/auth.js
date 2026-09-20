const express = require("express");
const { pool } = require("../db");
const { hashPassword, verifyPassword } = require("../utils/passwords");
const { signToken } = require("../utils/sessions");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "-",
  };
}

router.post("/register", async (request, response, next) => {
  const { name, email, phone, password, licenceNumber, address } = request.body;

  if (!name || !email || !phone || !password || !licenceNumber) {
    response.status(400).json({ message: "Name, email, phone, password, and licence number are required." });
    return;
  }

  const connection = await pool.getConnection();

  try {
    const passwordHash = await hashPassword(password);
    const { firstName, lastName } = splitName(name);

    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, 'customer')
      `,
      [name, email, phone, passwordHash],
    );

    await connection.execute(
      `
      INSERT INTO customers (
        user_id,
        first_name,
        last_name,
        phone,
        email,
        licence_number,
        address
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [userResult.insertId, firstName, lastName, phone, email, licenceNumber, address || null],
    );

    await connection.commit();

    response.status(201).json({ message: "Customer account created." });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

router.post("/login", async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const [rows] = await pool.execute(
      `
      SELECT user_id, name, email, password_hash, role, status
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email],
    );

    const user = rows[0];

    if (!user || user.status !== "active") {
      response.status(401).json({ message: "Invalid login details." });
      return;
    }

    const validPassword = await verifyPassword(password, user.password_hash);

    if (!validPassword) {
      response.status(401).json({ message: "Invalid login details." });
      return;
    }

    const token = signToken({
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    response.json({
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (request, response) => {
  response.json({ user: request.user });
});

module.exports = router;
