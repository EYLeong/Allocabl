const rainbowInit = require("../helpers/rainbowInit");
const databaseManager = require("../helpers/databaseManager");

const disconnect = socket => {
    console.log(`a user with socket id ${socket.id} disconnected`);
};

const loginGuest = async (socket, department) => {
    if (rainbowInit.getRainbowReady()) {
        try {
            let user = await rainbowInit
                .getRainbowSDK()
                .admin.createAnonymousGuestUser();
            let json = await rainbowInit
                .getRainbowSDK()
                .admin.askTokenOnBehalf(user.loginEmail, user.password);
            console.log(json);
            databaseManager.getAgent(
                department,
                id => {
                    console.log(id);
                    socket.emit("loginInfo", {
                        token: json.token,
                        agentID: id
                    });
                    databaseManager.incrementCustomersServed(
                        id,
                        err => console.log(err),
                        result => console.log(result)
                    );
                    databaseManager.toggleAgentAvailability(
                        id,
                        err => console.log(err),
                        result => console.log(result)
                    );
                },
                err => {
                    console.log(err);
                    socket.emit("customError", "databaseError");
                }
            );
        } catch (err) {
            console.log(err);
            socket.emit("customError", "SDK error");
        }
    } else {
        console.log("server not ready");
        socket.emit("customError", "server not ready");
    }
};

module.exports = { disconnect, loginGuest };
