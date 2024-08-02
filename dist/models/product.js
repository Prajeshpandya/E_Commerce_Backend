import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"],
    },
    price: {
        type: Number,
        required: [true, "Please enter price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter photo"],
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter Description"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const Product = mongoose.model("Product", schema);
