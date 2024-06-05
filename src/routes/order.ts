import { Router } from "express";

import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = Router();

//route- /api/v1/order/...
router.post("/new", newOrder);
router.get("/my", myOrders);
router.get("/all", adminOnly, allOrders);
router
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default router;
