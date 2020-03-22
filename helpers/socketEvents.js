const rainbowInit = require("./rainbowInit");
const databaseManager = require("./databaseManager");

const disconnect = async socket => {
    console.log(`a user with socket id ${socket.id} disconnected`);
    try {
        let result = await databaseManager.removeSocketAgent(socket.id);
        console.log(
            `customerSocket ${socket.id} removed successfully from database`
        );
    } catch (err) {
        console.log(err);
    }
};

const loginGuest = async (socket, department) => {
    if (rainbowInit.getRainbowReady()) {
        try {
            let rows = await databaseManager.getAgent(department);
            if (rows.length !== 0) {
                let result = await databaseManager.toggleAgentAvailability(
                    rows[0].id
                );
                result = await databaseManager.incrementCustomersServed(
                    rows[0].id
                );
                result = await databaseManager.addSocketAgent(
                    rows[0].id,
                    socket.id
                );
                console.log(`AgentID ${rows[0].id} retrieved from database and assigned`);
                try {
                    let user = await rainbowInit
                        .getRainbowSDK()
                        .admin.createAnonymousGuestUser();
                    let json = await rainbowInit
                        .getRainbowSDK()
                        .admin.askTokenOnBehalf(user.loginEmail, user.password);
                    socket.emit("loginInfo", {
                        token: json.token,
                        agentID: rows[0].id
                    });
                    console.log(
                        `AgentID ${rows[0].id} and guest token sent to client`
                    );
                } catch (err) {
                    console.log(err);
                    socket.emit("customError", "SDK error");
                }
            } else {
                console.log("No agent available!");
                result = await databaseManager.addWaitList(
                    department,
                    socket.id
                )
                socket.emit("customError", "No agent available!");
            }
        } catch (err) {
            console.log(err);
            socket.emit("customError", "databaseError");
        }
    } else {
        console.log("server not ready");
        socket.emit("customError", "server not ready");
    }
};

module.exports = { disconnect, loginGuest };
