import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    username: {type: String, required: true},
    email : {type: String, required: true},
    password : {type: String, required: true},
    role : {type: String, required: true},
    isStatus: {type: Boolean, default: false}
})

const authModel = mongoose.model("BlogAuth", authSchema)

export default authModel