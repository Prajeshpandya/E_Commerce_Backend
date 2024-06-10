import { Router } from "express";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controllers/stats.js";
import { adminOnly } from "../middlewares/adminOnly.js";
const router = Router();
// default route : /api/v1/dashboard/...
router.get("/stats", adminOnly, getDashboardStats);
router.get("/pie", adminOnly, getPieCharts);
router.get("/bar", adminOnly, getBarCharts);
router.get("/line", adminOnly, getLineCharts);
export default router;
