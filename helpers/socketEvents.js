const { io } = require("./server");
const databaseManager = require("./databaseManager");

const disconnect = async (rainbowSDK, socket) => {
    let rows = await databaseManager.getDepartment(socket.id);
    if (rows.length != 0) {
        // Talking to agent, update agent and get next person in queue
        await databaseManager.removeSocketAgent(socket.id);
        await module.exports.checkWaitlist(rainbowSDK, rows[0].department);
    } else {
        // Not talking to agent, remove from queue if queueing
        let department = await databaseManager.findSocketWaitlistDepartment(
            socket.id
        );
        if (department) {
            await databaseManager.removeFromWaitlistById(department, socket.id);
            await module.exports.updateClientsPositions(department);
        }
    }
};

const loginGuest = async (rainbowSDK, socket, inputs) => {
    let department = inputs[0];
    let agent = inputs[1];
    let online = await databaseManager.checkDepartmentOnline(department);
    let emitted=false;
    let rows=[];
    if (agent!=null) {
        let agents=await rainbowSDK.admin.getAllUsers("all");
        let result = agents.filter(agentInfo => agentInfo.firstName == agent);
        if (result.length!=0) rows = await databaseManager.checkAgentAvailable(department, result[0].id);
        else {
            emitted=true;
            socket.emit("customError", "Requested agent not found.");
        }
    }
    else {
        rows = await databaseManager.getAgent(department);
    }
    if (online.length != 0 && !emitted) {
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
                agentID: rows[0].id,
            });
        } else {
            if (agent!=null) socket.emit("customError", "Requested agent is not online or available.");
            else {
                await databaseManager.addWaitList(department, socket.id);
                let rows = await databaseManager.getDepartmentWaitlist(department);
                socket.emit("waitList", "All agents busy! Added to waitlist!");
                socket.emit("waitList", `Queue position: ${rows.length}`);
            }
        }
    } else {
        if (!emitted) {
            if (agent!=null) socket.emit("customError", "Requested agent is not online.");
            else socket.emit("customError", "No agent is online!");
        }
    }
};

const checkWaitlist = async (rainbowSDK, department) => {
    let nextInList = await databaseManager.getFromWaitList(department);
    if (nextInList.length != 0) {
        await databaseManager.removeFromWaitList(department);
        let socket = io.sockets.connected[nextInList[0].socket_id];
        await module.exports.updateClientsPositions(department);
        if (socket) {
            socket.emit(
                "agentAvailable",
                `An agent is now available! Connecting you to a ${department} agent...`
            );
            await module.exports.loginGuest(rainbowSDK, socket, [department, null]);
        } else {
            await checkWaitlist(rainbowSDK, department);
        }
    }
};

const updateClientsPositions = async (department) => {
    let rows = await databaseManager.getDepartmentWaitlist(department);
    for (var i = 0; i < rows.length; i++) {
        let socket = io.sockets.connected[rows[i].socket_id];
        if (socket) socket.emit("waitList", `Queue position: ${i + 1}`);
    }
};

module.exports = {
    disconnect,
    loginGuest,
    checkWaitlist,
    updateClientsPositions,
};
