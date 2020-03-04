const mysql = require("mysql");

const createConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Password123",
        database: "sys"
    });
};

function checkAgentAvailability(department) {
    return new Promise(function(resolve, reject) {
    createConnection().query(
        `SELECT id FROM agents WHERE available = 1 AND department = '${department}' ORDER BY customersServed`,
        function(err, rows) {
            if (err) {
                return reject(err);
            } 
            resolve(rows);
        }
    );
    });
}

const getAgent = (department, callback, errorHandler) => {
    createConnection().query(
        `SELECT id FROM agents WHERE available = 1 AND department = '${department}' ORDER BY customersServed`,
        (err, rows) => {
            if (err) {
                errorHandler(err);
            } else {
                callback(rows[0].id);
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
    checkAgentAvailability,
    getAgent,
    incrementCustomersServed,
    toggleAgentAvailability
};
