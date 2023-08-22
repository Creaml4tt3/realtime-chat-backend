const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

require("dotenv").config();

const prisma = new PrismaClient();

async function findUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

async function checkVaild(user: any, password: string) {
  try {
    const isValid = await bcrypt.compare(password, user?.password || "");
    if (isValid) {
      return user;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error("Error comparing passwords: " + error.message);
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, cb: Function) => {
      return checkVaild(await findUser(email), password)
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
          }
          return cb(null, user, { message: "Logged In Successfully" });
        })
        .catch((err) => cb(err));
    }
  )
);

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_ACCESS_TOKEN,
    },
    (jwtPayload: any, cb: Function) => {
      return findUser(jwtPayload?.email)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
