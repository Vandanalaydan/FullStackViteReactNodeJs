import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../modles/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


import mongoose from "mongoose";
const generateAccessAndRefreshToken =async(userId) =>{
    try{
        const user = await User.findById(userId);
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken= refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const registerUser =asyncHandler( async (req,res) =>{
    // get user details from frontend ***********
    // validation - not empty
    //check if user already exists: username,email
    //cheak for images, check for avatar
    //upload them to cloudinary, avtar
    //create user object -create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return res
   const{fullName,email,username,password} =  req.body
   

   if (
    [fullName,email,username,password].some((field)=> field?.trim() === "")

   ){
    throw new  ApiError(400,"fullname is required")
   }
     


const existedUser = await User.findOne({
    $or:[{username},{email}]
})

if (existedUser){
    throw new ApiError(409,"User with email or username already exists")
}

const avatarLocalPath =  req.files?.avatar[0]?.path;
//const coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
    coverImageLocalPath =req.files.coverImage[0].path
}

if (!avatarLocalPath)  {
    throw new ApiError (400,"Avatar file is required")
}

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage= await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError(400,"Avatar file is required")
}

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})
const createdUser =await User.findById(user._id).select("-password -refreshToken");

if(!createdUser){
    throw new ApiError(500,"Something went wrong while register the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered succesfully")
)


} )

const loginUser = asyncHandler(async(req,res)=>{
    //req body-> data
    //username or email
    //find the User
    //password check
    //accesss and refresh token
    //send cookie

    const{email,username,password} =req.body;
    if( !username && !email){
        throw new ApiError(400,"username or email is required");
    }
  

   const user =await User.findOne({
        $or:[{username},{email}]
    });

    
    if (!user){
        throw new ApiError(404,"User does not exists");
    }

     const isPasswordValid =await user.isPasswordCorrect(password);

     if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials")
     }
     
      const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

      const options ={
        httpOnly:true,
        secure:true
      }
      return res
      .status(200)
      .cookie("accessToken", accessToken ,options)
      .cookie("refreshToken", refreshToken ,options)
      .json( new ApiResponse (200, {user: loggedInUser,accessToken,refreshToken}, " User logged In Successfully"));

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(

        req.user._id,{
            $unset:{
                refreshToken:1 // this removes the field from document
            }
        },
        {
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true
      }
      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse (200,{},"User logged Out"))

});

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken 
    //console.log(incomingRefreshToken);



    if (!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
   
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

       const user = await User.findById(decodedToken?._id)
       //console.log(decodedToken?._id);
       
       if (!user){
        throw new ApiError(401,"Invalid refresh token");
        
    }
    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
    }
    
    const options = {
        httpOnly:true,
        secure:true
    }
    
    const {accessToken,newRefreshToken}= await generateAccessAndRefreshToken(user._id);
    //console.log(newRefreshToken);
    
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",newRefreshToken, options)
    .json(
        new ApiResponse(200,
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
    
        )
    )
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
        
    }
});

const changeCurrentPassword =asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword} = req.body;

    // if(!(newPassword ==confPassword)){
    //     throw new ApiError(400,"newPassword  and confPassword are not same")
    // }
    const user = await User.findById(req.user?._id)

    const  isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    console.log(isPasswordCorrect);
    console.log(oldPassword);
    console.log(newPassword);


    if (!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }
    
    
    user.password =  newPassword;



   await user.save({validateBeforeSave:false});
    return res 
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))

});

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar files is missing")
    }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if (!avatar.url){
    throw new ApiError(400,"Error while uploading on avatar")
}
const user = await User.findByIdAndUpdate(
    req.user?._id,
     {
        $set:{
        avatar:avatar.url
        }

    },
    {new:true}

).select("-password")

return res
.status(200)

.json(new ApiResponse(200,user,"Avatar  updated successfully"))


});

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing")
    }

   const  coverImage  = await uploadOnCloudinary(coverImageLocalPath)

   if (!coverImage.url){
    throw new ApiError(400,"Error while uploading on cover image")
}
const user = await User.findByIdAndUpdate(
    req.user?._id,
     {
        $set:{
        coverImage:coverImage.url
        }

    },
    {new:true}

).select("-password")

return res
.status(200)

.json(new ApiResponse(200,user,"Cover Image updated successfully"))


})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const{username}= req.params

    if(!username?.trim()) {
        throw new ApiError(400,"username is missing")

    }

    const channel = await User.aggregate ([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"

            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscribers",
                as:"subscribedTo"

            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then:true,
                    else:false

                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                email:1,
                avatar:1,
                coverImage:1
            }
        }
    ])

    if (!channel?.length) {
        throw  new ApiError(404,"channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0],"User channel fetched successfully")
    )

})

const getWatchHistory= asyncHandler(async(req,res)=>{
    const user =await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)

            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"id",
                as:"watchHistory",
                pipeline:[{
                    $lookup:{
                        from:"user",
                        localField:"owner",
                        foreignField:"-id",
                        as:"owner",
                        pipeline:[
                            {
                            $project:{
                                fullName:1,
                                userName:1,
                                avatar:1
                            }
                        }
                    ]

                    }
                },
                {
                    $addFields:{
                       owner: {
                        $first:"$owner"
                     }
                    }
                }
                ]
            }
        }
    ])

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}