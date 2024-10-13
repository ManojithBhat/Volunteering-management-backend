import {ApiError} from '../utils/ApiError.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (userId)=>{
    try{
        const user = await User.findByIdAndUpdate(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //there are methods
        user.refreshToken = refreshToken
        //mongoose will not validate the fields before saving 
        await user.save({valiateBeforeSave:false})
        return {accessToken,refreshToken}

    }catch(err){
        throw new ApiError(500,"Something went wrong while generating regresh and access tokens")
    }
}

const register = AsyncHandler(async(req,res)=>{

     /*Get user details from the frontend*/
    /*Validation for example: not empty, email,password */
    /*Check if user already exists : either through username or emailid */
    /* Check for images or check for avatar*/
    /*Upload them to cloudinary, avatar*/
    /*create user object - create entry in db */
    /*Remove password and refesh token from the response */
    /*check for user creation*/
    /*Return response */

    const {username,email,department,usn,poc,password,role} = req.body;
    
    if([username,email,department,usn,poc,password].some(field=>field==="")){
        throw new ApiError(400,"All fields are required ");
    }

    //check for the existing user 

    const existedUser = await User.findOne({
        $or:[{usn},{email}]
    })

    /*The HTTP 409 Conflict status code indicates that a client's request conflicts with the current state of a resource. This error is most likely to occur in response to a PUT request, which can be used to create a new resource or replace an existing one. */

    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    //add the new user to the database 
    const user = await User.create({
        username:username,
        email:email,
        department:department,
        usn:usn,
        poc:poc,
        password:password,
        role:role
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User not created")
    }

    res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
    )

})

const loginUser = AsyncHandler(async(req,res)=>{
     /* request body ->data */
        /* get username or email/ */
        /* find the user */
        /* compare password */
        /* access and refresh token */
        /* send cookies */

        const {email,password,usn} = req.body;
        if(!(email || usn)){
            throw new ApiError(400,"email or usn is required");
        }

        const user = await User.findOne({
            $or:[{email},{usn}]
        })

        if(!user){
            throw new ApiError(404,"User not found");
        }

        //the user defined method in user.model.js so we should use user and if it is of mongoose then User

        const isPasswordValid = await user.isPasswordCorrect(password);

        if(!isPasswordValid){
            throw new ApiError(404,"Invalid user credentials");
        }

        //user is valid and now we need to generate access and refresh token for the user 
        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id) 

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        //cookie are modifiable by only server and not the frontend 
        const options = {
            httpOnly : true,
            secure : true,
        }

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {user:loggedInUser,accessToken,refreshToken},
                "User logged in successfully"
            )
        )
})

const logoutUser = AsyncHandler(async(req,res)=>{
    //to log out we have to clear cookies at the user end and also remove the refresh token from the db 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {   //the response we get back will be the new updated value 
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken = AsyncHandler(async(req,res)=>{
    const incomingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(200,{accessToken,newRefreshToken},"Access token refreshed")
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

const getCurrentUser = AsyncHandler(async(req,res)=>{

    return res.status(200)
    .json(new ApiResponse(200,req.user,"Current User fetched successfully"))
})

const updateCurrentDetails = AsyncHandler(async(req,res)=>{

    //when request is made, the user is already verified by the middleware verifyJWT

    const {username,email,department,usn,poc,password,oldPassword} = req.body;
    
    console.log(req.body)
   

    if(!username && !email && !department && !usn && !poc&& (!password || !newPassword)){
        throw new ApiError(400,"No fields are changed");
    }

    const user = await User.findById(req.user._id);

    if(oldPassword){
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if(!isPasswordCorrect){
            throw new ApiError(400,"Invalid old password");
        }
        user.password = newPassword;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.department = department || user.department;
    user.usn = usn || user.usn;
    user.poc = poc || user.poc;

    //save is custom method writtern by us in the user.model.js which will hash the password before saving but if we have the password that is same as newPassword then it will not hash it again,it is bc of the pre save hook

    await user.save({validateBeforeSave:false})


    res.status(200)
    .json(new ApiResponse(200,user,"User details updated successfully"));

})

const getUserProfile = AsyncHandler(async(req,res)=>{
    const usn = req.user.usn;
    if(!usn){
        throw new ApiError(400,"Username is missing ");
    }

    const eventList = await User.findOne({usn})
    .populate({
      path: 'eventList',
      select: 'eventName',
    })
    .exec();
    

    res.status(200)
    .json(new ApiResponse(200,eventList,"User fetched successfully"))
})



export {
    register,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateCurrentDetails,
    getUserProfile,
}