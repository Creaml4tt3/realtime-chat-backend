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
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { createUser, findUser, updateUser, updateRefreshToken, } = require("../utilities/prisma");
require("dotenv").config();
const jwtValidate = (req, res, next) => {
    try {
        if (!req.headers["authorization"])
            return res.sendStatus(401);
        const access_token = req.headers["authorization"].replace("Bearer ", "");
        jwt.verify(access_token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
            if (err)
                throw new Error(err);
            req.token = access_token;
            req.user = decoded;
            delete req.user.exp;
            delete req.user.iat;
        });
        next();
    }
    catch (error) {
        return res.sendStatus(403);
    }
};
router.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const user = yield findUser(email);
    if (user) {
        return res.status(422).json({
            status: false,
            message: "this email have already registered.",
        });
    }
    else {
        yield createUser({
            email,
            password,
            name,
        });
        return res.json({
            status: true,
            message: "this email create successful.",
        });
    }
}));
router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
            });
            updateRefreshToken(user === null || user === void 0 ? void 0 : user.email);
            return res.json({
                status: true,
                message: info === null || info === void 0 ? void 0 : info.message,
                user,
                accessToken,
            });
        }
        else {
            return res.status(422).json({ status: false, message: info === null || info === void 0 ? void 0 : info.message });
        }
    })(req, res, next);
});
router.post("/refresh", (req, res) => {
    const { refresh_token } = req.body;
    if (refresh_token) {
        jwt.verify(refresh_token, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.json({
                    status: false,
                    message: "refresh_token has expired.",
                });
            }
            const { email } = decoded;
            const user = yield findUser(email);
            if (user) {
                const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
                });
                updateRefreshToken(email);
                return res.json({ status: true, accessToken });
            }
        }));
    }
    else {
        return res.status(500).send("refresh_token not found.");
    }
});
router.post("/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, picture, at_hash } = req.body;
    if (email) {
        const user = yield findUser(email);
        if (user && !user.photo) {
            yield updateUser(email, {
                photo: picture,
            });
        }
        if (!user) {
            yield createUser({
                email,
                password: at_hash,
                name,
                photo: picture,
            });
            const createdUser = yield findUser(email);
            return res.json({
                status: true,
                message: "first login with google created user data success.",
                user: createdUser,
            });
        }
        else {
            return res.json({
                status: true,
                message: "load user data success.",
                user,
            });
        }
    }
}));
router.post("/logout", jwtValidate, (req, res) => {
    var _a;
    updateRefreshToken((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email, true);
    return res.json({ status: true, message: "logout successful." });
});
module.exports = router;
