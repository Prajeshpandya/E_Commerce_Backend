import { Router } from "express";

import {
  allOrders,
  getSingleOrder,
  myOrders,
  newOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = Router();

//route- /api/v1/order/...
router.post("/new", newOrder);
router.get("/my", myOrders);
router.get("/all", adminOnly, allOrders);
router.route("/:id").get(getSingleOrder);

export default router;
