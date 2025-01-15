import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError }from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { Admin } from "../models/admin.model.js"



const verifyUserJwt = asyncHandler( async(req,res,next) => {

    const token = req.cookies?.accessTokenUser
    
    if(!token){
        throw new apiError(400,"Unauthorized Request!")
    }

    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new apiError("Invalid Access Token!")
    }
    
    req.user = user

    next()

} )


const verifyAdminJwt = asyncHandler( async(req,res,next) => {

    const token = req.cookies?.accessTokenUser
    
    if(!token){
        throw new apiError(400,"Unauthorized Request!")
    }

    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const admin = await Admin.findById(decodedToken?._id)

    if(!admin){
        throw new apiError("Invalid Access Token!")
    }
    
    req.admin = admin

    next()

} )

export { verifyUserJwt, verifyAdminJwt }