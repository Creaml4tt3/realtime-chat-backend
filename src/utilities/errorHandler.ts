import express, { Express, Request, Response, NextFunction } from "express";

function logErrors(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500);
  res.render("error", { error: err });
}

function errorHandlers(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode;
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
}
