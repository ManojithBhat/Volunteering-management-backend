import {AsyncHandler} from '../utils/AsyncHandler.js'
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyRole = AsyncHandler(async(req,res,next)=>{

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

        if(user.role !== "admin"){
            throw new ApiError(401,"You are not authorized to access this route")
        }

        //we should not return anything, but add an object in the request 
        req.user = user
        next()
    }catch(err){
        throw new ApiError(401,err?.message || "invalid access token")
    }

})



export {verifyRole};