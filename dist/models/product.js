import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
    },
    photos: [{
            public_id: {
                type: String,
                required: [true, "Please enter Public ID"]
            },
            url: {
                type: String,
                required: [true, "Please enter URL"]
            }
        }],
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
