const mysql = require("mysql");
const utils = require("./utils");

const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "allocabl",
    password: "Password123",
    multipleStatements: true,
});

let databaseName = "allocabl";

const setDatabase = (dbName) => {
    if (!utils.isAlphaNum(dbName))
        throw new Error("database name must be alphanumeric");
    databaseName = dbName;
};

function checkAgentAvailable(department, agentID) {
    if (typeof agentID !== "string" || typeof department !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    let sql = `SELECT id FROM ${databaseName}.agents WHERE available = 1 AND department = ? AND id = ?`;
    let inserts = [department, agentID];
    sql = mysql.format(sql, inserts);
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

function getAgent(department) {
    if (typeof department !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    let sql = `SELECT id FROM ${databaseName}.agents WHERE available = 1 AND department = ? ORDER BY customersServed`;
    let inserts = [department];
    sql = mysql.format(sql, inserts);
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const getAgentDepartment = (agentID) => {
    if (typeof agentID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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
    if (typeof socketID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    let sql = `SELECT department FROM ${databaseName}.agents WHERE customerSocket = ?`;
    let inserts = [socketID];
    sql = mysql.format(sql, inserts);
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const incrementCustomersServed = (agentID) => {
    if (typeof agentID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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
    if (typeof agentID !== "string" || typeof socketID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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

const removeSocketAgent = (socketID) => {
    if (typeof socketID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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

const setAgentAvailable = (agentID) => {
    if (typeof agentID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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

const setAgentUnavailable = (agentID) => {
    if (typeof agentID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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

const setAgentOnline = (agentID) => {
    if (typeof agentID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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

const setAgentOffline = (agentID) => {
    if (typeof agentID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
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

const checkDepartmentOnline = (department) => {
    if (typeof department !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    let sql = `SELECT id FROM ${databaseName}.agents WHERE online = 1 AND department = ? ORDER BY customersServed`;
    let inserts = [department];
    sql = mysql.format(sql, inserts);
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const addWaitList = (department, socketID) => {
    if (typeof department !== "string" || typeof socketID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
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

const getFromWaitList = (department) => {
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
    let sql = `SELECT socket_id FROM ${databaseName}.waitlist_${department} ORDER BY id asc LIMIT 1`;
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, nextInList) => {
            if (err) reject(err);
            resolve(nextInList);
        });
    });
};

const removeFromWaitList = (department) => {
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
    let sql = `DELETE FROM ${databaseName}.waitlist_${department} ORDER BY id asc LIMIT 1`;
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, dump) => {
            if (err) reject(err);
            resolve(dump);
        });
    });
};

const removeFromWaitlistById = (department, socketID) => {
    if (typeof department !== "string" || typeof socketID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
    let sql = `SET SQL_SAFE_UPDATES = 0;DELETE FROM ${databaseName}.waitlist_${department} WHERE socket_id = ?;SET SQL_SAFE_UPDATES = 1;`;
    let inserts = [socketID];
    sql = mysql.format(sql, inserts);
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, dump) => {
            if (err) reject(err);
            resolve(dump);
        });
    });
};

const clearDepartmentWaitlist = (department) => {
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
    let sql = `SET SQL_SAFE_UPDATES = 0;DELETE FROM ${databaseName}.waitlist_${department};SET SQL_SAFE_UPDATES = 1`;
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const getDepartmentWaitlist = (department) => {
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
    let sql = `SELECT * FROM ${databaseName}.waitlist_${department}`;
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const findSocketWaitlist = (department, socketID) => {
    if (typeof department !== "string" || typeof socketID !== "string")
        return new Promise((resolve, reject) => {
            reject(new Error("parameters must be of type string"));
        });
    if (!utils.isAlphaNum(department))
        return new Promise((resolve, reject) => {
            reject(new Error("department must be alphanumeric"));
        });
    let sql = `SELECT * FROM ${databaseName}.waitlist_${department} WHERE socket_id = ?`;
    let inserts = [socketID];
    sql = mysql.format(sql, inserts);
    return new Promise(function (resolve, reject) {
        connectionPool.query(sql, function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const findSocketWaitlistDepartment = async (socketID) => {
    for (dept of ["sales", "finance", "general"]) {
        let rows = await findSocketWaitlist(dept, socketID);
        if (rows.length !== 0) return dept;
    }
    return null;
};

module.exports = {
    getAgent,
    checkAgentAvailable,
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
    removeFromWaitlistById,
    getAgentDepartment,
    checkDepartmentOnline,
    clearDepartmentWaitlist,
    getDepartmentWaitlist,
    connectionPool,
    setDatabase,
    findSocketWaitlist,
    findSocketWaitlistDepartment,
};
