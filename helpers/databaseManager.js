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
    let sql = `SELECT id FROM ${databaseName}.agents WHERE available = 1 AND department = ? ORDER BY customersServed`;
    let inserts = [department];
    sql = mysql.format(sql, inserts);
    return new Promise(function(resolve, reject) {
        connectionPool.query(sql, function(err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const getAgentDepartment = agentID => {
    let sql = `SELECT department FROM ${databaseName}.agents WHERE id = ?`;
    let inserts = [agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

function getDepartment(socketID) {
    let sql = `SELECT department FROM ${databaseName}.agents WHERE customerSocket = ?`;
    let inserts = [socketID];
    sql = mysql.format(sql, inserts);
    return new Promise(function(resolve, reject) {
        connectionPool.query(sql, function(err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const incrementCustomersServed = agentID => {
    let sql = `UPDATE ${databaseName}.agents SET customersServed = customersServed + 1 WHERE id = ?`;
    let inserts = [agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const addSocketAgent = (agentID, socketID) => {
    let sql = `UPDATE ${databaseName}.agents SET customerSocket = ? WHERE id = ?`;
    let inserts = [socketID, agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const removeSocketAgent = socketID => {
    let sql = `SET SQL_SAFE_UPDATES = 0;UPDATE ${databaseName}.agents SET available = 1, customerSocket = NULL WHERE customerSocket = ?;SET SQL_SAFE_UPDATES = 1`;
    let inserts = [socketID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const setAgentAvailable = agentID => {
    let sql = `UPDATE ${databaseName}.agents SET available = 1 WHERE id = ?`;
    let inserts = [agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const setAgentUnavailable = agentID => {
    let sql = `UPDATE ${databaseName}.agents SET available = 0 WHERE id = ?`;
    let inserts = [agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const setAgentOnline = agentID => {
    let sql = `UPDATE ${databaseName}.agents SET online = 1 WHERE id = ?`;
    let inserts = [agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const setAgentOffline = agentID => {
    let sql = `UPDATE ${databaseName}.agents SET online = 0 WHERE id = ?`;
    let inserts = [agentID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const addWaitList = (department, socketID) => {
    let sql = `INSERT INTO ${databaseName}.waitlist_${department}(socket_id) VALUES(?)`;
    let inserts = [socketID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getFromWaitList = department => {
    let sql = `SELECT socket_id FROM ${databaseName}.waitlist_${department} ORDER BY id asc LIMIT 1`;
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, nextInList) => {
            if (err) reject(err);
            resolve(nextInList);
        });
    });
};

const removeFromWaitList = department => {
    let sql = `DELETE FROM ${databaseName}.waitlist_${department} ORDER BY id asc LIMIT 1`;
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, dump) => {
            if (err) reject(err);
            resolve(dump);
        });
    });
};

const removeFromAllWaitlistsById = socketID => {
    let sql = `SET SQL_SAFE_UPDATES = 0;DELETE FROM ${databaseName}.waitlist_sales WHERE socket_id = ?;DELETE FROM ${databaseName}.waitlist_finance WHERE socket_id = ?;DELETE FROM ${databaseName}.waitlist_general WHERE socket_id = ?;SET SQL_SAFE_UPDATES = 1`;
    let inserts = [socketID, socketID, socketID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, dump) => {
            if (err) reject(err);
            resolve(dump);
        });
    });
};

const checkDepartmentOnline = department => {
    let sql = `SELECT id FROM ${databaseName}.agents WHERE online = 1 AND department = ? ORDER BY customersServed`;
    let inserts = [department];
    sql = mysql.format(sql, inserts);
    return new Promise(function(resolve, reject) {
        connectionPool.query(sql, function(err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const clearDepartmentWaitlist = department => {
    let sql = `SET SQL_SAFE_UPDATES = 0;DELETE FROM ${databaseName}.waitlist_${department};SET SQL_SAFE_UPDATES = 1`;
    return new Promise(function(resolve, reject) {
        connectionPool.query(sql, function(err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const getDepartmentWaitlist = department => {
    let sql = `SELECT * FROM ${databaseName}.waitlist_${department}`;
    return new Promise(function(resolve, reject) {
        connectionPool.query(sql, function(err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
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
