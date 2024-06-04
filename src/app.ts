import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import { connDb } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan"

export const app = express();

config({
  path:"./.env"
})

const port = process.env.PORT || 5000 ;
const mongo_uri = process.env.MONGO_URI || "";



connDb(mongo_uri);

export const myCache = new NodeCache();

app.use(express.json());
app.use(morgan("dev"))

//using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use("/", (req, res, next) => {
  res.send("API is Working with /api/v1 !");
});

// for get the data/photo from the uploads folder
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(5000, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
