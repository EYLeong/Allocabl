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
        `SELECT id FROM agents WHERE available = 1 AND department = '${department}'`,
        (err, rows) => {
            if (err) {
                errorHandler(err);
            } else callback(rows[0].id);
        }
    );
};

module.exports = { getAgent };
