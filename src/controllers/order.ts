import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/type.js";
import { Request } from "express";
import { inValidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilityClass.js";
import { myCache } from "../app.js";

export const myOrders = TryCatch(
  async (req, res, next) => {
    const { id: user } = req.query;

    let orders;

    if (myCache.has(`my-orders ${user}`)) {
      orders = JSON.parse(myCache.get(`my-orders ${user}`)!);
    } else {
      orders = await Order.find({ user });
      myCache.set(`my-orders ${user}`, JSON.stringify(orders));
    }
//this js response..
    res.status(201).json({
      success: "true",
      orders,
    });
  }
);

export const allOrders = TryCatch(async (req, res, next) => {
  let orders;

  if (myCache.has("all-orders")) {
    orders = JSON.parse(myCache.get("all-orders")!);
  } else {
    //here we need user details also so we did that & also specify single field also
    orders = await Order.find().populate("user", "name"); //pass populate parameter that we need to mention , and use ref in model
    myCache.set("all-orders", JSON.stringify(orders));
  }

  return res.status(200).json({
    success: "true",
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let order;

  if (myCache.has(`order-${id}`)) {
    order = JSON.parse(myCache.get(`order-${id}`)!);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order Not Found! ", 404));
    myCache.set(`order-${id}`, JSON.stringify(order));
  }

  return res.status(200).json({
    success: "true",
    order,
  });
});

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
      subTotal === undefined ||
      discount === undefined ||
      total === undefined ||
      shippingCharges === undefined ||
      tax === undefined
    )
      return next(
        new ErrorHandler("Please add the all valid Credentials!", 400)
      );

   const order = await Order.create({
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

    //create the perticular user's order so we need to revalidate that. so we pass the userId of the user and revalidate the keys.
    inValidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId:order.orderItems.map(i=>String(i.productId))
    });

    //at this point we not add the orderId and not revalidate that bcz.. at that time not even have the order id so there is no point to do that !

    res.status(201).json({
      success: "true",
      message: "Your Order Has Been Placed Successfully!",
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found ", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;

    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  //here admin update the order so not necessory that he update the order of self, so it can be update the other's order so we have to specify the id of that perticular user from the order itself

  inValidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  res.status(200).json({
    success: "true",
    message: "Order Processed Successfully!",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found ", 404));

  await order.deleteOne();

  //here admin update the order so not necessory that he update the order of self, so it can be update the other's order so we have to specify the id of that perticular user from the order itself
  inValidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  res.status(200).json({
    success: "true",
    message: "Order Deleted Successfully!",
  });
});
