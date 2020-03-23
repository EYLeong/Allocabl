const mysql = require("mysql");

const createConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "allocabl",
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

const getAgentDepartment = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `SELECT department FROM agents WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

function getDepartment(socketID) {
    return new Promise(function(resolve, reject) {
        createConnection().query(
            `SELECT department FROM agents WHERE customerSocket='${socketID}'`,
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

const setAgentOnline = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET online = 1 WHERE id = '${agentID}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const setAgentOffline = agentID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `UPDATE agents SET online = 0 WHERE id = '${agentID}'`,
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

const getFromWaitList = department => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `SELECT socket_id FROM allocabl.waitlist_${department} ORDER BY id asc LIMIT 1`,
            (err, nextInList) => {
                if (err) reject(err);
                resolve(nextInList);
            }
        );
    });
};

const removeFromWaitList = department => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `DELETE FROM allocabl.waitlist_${department} ORDER BY id asc LIMIT 1`,
            (err, dump) => {
                if (err) reject(err);
                resolve(dump);
            }
        );
    });
};

const removeFromAllWaitlistsById = socketID => {
    return new Promise((resolve, reject) => {
        createConnection().query(
            `SET SQL_SAFE_UPDATES = 0;DELETE FROM allocabl.waitlist_sales WHERE socket_id = '${socketID}';DELETE FROM allocabl.waitlist_finance WHERE socket_id = '${socketID}';DELETE FROM allocabl.waitlist_general WHERE socket_id = '${socketID}';SET SQL_SAFE_UPDATES = 1`,
            (err, dump) => {
                if (err) reject(err);
                resolve(dump);
            }
        );
    });
};

const checkDepartmentOnline = department => {
    return new Promise(function(resolve, reject) {
        createConnection().query(
            `SELECT id FROM agents WHERE online = 1 AND department = '${department}' ORDER BY customersServed`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const clearDepartmentWaitlist = department => {
    return new Promise(function(resolve, reject) {
        createConnection().query(
            `SET SQL_SAFE_UPDATES = 0;DELETE FROM allocabl.waitlist_${department};SET SQL_SAFE_UPDATES = 1`,
            function(err, rows) {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const getDepartmentWaitlist = department => {
    return new Promise(function(resolve, reject) {
        createConnection().query(
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
