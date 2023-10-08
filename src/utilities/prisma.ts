const prisma = require("./prismaConnection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//? passport User CRUD
export async function createUser(userData: userData) {
  const { email, password, name, photo } = userData;
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
      photo,
    },
  });
  return user;
}

export async function findUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
      deleted: false,
    },
  });
  return user;
}

export async function updateUser(email: string, data: Object) {
  const user = await prisma.user.update({
    where: {
      email: email,
      deleted: false,
    },
    data: {
      ...data,
    },
  });
  return user;
}

export async function updateRefreshToken(
  email: string,
  deleted: boolean = false
) {
  const refreshToken = deleted
    ? null
    : jwt.sign({ email }, process.env.SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      });
  updateUser(email, { refresh_token: refreshToken });
}

//? socketIO Message CRUD
export async function createMessage(data: message) {
  const { author_email, text } = data;
  const createMessage = await prisma.message.create({
    data: {
      text,
      author_email,
    },
  });
  return createMessage;
}

export async function readMessages() {
  const messages = await prisma.message.findMany({
    where: {
      deleted: false,
    },
  });
  return messages;
}
