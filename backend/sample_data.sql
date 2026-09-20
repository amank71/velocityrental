-- MySQL Sample Data for Vehicle Rental System (Cars & Bikes)

USE vehicle_rental;

-- Insert Admin and Customer Users
INSERT INTO users (name, email, phone, password_hash, role) VALUES 
('Admin User', 'admin@rental.test', '9999999999', 'scrypt$16384$8$1$c0c0f8d3a7b5960ee14f651f2b1f3849$35cb764eddaff258e616bb7fee468f50d793457818348486bbc575711c2220b5cfa716521602f234831429734e4692846085b8861c494b749502c4bdec4b68b7', 'admin'),
('Aarav Sharma', 'aarav@rental.test', '9876543210', 'scrypt$16384$8$1$c0c0f8d3a7b5960ee14f651f2b1f3849$35cb764eddaff258e616bb7fee468f50d793457818348486bbc575711c2220b5cfa716521602f234831429734e4692846085b8861c494b749502c4bdec4b68b7', 'customer'),
('Priya Singh', 'priya@rental.test', '9876543211', 'scrypt$16384$8$1$c0c0f8d3a7b5960ee14f651f2b1f3849$35cb764eddaff258e616bb7fee468f50d793457818348486bbc575711c2220b5cfa716521602f234831429734e4692846085b8861c494b749502c4bdec4b68b7', 'customer');

-- Insert Customer Profiles
INSERT INTO customers (user_id, first_name, last_name, phone, email, licence_number, address) VALUES
(2, 'Aarav', 'Sharma', '9876543210', 'aarav@rental.test', 'DL-1420110012345', 'Connaught Place, New Delhi'),
(3, 'Priya', 'Singh', '9876543211', 'priya@rental.test', 'DL-1420110098765', 'Saket, New Delhi');

-- Insert Vehicles (Cars and Bikes)
INSERT INTO vehicles (registration_number, make, model, vehicle_type, manufacture_year, seats, daily_rate, operational_status, odometer_km) VALUES
('DL1C AA 1111', 'Hyundai', 'Creta', 'suv', 2023, 5, 2500.00, 'available', 15000),
('DL1C AB 2222', 'Honda', 'City', 'sedan', 2022, 5, 2000.00, 'available', 22000),
('DL1C AC 3333', 'Maruti', 'Swift', 'hatchback', 2023, 5, 1200.00, 'available', 18000),
('DL1C AD 4444', 'Toyota', 'Innova', 'suv', 2021, 7, 3000.00, 'available', 45000),
('DL1B AA 5555', 'Royal Enfield', 'Classic 350', 'bike', 2023, 2, 800.00, 'available', 5000),
('DL1B AB 6666', 'Bajaj', 'Pulsar 150', 'bike', 2022, 2, 400.00, 'available', 12000),
('DL1B AC 7777', 'Honda', 'Activa 6G', 'bike', 2024, 2, 350.00, 'available', 2000);

-- Insert Sample Bookings
INSERT INTO bookings (customer_id, vehicle_id, start_date, end_date, booking_status, total_amount) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'reserved', 7500.00),
(2, 5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'reserved', 2400.00);

-- Insert Sample Payments
INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_reference) VALUES
(1, 7500.00, 'upi', 'paid', 'UPI1234567890'),
(2, 2400.00, 'card', 'paid', 'TXN0987654321');
