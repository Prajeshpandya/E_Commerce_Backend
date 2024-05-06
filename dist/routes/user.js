import { Router } from "express";
import { newUser, getUser, getAllUsers } from "../controllers/user.js";
const route = Router();
//route- /api/v1/user/...
route.post("/new", newUser);
route.get("/all", getAllUsers);
route.get("/:id", getUser);
export default route;
