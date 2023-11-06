import { Server, Socket } from "socket.io";
import { createMessage } from "./prisma";

require("dotenv").config();

const handleSocketConnection = (io: Server) => {
  io.on("connection", (client: Socket) => {
    console.log("user connected");
    // client.on("event", (data: any) => {
    //   console.log(data);
    // });
    client.on("disconnect", () => {
      console.log("user disconnected");
    });
    client.on("message:create", function (data: message) {
      createMessage(data);
      io.sockets.emit("message:recieve", data);
    });
  });
};

export default handleSocketConnection;

// const io = new Server({
//   cors: {
//     origin: process.env.FRONT_URL || "http://localhost:3000",
//   },
// });

// io.listen(Number(process.env.SOCKET_PORT) || 5500);
