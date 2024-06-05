import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/type.js";
import { Request } from "express";
import { inValidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilityClass.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subTotal,
      discount,
      total,
      shippingCharges,
      tax,
    } = req.body;

    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subTotal ||
      !discount ||
      !total ||
      !shippingCharges ||
      !tax
    )
      return next(
        new ErrorHandler("Please add the all valid Credentials!", 400)
      );

    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subTotal,
      discount,
      total,
      shippingCharges,
      tax,
    });

    await reduceStock(orderItems);
    await inValidateCache({ product: true, order: true, admin: true });

    res.status(201).json({
      success: "true",
      message: "Your Order Has Been Placed Successfully!",
    });
  }
);

export const myOrders = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const { id: user } = req.query;

    let orders;

    if (myCache.has(`my-orders ${user}`)) {
      orders = JSON.parse(myCache.get(`my-orders ${user}`)!);
    } else {
      orders = await Order.find({ user });
      myCache.set(`my-orders ${user}`, JSON.stringify(orders));
    }

    res.status(201).json({
      success: "true",
      orders,
    });
  }
);

export const allOrders = TryCatch(async (req, res, next) => {
  let orders;

  if (myCache.has("my-orders")) {
    orders = JSON.parse(myCache.get("my-orders")!);
  } else {
    //here we need user details also so we did that & also specify single field also
    orders = await Order.find().populate("user", "name"); //pass populate parameter that we need to mention , and use ref in model
    myCache.set("my-orders", JSON.stringify(orders));
  }

  return res.status(200).json({
    success: "true",
    orders,
  });
});
export const getSingleOrder = TryCatch(async (req, res, next) => {
  const {id} = req.params;
  let order;

  if (myCache.has(`order ${id}`)) {
    order = JSON.parse(myCache.get(`order ${id}`)!);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order Not Found! ", 404));
    myCache.set(`order ${id}`, JSON.stringify(order));
  }

  return res.status(200).json({
    success: "true",
    order,
  });
});
