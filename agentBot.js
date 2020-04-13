let RainbowSDK = require("rainbow-node-sdk");

// Define your configuration
let options = {
    rainbow: {
        host: "sandbox",
    },
    credentials: {
        login: "agent1@allocabl.com",
        password: "Password123!",
    },
    // Application identifier
    application: {
        appID: "b61d1e604d9c11ea819a43cb4a9dae9b",
        appSecret:
            "t9EcSl9Df3qUGJBhdVMhS9UVavSwd6mttfT2hHW8A1310V6b6gy7FOzav3gWcpUC",
    },
    // Logs options
    logs: {
        enableConsoleLogs: false,
        enableFileLogs: false,
        file: {
            path: "/var/tmp/rainbowsdk/",
            level: "debug",
        },
    },
    // IM options
    im: {
        sendReadReceipt: true,
    },
};

for (let i = 1; i < 2; i++) {
    options.credentials.login = `sales${i}@allocabl.com`;
    options.credentials.password = "Password123!";
    // Instantiate the SDK
    let rainbowSDK = new RainbowSDK(options);

    // Start the SDK
    rainbowSDK.start();

    rainbowSDK.events.on("rainbow_onready", () => {
        console.log("RAINBOW IS READY");
    });

    rainbowSDK.events.on("rainbow_onstopped", () => {
        console.log("RAINBOW STOPPED");
    });

    rainbowSDK.events.on("rainbow_onmessagereceived", (message) => {
        rainbowSDK.im.sendMessageToConversation(message.conversation, "hi");
    });
}

for (let i = 1; i < 6; i++) {
    options.credentials.login = `finance${i}@allocabl.com`;
    options.credentials.password = "Password123!";
    // Instantiate the SDK
    let rainbowSDK = new RainbowSDK(options);

    // Start the SDK
    rainbowSDK.start();

    rainbowSDK.events.on("rainbow_onready", () => {
        console.log("RAINBOW IS READY");
    });

    rainbowSDK.events.on("rainbow_onstopped", () => {
        console.log("RAINBOW STOPPED");
    });

    rainbowSDK.events.on("rainbow_onmessagereceived", (message) => {
        rainbowSDK.im.sendMessageToConversation(message.conversation, "hi");
    });
}

// for (let i = 1; i < 6; i++) {
//     options.credentials.login = `general${i}@allocabl.com`;
//     options.credentials.password = "Password123!";
//     // Instantiate the SDK
//     let rainbowSDK = new RainbowSDK(options);

//     // Start the SDK
//     rainbowSDK.start();

//     rainbowSDK.events.on("rainbow_onready", () => {
//         console.log("RAINBOW IS READY");
//     });

//     rainbowSDK.events.on("rainbow_onstopped", () => {
//         console.log("RAINBOW STOPPED");
//     });

//     rainbowSDK.events.on("rainbow_onmessagereceived", (message) => {
//         rainbowSDK.im.sendMessageToConversation(message.conversation, "hi");
//     });
// }
