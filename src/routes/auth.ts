import { Request, Response, NextFunction } from "express";
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  createUser,
  findUser,
  updateUser,
  updateRefreshToken,
} = require("../utilities/prisma");

require("dotenv").config();

const jwtValidate = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401);
    const access_token = req.headers["authorization"].replace("Bearer ", "");
    jwt.verify(
      access_token,
      process.env.SECRET_ACCESS_TOKEN,
      (err: any, decoded: any) => {
        if (err) throw new Error(err);
        req.token = access_token;
        req.user = decoded;
        delete req.user.exp;
        delete req.user.iat;
      }
    );
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;
    const user = await findUser(email);
    if (user) {
      return res.status(422).json({
        status: false,
        message: "this email have already registered.",
      });
    } else {
      await createUser({
        email,
        password,
        name,
      });

      return res.json({
        status: true,
        message: "this email create successful.",
      });
    }
  }
);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (user) {
        const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        });
        updateRefreshToken(user?.email);

        return res.json({
          status: true,
          message: info?.message,
          user,
          accessToken,
        });
      } else {
        return res.status(422).json({ status: false, message: info?.message });
      }
    }
  )(req, res, next);
});

router.post("/refresh", (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  if (refresh_token) {
    jwt.verify(
      refresh_token,
      process.env.SECRET_REFRESH_TOKEN,
      async (err: any, decoded: any) => {
        if (err) {
          return res.json({
            status: false,
            message: "refresh_token has expired.",
          });
        }
        const { email } = decoded;
        const user = await findUser(email);

        if (user) {
          const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
          });
          updateRefreshToken(email);

          return res.json({ status: true, accessToken });
        }
      }
    );
  } else {
    return res.status(500).send("refresh_token not found.");
  }
});

router.post("/google", async (req: Request, res: Response) => {
  const { email, name, picture, at_hash } = req.body;
  if (email) {
    const user = await findUser(email);
    if (user && !user.photo) {
      await updateUser(email, {
        photo: picture,
      });
    }
    if (!user) {
      await createUser({
        email,
        password: at_hash,
        name,
        photo: picture,
      });
      const createdUser = await findUser(email);

      return res.json({
        status: true,
        message: "first login with google created user data success.",
        user: createdUser,
      });
    } else {
      return res.json({
        status: true,
        message: "load user data success.",
        user,
      });
    }
  }
});

router.post("/logout", jwtValidate, (req: Request, res: Response) => {
  updateRefreshToken(req?.user?.email, true);
  return res.json({ status: true, message: "logout successful." });
});

module.exports = router;
