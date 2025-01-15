import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteInCloudinary } from "../utils/cloudinary.js"

const generateAccessTokenAndRefreshTokenForUser =  async function(admin_id) {
    const admin = await Admin.findById(admin_id)
    const accessToken = await admin.generateAccessToken()
    const refreshToken = await admin.generateRefreshToken()

    admin.refreshToken = refreshToken
    await admin.save()
    
    return { accessToken, refreshToken }

}

const registerAdmin = asyncHandler( async(req,res) => {

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

    const admin = await Admin.create({
        username,
        email,
        password,
        fullName,
        avatar: avatar.url
    })

    const adminCreated = await Admin.findById(admin._id).select( "-password -refreshToken" )

    if(!adminCreated){
        throw new apiError(500,"Internal Server Issues")
    }

    return res
    .status(200)
    .json( new apiResponse(200,"Admin Registered Successfully!", adminCreated))

} )


const loginAdmin = asyncHandler( async(req,res) => {

    const { username,password } = req.body
    
    if(!username || !password){
        throw new apiError(400,"All fields are required!")
    }

    const admin = await Admin.findOne({username})

    if(!admin){
        throw new apiError(404,"Admin does not exists!")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(400,"Invalid Admin Credentials!")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokenForUser(admin._id)
    
    // console.log(accessToken);
    // console.log(refreshToken);

    if(!(accessToken && refreshToken))
    {
        throw new apiError(400,"Something went wrong while generating access token or refresh token...")
    }

    const loggedInAdmin = await Admin.findById(admin._id).select( "-password -refreshToken" )
    
   if(!loggedInAdmin){
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
    .json(new apiResponse(200,"Admin Logged In Successfully!",{data:loggedInAdmin,accessToken,refreshToken}))

} )

const logoutAdmin = asyncHandler( async(req,res) => {
    
    const admin = await Admin.findByIdAndUpdate(req.admin?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        })

        if(!admin){
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
    .json(new apiResponse(200,"Admin Logged Out Successfully!"))

} )

const changePassword = asyncHandler(async(req,res) => {
    
    const {oldPassword, newPassword} = req.body

    if((!oldPassword || !newPassword) || (oldPassword.trim() === "" || newPassword.trim() === "")){
       throw new apiError(400, "Both fields are required!")
    }
 
    const admin = await Admin.findById(req.admin._id)
 
    const isPasswordValid = await admin.isPasswordCorrect(oldPassword)
    console.log(isPasswordValid);

    if(!isPasswordValid){
       throw new apiError(400, "Incorrect Current Password")
    }
    
    admin.password = newPassword
    admin.save()
 
    return res
    .status(200)
    .json(new apiResponse(200,"Password Changed Successfully!",{}))
 
 })
 
 const updateAdminDetails = asyncHandler(async(req,res) => {
      
    const { fullName, email } = req.body
 
    if((!fullName || !email) || (fullName.trim() === "" || email.trim() === "")){
        throw new apiError(400, "Both fields are required!")  
    }
    
    const admin = await Admin.findByIdAndUpdate(req.admin._id,
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
   .json(new apiResponse(200,"admin Details updated successfully!",admin))
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
 
       const deleteResponse = await deleteInCloudinary(req.admin.avatar)
       console.log(deleteResponse) 
 
       const admin = await Admin.findByIdAndUpdate(req.admin._id, {
          $set: {
             avatar: avatar.url
          }
       },
       {
          new: true
       })
 
       return res
       .status(200)
       .json(new apiResponse(200,"Avatar Updated Successfully",admin))
 
 })

 const getCurrentAdmin = asyncHandler((req,res) => {
   
    return res
    .status(200)
    .json(new apiResponse(200,"Admin",req.admin)) 
 })

export { registerAdmin, loginAdmin, logoutAdmin, changePassword, updateAdminDetails, updateAvatar, getCurrentAdmin }