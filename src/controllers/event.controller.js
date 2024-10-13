import {ApiError} from '../utils/ApiError.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Event} from '../models/events.model.js';
import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const addEvent = AsyncHandler(async(req,res)=>{
    const {eventName,description,location,date,driveLink,image} = req.body;

    if([eventName,description,location,date].some(field=>field?.trim()===" ")){
        throw new ApiError(400,"All fields are required ");
    }


    const existedEvent = await Event.findOne({
        $and:[{eventName},{date}]
    })

    if(existedEvent){
        throw new ApiError(409,"Event already exists")
    }

    //add the new event to the database
    const event = await Event.create({
        eventName:eventName,
        description:description,
        location:location,
        date:date,
        driveLink:driveLink,
        image:image,
        createdBy:req.user._id
    })

    if(!event){
        throw new ApiError(500,"Event could not be created")
    }

    const createdEvent = await Event.findById(event._id).select("-driveLink -image")

    res.status(200).json(
        new ApiResponse(200,createdEvent,"Event created successfully")
    )

})

const updateEvent = AsyncHandler(async(req,res)=>{
    const {eventName,description,location,date,driveLink,image} = req.body;

   if(!eventName && !description && !location && !date && !driveLink && !image){
         throw new ApiError(400,"Atleast one field is required to update")
    }

    //have a doubt on from where the data comes from - it could be params or req.body
    const event = await Event.findById(req.params.id);

    if(!event){
        throw new ApiError(404,"Event not found")
    }

    event.eventName = eventName || event.eventName;
    event.description = description || event.description;
    event.location = location || event.location;
    event.date = date || event.date;
    event.driveLink = driveLink || event.driveLink;
    event.image = image || event.image;

    await event.save();

    res.status(200).json(
        new ApiResponse(200,event,"Event updated successfully")
    )
})

const deleteEvent = AsyncHandler(async(req,res)=>{
    const event = await Event.findById(req.params.id);

    if(!event){
        throw new ApiError(404,"Event not found")
    }

    await event.remove();

    res.status(200).json(
        new ApiResponse(200,event,"Event deleted successfully")
    )
})

const addEventUsers = AsyncHandler(async(req,res)=>{
    const {eventId} = req.params;
    const {usn} = req.body;

    console.log(eventId)
    const event = await Event.findById(eventId);

    if(!event){
        throw new ApiError(404,"Event not found")
    }

    const user = await User.findOne({usn});

    if(!user){
        throw new ApiError(404,"User not found")
    }

    if (event.volunteers.includes(user._id)) {
        return res.status(400).json(new ApiError(400, "User already added to event"));
    }

    event.volunteers.push(user._id);

    await event.save();

    res.status(200).json(
        new ApiResponse(200,event,"User added to event successfully")
    )

})

const getEventDetails = AsyncHandler(async(req,res)=>{
    const {eventId} = req.params;

    const event = await Event.findById(eventId);

    if(!event){
        throw new ApiError(404,"Event not found");
    }

    const volunteers = await Event.findOne(event)
    .populate({
        path:"volunteers",
        select:"usn username"
    })

    if(!volunteers){
        throw new ApiError(404,"No volunteers found")
    }

    res.status(200).json(
        new ApiResponse(200,volunteers,"Volunteers fetched successfully")
    )

})

const getEvent = AsyncHandler(async(req,res)=>{
    const events = await Event.find();

    if(!events){
        throw new ApiError(404,"No events found")
    }

    res.status(200).json(
        new ApiResponse(200,events,"Events fetched successfully")
    )
})


export {
    addEvent,
    updateEvent,
    deleteEvent,
    addEventUsers,
    getEventDetails,
    getEvent
};