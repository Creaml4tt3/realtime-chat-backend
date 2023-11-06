"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require("cors");
const passport = require("passport");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const methodOverride = require("method-override");
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const socket_1 = __importDefault(require("./utilities/socket"));
require("./configs/passport");
const auth = require("./routes/auth");
const user = require("./routes/user");
const chat = require("./routes/chat");
require("dotenv").config();
const app = (0, express_1.default)();
const port = Number(process.env.EXPRESS_PORT) || 3000;
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
app.use(cors({ origin: process.env.FRONT_URL }));
app.use(express_1.default.static("public"));
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
app.get("/", (req, res) => {
    res.json({
        message: "Hello Express + TypeScirpt!!",
    });
});
app.use("/auth", auth);
app.use("/user", passport.authenticate("jwt", { session: false }), user);
app.use("/chat", chat);
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server);
(0, socket_1.default)(io);
server.listen(port, () => console.log(`Application is running on port ${port}`));
module.exports = app;
