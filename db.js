import mongoose from 'mongoose';
import dotenv from 'dotenv';

//ENV configuration
dotenv.config();

export function dbConnection(){
    let mongo_URL=process.env.mongo_URL
    try {
        mongoose.connect(`${mongo_URL}`);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error Connecting in DB", error)
    }
}