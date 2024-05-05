import { Response } from "express";
import ErrorHandler from "../utils/utilityClass.js";

export const errorMiddleware = (
  err: ErrorHandler,
  res: Response,
) => {

  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
