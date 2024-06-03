import mongoose from "mongoose";
import { Product } from "../models/product.js";
export const connDb = () => {
    mongoose
        .connect("mongodb://localhost:27017", { dbName: "E-Commerce" })
        .then((c) => {
        console.log(`DataBase Connected to ${c.connection.host}`);
    })
        .catch((e) => console.log(e));
};
export const inValidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
    }
    if (order) {
    }
    if (admin) {
    }
};
