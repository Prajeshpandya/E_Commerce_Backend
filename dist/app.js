import express from "express";
import { connDb } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
//Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import statsRoute from "./routes/stats.js";
export const app = express();
config({
    path: "./.env",
});
const port = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";
connDb(mongo_uri);
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
//make sure this instance created before the myCache.
export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", //we can give specific domain , that only take accept the request from that specific domain
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"],
    credentials: true, //for get header details like cookie...
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/uploads", express.static("uploads"));
//using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", statsRoute);
app.use("/", (req, res, next) => {
    res.send("API is Working with /api/v1 !");
});
// for get the data/photo from the uploads folder
// app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(5000, () => {
    console.log(`Express is working on http://localhost:${port}`);
});
