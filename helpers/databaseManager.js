const mysql = require("mysql");

const connectionPool = mysql.createPool({
    host: "localhost",
    user: "allocabl",
    password: "Password123",
    database: "allocabl",
    multipleStatements: true
});

function getAgent(department, connection) {
    connection = connection || connectionPool;
    return new Promise(function(resolve, reject) {
        connection.query(
            `SELECT id FROM agents WHERE available = 1 AND department = '${department}' ORDER BY customersServed`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
}

const getAgentDepartment = (agentID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT department FROM agents WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

function getDepartment(socketID, connection) {
    connection = connection || connectionPool;
    return new Promise(function(resolve, reject) {
        connection.query(
            `SELECT department FROM agents WHERE customerSocket='${socketID}'`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
}

const incrementCustomersServed = (agentID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE agents SET customersServed = customersServed + 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const addSocketAgent = (agentID, socketID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE agents SET customerSocket = '${socketID}' WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const removeSocketAgent = (socketID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `SET SQL_SAFE_UPDATES = 0;UPDATE agents SET available = 1, customerSocket = NULL WHERE customerSocket = '${socketID}';SET SQL_SAFE_UPDATES = 1`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentAvailable = (agentID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE agents SET available = 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentUnavailable = (agentID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE agents SET available = 0 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentOnline = (agentID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE agents SET online = 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentOffline = (agentID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE agents SET online = 0 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const addWaitList = (department, socketID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO waitlist_${department}(socket_id)
            VALUES('${socketID}')`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const getFromWaitList = (department, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT socket_id FROM allocabl.waitlist_${department} ORDER BY id asc LIMIT 1`,
            (err, nextInList) => {
                if (err) reject(err);
                resolve(nextInList);
            }
        );
    });
};

const removeFromWaitList = (department, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM allocabl.waitlist_${department} ORDER BY id asc LIMIT 1`,
            (err, dump) => {
                if (err) reject(err);
                resolve(dump);
            }
        );
    });
};

const removeFromAllWaitlistsById = (socketID, connection) => {
    connection = connection || connectionPool;
    return new Promise((resolve, reject) => {
        connection.query(
            `SET SQL_SAFE_UPDATES = 0;DELETE FROM allocabl.waitlist_sales WHERE socket_id = '${socketID}';DELETE FROM allocabl.waitlist_finance WHERE socket_id = '${socketID}';DELETE FROM allocabl.waitlist_general WHERE socket_id = '${socketID}';SET SQL_SAFE_UPDATES = 1`,
            (err, dump) => {
                if (err) reject(err);
                resolve(dump);
            }
        );
    });
};

const checkDepartmentOnline = (department, connection) => {
    connection = connection || connectionPool;
    return new Promise(function(resolve, reject) {
        connection.query(
            `SELECT id FROM agents WHERE online = 1 AND department = '${department}' ORDER BY customersServed`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const clearDepartmentWaitlist = (department, connection) => {
    connection = connection || connectionPool;
    return new Promise(function(resolve, reject) {
        connection.query(
            `SET SQL_SAFE_UPDATES = 0;DELETE FROM allocabl.waitlist_${department};SET SQL_SAFE_UPDATES = 1`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const getDepartmentWaitlist = (department, connection) => {
    connection = connection || connectionPool;
    return new Promise(function(resolve, reject) {
        connection.query(
            `SELECT * FROM allocabl.waitlist_${department}`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

module.exports = {
    getAgent,
    incrementCustomersServed,
    addSocketAgent,
    removeSocketAgent,
    setAgentAvailable,
    setAgentUnavailable,
    addWaitList,
    getDepartment,
    getFromWaitList,
    removeFromWaitList,
    setAgentOnline,
    setAgentOffline,
    removeFromAllWaitlistsById,
    getAgentDepartment,
    checkDepartmentOnline,
    clearDepartmentWaitlist,
    getDepartmentWaitlist
};
