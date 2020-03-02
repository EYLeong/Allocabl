const mysql = require("mysql");

let connection = mysql.createConnection({
    host: "localhost",
    user: "allocabl",
    password: "Password123",
    database: "allocabl"
});

const restartConnection = () => {
    connection = mysql.createConnection({
        host: "localhost",
        user: "allocabl",
        password: "Password123",
        database: "allocabl"
    });
};

const getAgent = (department, callback) => {
    connection.query(
        `SELECT id FROM agents WHERE available = 1 AND department = '${department}'`,
        (err, rows) => {
            if (err) {
                console.log(err);
                callback("ERROR");
                restartConnection();
            } else callback(rows[0].id);
        }
    );
};

module.exports = { getAgent };
