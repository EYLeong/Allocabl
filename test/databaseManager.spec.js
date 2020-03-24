const expect = require("chai").expect;
const databaseManager = require("../helpers/databaseManager");

const promiseQuery = sqlString => {
    return new Promise((resolve, reject) => {
        databaseManager.connectionPool.query(sqlString, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

describe("Database", function() {
    before("create database", async function() {
        await promiseQuery(
            "DROP DATABASE IF EXISTS allocablTest;CREATE DATABASE allocablTest;"
        );
        databaseManager.setDatabase("allocablTest");
    });

    after("drop database and close connection pool", async function() {
        await promiseQuery("DROP DATABASE IF EXISTS allocablTest");
        databaseManager.connectionPool.end();
    });

    describe("Agents", function() {
        before("create table", async function() {
            let sql =
                "DROP TABLE IF EXISTS allocablTest.agents;CREATE TABLE allocablTest.agents (id varchar(24) NOT NULL, department varchar(100) DEFAULT NULL, available tinyint(1) DEFAULT NULL, customersServed int DEFAULT NULL, customerSocket char(100) DEFAULT NULL, online tinyint(1) DEFAULT NULL, PRIMARY KEY (`id`))";
            await promiseQuery(sql);
        });

        afterEach("clear tables", async function() {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        after("drop table", async function() {
            await promiseQuery("DROP TABLE IF EXISTS allocablTest.agents");
        });

        it("returns available agents with correct department, ordered by customers served", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,NULL,1),('2','sales',0,10,NULL,1),('3','sales',1,2,NULL,1)";
            await promiseQuery(sql);
            let rows = await databaseManager.getAgent("sales");
            expect(rows).to.have.lengthOf(2);
            expect(rows[0].id).to.equal("1");
            rows = await databaseManager.getAgent("finance");
            expect(rows).to.have.lengthOf(0);
        });

        it("returns department of agent", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,NULL,1),('2','finance',0,10,NULL,1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            let rows = await databaseManager.getAgentDepartment("1");
            expect(rows[0].department).to.equal("sales");
            rows = await databaseManager.getAgentDepartment("2");
            expect(rows[0].department).to.equal("finance");
            rows = await databaseManager.getAgentDepartment("invalid");
            expect(rows).to.have.lengthOf(0);
        });

        it("returns department of agent currently engaged to customerSocket", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            let rows = await databaseManager.getDepartment("customer1");
            expect(rows[0].department).to.equal("sales");
            rows = await databaseManager.getDepartment("invalid");
            expect(rows).to.have.lengthOf(0);
        });

        it("increments the number of customers served of an agent", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            await databaseManager.incrementCustomersServed("1");
            await databaseManager.incrementCustomersServed("2");
            let rows = await promiseQuery(
                "SELECT customersServed FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].customersServed).to.equal(1);
            expect(rows[1].customersServed).to.equal(11);
            expect(rows[2].customersServed).to.equal(2);
        });

        it("adds a customerSocket to agent", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            await databaseManager.addSocketAgent("1", "customerA");
            await databaseManager.addSocketAgent("3", "customerB");
            let rows = await promiseQuery(
                "SELECT customerSocket FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].customerSocket).to.equal("customerA");
            expect(rows[1].customerSocket).to.equal("customer2");
            expect(rows[2].customerSocket).to.equal("customerB");
        });

        it("removes a customerSocket from corresponding agent", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            await databaseManager.removeSocketAgent("customer1");
            let rows = await promiseQuery(
                "SELECT customerSocket FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].customerSocket).to.be.null;
            expect(rows[1].customerSocket).to.equal("customer2");
            expect(rows[2].customerSocket).to.be.null;
        });

        it("sets an agent to available", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',0,2,NULL,1)";
            await promiseQuery(sql);
            await databaseManager.setAgentAvailable("2");
            await databaseManager.setAgentAvailable("1");
            let rows = await promiseQuery(
                "SELECT available FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].available).to.equal(1);
            expect(rows[1].available).to.equal(1);
            expect(rows[2].available).to.equal(0);
        });

        it("sets an agent to unavailable", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            await databaseManager.setAgentUnavailable("1");
            await databaseManager.setAgentUnavailable("2");
            let rows = await promiseQuery(
                "SELECT available FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].available).to.equal(0);
            expect(rows[1].available).to.equal(0);
            expect(rows[2].available).to.equal(1);
        });

        it("sets an agent to online", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','finance',0,10,'customer2',0),('3','general',1,2,NULL,0)";
            await promiseQuery(sql);
            await databaseManager.setAgentOnline("1");
            await databaseManager.setAgentOnline("2");
            let rows = await promiseQuery(
                "SELECT online FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].online).to.equal(1);
            expect(rows[1].online).to.equal(1);
            expect(rows[2].online).to.equal(0);
        });

        it("sets an agent to offline", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',0),('2','finance',0,10,'customer2',1),('3','general',1,2,NULL,1)";
            await promiseQuery(sql);
            await databaseManager.setAgentOffline("1");
            await databaseManager.setAgentOffline("2");
            let rows = await promiseQuery(
                "SELECT online FROM allocablTest.agents ORDER BY id"
            );
            expect(rows[0].online).to.equal(0);
            expect(rows[1].online).to.equal(0);
            expect(rows[2].online).to.equal(1);
        });

        it("returns all online agents from specified department", async function() {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('1','sales',1,0,'customer1',1),('2','sales',0,10,'customer2',0),('3','general',1,2,NULL,0)";
            await promiseQuery(sql);
            let rows = await databaseManager.checkDepartmentOnline("sales");
            expect(rows).to.have.lengthOf(1);
            rows = await databaseManager.checkDepartmentOnline("general");
            expect(rows).to.have.lengthOf(0);
        });
    });

    describe("Waitlists", function() {
        before("create table", async function() {
            let sql =
                "DROP TABLE IF EXISTS allocablTest.waitlist_sales;CREATE TABLE allocablTest.waitlist_sales (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));DROP TABLE IF EXISTS allocablTest.waitlist_finance;CREATE TABLE allocablTest.waitlist_finance (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));DROP TABLE IF EXISTS allocablTest.waitlist_general;CREATE TABLE allocablTest.waitlist_general (id int NOT NULL AUTO_INCREMENT, socket_id varchar(255) DEFAULT NULL, PRIMARY KEY (id));";
            await promiseQuery(sql);
        });

        afterEach("clear tables", async function() {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;SET SQL_SAFE_UPDATES = 1"
            );
        });

        after("drop table", async function() {
            await promiseQuery(
                "DROP TABLE IF EXISTS allocablTest.waitlist_sales;DROP TABLE IF EXISTS allocablTest.waitlist_finance;DROP TABLE IF EXISTS allocablTest.waitlist_general;"
            );
        });

        it("adds sockets to waitlist in insertion order", async function() {
            await databaseManager.addWaitList("sales", "customer1");
            await databaseManager.addWaitList("sales", "customer2");
            let rows = await promiseQuery(
                "SELECT socket_id FROM allocablTest.waitlist_sales ORDER BY id"
            );
            expect(rows).to.have.lengthOf(2);
            expect(rows[0].socket_id).to.be.equal("customer1");
            expect(rows[1].socket_id).to.be.equal("customer2");
        });

        it("returns the next customer in the waitlist for a department", async function() {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
            await promiseQuery(sql);
            let rows = await databaseManager.getFromWaitList("sales");
            expect(rows).to.have.lengthOf(1);
            expect(rows[0].socket_id).to.be.equal("customer1");
        });

        it("removes the next customer from a waitlist by department", async function() {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
            await promiseQuery(sql);
            await databaseManager.removeFromWaitList("sales");
            let rows = await promiseQuery(
                "SELECT socket_id FROM allocablTest.waitlist_sales"
            );
            expect(rows).to.have.lengthOf(1);
            expect(rows[0].socket_id).to.be.equal("customer2");
        });

        it("removes a customer from all waitlists", async function() {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_finance(socket_id) VALUES('customer2');";
            await promiseQuery(sql);
            await databaseManager.removeFromAllWaitlistsById("customer1");
            let rows = await promiseQuery(
                "SELECT socket_id FROM allocablTest.waitlist_sales"
            );
            expect(rows).to.have.lengthOf(0);
            rows = await promiseQuery(
                "SELECT socket_id FROM allocablTest.waitlist_finance"
            );
            expect(rows).to.have.lengthOf(1);
        });

        it("clears the waitlist of a particular department", async function() {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
            await promiseQuery(sql);
            await databaseManager.clearDepartmentWaitlist("sales");
            let rows = await promiseQuery(
                "SELECT * FROM allocablTest.waitlist_sales"
            );
            expect(rows).to.have.lengthOf(0);
        });

        it("returns the waitlist of a particular department", async function() {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer1');INSERT INTO allocablTest.waitlist_sales(socket_id) VALUES('customer2');";
            await promiseQuery(sql);
            let rows = await databaseManager.getDepartmentWaitlist("sales");
            expect(rows).to.have.lengthOf(2);
            expect(rows[0].socket_id).to.be.equal("customer1");
        });
    });
});
