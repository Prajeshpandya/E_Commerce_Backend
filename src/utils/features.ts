import mongoose from "mongoose";
import { InValidateCacheProps, orderItemType } from "../types/type.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";

export const connDb = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "E-Commerce" })
    .then((c) => {
      console.log(`DataBase Connected to ${c.connection.host}`);
    })
    .catch((e) => console.log(e));
};

export const inValidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId
}: InValidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
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
    // Revalidate on New,Update,Delete & New Order!

    //delete the cache data when the order's change, and we need to remove the cache data accordingly!
    const orderKeys: string[] = ["all-orders", `my-orders ${userId}` , `order-${orderId}`];

    // const orders = await Order.find({}).select("_id");

    // orders.forEach((i) => {
    //   orderKeys.push();
    // });

    myCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];

    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found!");
    product.stock -= order.quantity;
    await product.save();
  }
};
