const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const socketEvents = require("./helpers/socketEvents");

app.use(express.static("public"));

http.listen(port, () => console.log(`App listening on port ${port}!`));

io.on("connection", socket => {
    console.log(`a user with socket id ${socket.id} connected`);
    socket.on("disconnect", () => socketEvents.disconnect(socket));
    socket.on("loginGuest", department =>
        socketEvents.loginGuest(socket, department)
    );
});
