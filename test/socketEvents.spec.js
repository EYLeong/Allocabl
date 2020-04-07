const socketEvents = require("../helpers/socketEvents");
const databaseManager = require("../helpers/databaseManager");
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

describe("SocketEvents", () => {
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

    describe("loginGuest", () => {
        before("insert test values", async () => {
            let sql =
                "INSERT INTO allocablTest.agents VALUES ('0','sales',1,10,NULL,1), ('1','sales',0,10,NULL,1),('2','sales',1,0,NULL,1),('3','general',0,2,NULL,1),('4','general',0,2,NULL,1), ('5','finance',1,2,NULL,0), ('6','finance',1,2,NULL,0)";
            await promiseQuery(sql);
        });

        after("clear test values", async () => {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        describe("agent available", async () => {
            let loginInfoSignal = 0;
            let loginInfoData = 0;
            const fakeSocket = {
                id: "testSocketID",
                emit: (signal, data) => {
                    if (signal === "loginInfo") loginInfoSignal++;
                    if (
                        JSON.stringify(data) ===
                        JSON.stringify({
                            token: "testToken",
                            agentID: "2",
                        })
                    )
                        loginInfoData++;
                },
            };

            it("picks the correct agent and sends the right data to the socket", async () => {
                await socketEvents.loginGuest(testSDK, fakeSocket, "sales");
                expect(loginInfoSignal).to.be.equal(1);
                expect(loginInfoData).to.be.equal(1);
            });

            it("sets agent to unavailable", async () => {
                let rows = await promiseQuery(
                    "SELECT available FROM allocablTest.agents WHERE id = '2'"
                );
                expect(rows[0].available).to.be.equal(0);
            });

            it("increments the customers served of the agent", async () => {
                let rows = await promiseQuery(
                    "SELECT customersServed FROM allocablTest.agents WHERE id = '2'"
                );
                expect(rows[0].customersServed).to.be.equal(1);
            });
        });

        describe("all agents busy", () => {
            let busyMsg = 0;
            let queuePos = 0;
            let waitlistSignal = 0;
            const fakeSocket = {
                id: "testSocketID",
                emit: (signal, data) => {
                    if (signal === "waitList") waitlistSignal++;
                    if (data === "All agents busy! Added to waitlist!")
                        busyMsg++;
                    if (data === "Queue position: 1") queuePos++;
                },
            };

            it("sends the correct waitlist messages to the socket", async () => {
                await socketEvents.loginGuest(testSDK, fakeSocket, "general");
                expect(busyMsg).to.be.equal(1);
                expect(queuePos).to.be.equal(1);
                expect(waitlistSignal).to.be.equal(2);
            });

            it("adds the socket ID to the correct department waitlist", async () => {
                let rows = await promiseQuery(
                    "SELECT * FROM allocablTest.waitlist_general"
                );
                expect(rows).to.have.lengthOf(1);
                expect(rows[0].socket_id).to.equal("testSocketID");
            });
        });

        describe("no agent online", () => {
            let errorSignal = 0;
            let errorData = 0;
            const fakeSocket = {
                id: "testSocketID",
                emit: (signal, data) => {
                    if (signal === "customError") errorSignal++;
                    if (data === "no agent online") errorData++;
                },
            };

            it("sends the correct messages to the socket", async () => {
                await socketEvents.loginGuest(testSDK, fakeSocket, "finance");
                expect(errorSignal).to.be.equal(1);
                expect(errorData).to.be.equal(1);
            });
        });
    });

    describe("updateClientsPositions", () => {
        before("insert test values", async () => {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales VALUES ('1', 'testSocketID1'), ('2', 'testSocketID2')";
            await promiseQuery(sql);
        });

        after("clear test values", async () => {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        it("notifies all sockets in waitlist about their positions", async () => {
            let waitlistSignal1 = 0;
            let waitlistData1 = 0;
            const fakeSocket1 = {
                id: "testSocketID1",
                emit: (signal, data) => {
                    if (signal === "waitList") waitlistSignal1++;
                    if (data === "Queue position: 1") waitlistData1++;
                },
            };

            let waitlistSignal2 = 0;
            let waitlistData2 = 0;
            const fakeSocket2 = {
                id: "testSocketID2",
                emit: (signal, data) => {
                    if (signal === "waitList") waitlistSignal2++;
                    if (data === "Queue position: 2") waitlistData2++;
                },
            };

            const fakeConnected = {
                testSocketID1: fakeSocket1,
                testSocketID2: fakeSocket2,
            };

            sinon.replace(io.sockets, "connected", fakeConnected);

            await socketEvents.updateClientsPositions("sales");
            expect(waitlistSignal1).to.equal(1);
            expect(waitlistData1).to.equal(1);
            expect(waitlistSignal2).to.equal(1);
            expect(waitlistData2).to.equal(1);
        });

        it("does nothing if the waitlist is empty", async () => {
            await socketEvents.updateClientsPositions("finance");
        });
    });

    describe("checkWaitList", () => {
        before("insert test values", async () => {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales VALUES ('1', 'testSocketID1'), ('2', 'testSocketID2')";
            await promiseQuery(sql);
            sql =
                "INSERT INTO allocablTest.agents VALUES ('0','sales',1,10,NULL,1)";
            await promiseQuery(sql);
        });

        after("clear test values", async () => {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        describe("waitlist not empty", () => {
            let agentAvailableSignal = 0;
            let agentAvailableData = 0;
            const fakeSocket = {
                id: "testSocketID1",
                emit: (signal, data) => {
                    if (signal === "agentAvailable") agentAvailableSignal++;
                    if (
                        data ===
                        "An agent is now available! Connecting you to a sales agent..."
                    )
                        agentAvailableData++;
                },
            };

            const fakeConnected = {
                testSocketID1: fakeSocket,
            };

            let loginGuestSDK = 0;
            let loginGuestSocket = 0;
            let loginGuestDepartment = 0;
            const fakeLoginGuest = (rainbowSDK, socket, department) => {
                if (JSON.stringify(rainbowSDK) === JSON.stringify(testSDK))
                    loginGuestSDK++;
                if (JSON.stringify(socket) === JSON.stringify(fakeSocket))
                    loginGuestSocket++;
                if (department === "sales") loginGuestDepartment++;
            };

            let updatePosDepartment = 0;
            const fakeUpdatePositions = (department) => {
                if (department === "sales") updatePosDepartment++;
            };

            it("notifies socket that an agent is available", async () => {
                sinon.replace(io.sockets, "connected", fakeConnected);
                sinon.replace(socketEvents, "loginGuest", fakeLoginGuest);
                sinon.replace(
                    socketEvents,
                    "updateClientsPositions",
                    fakeUpdatePositions
                );
                await socketEvents.checkWaitlist(testSDK, "sales");
                expect(agentAvailableSignal).to.equal(1);
                expect(agentAvailableData).to.equal(1);
            });

            it("calls loginGuest with the right parameters", async () => {
                expect(loginGuestSDK).to.equal(1);
                expect(loginGuestSocket).to.equal(1);
                expect(loginGuestDepartment).to.equal(1);
            });

            it("calls updateClientsPositions with the right parameters", async () => {
                expect(updatePosDepartment).to.equal(1);
            });
        });

        it("does nothing if waitlist is empty", async () => {
            await socketEvents.checkWaitlist(testSDK, "finance");
        });
    });

    describe("disconnect", () => {
        before("insert test values", async () => {
            let sql =
                "INSERT INTO allocablTest.waitlist_sales VALUES ('1', 'testSocketID1'), ('2', 'testSocketID2')";
            await promiseQuery(sql);
            sql =
                "INSERT INTO allocablTest.agents VALUES ('0','sales',0,10,'testSocketID3',1)";
            await promiseQuery(sql);
        });

        after("clear test values", async () => {
            await promiseQuery(
                "SET SQL_SAFE_UPDATES = 0;DELETE FROM allocablTest.waitlist_sales;DELETE FROM allocablTest.waitlist_finance;DELETE FROM allocablTest.waitlist_general;DELETE FROM allocablTest.agents;SET SQL_SAFE_UPDATES = 1"
            );
        });

        describe("talking to agent", () => {
            const fakeSocket = {
                id: "testSocketID3",
            };

            let checkWaitlistSDK = 0;
            let checkwaitlistDepartment = 0;
            const fakeCheckWaitlist = (rainbowSDK, department) => {
                if (JSON.stringify(rainbowSDK) === JSON.stringify(testSDK))
                    checkWaitlistSDK++;
                if (department === "sales") checkwaitlistDepartment++;
            };

            it("removes the socket ID from the agent and sets agent to available", async () => {
                sinon.replace(socketEvents, "checkWaitlist", fakeCheckWaitlist);
                await socketEvents.disconnect(testSDK, fakeSocket);
                let sql = "SELECT * FROM allocablTest.agents WHERE id = '0'";
                let rows = await promiseQuery(sql);
                expect(rows[0].customerSocket).to.be.null;
                expect(rows[0].available).to.equal(1);
            });

            it("calls checkWaitList with the right parameters", async () => {
                expect(checkWaitlistSDK).to.equal(1);
                expect(checkwaitlistDepartment).to.equal(1);
            });
        });

        describe("not talking to agent", () => {
            const fakeSocket1 = {
                id: "testSocketID1",
            };

            const fakeSocket2 = {
                id: "testSocketID4",
            };

            let updatePositionsDepartment = 0;
            const fakeUpdatePositions = (department) => {
                if (department === "sales") updatePositionsDepartment++;
            };

            describe("in waitlist", () => {
                it("removes socket ID from waitlist", async () => {
                    sinon.replace(
                        socketEvents,
                        "updateClientsPositions",
                        fakeUpdatePositions
                    );
                    await socketEvents.disconnect(testSDK, fakeSocket1);
                    let sql =
                        "SELECT * FROM allocablTest.waitlist_sales WHERE socket_id = 'testSocketID1'";
                    let rows = await promiseQuery(sql);
                    expect(rows).to.have.lengthOf(0);
                });
                it("calls updateClientsPositions with the right parameters", async () => {
                    expect(updatePositionsDepartment).to.equal(1);
                });
            });

            it("does nothing if not in waitlist", async () => {
                await socketEvents.disconnect(testSDK, fakeSocket2);
            });
        });
    });
});
