import { Request, Response, NextFunction } from "express";
import { readMessages, findUser } from "../utilities/prisma";
const router = require("express").Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const messages = await readMessages();
  res.json(messages);
});

router.get(
  "/user/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    const user_email = req?.params?.email;
    const user = await findUser(user_email);
    res.json({ photo: user?.photo, name: user?.name, email: user.email });
  }
);

module.exports = router;
