-- Creating columns to add values
-- Inserts values to department table
INSERT INTO department(name)
VALUES ('Management'),
('Kitchen'),
('Customer Service');

-- Inserts values to role table
INSERT INTO role(title, salary, department_id)
VALUES ('General manager', 70000, 1),
('Cheff', 65000, 1),
('Supervisors', 58000, 1),
('Cook', 52000, 2),
('Prep', 46000, 2),
('Dishwasher', 40000, 2),
('Server', 45000, 3),
('Bartender', 46000, 3),
('Host', 42000, 3),
('Busser', 42500, 3);

-- Inserts values to employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Anthony', 'Azzi', 1, 1),
('Bobby', 'Hoffman', 2, 1),
('Leslie', 'Vaden', 3, 1),
('Kweku', 'Adarkwa', 3, 1),
('Anand', 'Patel', 4, 2),
('Brent', 'Knox', 4, 2),
('Brielle', 'Broadt', 4, 2),
('Carlos', 'Palacio', 5, 2),
('Clarisa', 'Gonzalez', 5, 2),
('Cristian', 'Reyes', 5, 2),
('Crystak', 'Green', 5, 2),
('Daniel', 'Merkin', 6, 2),
('Devin', 'Amlen', 6, 2),
('Eric', 'Coteron', 7, 3),
('Ernest', 'Registre', 7, 3),
('Janell', 'Smith', 7, 3 ),
('Jesse', 'LoCascio', 7, 3),
('Jim', 'Buckley', 7, 4 ),
('John', 'Post', 7, 4),
('Kitana', 'Kearney', 7, 4 ),
('Kris', 'Hinojosa', 7, 4),
('Lina', 'Errico', 8, 3),
('Maitreee', 'Patel', 8, 3),
('Malka', 'Greenberg', 8, 4),
('Mario', 'Resende', 8, 4),
('Shivani', 'Singh', 9, 3),
('Neha', 'Sabannavar', 9, 4),
('Matthew', 'Trucco', 10, 3),
('Neil', 'Holloway', 10, 4);



