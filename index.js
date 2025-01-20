import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import authRoute from "./routes/authRoutes.js"

const app = express()

dotenv.config()
app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    res.send("Welcome Blog App Backend")
})

app.use("/auth", authRoute)



let PORT = process.env.PORT || 4010
let MONGODB = process.env.MONGODB_URI

mongoose.connect(MONGODB)
.then((req) => {
    console.log("Mongodb Connected Successfully");
}).catch((err) => {
    console.log(err);
})

app.listen(PORT, (req, res) => {
    console.log("Server is Started", PORT);
})