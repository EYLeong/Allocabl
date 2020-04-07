const expect = require("chai").expect;
const databaseManager = require("../helpers/databaseManager");

const promiseQuery = (sqlString) => {
    return new Promise((resolve, reject) => {
        databaseManager.connectionPool.query(sqlString, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const securityTests = async (func) => {
    it("is protected against sql injection", async () => {
        await func("'; DROP allocablTest.agents");
        let rows = await promiseQuery("SELECT * FROM allocablTest.agents");
        expect(rows).to.not.have.lengthOf(0);
    });

    it("throws an error if the database name is wrong", async () => {
        databaseManager.setDatabase("invalid");
        try {
            await func("asdf");
        } catch (err) {
            expect(err).to.have.property(
                "sqlMessage",
                "Unknown database 'invalid'"
            );
        }
        databaseManager.setDatabase("allocablTest");
    });

    it("throws an error if the parameters are not strings", async () => {
        try {
            await func({ test: "test" });
        } catch (err) {
            expect(err.message).to.be.equal(
                "parameters must be of type string"
            );
        }
    });
};

const waitlistSecurityTests = async (func) => {
    it("throws an error if the department does not exist", async () => {
        try {
            await func("invalid");
        } catch (err) {
            expect(err).to.have.property(
                "sqlMessage",
                "Table 'allocablTest.waitlist_invalid' doesn't exist"
            );
        }
    });

    it("throws an error if the department is not alphanumeric", async () => {
        try {
            await func("asdf^&");
        } catch (err) {
            expect(err.message).to.be.equal("department must be alphanumeric");
        }

        try {
            await func({ test: "test" });
        } catch (err) {
            expect(err.message).to.be.equal("department must be alphanumeric");
        }
    });

    it("throws an error if the database name is wrong", async () => {
        databaseManager.setDatabase("invalid");
        try {
            await databaseManager.getFromWaitList("sales");
        } catch (err) {
            expect(err).to.have.property(
                "sqlMessage",
                "Unknown database 'invalid'"
            );
        }
        databaseManager.setDatabase("allocablTest");
    });
};

const waitlistSecurityTests2 = async (func) => {
    it("throws an error if the department does not exist", async () => {
        try {
            await func("invalid", "customer1");
        } catch (err) {
            expect(err).to.have.property(
                "sqlMessage",
                "Table 'allocablTest.waitlist_invalid' doesn't exist"
            );
        }
    });

    it("throws an error if the department is not alphanumeric", async () => {
        try {
            await func("asdf8(", "test");
        } catch (err) {
            expect(err.message).to.be.equal("department must be alphanumeric");
        }
    });

    it("throws an error if the parameters are not strings", async () => {
        try {
            await func({ test: "test" }, "test");
        } catch (err) {
            expect(err.message).to.be.equal(
                "parameters must be of type string"
            );
        }

        try {
            await func("test", { test: "test" });
        } catch (err) {
            expect(err.message).to.be.equal(
                "parameters must be of type string"
            );
        }
    });

    it("throws an error if the database name is wrong", async () => {
        databaseManager.setDatabase("invalid");
        try {
            await func("test", "test");
        } catch (err) {
            expect(err).to.have.property(
                "sqlMessage",
                "Unknown database 'invalid'"
            );
        }
        databaseManager.setDatabase("allocablTest");
    });
};

describe("DatabaseManager", function () {
    before("create database", async function () {
        await promiseQuery(
            "DROP DATABASE IF EXISTS allocablTest;CREATE DATABASE allocablTest;"
        );
    });

    after("drop database and close connection pool", async function () {
        await promiseQuery("DROP DATABASE IF EXISTS allocablTest");
        databaseManager.connectionPool.end();
    });

    describe("setDatabase", () => {
        it("throws an error if trying to set a database name that is not alphanumeric", () => {
            expect(() => {
                databaseManager.setDatabase("asdfasdf-0");
            }).to.throw("alphanumeric");
        });

        it("throws an error if trying to set an empty database name", () => {
            expect(() => {
                databaseManager.setDatabase("");
            }).to.throw("alphanumeric");
        });

        it("throws an error if trying to set a database name that is not a string", () => {
            expect(() => {
                databaseManager.setDatabase({ test: "test" });
            }).to.throw("alphanumeric");
            expect(() => {
                databaseManager.setDatabase();
            }).to.throw("alphanumeric");
        });

        it("sets the database for future queries to that specified by the given database name", async () => {
            let sql =
                "DROP TABLE IF EXISTS allocablTest.agents;CREATE TABLE allocablTest.agents (id varchar(24) NOT NULL, department varchar(100) DEFAULT NULL, available tinyint(1) DEFAULT NULL, customersServed int DEFAULT NULL, customerSocket char(100) DEFAULT NULL, online tinyint(1) DEFAULT NULL, PRIMARY KEY (`id`))";
            await promiseQuery(sql);
            databaseManager.setDatabase("allocablTest");
            let result = await databaseManager.getAgent("asdf");
            expect(result).to.have.lengthOf(0);
            sql = "DROP TABLE IF EXISTS allocablTest.agents";
            await promiseQuery(sql);
        });
    });

    describe("Agents", function () {
        before("create table", async function () {
            let sql =
                "DROP TABLE IF EXISTS allocablTest.agents;CREATE TABLE allocablTest.agents (id varchar(24) NOT NULL, department varchar(100) DEFAULT NULL, available tinyint(1) DEFAULT NULL, customersServed int DEFAULT NULL, customerSocket char(100) DEFAULT NULL, online tinyint(1) DEFAULT NULL, PRIMARY KEY (`id`))";
            await promiseQuery(sql);
        });

        after("drop table", async function () {
            await promiseQuery("DROP TABLE IF EXISTS allocablTest.agents");
        });

        describe("getAgent", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,NULL,1),('2','sales',0,10,NULL,1),('3','sales',1,2,NULL,1),('4','finance',0,0,NULL,0)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns available agents with correct department, ordered by customers served", async function () {
                let rows = await databaseManager.getAgent("sales");
                expect(rows).to.have.lengthOf(2);
                expect(rows[0].id).to.equal("1");
            });

            it("is empty when no agent is available", async () => {
                let rows = await databaseManager.getAgent("finance");
                expect(rows).to.have.lengthOf(0);
            });

            it("is empty when the department does not exist", async () => {
                let rows = await databaseManager.getAgent("general");
                expect(rows).to.have.lengthOf(0);
            });

            securityTests(databaseManager.getAgent);
        });

        describe("getAgentDepartment", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,NULL,1),('2','finance',0,10,NULL,1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns department of agent", async function () {
                let rows = await databaseManager.getAgentDepartment("1");
                expect(rows[0].department).to.equal("sales");
                rows = await databaseManager.getAgentDepartment("2");
                expect(rows[0].department).to.equal("finance");
            });

            it("is empty if agent is not found", async () => {
                let rows = await databaseManager.getAgentDepartment("invalid");
                expect(rows).to.have.lengthOf(0);
            });

            securityTests(databaseManager.getAgentDepartment);
        });

        describe("getDepartment", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns department of agent currently engaged to customerSocket", async function () {
                let rows = await databaseManager.getDepartment("customer1");
                expect(rows[0].department).to.equal("sales");
            });

            it("is empty when given an invalid customerSocket", async () => {
                let rows = await databaseManager.getDepartment("invalid");
                expect(rows).to.have.lengthOf(0);
            });

            securityTests(databaseManager.getDepartment);
        });

        describe("incrementCustomersServed", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("increments the number of customers served of an agent", async function () {
                await databaseManager.incrementCustomersServed("1");
                let rows = await promiseQuery(
                    "SELECT customersServed FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[0].customersServed).to.equal(1);
            });

            it("does nothing when given an invalid agent id", async () => {
                let result = await databaseManager.incrementCustomersServed(
                    "invalid"
                );
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            securityTests(databaseManager.incrementCustomersServed);
        });

        describe("addSocketAgent", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("adds a customerSocket to agent", async function () {
                await databaseManager.addSocketAgent("3", "customerA");
                let rows = await promiseQuery(
                    "SELECT customerSocket FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[2].customerSocket).to.equal("customerA");
            });

            it("does nothing when given an invalid agent id", async () => {
                let result = await databaseManager.addSocketAgent(
                    "invalid",
                    "customerB"
                );
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            it("is protected against sql injection", async () => {
                let result = await databaseManager.addSocketAgent(
                    "'; DROP allocablTest.agents",
                    "'; DROP allocablTest.agents"
                );
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            it("throws an error if the database name is wrong", async () => {
                databaseManager.setDatabase("invalid");
                try {
                    await databaseManager.addSocketAgent("asdf", "test");
                } catch (err) {
                    expect(err).to.have.property(
                        "sqlMessage",
                        "Unknown database 'invalid'"
                    );
                }
                databaseManager.setDatabase("allocablTest");
            });

            it("throws an error if the parameters are not strings", async () => {
                try {
                    await databaseManager.addSocketAgent(
                        { test: "test" },
                        "string"
                    );
                } catch (err) {
                    expect(err.message).to.be.equal(
                        "parameters must be of type string"
                    );
                }
                try {
                    await databaseManager.addSocketAgent("string", {
                        test: "test",
                    });
                } catch (err) {
                    expect(err.message).to.be.equal(
                        "parameters must be of type string"
                    );
                }
            });
        });

        describe("removeSocketAgent", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("removes a customerSocket from corresponding agent", async () => {
                await databaseManager.removeSocketAgent("customer1");
                let rows = await promiseQuery(
                    "SELECT customerSocket FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[0].customerSocket).to.be.null;
            });

            it("does nothing if given an invalid socket id", async () => {
                let result = await databaseManager.removeSocketAgent("invalid");
                for (obj of result) {
                    expect(obj).to.have.property("affectedRows", 0);
                    expect(obj).to.have.property("changedRows", 0);
                }
            });

            securityTests(databaseManager.removeSocketAgent);
        });

        describe("setAgentAvailable", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',0,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("sets an agent to available", async function () {
                await databaseManager.setAgentAvailable("2");
                let rows = await promiseQuery(
                    "SELECT available FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[1].available).to.equal(1);
            });

            it("does nothing when given an invalid agent id", async () => {
                let result = await databaseManager.setAgentAvailable("invalid");
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            securityTests(databaseManager.setAgentAvailable);
        });

        describe("setAgentUnavailable", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("sets an agent to unavailable", async function () {
                await databaseManager.setAgentUnavailable("1");
                let rows = await promiseQuery(
                    "SELECT available FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[0].available).to.equal(0);
            });

            it("does nothing when given an invalid agent id", async () => {
                let result = await databaseManager.setAgentUnavailable(
                    "invalid"
                );
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            securityTests(databaseManager.setAgentUnavailable);
        });

        describe("setAgentOnline", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',0),('3','general',1,2,NULL,0)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("sets an agent to online", async function () {
                await databaseManager.setAgentOnline("2");
                let rows = await promiseQuery(
                    "SELECT online FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[1].online).to.equal(1);
            });

            it("does nothing when given an invalid agent id", async () => {
                let result = await databaseManager.setAgentOnline("invalid");
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            securityTests(databaseManager.setAgentOnline);
        });

        describe("setAgentOffline", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',0),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("sets an agent to offline", async function () {
                await databaseManager.setAgentOffline("2");
                let rows = await promiseQuery(
                    "SELECT online FROM allocablTest.agents ORDER BY id"
                );
                expect(rows[1].online).to.equal(0);
            });

            it("does nothing when given an invalid agent id", async () => {
                let result = await databaseManager.setAgentOffline("invalid");
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            securityTests(databaseManager.setAgentOffline);
        });

        describe("checkDepartmentOnline", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','sales',0,10,'customer2',0),('3','general',1,2,NULL,0)";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear table", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns all online agents from specified department", async function () {
                let rows = await databaseManager.checkDepartmentOnline("sales");
                expect(rows).to.have.lengthOf(1);
            });

            it("is empty when there are no online agents for the department", async () => {
                let rows = await databaseManager.checkDepartmentOnline(
                    "general"
                );
                expect(rows).to.have.lengthOf(0);
            });

            it("is empty when the department does not exist", async () => {
                let rows = await databaseManager.checkDepartmentOnline(
                    "finance"
                );
                expect(rows).to.have.lengthOf(0);
            });

            securityTests(databaseManager.checkDepartmentOnline);
        });
    });

    describe("Waitlists", function () {
        before("create table and use database", async function () {
            let sql =
                "DROP TABLE IF EXISTS allocablTest.waitlist_sales;CREATE TABLE allocablTest.waitlist_sales (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));DROP TABLE IF EXISTS allocablTest.waitlist_finance;CREATE TABLE allocablTest.waitlist_finance (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));DROP TABLE IF EXISTS allocablTest.waitlist_general;CREATE TABLE allocablTest.waitlist_general (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));";
            await promiseQuery(sql);
        });

        after("drop table", async function () {
            await promiseQuery(
                "DROP TABLE IF EXISTS allocablTest.waitlist_sales;DROP TABLE IF EXISTS allocablTest.waitlist_finance;DROP TABLE IF EXISTS allocablTest.waitlist_general;"
            );
        });

        describe("addWaitList", () => {
            before("insert data and set database", () => {
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("adds sockets to waitlist in insertion order", async function () {
                await databaseManager.addWaitList("sales", "customer1");
                await databaseManager.addWaitList("sales", "customer2");
                let rows = await promiseQuery(
                    "SELECT socket_id FROM allocablTest.waitlist_sales ORDER BY id"
                );
                expect(rows).to.have.lengthOf(2);
                expect(rows[0].socket_id).to.be.equal("customer1");
                expect(rows[1].socket_id).to.be.equal("customer2");
            });

            it("is protected against sql injection", async () => {
                await databaseManager.addWaitList(
                    "sales",
                    "'fake');DROP allocablTest.waitlist_sales"
                );
                let rows = await promiseQuery(
                    "SELECT * FROM allocablTest.waitlist_sales"
                );
                expect(rows).to.have.lengthOf(3);
            });

            waitlistSecurityTests2(databaseManager.addWaitList);
        });

        describe("getFromWaitList", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns the next customer in the waitlist for a department", async function () {
                let rows = await databaseManager.getFromWaitList("sales");
                expect(rows).to.have.lengthOf(1);
                expect(rows[0].socket_id).to.be.equal("customer1");
            });

            it("is empty if the waitlist is empty", async () => {
                let rows = await databaseManager.getFromWaitList("finance");
                expect(rows).to.have.lengthOf(0);
            });

            waitlistSecurityTests(databaseManager.getFromWaitList);
        });

        describe("removeFromWaitList", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("removes the next customer from a waitlist by department", async function () {
                await databaseManager.removeFromWaitList("sales");
                let rows = await promiseQuery(
                    "SELECT socket_id FROM allocablTest.waitlist_sales"
                );
                expect(rows).to.have.lengthOf(1);
                expect(rows[0].socket_id).to.be.equal("customer2");
            });

            it("does nothing if the waitlist is empty", async () => {
                let result = await databaseManager.removeFromWaitList(
                    "finance"
                );
                expect(result).to.have.property("affectedRows", 0);
                expect(result).to.have.property("changedRows", 0);
            });

            waitlistSecurityTests(databaseManager.removeFromWaitList);
        });

        describe("removeFromWaitlistById", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_finance(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("removes a customer from the specified department waitlist", async function () {
                await databaseManager.removeFromWaitlistById(
                    "sales",
                    "customer1"
                );
                let rows = await promiseQuery(
                    "SELECT socket_id FROM allocablTest.waitlist_sales"
                );
                expect(rows).to.have.lengthOf(0);
            });

            it("does nothing if the customer is not in the waitlist", async () => {
                let result = await databaseManager.removeFromWaitlistById(
                    "finance",
                    "invalid"
                );
            });

            it("is protected against sql injection", async () => {
                let result = await databaseManager.removeFromWaitlistById(
                    "finance",
                    "';DROP allocablTest.waitlist_finance;"
                );
                expect(result[1]).to.have.property("affectedRows", 0);
                expect(result[1]).to.have.property("changedRows", 0);
            });

            waitlistSecurityTests2(databaseManager.removeFromWaitlistById);
        });

        describe("clearDepartmentWaitlist", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("clears the waitlist of a particular department", async function () {
                await databaseManager.clearDepartmentWaitlist("sales");
                let rows = await promiseQuery(
                    "SELECT * FROM allocablTest.waitlist_sales"
                );
                expect(rows).to.have.lengthOf(0);
            });

            waitlistSecurityTests(databaseManager.clearDepartmentWaitlist);
        });

        describe("getDepartmentWaitlist", () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns the waitlist of a particular department", async function () {
                let rows = await databaseManager.getDepartmentWaitlist("sales");
                expect(rows).to.have.lengthOf(2);
                expect(rows[0].socket_id).to.be.equal("customer1");
            });

            it("is empty if the waitlist is empty", async () => {
                let rows = await databaseManager.getDepartmentWaitlist(
                    "finance"
                );
                expect(rows).to.have.lengthOf(0);
            });

            waitlistSecurityTests(databaseManager.getDepartmentWaitlist);
        });

        describe("findSocketWaitlist", async () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_finance(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("looks for a socket ID in a given department's waitlist", async () => {
                let rows = await databaseManager.findSocketWaitlist(
                    "sales",
                    "customer1"
                );
                expect(rows).to.have.lengthOf(1);
                expect(rows[0].socket_id).to.equal("customer1");
            });

            it("is empty if the entry is not found", async () => {
                let rows = await databaseManager.findSocketWaitlist(
                    "finance",
                    "test"
                );
                expect(rows).to.have.lengthOf(0);
            });

            it("is protected against sql injection", async () => {
                await databaseManager.findSocketWaitlist(
                    "finance",
                    "';DROP allocablTest.waitlist_finance;"
                );
                let rows = await promiseQuery(
                    "SELECT * FROM allocablTest.waitlist_finance"
                );
                expect(rows).to.have.lengthOf(1);
            });

            waitlistSecurityTests2(databaseManager.findSocketWaitlist);
        });

        describe("findSocketWaitlistDepartment", async () => {
            before("insert data and set database", async () => {
                let sql =
                    "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_finance(socket_id) VALUES('customer2');";
                await promiseQuery(sql);
                databaseManager.setDatabase("allocablTest");
            });

            after("clear tables", async () => {
                await promiseQuery(
                    "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
                );
            });

            it("returns the department of the waitlist that a given socket ID is in", async () => {
                let dept = await databaseManager.findSocketWaitlistDepartment(
                    "customer1"
                );
                expect(dept).to.be.equal("sales");
            });

            it("is protected against sql injection", async () => {
                let dept = await databaseManager.findSocketWaitlistDepartment(
                    "';DROP allocablTest.waitlist_finance;"
                );
                let rows = await promiseQuery(
                    "SELECT * FROM allocablTest.waitlist_finance"
                );
                expect(rows).to.have.lengthOf(1);
            });

            it("throws an error if the parameters are not strings", async () => {
                try {
                    await databaseManager.findSocketWaitlistDepartment({
                        test: "test",
                    });
                } catch (err) {
                    expect(err.message).to.be.equal(
                        "parameters must be of type string"
                    );
                }
            });
        });
    });
});
