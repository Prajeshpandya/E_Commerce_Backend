import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
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
});
