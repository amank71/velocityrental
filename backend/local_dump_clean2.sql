-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: vehicle_rental
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `booking_payment_summary`
--

DROP TABLE IF EXISTS `booking_payment_summary`;
/*!50001 DROP VIEW IF EXISTS `booking_payment_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `booking_payment_summary` AS SELECT
 1 AS `booking_id`,
  1 AS `customer_id`,
  1 AS `customer_name`,
  1 AS `vehicle_id`,
  1 AS `registration_number`,
  1 AS `start_date`,
  1 AS `end_date`,
  1 AS `booking_status`,
  1 AS `total_amount`,
  1 AS `amount_paid`,
  1 AS `amount_due`,
  1 AS `payment_status` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `booking_status` enum('reserved','active','completed','cancelled') NOT NULL DEFAULT 'reserved',
  `pickup_odometer_km` int(11) DEFAULT NULL,
  `return_odometer_km` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (`total_amount` >= 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`booking_id`),
  KEY `idx_bookings_vehicle_dates` (`vehicle_id`,`start_date`,`end_date`),
  KEY `idx_bookings_customer` (`customer_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON UPDATE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'2026-09-21','2026-09-23','reserved',NULL,NULL,7500.00,'2026-09-20 17:50:22'),(2,2,5,'2026-09-22','2026-09-24','reserved',NULL,NULL,2400.00,'2026-09-20 17:50:22'),(3,3,6,'2026-09-23','2026-09-25','reserved',NULL,NULL,1200.00,'2026-09-20 18:11:40');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `licence_number` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `licence_number` (`licence_number`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,2,'Aarav','Sharma','9876543210','aarav@rental.test','DL-1420110012345','Connaught Place, New Delhi','2026-09-20 17:50:22'),(2,3,'Priya','Singh','9876543211','priya@rental.test','DL-1420110098765','Saket, New Delhi','2026-09-20 17:50:22'),(3,4,'Aman','Kumar','06239117195','ama469649@gmail.com','pb20',NULL,'2026-09-20 18:11:13');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL CHECK (`amount` >= 0),
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` enum('cash','card','upi','bank_transfer') NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `transaction_reference` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `transaction_reference` (`transaction_reference`),
  KEY `idx_payments_booking` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,7500.00,'2026-09-20 17:50:22','upi','paid','UPI1234567890',NULL),(2,2,2400.00,'2026-09-20 17:50:22','card','paid','TXN0987654321',NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@rental.test','9999999999','scrypt$16384$8$1$c0c0f8d3a7b5960ee14f651f2b1f3849$35cb764eddaff258e616bb7fee468f50d793457818348486bbc575711c2220b5cfa716521602f234831429734e4692846085b8861c494b749502c4bdec4b68b7','admin','active'),(2,'Aarav Sharma','aarav@rental.test','9876543210','scrypt$16384$8$1$c0c0f8d3a7b5960ee14f651f2b1f3849$35cb764eddaff258e616bb7fee468f50d793457818348486bbc575711c2220b5cfa716521602f234831429734e4692846085b8861c494b749502c4bdec4b68b7','customer','active'),(3,'Priya Singh','priya@rental.test','9876543211','scrypt$16384$8$1$c0c0f8d3a7b5960ee14f651f2b1f3849$35cb764eddaff258e616bb7fee468f50d793457818348486bbc575711c2220b5cfa716521602f234831429734e4692846085b8861c494b749502c4bdec4b68b7','customer','active'),(4,'Aman Kumar','ama469649@gmail.com','06239117195','scrypt$16384$8$1$c28003f7a5ef723eb6a0c097bec25fe6$99b38025bc961f6f3ef7dc74005c1fa0430f99ac3ec2220b87d74ee71ab3945fb0e18354a5ba376b96edc8c746fad3275170c1b83dbf6bbce59a313fbeaea6f9','customer','active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `vehicle_availability`
--

DROP TABLE IF EXISTS `vehicle_availability`;
/*!50001 DROP VIEW IF EXISTS `vehicle_availability`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vehicle_availability` AS SELECT
 1 AS `vehicle_id`,
  1 AS `registration_number`,
  1 AS `make`,
  1 AS `model`,
  1 AS `vehicle_type`,
  1 AS `daily_rate`,
  1 AS `availability_status` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_number` varchar(50) NOT NULL,
  `make` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `manufacture_year` int(11) NOT NULL CHECK (`manufacture_year` between 1980 and 2100),
  `seats` int(11) NOT NULL CHECK (`seats` > 0),
  `daily_rate` decimal(10,2) NOT NULL CHECK (`daily_rate` >= 0),
  `operational_status` enum('available','maintenance','retired') NOT NULL DEFAULT 'available',
  `odometer_km` int(11) NOT NULL DEFAULT 0 CHECK (`odometer_km` >= 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`vehicle_id`),
  UNIQUE KEY `registration_number` (`registration_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'DL1C AA 1111','Hyundai','Creta','suv',2023,5,2500.00,'available',15000,'2026-09-20 17:50:22'),(2,'DL1C AB 2222','Honda','City','sedan',2022,5,2000.00,'available',22000,'2026-09-20 17:50:22'),(3,'DL1C AC 3333','Maruti','Swift','hatchback',2023,5,1200.00,'available',18000,'2026-09-20 17:50:22'),(4,'DL1C AD 4444','Toyota','Innova','suv',2021,7,3000.00,'available',45000,'2026-09-20 17:50:22'),(5,'DL1B AA 5555','Royal Enfield','Classic 350','bike',2023,2,800.00,'available',5000,'2026-09-20 17:50:22'),(6,'DL1B AB 6666','Bajaj','Pulsar 150','bike',2022,2,400.00,'available',12000,'2026-09-20 17:50:22'),(7,'DL1B AC 7777','Honda','Activa 6G','bike',2024,2,350.00,'available',2000,'2026-09-20 17:50:22'),(8,'PB32AC2622','Maruti','Lord Alto','hatchback',2008,5,2500.00,'available',0,'2026-09-20 18:26:33');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `booking_payment_summary`
--

/*!50001 DROP VIEW IF EXISTS `booking_payment_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `booking_payment_summary` AS select `b`.`booking_id` AS `booking_id`,`b`.`customer_id` AS `customer_id`,concat(`c`.`first_name`,' ',`c`.`last_name`) AS `customer_name`,`b`.`vehicle_id` AS `vehicle_id`,`v`.`registration_number` AS `registration_number`,`b`.`start_date` AS `start_date`,`b`.`end_date` AS `end_date`,`b`.`booking_status` AS `booking_status`,`b`.`total_amount` AS `total_amount`,coalesce(sum(case when `p`.`payment_status` = 'paid' then `p`.`amount` else 0 end),0) AS `amount_paid`,`b`.`total_amount` - coalesce(sum(case when `p`.`payment_status` = 'paid' then `p`.`amount` else 0 end),0) AS `amount_due`,case when `b`.`total_amount` = 0 then 'not_required' when coalesce(sum(case when `p`.`payment_status` = 'paid' then `p`.`amount` else 0 end),0) = 0 then 'unpaid' when coalesce(sum(case when `p`.`payment_status` = 'paid' then `p`.`amount` else 0 end),0) < `b`.`total_amount` then 'partial' else 'paid' end AS `payment_status` from (((`bookings` `b` join `customers` `c` on(`c`.`customer_id` = `b`.`customer_id`)) join `vehicles` `v` on(`v`.`vehicle_id` = `b`.`vehicle_id`)) left join `payments` `p` on(`p`.`booking_id` = `b`.`booking_id`)) group by `b`.`booking_id`,`b`.`customer_id`,`c`.`first_name`,`c`.`last_name`,`b`.`vehicle_id`,`v`.`registration_number`,`b`.`start_date`,`b`.`end_date`,`b`.`booking_status`,`b`.`total_amount` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vehicle_availability`
--

/*!50001 DROP VIEW IF EXISTS `vehicle_availability`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013  SQL SECURITY DEFINER */
/*!50001 VIEW `vehicle_availability` AS select `v`.`vehicle_id` AS `vehicle_id`,`v`.`registration_number` AS `registration_number`,`v`.`make` AS `make`,`v`.`model` AS `model`,`v`.`vehicle_type` AS `vehicle_type`,`v`.`daily_rate` AS `daily_rate`,case when `v`.`operational_status` <> 'available' then `v`.`operational_status` when exists(select 1 from `bookings` `b` where `b`.`vehicle_id` = `v`.`vehicle_id` and `b`.`booking_status` = 'active' and curdate() between `b`.`start_date` and `b`.`end_date` limit 1) then 'rented' when exists(select 1 from `bookings` `b` where `b`.`vehicle_id` = `v`.`vehicle_id` and `b`.`booking_status` = 'reserved' and curdate() between `b`.`start_date` and `b`.`end_date` limit 1) then 'reserved' else 'available' end AS `availability_status` from `vehicles` `v` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-21  0:16:52
