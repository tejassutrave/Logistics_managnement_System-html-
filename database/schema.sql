-- Create Tables

DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Storing plain text as per simple requirements (pass=12345)
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    capacity INTEGER,
    manager_name VARCHAR(100)
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Available' -- Available, On Trip, On Leave
);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50),
    type VARCHAR(30), -- Truck, Van, Bike
    capacity_kg DECIMAL(10, 2),
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weight_kg DECIMAL(10, 2),
    price DECIMAL(10, 2),
    quantity INTEGER DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE SET NULL
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    shipment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending' -- Pending, In Transit, Delivered, Cancelled
);

-- Seed Data

-- Users
INSERT INTO users (username, password, role) VALUES 
('admin', '12345', 'admin'),
('manager', '12345', 'manager'),
('driver', '12345', 'driver'),
('tejas', '12345', 'admin'),
('sai', '12345', 'manager'),
('abhay', '12345', 'driver'),
('rohit', '12345', 'driver'),
('sharat', '12345', 'driver');

-- Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('Tejas Tech Supplies', 'Tejas', '555-0101', 'tejas@supply.com', '123 Tech Park, Bangalore'),
('Sai Electronics', 'Sai', '555-0102', 'sai@elec.com', '456 Innovation Dr, Hyderabad'),
('Abhay Auto Parts', 'Abhay', '555-0103', 'abhay@auto.com', '789 Motor Ln, Pune'),
('Rohit Fashion Wholesalers', 'Rohit', '555-0104', 'rohit@style.com', '321 Fashion St, Mumbai'),
('Sharat Organics', 'Sharat', '555-0105', 'sharat@farm.com', '654 Green Way, Delhi');

-- Warehouses
INSERT INTO warehouses (name, location, capacity, manager_name) VALUES
('Central Tejas Hub', 'Bangalore', 50000, 'Tejas'),
('Sai Storage Facility', 'Hyderabad', 30000, 'Sai'),
('Abhay District Depot', 'Pune', 25000, 'Abhay'),
('Rohit Distribution Center', 'Mumbai', 20000, 'Rohit'),
('Sharat Logistics Park', 'Delhi', 35000, 'Sharat');

-- Customers
INSERT INTO customers (name, email, phone, address) VALUES
('Tejas Retail', 'buy@tejas.com', '555-1111', 'Block A, Tech City'),
('Sai Mart', 'orders@saimart.com', '555-2222', 'Sector 5, Cyber Hub'),
('Abhay Hypermarket', 'contact@abhay.com', '555-3333', 'Main Road, Pune Camp'),
('Rohit Trends', 'shop@rohit.com', '555-4444', 'High Street, Bandra'),
('Sharat Daily Needs', 'store@sharat.com', '555-5555', 'Connaught Place, Delhi');

-- Drivers
INSERT INTO drivers (name, license_number, phone, status) VALUES
('Tejas', 'DL-TEJAS-001', '9876543210', 'Available'),
('Sai', 'DL-SAI-002', '9876543211', 'On Trip'),
('Abhay', 'DL-ABHAY-003', '9876543212', 'Available'),
('Rohit', 'DL-ROHIT-004', '9876543213', 'On Leave'),
('Sharat', 'DL-SHARAT-005', '9876543214', 'Available');

-- Vehicles
INSERT INTO vehicles (license_plate, model, type, capacity_kg, driver_id) VALUES
('KA-01-AB-1234', 'Tata Ace', 'Van', 800.00, 1),
('TS-02-XY-5678', 'Ashok Leyland', 'Truck', 15000.00, 2),
('MH-12-PQ-9012', 'Mahindra Bolero', 'Van', 1200.00, 3),
('MH-02-JK-3456', 'Eicher Pro', 'Truck', 10000.00, 4),
('DL-05-MN-7890', 'Tata 407', 'Truck', 4000.00, 5);

-- Items
INSERT INTO items (name, description, weight_kg, price, quantity, supplier_id, warehouse_id) VALUES
('Gaming Laptop', 'High Performance Tejas Edition', 2.30, 95000.00, 50, 1, 1),
('Smartphone Pro', 'Sai Mobile 5G', 0.18, 45000.00, 100, 2, 2),
('Car Battery', 'Abhay Power Cell', 15.00, 5500.00, 200, 3, 3),
('Designer Jeans', 'Rohit Denim Collection', 0.80, 2500.00, 500, 4, 4),
('Organic Rice', 'Sharat Basmati 25kg', 25.00, 1800.00, 100, 5, 5),
('Wireless Earbuds', 'Tejas Audio', 0.05, 3000.00, 300, 1, 2),
('LED TV 55"', 'Sai Vision', 12.00, 35000.00, 40, 2, 1),
('Brake Pads', 'Abhay Safety Kit', 2.50, 1200.00, 150, 3, 3),
('Cotton Shirts', 'Rohit Formal Wear', 0.30, 1500.00, 600, 4, 4),
('Almonds', 'Sharat Premium Nuts', 1.00, 900.00, 250, 5, 5);

-- Shipments
INSERT INTO shipments (tracking_number, item_id, quantity, customer_id, vehicle_id, status) VALUES
('TRK-TEJ-001', 1, 5, 1, 1, 'In Transit'),
('TRK-SAI-002', 3, 20, 2, 2, 'Pending'),
('TRK-ABH-003', 5, 10, 3, 3, 'Delivered'),
('TRK-ROH-004', 8, 50, 4, 4, 'Cancelled'),
('TRK-SHA-005', 2, 2, 5, 5, 'In Transit');
