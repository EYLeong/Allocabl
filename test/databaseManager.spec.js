const mysql = require("mysql");
const expect = require("chai").expect;
const databaseManager = require("../helpers/databaseManager");

const connectionPool = mysql.createPool({
    host: "localhost",
    user: "allocabl",
    password: "Password123",
    multipleStatements: true
});

const promiseQuery = (sqlString, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(sqlString, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

describe("Database", function() {
    before("create database", async function() {
        await promiseQuery(
            "DROP DATABASE IF EXISTS allocablTest;CREATE DATABASE allocablTest;USE allocablTest",
            connectionPool
        );
    });

    after("drop database and close connection pool", async function() {
        await promiseQuery(
            "DROP DATABASE IF EXISTS allocablTest",
            connectionPool
        );
        connectionPool.end();
    });

    describe("Agents", function() {
        before("create table", async function() {
            let sql =
                "DROP TABLE IF EXISTS agents;CREATE TABLE agents (id varchar(24) NOT NULL, department varchar(100) DEFAULT NULL, available tinyint(1) DEFAULT NULL, customersServed int DEFAULT NULL, customerSocket char(100) DEFAULT NULL, online tinyint(1) DEFAULT NULL, PRIMARY KEY (`id`))";
            await promiseQuery(sql, connectionPool);
        });

        afterEach("clear table", async function() {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM agents;SET SQL_SAFE_UPDATES = 1",
                connectionPool
            );
        });

        after("drop table", async function() {
            await promiseQuery("DROP TABLE IF EXISTS agents", connectionPool);
        });

        it("returns available agents with correct department, ordered by customers served", async function() {
            let sql =
                "INSERT INTO agents VALUES ('1','sales',1,0,NULL,1),('2','sales',0,10,NULL,1),('3','sales',1,2,NULL,1)";
            await promiseQuery(sql, connectionPool);
            let rows = await databaseManager.getAgent("sales", connectionPool);
            expect(rows).to.have.lengthOf(2);
            expect(rows[0].id).to.equal("1");
        });
    });
});
