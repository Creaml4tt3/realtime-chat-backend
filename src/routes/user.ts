import { Request, Response, NextFunction } from "express";
const router = require("express").Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("respond with a resource");
});

router.get("/profile", (req: Request, res: Response, next: NextFunction) => {
  delete req.user.refresh_token;
  delete req.user.password;
  delete req.user.deleted;
  delete req.user.iat;
  delete req.user.exp;
  res.json(req.user);
});

module.exports = router;
