const { express, app, port, http, io } = require("./helpers/server");
const { rainbowSDK } = require("./helpers/rainbowInit");
const synchronized = require("./helpers/synchronized");

app.use(express.static("public"));

rainbowSDK.start();

rainbowSDK.events.on("rainbow_onready", async () => {
    console.log("RAINBOW IS READY");
    try {
        let contacts = await rainbowSDK.contacts.getAll();
        for (contact of contacts) {
            if (!contact.adminType && !contact.isTerminated) {
                await synchronized.onAgentStatusChangeLocked(
                    rainbowSDK,
                    contact.id,
                    contact.presence
                );
            }
        }
        http.listen(port, () => console.log(`App listening on port ${port}!`));
        console.log("ALLOCABL IS READY");
    } catch (err) {
        console.log(err);
    }
});

rainbowSDK.events.on("rainbow_onstopped", () => {
    console.log("RAINBOW STOPPED");
    http.close();
    console.log("ALLOCABL STOPPED");
});

rainbowSDK.events.on("rainbow_oncontactpresencechanged", async (contact) => {
    try {
        await synchronized.onAgentStatusChangeLocked(
            rainbowSDK,
            contact.id,
            contact.presence
        );
    } catch (err) {
        console.log(err);
    }
});

io.on("connection", (socket) => {
    console.log(`a user with socket id ${socket.id} connected`);

    socket.on("disconnect", async () => {
        try {
            await synchronized.disconnectLocked(rainbowSDK, socket);
            console.log(`a user with socket id ${socket.id} disconnected`);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("loginGuest", async inputs => {
        try {
            await synchronized.loginGuestLocked(rainbowSDK, socket, inputs);
        } catch (err) {
            socket.emit("customError", "There is a problem with the server");
            console.log(err);
        }
    });
});
