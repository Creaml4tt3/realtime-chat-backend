"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
require("dotenv").config();
const handleSocketConnection = (io) => {
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
};
exports.default = handleSocketConnection;
// const io = new Server({
//   cors: {
//     origin: process.env.FRONT_URL || "http://localhost:3000",
//   },
// });
// io.listen(Number(process.env.SOCKET_PORT) || 5500);
