import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
const passport = require("passport");

require("./utilities/socket");
require("./configs/passport");
const auth = require("./routes/auth");
const user = require("./routes/user");

require("dotenv").config();

const app: Express = express();
const port: number = Number(process.env.EXPRESS_PORT) || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.status(err);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello Express + TypeScirpt!!",
  });
});

app.use("/auth", auth);
app.use("/user", passport.authenticate("jwt", { session: false }), user);

app.listen(port, () => console.log(`Application is running on port ${port}`));
