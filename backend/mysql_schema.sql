-- MySQL Schema for Vehicle Rental System
-- Generated for Final Deployment

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    licence_number VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    manufacture_year INT NOT NULL CHECK (manufacture_year BETWEEN 1980 AND 2100),
    seats INT NOT NULL CHECK (seats > 0),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate >= 0),
    operational_status ENUM('available', 'maintenance', 'retired') NOT NULL DEFAULT 'available',
    odometer_km INT NOT NULL DEFAULT 0 CHECK (odometer_km >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    booking_status ENUM('reserved', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'reserved',
    pickup_odometer_km INT,
    return_odometer_km INT,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (end_date >= start_date),
    CHECK (pickup_odometer_km IS NULL OR pickup_odometer_km >= 0),
    CHECK (return_odometer_km IS NULL OR return_odometer_km >= pickup_odometer_km)
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'card', 'upi', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    transaction_reference VARCHAR(255) UNIQUE,
    notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_bookings_vehicle_dates ON bookings (vehicle_id, start_date, end_date);
CREATE INDEX idx_bookings_customer ON bookings (customer_id);
CREATE INDEX idx_payments_booking ON payments (booking_id);

DELIMITER //

CREATE TRIGGER prevent_overlapping_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.booking_status IN ('reserved', 'active') THEN
        IF EXISTS (
            SELECT 1 FROM bookings
            WHERE vehicle_id = NEW.vehicle_id
              AND booking_status IN ('reserved', 'active')
              AND NEW.start_date <= end_date
              AND NEW.end_date >= start_date
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Vehicle is already booked for those dates';
        END IF;
    END IF;
END//

CREATE TRIGGER prevent_overlapping_booking_update
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.booking_status IN ('reserved', 'active') THEN
        IF EXISTS (
            SELECT 1 FROM bookings
            WHERE vehicle_id = NEW.vehicle_id
              AND booking_id <> OLD.booking_id
              AND booking_status IN ('reserved', 'active')
              AND NEW.start_date <= end_date
              AND NEW.end_date >= start_date
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Vehicle is already booked for those dates';
        END IF;
    END IF;
END//

DELIMITER ;

CREATE OR REPLACE VIEW vehicle_availability AS
SELECT
    v.vehicle_id,
    v.registration_number,
    v.make,
    v.model,
    v.vehicle_type,
    v.daily_rate,
    CASE
        WHEN v.operational_status <> 'available' THEN v.operational_status
        WHEN EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.vehicle_id = v.vehicle_id
              AND b.booking_status = 'active'
              AND CURDATE() BETWEEN b.start_date AND b.end_date
        ) THEN 'rented'
        WHEN EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.vehicle_id = v.vehicle_id
              AND b.booking_status = 'reserved'
              AND CURDATE() BETWEEN b.start_date AND b.end_date
        ) THEN 'reserved'
        ELSE 'available'
    END AS availability_status
FROM vehicles v;

CREATE OR REPLACE VIEW booking_payment_summary AS
SELECT
    b.booking_id,
    b.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    b.vehicle_id,
    v.registration_number,
    b.start_date,
    b.end_date,
    b.booking_status,
    b.total_amount,
    COALESCE(SUM(CASE WHEN p.payment_status = 'paid' THEN p.amount ELSE 0 END), 0) AS amount_paid,
    b.total_amount - COALESCE(SUM(CASE WHEN p.payment_status = 'paid' THEN p.amount ELSE 0 END), 0) AS amount_due,
    CASE
        WHEN b.total_amount = 0 THEN 'not_required'
        WHEN COALESCE(SUM(CASE WHEN p.payment_status = 'paid' THEN p.amount ELSE 0 END), 0) = 0 THEN 'unpaid'
        WHEN COALESCE(SUM(CASE WHEN p.payment_status = 'paid' THEN p.amount ELSE 0 END), 0) < b.total_amount THEN 'partial'
        ELSE 'paid'
    END AS payment_status
FROM bookings b
JOIN customers c ON c.customer_id = b.customer_id
JOIN vehicles v ON v.vehicle_id = b.vehicle_id
LEFT JOIN payments p ON p.booking_id = b.booking_id
GROUP BY
    b.booking_id,
    b.customer_id,
    c.first_name,
    c.last_name,
    b.vehicle_id,
    v.registration_number,
    b.start_date,
    b.end_date,
    b.booking_status,
    b.total_amount;
