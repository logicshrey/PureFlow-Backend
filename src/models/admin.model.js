import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminSchema = new Schema({
   username:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    trim: true
   },
   email:{
    type: String,
    required: true,
    unique: true
   },
   password:{
    type: String,
    required: true
   },
   fullName:{
    type: String,
    required: true
   },
   avatar:{
    type: String,
    required: true
   },
   refreshToken:{
    type: String
   }
}, { timestamps: true })

adminSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next()

   this.password = await bcrypt.hash(this.password, 10)
   next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

adminSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}


export const Admin = mongoose.model("Admin",adminSchema)