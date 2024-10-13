//index.js - Entry point of the application where the server is created and the database connection is established.
import dotenv from 'dotenv';
dotenv.config({path:'./.env'});
import connectDB from './db/index.js';
import {app} from './app.js';

connectDB()
.then(()=>{
    app.on("Error: ",(error)=>{
        console.log("ERROR: ",error);
        throw error;
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
}).catch((err)=>{
    console.log("Mongodb connection failed");
})

