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
const prisma_1 = require("../utilities/prisma");
const router = require("express").Router();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield (0, prisma_1.readMessages)();
    res.json(messages);
}));
router.get("/user/:email", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user_email = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.email;
    const user = yield (0, prisma_1.findUser)(user_email);
    res.json({ photo: user === null || user === void 0 ? void 0 : user.photo, name: user === null || user === void 0 ? void 0 : user.name, email: user.email });
}));
module.exports = router;
