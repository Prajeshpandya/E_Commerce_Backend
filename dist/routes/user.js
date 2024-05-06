import { Router } from "express";
import { newUser, getUser, getAllUsers, deleteUser, } from "../controllers/user.js";
const router = Router();
//route- /api/v1/user/...
router.post("/new", newUser);
router.get("/all", getAllUsers);
router.route("/:id").get(getUser).delete(deleteUser);
export default router;
