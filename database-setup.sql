-- Create the university database
CREATE DATABASE university;

-- Connect to the university database and create the courses table
\c university

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    department VARCHAR(10) NOT NULL,
    course_number VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL
);

-- Insert sample data
INSERT INTO courses (department, course_number, title, credits) VALUES
    ('CSCI', '5817', 'Database Systems', 3),
    ('CSCI', '5828', 'Foundations of Software Engineering', 3),
    ('CSCI', '5229', 'Computer Graphics', 3),
    ('MATH', '3130', 'Linear Algebra', 3),
    ('MATH', '2300', 'Calculus 2', 4),
    ('PHYS', '2020', 'General Physics 2', 4);
