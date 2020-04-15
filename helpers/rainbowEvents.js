const databaseManager = require("./databaseManager");
const socketEvents = require("./socketEvents");
const { io } = require("./server");

const onAgentStatusChange = async (rainbowSDK, id, presence) => {
    if (presence === "online") {
        await databaseManager.setAgentOnline(id);
        await databaseManager.setAgentAvailable(id);
        let rows = await databaseManager.getAgentDepartment(id);
        await socketEvents.checkWaitlist(rainbowSDK, rows[0].department);
    } else {
        await databaseManager.setAgentUnavailable(id);
        await databaseManager.setAgentOffline(id);
        let rows = await databaseManager.getAgentDepartment(id);
        let department = rows[0].department;
        rows = await databaseManager.checkDepartmentOnline(department);
        if (rows.length === 0) {
            let waiters = await databaseManager.getDepartmentWaitlist(
                department
            );
            await databaseManager.clearDepartmentWaitlist(department);
            for (let waiting of waiters) {
                let socket = io.sockets.connected[waiting.socket_id];
                if (socket)
                    socket.emit("customError", "all agents have gone offline");
            }
        }
    }
};

module.exports = { onAgentStatusChange };
