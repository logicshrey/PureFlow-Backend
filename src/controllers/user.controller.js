import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteInCloudinary } from "../utils/cloudinary.js"

const generateAccessTokenAndRefreshTokenForUser =  async function(user_id) {
    const user = await User.findById(user_id)
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save()
    
    return { accessToken, refreshToken }

}

const registerUser = asyncHandler( async(req,res) => {

    const {username,email,password,fullName} = req.body

    if( [username,email,password,fullName].some((ele)=>{
        !ele || ele?.trim() === ""  
    }) )
    {
       throw new apiError(400,"All fields are required!")
    }

    const localAvatarPath = req.file?.path
    
    if(!localAvatarPath){
       throw new apiError(400,"Avatar is required!")
    }

    const avatar = await uploadOnCloudinary(localAvatarPath)

    if(!avatar){
       throw new apiError(400,"Something went wrong while uploading avatar on cloudinary!")
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName,
        avatar: avatar.url
    })

    const userCreated = await User.findById(user._id).select( "-password -refreshToken" )

    if(!userCreated){
        throw new apiError(500,"Internal Server Issues")
    }

    return res
    .status(200)
    .json( new apiResponse(200,"User Registered Successfully!", userCreated))

} )


const loginUser = asyncHandler( async(req,res) => {

    const { username,password } = req.body
    
    if(!username || !password){
        throw new apiError(400,"All fields are required!")
    }

    const user = await User.findOne({username})

    if(!user){
        throw new apiError(404,"User does not exists!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(400,"Invalid User Credentials!")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokenForUser(user._id)
    
    // console.log(accessToken);
    // console.log(refreshToken);

    if(!(accessToken && refreshToken))
    {
        throw new apiError(400,"Something went wrong while generating access token or refresh token...")
    }

    const loggedInUser = await User.findById(user._id).select( "-password -refreshToken" )
    
   if(!loggedInUser){
    throw new apiError(500,"Internal Server Issues")
   } 

   const options = {
    httpOnly: true,
    secure: true,
    expires: new Date( Date.now() + 90 * 24 * 60 * 60 * 1000 )
    }

    return res
    .status(200)
    .cookie("accessTokenUser",accessToken,options)
    .cookie("refreshTokenUser",refreshToken,options)
    .json(new apiResponse(200,"User Logged In Successfully!",{data:loggedInUser,accessToken,refreshToken}))

} )

const logoutUser = asyncHandler( async(req,res) => {
    
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        })

        if(!user){
            throw new apiError(500,"Internal Server Issue while logging out...")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

    return res
    .status(200)
    .clearCookie("accessTokenUser",options)
    .clearCookie("refreshTokenUser",options)
    .json(new apiResponse(200,"User Logged Out Successfully!"))

} )

const changePassword = asyncHandler(async(req,res) => {
    
    const {oldPassword, newPassword} = req.body

    if((!oldPassword || !newPassword) || (oldPassword.trim() === "" || newPassword.trim() === "")){
       throw new apiError(400, "Both fields are required!")
    }
 
    const user = await User.findById(req.user._id)
 
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    console.log(isPasswordValid);

    if(!isPasswordValid){
       throw new apiError(400, "Incorrect Current Password")
    }
    
    user.password = newPassword
    user.save()
 
    return res
    .status(200)
    .json(new apiResponse(200,"Password Changed Successfully!",{}))
 
 })
 
 const updateUserDetails = asyncHandler(async(req,res) => {
      
    const { fullName, email } = req.body
 
    if((!fullName || !email) || (fullName.trim() === "" || email.trim() === "")){
        throw new apiError(400, "Both fields are required!")  
    }
    
    const user = await User.findByIdAndUpdate(req.user._id,
                                        {
                                           $set: {
                                              fullName,
                                              email
                                           }
                                        },
                                        {
                                           new: true
                                        });
    
    
   return res
   .status(200)
   .json(new apiResponse(200,"User Details updated successfully!",user))
 })
 
 const updateAvatar = asyncHandler(async(req,res) => {
       
       const localAvatarPath = req.file?.path
       console.log(localAvatarPath);
       if(!localAvatarPath){
          throw new apiError(400, "Avatar is required!")
       }
 
       const avatar = await uploadOnCloudinary(localAvatarPath)
 
       if(!avatar?.url){
          throw new apiError(400, "Something went wrong while updating Avatar...")
       }
 
       const deleteResponse = await deleteInCloudinary(req.user.avatar)
       console.log(deleteResponse) 
 
       const user = await User.findByIdAndUpdate(req.user._id, {
          $set: {
             avatar: avatar.url
          }
       },
       {
          new: true
       })
 
       return res
       .status(200)
       .json(new apiResponse(200,"Avatar Updated Successfully",user))
 
 })

 const getCurrentUser = asyncHandler((req,res) => {
   
    return res
    .status(200)
    .json(new apiResponse(200,"User",req.user)) 
 })

export { registerUser, loginUser, logoutUser, changePassword, updateUserDetails, updateAvatar, getCurrentUser }