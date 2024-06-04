import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
export const connDb = (uri) => {
    mongoose
        .connect(uri, { dbName: "E-Commerce" })
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
            //ex: "product-60d21b4667d0d8992e610c85",
            // for made like this
            // "product-60d21b4667d0d8992e610c87"
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
