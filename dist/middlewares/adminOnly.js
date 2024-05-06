// middleware to make sure only admin is allowed!
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utilityClass.js";
import { TryCatch } from "./error.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    //example: "/api/v1/user/bjbnjn?key=24" so here query is 24...
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please Login First!", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User Not Find!", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("You are not Admin!", 401));
    next();
});
