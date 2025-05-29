import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/${Cluster0103}';


export const connectToMongo = async () => {
    try{
        await mongoose.connect(mongoURI);
        console.log("Successfully connected to MongoDB");
        return true;
    }catch(e){
        console.error('Connection to MongoDb failed', e);
        await mongoose.disconnect();
        return false;
    }
};