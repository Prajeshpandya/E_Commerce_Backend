import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
