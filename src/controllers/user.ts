import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/type.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utilityClass.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, _id, dob, email, gender, photo, role } = req.body;

    let user = await User.findById(_id);

    if (user)
      return res.status(200).json({
        success: "true",
        message: `Welcome Back, ${user.name}`,
      });

    if (!name || !_id || !dob || !email || !gender || !photo || !role) {
      return next(new ErrorHandler("Please enter all field", 400));
    }

    user = await User.create({
      name,
      _id,
      dob: new Date(dob),
      email,
      gender,
      photo,
      role,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();

  return res.status(201).json({
    success: "true",
    users,
  });
});
export const getUser = TryCatch(async (req, res, next) => {
  const users = await User.find();

  return res.status(201).json({
    success: "true",
    users,
  });
});