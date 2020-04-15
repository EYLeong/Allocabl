const expect = require("chai").expect;
const sinon = require("sinon");
const synchronized = require("../helpers/synchronized");
const socketEvents = require("../helpers/socketEvents");
const databaseManager = require("../helpers/databaseManager");

const promiseQuery = (sqlString) => {
    return new Promise((resolve, reject) => {
        databaseManager.connectionPool.query(sqlString, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const promiseTimeout = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};

const testSDK = {
    admin: {
        createAnonymousGuestUser: () => {
            return {
                loginEmail: "testEmail",
                password: "testPassword",
            };
        },
        askTokenOnBehalf: (email, password) => {
            if (email === "testEmail" && password === "testPassword")
                return { token: "testToken" };
            else throw new Error("incorrect credentials");
        },
    },
};

describe("concurrency stress testing", () => {
    before("setup database", async function () {
        await promiseQuery(
            "DROP DATABASE IF EXISTS allocablTest;CREATE DATABASE allocablTest;"
        );
        let sql =
            "DROP TABLE IF EXISTS allocablTest.agents;CREATE TABLE allocablTest.agents (id varchar(24) NOT NULL, department varchar(100) DEFAULT NULL, available tinyint(1) DEFAULT NULL, customersServed int DEFAULT NULL, customerSocket char(100) DEFAULT NULL, online tinyint(1) DEFAULT NULL, PRIMARY KEY (`id`))";
        await promiseQuery(sql);
        sql =
            "DROP TABLE IF EXISTS allocablTest.waitlist_sales;CREATE TABLE allocablTest.waitlist_sales (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));DROP TABLE IF EXISTS allocablTest.waitlist_finance;CREATE TABLE allocablTest.waitlist_finance (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));DROP TABLE IF EXISTS allocablTest.waitlist_general;CREATE TABLE allocablTest.waitlist_general (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));";
        await promiseQuery(sql);
        databaseManager.setDatabase("allocablTest");
    });

    afterEach("restore sinon", () => {
        sinon.restore();
    });

    after("drop database and close connection pool", async function () {
        await promiseQuery("DROP DATABASE IF EXISTS allocablTest");
        databaseManager.connectionPool.end();
    });

    describe("guest login requests", () => {
        before("insert test values", async () => {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('0','sales',1,2,NULL,1), ('1','sales',1,1,NULL,1),('2','sales',1,0,NULL,1)";
            await promiseQuery(sql);
        });

        after("clear test values", async () => {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        it("puts users into the waitlist in order", async () => {
            for (let i = 0; i < 100; i++) {
                synchronized.loginGuestLocked(
                    testSDK,
                    {
                        id: `${i}`,
                        emit: (signal, data) => {
                            // console.log(signal, data);
                        },
                    },
                    "sales"
                );
            }
            await promiseTimeout(1100);
            let rows = await promiseQuery(
                "SELECT * FROM allocablTest.waitlist_sales"
            );
            expect(rows).to.have.lengthOf(97);
            for (let i = 3; i < 100; i++) {
                expect(rows[i - 3].socket_id).to.equal(`${i}`);
            }
        });

        it("allocates agents in the correct order", async () => {
            let rows = await promiseQuery(
                "SELECT * FROM allocablTest.agents ORDER BY id"
            );
            for (let i = 0; i < rows.length; i++) {
                expect(rows[i].customerSocket).to.equal(`${2 - i}`);
            }
        });
    });
});
