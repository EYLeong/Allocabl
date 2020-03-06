const databaseManager = require("./databaseManager");

let rainbowReady = false;
let agentCount = 0;

// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");

// Define your configuration
let options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: "leo.en.gms@gmail.com", // To replace by your developer credendials
        password: "7q?2OfHDGx[9" // To replace by your developer credentials
    },
    // Application identifier
    application: {
        appID: "b61d1e604d9c11ea819a43cb4a9dae9b",
        appSecret:
            "t9EcSl9Df3qUGJBhdVMhS9UVavSwd6mttfT2hHW8A1310V6b6gy7FOzav3gWcpUC"
    },
    // Logs options
    logs: {
        enableConsoleLogs: false,
        enableFileLogs: false,
        file: {
            path: "/var/tmp/rainbowsdk/",
            level: "debug"
        }
    },
    // IM options
    im: {
        sendReadReceipt: true
    }
};

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(options);

// Start the SDK
rainbowSDK.start();

rainbowSDK.events.on("rainbow_onready", () => {
    updateAgentStatusAll();
});

rainbowSDK.events.on("rainbow_onstopped", () => {
    console.log("RAINBOW STOPPED");
    rainbowReady = false;
});

// "rainbow_oncontactpresencechanged"
// contact.presence

const getRainbowReady = () => {
    return rainbowReady;
};

const getRainbowSDK = () => {
    return rainbowSDK;
};

const updateAgentStatusAll = async () => {
    let contacts = await rainbowSDK.contacts.getAll();
    agentCount = contacts.length - 1;
    for (contact of contacts) {
        if (!contact.adminType) {
            updateAgentStatus(contact.id, contact.presence);
        }
    }
};

const updateAgentStatus = async (id, presence) => {
    if (presence === "online") {
        await databaseManager.setAgentAvailable(id);
        console.log(`AgentID ${id} set to available`);
    } else {
        await databaseManager.setAgentUnavailable(id);
        console.log(`AgentID ${id} set to unavailable`);
    }
    agentCount -= 1;
    if (agentCount === 0) {
        rainbowReady = true;
        console.log("RAINBOW IS READY");
    }
};

module.exports = { getRainbowReady, getRainbowSDK };
