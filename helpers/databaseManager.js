const mysql = require("mysql");

const createConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Password123",
        database: "allocabl",
        multipleStatements: true
    });
};

function getAgent(department) {
    return new Promise(function(resolve, reject) {
        createConnection().query(
            `SELECT id FROM agents WHERE available = 1 AND department = '${department}' ORDER BY customersServed`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
}

const incrementCustomersServed = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET customersServed = customersServed + 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const toggleAgentAvailability = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET available = NOT available WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const addSocketAgent = (agentID, socketID) => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET customerSocket = '${socketID}' WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const removeSocketAgent = socketID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `SET SQL_SAFE_UPDATES = 0;UPDATE agents SET available = 1, customerSocket = NULL WHERE customerSocket = '${socketID}';SET SQL_SAFE_UPDATES = 1`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentAvailable = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET available = 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentUnavailable = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET available = 0 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const addWaitList = (department, socketID) => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `INSERT INTO waitlist_${department}(socket_id)
            VALUES('${socketID}')`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

module.exports = {
    getAgent,
    incrementCustomersServed,
    toggleAgentAvailability,
    addSocketAgent,
    removeSocketAgent,
    setAgentAvailable,
    setAgentUnavailable,
    addWaitList
};
