import enumMsgs from "../enum/enum.js"
import authModel from "../models/model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const authController = {

    GetAllController: async (req, res) => {
        try {
            let getAll = await authModel.find()

            res.status(201).send({ status: 201, message: enumMsgs.Success_Msg, data: [getAll] })

        } catch (error) {
            res.status(400).send({ status: 400, message: enumMsgs.Common_Msg })
        }
    },

    RegController: async (req, res) => {
        try {
            let { email, password, username, role } = req.body

            if (!email || !password || !username || !role) {
                res.status(400).send({ status: 400, message: "All Fields are Required" })
            }

            let user = await authModel.findOne({ email })

            if (user) {
                res.status(400).send({ status: 400, message: "User is Already Exist" })
            }

            let hashPass = await bcrypt.hash(password, 10)

            const newUser = await authModel.create({
                email,
                password: hashPass,
                username,
                role
            })

            res.status(201).send({ status: 201, message: enumMsgs.Register_Msg, newUser })

        } catch (error) {
            res.status(400).send({ status: 400, message: enumMsgs.Common_Msg })
        }
    },

    LoginController: async (req, res) => {
        try {
            let { email, password } = req.body

            if (!email || !password) {
                res.status(400).send({ status: 400, message: "All Fields are Required" })
            }

            let user = await authModel.findOne({ email })

            if (!user) {
                res.status(400).send({ status: 400, message: "User Not Found" })
            }

            let validatePass = await bcrypt.compare(password, user?.password)

            if (!validatePass) {
                res.status(400).send({ status: 400, message: "Invalid Credentials" })
            }

            user.isStatus = true
            await user.save()

            let token = jwt.sign({ id: user?._id }, process.env.SECRET_KEY)

            res.status(201).send({ status: 201, message: enumMsgs.Login_Msg, token, user })

        } catch (error) {
            res.status(400).send({ status: 400, message: enumMsgs.Common_Msg })
        }
    },

    DeleteUser: async (req, res) => {
        try {
            let { id } = req.params
            let deleteUser = await authModel.findByIdAndDelete(id)

            res.status(200).send({ status: 200, message: "User Deleted Successfully", deleteUser })

        } catch (error) {
            res.status(400).send({ status: 400, message: enumMsgs.Common_Msg })

        }
    },

    LogoutController: async (req, res) => {
        try {
            const token = req.headers.autherization?.split(" ")[1]

            if (!token) {
                return res.status(401).send({ status: 401, message: "Unauthorized. No token provided." });
            }

            const decode = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decode);

            if (!decode?.id) {
                return res.status(401).send({ status: 401, message: "Invalid token." });
            }

            const user = await authModel.findById(decode.id);

            if (!user) {
                return res.status(404).send({ status: 404, message: "User not found." });
            }

            user.isStatus = false
            await user.save();

            res.status(200).send({ status: 200, message: "Logout successful" });

        } catch (error) {
            res.status(400).send({ status: 400, message: enumMsgs.Common_Msg })
        }
    }
}

export default authController