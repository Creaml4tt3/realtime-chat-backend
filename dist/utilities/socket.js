"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const prisma_1 = require("./prisma");
require("dotenv").config();
const io = new socket_io_1.Server({
    cors: {
        origin: process.env.FRONT_URL || "http://localhost:3000",
    },
});
io.on("connection", (client) => {
    console.log("user connected");
    // client.on("event", (data: any) => {
    //   console.log(data);
    // });
    client.on("disconnect", () => {
        console.log("user disconnected");
    });
    client.on("message:create", function (data) {
        (0, prisma_1.createMessage)(data);
        io.sockets.emit("message:recieve", data);
    });
});
io.listen(Number(process.env.SOCKET_PORT) || 5500);
