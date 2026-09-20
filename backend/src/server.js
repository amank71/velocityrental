const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");
const bookingRoutes = require("./routes/bookings");
const paymentRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "http://192.168.1.69:8080"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({ ok: true, service: "vehicle-rental-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, request, response, next) => {
  console.error(error);

  if (error.code === "ER_DUP_ENTRY") {
    response.status(409).json({ message: "A record with these details already exists." });
    return;
  }

  if (error.sqlState === "45000") {
    response.status(409).json({ message: error.sqlMessage || error.message });
    return;
  }

  response.status(500).json({ message: "Something went wrong." });
});

app.listen(port, () => {
  console.log(`Vehicle rental API running on http://localhost:${port}`);
});
