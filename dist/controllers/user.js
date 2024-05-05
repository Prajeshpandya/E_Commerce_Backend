import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, _id, dob, email, gender, photo, role } = req.body;
        const user = await User.create({
            name,
            _id,
            dob,
            email,
            gender,
            photo,
            role,
        });
        return res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error,
        });
    }
};
