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
require("./utilities/socket");
require("./configs/passport");
const auth = require("./routes/auth");
const user = require("./routes/user");
const chat = require("./routes/chat");
require("dotenv").config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8080;
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
app.use(cors({ origin: process.env.FRONT_URL }));
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
app.listen(port, () => console.log(`Application is running on port ${port}`));
