const mysql = require("mysql");

const createConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "allocabl",
        password: "Password123",
        database: "allocabl"
    });
};

const getAgent = (department, callback, errorHandler) => {
    createConnection().query(
        `SELECT id FROM agents WHERE available = 1 AND department = '${department}' ORDER BY customersServed`,
        (err, rows) => {
            if (err) {
                errorHandler(err);
            } else {
                if (rows.length == 0) errorHandler(new Error("No Agent Available"));
                else callback(rows[0].id);
            }
        }
    );
};

const incrementCustomersServed = (agentID, errorHandler, callback) => {
    createConnection().query(
        `UPDATE agents SET customersServed = customersServed + 1 WHERE id = '${agentID}'`,
        (err, result) => {
            if (err) {
                errorHandler(err);
            } else callback(result);
        }
    );
};

const toggleAgentAvailability = (agentID, errorHandler, callback) => {
    createConnection().query(
        `UPDATE agents SET available = NOT available WHERE id = '${agentID}'`,
        (err, result) => {
            if (err) {
                errorHandler(err);
            } else callback(result);
        }
    );
};

module.exports = {
    getAgent,
    incrementCustomersServed,
    toggleAgentAvailability
};
