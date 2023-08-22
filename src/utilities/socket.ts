import { Server } from "socket.io";

require("dotenv").config();

const io = new Server({
  cors: {
    origin: process.env.FRONT_URL || "http://localhost:3000",
  },
});
io.on("connection", (client: any) => {
  console.log(`user connected ${client}`);
  client.on("event", (data: any) => {
    console.log(data);
  });
  client.on("disconnect", () => {
    console.log("user disconnected");
  });
  client.on("sent-message", function (message: any) {
    io.sockets.emit("new-message", message);
  });
  client.on("create-something", function (message: any) {
    io.sockets.emit("foo", message);
  });
});

io.listen(Number(process.env.SOCKET_PORT) || 5500);
