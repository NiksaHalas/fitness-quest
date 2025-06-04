// backend/src/middleware/errorMiddleware.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Middleware za centralizovano rukovanje greškama u Express.js aplikaciji.

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
