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
exports.readMessages = exports.createMessage = exports.updateRefreshToken = exports.updateUser = exports.findUser = exports.createUser = void 0;
const prisma = require("./prismaConnection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//? passport User CRUD
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, name, photo } = userData;
        const user = yield prisma.user.create({
            data: {
                email,
                password,
                name,
                photo,
            },
        });
        return user;
    });
}
exports.createUser = createUser;
function findUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
                deleted: false,
            },
        });
        return user;
    });
}
exports.findUser = findUser;
function updateUser(email, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.update({
            where: {
                email: email,
                deleted: false,
            },
            data: Object.assign({}, data),
        });
        return user;
    });
}
exports.updateUser = updateUser;
function updateRefreshToken(email, deleted = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = deleted
            ? null
            : jwt.sign({ email }, process.env.SECRET_REFRESH_TOKEN, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
            });
        updateUser(email, { refresh_token: refreshToken });
    });
}
exports.updateRefreshToken = updateRefreshToken;
//? socketIO Message CRUD
function createMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { author_email, text } = data;
        const createMessage = yield prisma.message.create({
            data: {
                text,
                author_email,
            },
        });
        return createMessage;
    });
}
exports.createMessage = createMessage;
function readMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield prisma.message.findMany({
            where: {
                deleted: false,
            },
        });
        return messages;
    });
}
exports.readMessages = readMessages;
