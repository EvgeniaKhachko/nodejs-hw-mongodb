import createHttpError from "http-errors";

export const errorHandler = (err, req, res, next) => {
    console.error(err);
 // Перевірка, чи отримали ми помилку від HttpError
 if (err instanceof createHttpError.HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }
    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        data: err.message || "Unknown error"
    });
};


