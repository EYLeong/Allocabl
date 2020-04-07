const rainbowEvents = require("../helpers/rainbowEvents");
const databaseManager = require("../helpers/databaseManager");
const socketEvents = require("../helpers/socketEvents");
const expect = require("chai").expect;
const sinon = require("sinon");

const promiseQuery = (sqlString) => {
    return new Promise((resolve, reject) => {
        databaseManager.connectionPool.query(sqlString, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
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

describe("rainbowEvents", () => {
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

    describe("onAgentStatusChange", () => {
        before("insert test values", async () => {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('0','sales',0,10,NULL,0), ('1','sales',1,10,NULL,1)";
            await promiseQuery(sql);
        });

        after("clear test values", async () => {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        describe("agent comes online", () => {
            let checkWaitlistSDK = 0;
            let checkWaitlistDepartment = 0;
            const fakeCheckWaitlist = (rainbowSDK, department) => {
                if (JSON.stringify(rainbowSDK) === JSON.stringify(testSDK))
                    checkWaitlistSDK++;
                if (department === "sales") checkWaitlistDepartment++;
            };

            it("sets agent to online and available", async () => {
                sinon.replace(socketEvents, "checkWaitlist", fakeCheckWaitlist);
                await rainbowEvents.onAgentStatusChange(testSDK, "0", "online");
                let sql = "SELECT * FROM allocablTest.agents WHERE id = '0'";
                let rows = await promiseQuery(sql);
                expect(rows[0].available).to.equal(1);
                expect(rows[0].online).to.equal(1);
            });

            it("calls checkWaitlist with the correct parameters", async () => {
                expect(checkWaitlistSDK).to.equal(1);
                expect(checkWaitlistDepartment).to.equal(1);
            });
        });

        describe("agent goes offline", () => {});
    });
});
