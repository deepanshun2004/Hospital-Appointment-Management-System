-- MySQL Setup Script for Hospital Appointment System
-- Run this script as root or with sufficient privileges

-- Create databases
CREATE DATABASE IF NOT EXISTS doctor_service_db;
CREATE DATABASE IF NOT EXISTS patient_service_db;
CREATE DATABASE IF NOT EXISTS appointment_service_db;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'appuser'@'localhost' IDENTIFIED BY 'AppPass123!';
GRANT ALL PRIVILEGES ON doctor_service_db.* TO 'appuser'@'localhost';
GRANT ALL PRIVILEGES ON patient_service_db.* TO 'appuser'@'localhost';
GRANT ALL PRIVILEGES ON appointment_service_db.* TO 'appuser'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES;


SHOW GRANTS FOR 'appuser'@'localhost';
