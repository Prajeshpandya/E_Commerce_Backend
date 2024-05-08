import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilityClass.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please Add Photo ", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => console.log("deleted"));
        return next(new ErrorHandler("Please enter all fields  ", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res.status(201).json({
        success: "true",
        message: "Product created successfully",
    });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
        success: "true",
        products,
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: "true",
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: "true",
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({
        success: "true",
        product,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    //here change controller type req to any.. for pass id to string! or do directly bcz here not all field is required
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not Found!", 404));
    4;
    if (photo) {
        rm(product.photo, () => console.log("deleted old photo"));
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(200).json({
        success: "true",
        message: "Product Updated successfully",
    });
});
