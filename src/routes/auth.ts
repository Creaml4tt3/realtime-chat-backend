import { Request, Response, NextFunction } from "express";
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("dotenv").config();

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (user) {
        const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);
        return res.json({ user, token });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

module.exports = router;
