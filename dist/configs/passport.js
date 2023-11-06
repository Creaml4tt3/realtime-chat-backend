"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt_1 = __importDefault(require("bcrypt"));
const { findUser } = require("../utilities/prisma");
require("dotenv").config();
function checkVaild(user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isValid = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
            if (isValid) {
                return user;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new Error("Error comparing passwords: " + error.message);
        }
    });
}
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, cb) => __awaiter(void 0, void 0, void 0, function* () {
    return checkVaild(yield findUser(email), password)
        .then((user) => {
        if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
        }
        return cb(null, user, { message: "Logged In Successfully" });
    })
        .catch((err) => cb(err));
})));
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_ACCESS_TOKEN,
}, (jwtPayload, cb) => {
    return cb(null, jwtPayload);
}));
// passport.serializeUser((user: any, cb: Function) => {
//   console.log("SerializeUser");
//   cb(null, user);
// });
// passport.deserializeUser((user: any, cb: Function) => {
//   console.log("DeserializeUser");
//   cb(null, user);
// });
