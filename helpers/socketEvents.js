const { io } = require("./server");
const databaseManager = require("./databaseManager");

const disconnect = async (rainbowSDK, socket) => {
    let rows = await databaseManager.getDepartment(socket.id);
    await databaseManager.removeSocketAgent(socket.id);
    if (rows.length != 0) {
        // Talking to agent, get the next person in queue
        await checkWaitlist(rainbowSDK, rows[0].department);
    } else {
        // Not talking to agent, remove from queue if queueing
        let department = await databaseManager.findSocketWaitlistDepartment(
            socket.id
        );
        if (department) {
            await databaseManager.removeFromWaitlistById(department, socket.id);
            updateClientsPositions(department);
        }
    }
};

const loginGuest = async (rainbowSDK, socket, department) => {
    let online = await databaseManager.checkDepartmentOnline(department);
    if (online.length != 0) {
        let rows = await databaseManager.getAgent(department);
        if (rows.length != 0) {
            let result = await databaseManager.setAgentUnavailable(rows[0].id);
            result = await databaseManager.incrementCustomersServed(rows[0].id);
            result = await databaseManager.addSocketAgent(
                rows[0].id,
                socket.id
            );
            let user = await rainbowSDK.admin.createAnonymousGuestUser();
            let json = await rainbowSDK.admin.askTokenOnBehalf(
                user.loginEmail,
                user.password
            );
            socket.emit("loginInfo", {
                token: json.token,
                agentID: rows[0].id
            });
        } else {
            console.log("All agents busy");
            await databaseManager.addWaitList(department, socket.id);
            let rows = await databaseManager.getDepartmentWaitlist(department);
            socket.emit("waitList", "All agents busy! Added to waitlist!");
            socket.emit("waitList", `Queue position: ${rows.length}`);
        }
    } else {
        console.log("No agent online");
        socket.emit("customError", "no agent online");
    }
};

const checkWaitlist = async (rainbowSDK, department) => {
    let nextInList = await databaseManager.getFromWaitList(department);
    if (nextInList.length != 0) {
        await databaseManager.removeFromWaitList(department);
        let socket = io.sockets.connected[nextInList[0].socket_id];
        socket.emit(
            "agentAvailable",
            `An agent is now available! Connecting you to a ${department} agent...`
        );
        await loginGuest(rainbowSDK, socket, department);
        updateClientsPositions(department);
    }
};

const updateClientsPositions = async department => {
    let rows = await databaseManager.getDepartmentWaitlist(department);
    for (var i = 0; i < rows.length; i++) {
        let socket = io.sockets.connected[rows[i].socket_id];
        socket.emit("waitList", `Queue position: ${i + 1}`);
    }
};

module.exports = {
    disconnect,
    loginGuest,
    checkWaitlist,
    updateClientsPositions
};
