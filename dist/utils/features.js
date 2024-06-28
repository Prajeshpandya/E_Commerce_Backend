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
export const inValidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
        }
        if (typeof productId === "object") {
            productId.forEach((i) => productKeys.push(`product-${i}`));
            console.log("working");
        }
        // const products = await Product.find({}).select("_id");
        // products.forEach((i) => {
        //   productKeys.push(`product-${i._id}`);
        //   //ex: "product-60d21b4667d0d8992e610c85",
        //   // for made like this
        //   // "product-60d21b4667d0d8992e610c87"
        // });
        myCache.del(productKeys);
    }
    if (order) {
        // Revalidate on New,Update,Delete & New Order!
        //delete the cache data when the order's change, and we need to remove the cache data accordingly!
        const orderKeys = [
            "all-orders",
            `my-orders ${userId}`,
            `order-${orderId}`,
        ];
        // const orders = await Order.find({}).select("_id");
        // orders.forEach((i) => {
        //   orderKeys.push();
        // });
        myCache.del(orderKeys);
    }
    if (admin) {
        myCache.del([
            "admin-line-charts",
            "admin-bar-charts",
            "admin-pie-charts",
            "admin-stats",
        ]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found!");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
//if cant understand then see the function of getLastSixMonth data and store in the array for charts.. in 152 line of Stats.ts
export const getChartData = ({ length, docArr }) => {
    const today = new Date();
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - 1 - monthDiff] += 1;
        }
    });
    return data;
};
