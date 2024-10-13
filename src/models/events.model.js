import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const EventsSchema = new Schema(
    {
        eventName:{
            type:String,
            required:[true,"Please provide an event name"],
            trim:true,
            index:true
        },
        date:{
            type:Date,
            required:[true,"Please provide a date"],
        },
        location:{
            type:String,
            required:[true,"Please provide a place"],
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        description:{
            type:String,
        },
        volunteers:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        driveLink:{
            type:String,
        },
        image:{
            type:String,
        },
        heads:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    {
        timestamps:true
    }
)

export const Event = mongoose.model("Event",EventsSchema)