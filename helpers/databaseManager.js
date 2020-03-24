const mysql = require("mysql");

const connectionPool = mysql.createPool({
    host: "localhost",
    user: "allocabl",
    password: "Password123",
    multipleStatements: true
});

let databaseName = "allocabl";

const setDatabase = dbName => {
    databaseName = dbName;
};

function getAgent(department) {
    return new Promise(function(resolve, reject) {
        connectionPool.query(
            `SELECT id FROM ${databaseName}.agents WHERE available = 1 AND department = '${department}' ORDER BY customersServed`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
}

const getAgentDepartment = agentID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `SELECT department FROM ${databaseName}.agents WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

function getDepartment(socketID) {
    return new Promise(function(resolve, reject) {
        connectionPool.query(
            `SELECT department FROM ${databaseName}.agents WHERE customerSocket='${socketID}'`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
}

const incrementCustomersServed = agentID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `UPDATE ${databaseName}.agents SET customersServed = customersServed + 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const addSocketAgent = (agentID, socketID) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `UPDATE ${databaseName}.agents SET customerSocket = '${socketID}' WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const removeSocketAgent = socketID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `SET SQL_SAFE_UPDATES = 0;UPDATE ${databaseName}.agents SET available = 1, customerSocket = NULL WHERE customerSocket = '${socketID}';SET SQL_SAFE_UPDATES = 1`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentAvailable = agentID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `UPDATE ${databaseName}.agents SET available = 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentUnavailable = agentID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `UPDATE ${databaseName}.agents SET available = 0 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentOnline = agentID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `UPDATE ${databaseName}.agents SET online = 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentOffline = agentID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `UPDATE ${databaseName}.agents SET online = 0 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const addWaitList = (department, socketID) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `INSERT INTO ${databaseName}.waitlist_${department}(socket_id)
            VALUES('${socketID}')`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const getFromWaitList = department => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `SELECT socket_id FROM ${databaseName}.waitlist_${department} ORDER BY id asc LIMIT 1`,
            (err, nextInList) => {
                if (err) reject(err);
                resolve(nextInList);
            }
        );
    });
};

const removeFromWaitList = department => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `DELETE FROM ${databaseName}.waitlist_${department} ORDER BY id asc LIMIT 1`,
            (err, dump) => {
                if (err) reject(err);
                resolve(dump);
            }
        );
    });
};

const removeFromAllWaitlistsById = socketID => {
    return new Promise((resolve, reject) => {
        connectionPool.query(
            `SET SQL_SAFE_UPDATES = 0;DELETE FROM ${databaseName}.waitlist_sales WHERE socket_id = '${socketID}';DELETE FROM ${databaseName}.waitlist_finance WHERE socket_id = '${socketID}';DELETE FROM ${databaseName}.waitlist_general WHERE socket_id = '${socketID}';SET SQL_SAFE_UPDATES = 1`,
            (err, dump) => {
                if (err) reject(err);
                resolve(dump);
            }
        );
    });
};

const checkDepartmentOnline = department => {
    return new Promise(function(resolve, reject) {
        connectionPool.query(
            `SELECT id FROM ${databaseName}.agents WHERE online = 1 AND department = '${department}' ORDER BY customersServed`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const clearDepartmentWaitlist = department => {
    return new Promise(function(resolve, reject) {
        connectionPool.query(
            `SET SQL_SAFE_UPDATES = 0;DELETE FROM ${databaseName}.waitlist_${department};SET SQL_SAFE_UPDATES = 1`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const getDepartmentWaitlist = department => {
    return new Promise(function(resolve, reject) {
        connectionPool.query(
            `SELECT * FROM ${databaseName}.waitlist_${department}`,
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
    getDepartmentWaitlist,
    connectionPool,
    setDatabase
};
