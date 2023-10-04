-- Drop the database employees_db if it already exists
DROP DATABASE IF EXISTS employees_db;
-- Create a new database name employees_db
CREATE DATABASE employees_db;

-- Use the employees_db 
USE employees_db;

-- Tables have a primary key to relate tables to each other

-- Create a table name department, 2 rows
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(30) NOT NULL
);

-- Create a table named role, 4 rows
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY(department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

-- Create a table name employee, 5 rows
CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY(role_id)
  REFERENCES role(id)
  ON DELETE SET NULL
);
