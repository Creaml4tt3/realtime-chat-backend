import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
const cors = require("cors");
const passport = require("passport");

// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const methodOverride = require("method-override");

import http from "http";
import socketIo from "socket.io";
import handleSocketConnection from "./utilities/socket";
require("./configs/passport");
const auth = require("./routes/auth");
const user = require("./routes/user");
const chat = require("./routes/chat");

require("dotenv").config();

const app: Express = express();
const port: number = Number(process.env.EXPRESS_PORT) || 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors({ origin: process.env.FRONT_URL }));
app.use(express.static("public"));
// app.use(methodOverride());
// app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello Express + TypeScirpt!!",
  });
});

app.use("/auth", auth);
app.use("/user", passport.authenticate("jwt", { session: false }), user);
app.use("/chat", chat);

const server = http.createServer(app);
const io = new socketIo.Server(server);

handleSocketConnection(io);

server.listen(port, () =>
  console.log(`Application is running on port ${port}`)
);

module.exports = app;
