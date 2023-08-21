import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "creaml4tt3@gmail.com",
      username: "creaml4tt3",
      name: "Teekayu Poongkawabutr",
      password: bcrypt.hashSync("creaml4tt3", 10),
    },
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
