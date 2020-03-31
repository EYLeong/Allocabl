const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer(app);
io = require("socket.io")(http);

module.exports = { express, app, port, http, io };
