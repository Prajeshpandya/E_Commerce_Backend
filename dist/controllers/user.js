import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utilityClass.js";
export const newUser = TryCatch(async (req, res, next) => {
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
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find();
    return res.status(200).json({
        success: "true",
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found!", 400));
    return res.status(200).json({
        success: "true",
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found!", 400));
    await User.deleteOne();
    return res.status(200).json({
        success: "true",
        message: "User deleted successfully",
    });
});
