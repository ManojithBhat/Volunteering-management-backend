import {AsyncHandler} from '../utils/AsyncHandler.js'
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//when response is not used in the function then we will replace it by 'underscore' _ 
export const verifyJWT = AsyncHandler(async (req,_,next)=>{
    //request has the cookie access as we have cookie-parser 
    //we also have the header Authorization especially in case of mobile application 
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }

        console.log(user)
    
        //we should not return anything, but add an object in the request 
        req.user = user
        next()
    }catch(err){
        throw new ApiError(401,err?.message || "invalid access token")
    }

})