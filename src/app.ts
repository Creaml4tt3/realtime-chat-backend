import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";

require("dotenv").config();

const app: Express = express();
const port: number = Number(process.env.EXPRESS_PORT);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello Express + TypeScirpt!!",
  });
});

// app.listen(port, () => console.log(`Application is running on port ${port}`));

import { Server } from "socket.io";
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
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
io.listen(Number(process.env.SOCKET_PORT));
