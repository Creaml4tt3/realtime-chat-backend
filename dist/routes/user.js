"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
router.get("/", (req, res, next) => {
    res.json("respond with a resource");
});
router.get("/profile", (req, res, next) => {
    delete req.user.refresh_token;
    delete req.user.password;
    delete req.user.deleted;
    delete req.user.iat;
    delete req.user.exp;
    res.json(req.user);
});
module.exports = router;
