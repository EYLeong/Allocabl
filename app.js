const rainbowHelpers = require("./helpers/rainbowHelpers");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.get("/guestLogin", (req, res) => {
    if (rainbowReady) {
        rainbowHelpers
            .getGuestToken(rainbowSDK)
            .then(token => res.send(token))
            .catch(err => console.log(err));
    } else {
        res.status(400).send("server not ready");
    }
});

let rainbowReady = false;

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
        enableConsoleLogs: true,
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
    console.log("RAINBOW IS READY");
    rainbowReady = true;
});

rainbowSDK.events.on("rainbow_onstopped", () => {
    console.log("RAINBOW STOPPED");
    rainbowReady = false;
});
