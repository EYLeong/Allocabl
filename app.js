const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.get("/guestLogin", (req, res) => {
    if (rainbowReady) {
        rainbowSDK.admin
            .createAnonymousGuestUser()
            .then(user => {
                rainbowSDK.admin
                    .askTokenOnBehalf(user.loginEmail, user.password)
                    .then(json => {
                        console.log(json);
                        res.send(json.token);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.status(400).send("server not ready");
    }
});

let rainbowReady = false;

// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");

//all my Users IDs

/* 
    test1@company.com abcD1234! 5e427e8de9f1273063695350
    test2@company.com abcD1234! 5e5bf1116c332176648fdf29
    test3@company.com abcD1234! 5e5bf12c6c332176648fdf31
*/
// Define your configuration
let options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: "tscd.1996@gmail.com", // To replace by your developer credendials
        password: "y[x{2K5[Sd*6" // To replace by your developer credentials
    },
    // Application identifier
    application: {
        appID: "6eb85d004cb111ea819a43cb4a9dae9b",
        appSecret:
            "37GVusdx55LrIcQZHs68Uh1CYOf1LdDl68zazTZaZn8InoIek8rPFyzqAAnO4s52"
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
