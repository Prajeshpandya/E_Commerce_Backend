import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/type.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, _id, dob, email, gender, photo, role } = req.body;

    const user = await User.create({
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
  } catch (error) {
    next(error);
  }
};
