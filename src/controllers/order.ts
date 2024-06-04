import { TryCatch } from "../middlewares/error.js";
import {NewOrderRequestBody} from "../types/type.js" 
import { Request } from "express";



export const newOrder = TryCatch(async(req:Request<{},{},NewOrderRequestBody>,res,next)=>{

    

})

