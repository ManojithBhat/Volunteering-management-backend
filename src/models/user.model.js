import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:[true,"Please provide a username"],
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:[true,"Please provide an email"],
            unique:true,
            lowercase:true,
            trim:true,
        },
        department:{
            type:String,
            required:[true,"Please provide a department"],
        },
        usn:{
            type:String,
            required:[true,"Please provide a usn"],
            unique:true,
            trim:true,
        },
        poc:{
            type:Number,
            required:true,
        },
        password:{
            type:String,
            required:[true,"Please provide a password"],
        },
        eventList:[
            {
                type:Schema.Types.ObjectId,
                ref:"Event"
            }
        ],
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        refreshToken:{
            type:String
        }
},{
    timestamps:true
})

//pre save hook is from mongoose 
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    //hash the password only if it has been modified (or is new)
    this.password  = await bcrypt.hash(this.password,10);
    next(); 
})

UserSchema.methods.isPasswordCorrect = async function(password){
    /*this.password is the hashed password
    password is the password that user entered
    compare the password entered by user with the hashed password in the database
     await is used because bcrypt.compare is an async function */
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function(){
    //payload 
    return jwt.sign({
        _id : this._id,
        email : this.email,
        userName : this.userName,
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User",UserSchema);