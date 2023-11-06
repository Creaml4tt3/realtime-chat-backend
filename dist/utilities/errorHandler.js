"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: "Something failed!" });
    }
    else {
        next(err);
    }
}
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render("error", { error: err });
}
function errorHandlers(err, req, res, next) {
    const statusCode = res.statusCode;
    res.status(statusCode).json({
        error: {
            status: statusCode,
            message: err.message,
        },
    });
}
