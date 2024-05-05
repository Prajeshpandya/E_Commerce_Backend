import express from "express"
import userRoute from "./routes/user.js"
import { connDb } from "./utils/features.js"
export const app = express()


app.use(express.json())

//using Routes
app.use("/api/v1/user",userRoute)

app.use("/",(req,res,next)=>{
    res.send("API is Working with /api/v1 !")
})

const port =5000;

connDb()
app.listen(5000,()=>{
    console.log(`Express is working on http://localhost:${port}`)
})

