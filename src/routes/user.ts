import { Router } from "express";
import {
  newUser,
  getUser,
  getAllUsers,
  deleteUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = Router();

//route- /api/v1/user/...
router.post("/new", newUser);
router.get("/all", adminOnly, getAllUsers);
router.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default router;
