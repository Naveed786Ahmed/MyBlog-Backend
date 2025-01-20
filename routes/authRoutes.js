import express from "express"
import authController from "../controllers/authController.js"

const authRoute = express.Router()

authRoute.get("/", authController.GetAllController) 

authRoute.post("/reg", authController.RegController)

authRoute.post("/login", authController.LoginController)

authRoute.post("/logout", authController.LogoutController)

authRoute.delete("/deleteUser/:id", authController.DeleteUser)



export default authRoute