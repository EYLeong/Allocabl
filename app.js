const { express, app, port, http, io } = require("./helpers/server");
const socketEvents = require("./helpers/socketEvents");
const { rainbowSDK } = require("./helpers/rainbowInit");
const rainbowEvents = require("./helpers/rainbowEvents");

app.use(express.static("public"));

rainbowSDK.start();

rainbowSDK.events.on("rainbow_onready", async () => {
    console.log("RAINBOW IS READY");
    try {
        let contacts = await rainbowSDK.contacts.getAll();
        for (contact of contacts) {
            if (!contact.adminType)
                await rainbowEvents.onAgentStatusChange(
                    contact.id,
                    contact.presence
                );
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

rainbowSDK.events.on("rainbow_oncontactpresencechanged", async contact => {
    try {
        await rainbowEvents.onAgentStatusChange(contact.id, contact.presence);
    } catch (err) {
        console.log(err);
    }
});

io.on("connection", socket => {
    console.log(`a user with socket id ${socket.id} connected`);

    socket.on("disconnect", async () => {
        try {
            await socketEvents.disconnect(socket);
            console.log(`a user with socket id ${socket.id} disconnected`);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("loginGuest", async department => {
        try {
            await socketEvents.loginGuest(socket, department);
        } catch (err) {
            console.log(err);
        }
    });
});
