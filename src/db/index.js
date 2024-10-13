import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`\n MongoDB Connected !! DB host : ${connectionInstance.connection.host}`)
    }catch(err){
        console.error(`MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;