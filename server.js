const inquirer = require('inquirer');
require('dotenv').config();
const mysql = require('mysql2');

//connect to mysql
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employees_db'
    },
    console.log(`Connected to employees_db`)
);
db.connect((err) => {
    if (err) throw err;
    userPrompts();
});

//user prompts
const userPrompts = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'View employees by department',
                    'View employees by manager',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'View department budgets',
                    'No action',
                ],

            },
        ])

        //A different function will be executed according to the user's choice
        .then((res) => {
            const choice = res.options;
            switch (choice) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    UpdateEmployeeRole();
                    break;
                case 'View employees by department':
                    viewEmployeesByDepartment();
                    break;
                case 'View employees by manager':
                    viewEmployeesByManager();
                    break;
                case 'Delete a department':
                    deleteDepartment();
                    break;
                case 'Delete a role':
                    deleteRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'View department budgets':
                    viewDepartmentBudgets();
                    break;
                case 'No action':
                    noAction();
                    break;

            }
        });
};

//Select all the department 
const viewAllDepartments = () => {
    let query = `SELECT * FROM department`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompts();
    });
};

//Select all roles from role table
const viewAllRoles = () => {
    let query =
        `SELECT role.id, role.title, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompts();
    });
};

//Selects employees info and adds employee's manager
const viewAllEmployees = () => {
    const query =
        `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompts();
    });

};

//User's input is used to add to department table
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What is the name of the new department?',
        },
    ])
        .then((res) => {
            let query =
                `INSERT INTO department (name)
                VALUES (?)`;

            db.query(query, res.newDepartment, (err, result) => {
                if (err) throw err;
                console.log(`${res.newDepartment} has been added to departments`);
                viewAllDepartments();
            });

        });

};

//User's input and department table are used to add to role table
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the new role?'
        },

        {
            type: 'input',
            name: 'salary',
            message: 'what is the salary of the new role?',
        },
    ])
        .then((res) => {
            const newRoleInput = [res.newRole, res.salary];

            const getDepartment = `SELECT name, id FROM department`;

            db.query(getDepartment, (err, data) => {
                if (err) throw err;

                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dept',
                        message: 'What is the department of this new role?',
                        choices: dept
                    }
                ])
                    .then((res) => {
                        const dept = res.dept;
                        newRoleInput.push(dept);

                        let query = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

                        db.query(query, newRoleInput, (err, result) => {
                            if (err) throw err;

                            console.log(
                                `A new role has been added ${res.newRole} ${res.salary}`
                            );
                            viewAllRoles();
                        });
                    });
            });
        });
};

//Data from employee and role tables and user's inout are used to add a new employee
const addEmployee = () => {
    const getRole = `SELECT role.id, role.title FROM role`;
    db.query(getRole, (err, data) => {
        if (err) throw err;

        const roles = data.map((data) => ({
            name: data.title,
            value: data.id,
        }));


        const getManager =
            `SELECT id, CONCAT (first_name, ' ', last_name) AS manager_name 
                    FROM employee
                    WHERE id IN (
                        SELECT DISTINCT manager_id
                        FROM employee
                        WHERE manager_id IS NOT NULL
                    )`;
        db.query(getManager, (err, managers) => {
            if (err) throw err;

            const managersData = managers.map((manager) => ({
                name: manager.manager_name,
                value: manager.id,

            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?",
                },

                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's lastName?",
                },

                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles,
                },

                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managersData,
                },

            ])
                .then((res) => {
                    const newEmp = [res.firstName, res.lastName];
                    const chosenRole = res.role;
                    newEmp.push(chosenRole);
                    const chosenManager = res.manager;
                    newEmp.push(chosenManager);
                    let query =
                        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES (?, ?, ?, ?)`;

                    db.query(query, newEmp, (err, result) => {
                        if (err) throw err;
                        console.log(`${newEmp} has been added!`);

                        viewAllEmployees();

                    })

                });
        });
    });
}

//Info from employee and role tables together with user input is used to create a new role
const UpdateEmployeeRole = () => {
    const getEmployee = `SELECT * FROM employee`;

    db.query(getEmployee, (err, data) => {
        if (err) throw err;

        const employeesData = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employeesData,
            },
        ])
            .then((res) => {
                const employee = res.name;
                const newInfo = [];
                newInfo.push(employee);

                const getRole = `SELECT * FROM role`;

                db.query(getRole, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then((res) => {
                            const role = res.role;
                            newInfo.push(role);

                            let employee = newInfo[0];
                            newInfo[0] = role;
                            newInfo[1] = employee;

                            let query = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(query, newInfo, (err, result) => {
                                if (err) throw err;
                                console.log(`${role} has been added!`);

                                viewAllEmployees();
                            });
                        });
                });
            });
    });
};

//Data from employee is joined to data in role and department tables to show all employees by department
const viewEmployeesByDepartment = () => {
    let query =
        `SELECT employee.first_name, 
    employee.last_name, 
    department.name AS department
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id`;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompts();
    });
};

//Data from employees is used to display employees by manager
const viewEmployeesByManager = () => {
    let query =
        `SELECT employee.first_name,
    employee.last_name,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompts();
    });
};

//Data is retrieved and combined from tables in the following functions to execute the user's choices

const deleteDepartment = () => {
    const getDepartment = `SELECT * FROM department`;

    db.query(getDepartment, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'What department do you want to delete?',
                choices: dept,
            },
        ])
            .then((res) => {
                const chosenDept = res.dept;
                let query = `DELETE FROM department WHERE id = ?`;

                db.query(query, chosenDept, (err, result) => {
                    if (err) throw err;
                    console.log(`${chosenDept.name} has been deleted!`);

                    viewAllDepartments();
                });
            });
    });

};

const deleteRole = () => {
    const getRole = `SELECT * FROM role`;

    db.query(getRole, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'What role do you want to delete?',
                choices: roles,
            },
        ])
            .then((res) => {
                const chosenRole = res.role;
                let query = `DELETE FROM role WHERE id =?`;

                db.query(query, chosenRole, (err, result) => {
                    if (err) throw err;
                    console.log(`${chosenRole} has been deleted!`);
                    viewAllRoles();
                });

            });
    });

};

const deleteEmployee = () => {
    const getEmployee = `SELECT * FROM employee`;

    db.query(getEmployee, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would like to delete?',
                choices: employees,
            },
        ])
            .then((res) => {
                const chosenEmployee = res.name;

                let query = `DELETE FROM employee WHERE id = ?`;

                db.query(query, chosenEmployee, (err, result) => {
                    if (err) throw err;
                    console.log(`${chosenEmployee} has been deleted!`);
                    viewAllEmployees();
                });
            });

    });
};

const viewDepartmentBudgets = () => {
    let query =
        `SELECT department_id AS id, 
    department.name AS department,
    SUM(salary) AS budget
    FROM  role  
    JOIN department ON role.department_id = department.id GROUP BY  department_id`;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompts();
    });

};

const noAction = () => {
    if ('No action') {
        console.log('bye!');
        process.exit();
    };

};



