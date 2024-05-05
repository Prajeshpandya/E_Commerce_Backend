import { Router } from "express";
import { newUser } from "../controllers/user.js";

const route = Router()

//route- /api/v1/user/...

route.post("/new",newUser)

export default route