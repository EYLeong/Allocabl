const socketEvents = require("./socketEvents");
const rainbowEvents = require("./rainbowEvents");
const AsyncLock = require("async-lock");
const lock = new AsyncLock();
const KEY = "key";

const loginGuestLocked = async (rainbowSDK, socket, department) => {
    await lock.acquire(KEY, async () => {
        await socketEvents.loginGuest(rainbowSDK, socket, department);
    });
};

const disconnectLocked = async (rainbowSDK, socket) => {
    await lock.acquire(KEY, async () => {
        await socketEvents.disconnect(rainbowSDK, socket);
    });
};

const onAgentStatusChangeLocked = async (rainbowSDK, id, presence) => {
    await lock.acquire(KEY, async () => {
        await rainbowEvents.onAgentStatusChange(rainbowSDK, id, presence);
    });
};

module.exports = {
    loginGuestLocked,
    disconnectLocked,
    onAgentStatusChangeLocked,
};
