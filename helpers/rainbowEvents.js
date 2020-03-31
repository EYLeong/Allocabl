const databaseManager = require("./databaseManager");
const socketEvents = require("./socketEvents");
const { io } = require("./server");

const onAgentStatusChange = async (id, presence) => {
    if (presence === "online") {
        await databaseManager.setAgentOnline(id);
        await databaseManager.setAgentAvailable(id);
        let rows = await databaseManager.getAgentDepartment(id);
        await socketEvents.checkWaitlist(rows[0].department);
    } else {
        await databaseManager.setAgentUnavailable(id);
        await databaseManager.setAgentOffline(id);
        let rows = await databaseManager.getAgentDepartment(id);
        if (rows.length === 0) {
            let waiters = await databaseManager.getDepartmentWaitlist(
                rows[0].department
            );
            await databaseManager.clearDepartmentWaitlist(rows[0].department);
            for (waiting of waiters) {
                let socket = io.sockets.connected[waiting.socket_id];
                socket.emit("customError", "all agents have gone offline");
            }
        }
    }
};

module.exports = { onAgentStatusChange };
