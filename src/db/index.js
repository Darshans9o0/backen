import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";

const connectdb = async () => {
    try {
      const connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log((`\n MOGODB CONNECTED !! DB HOST : ${connectionInstance.connection.host}`)); // to cosole thsu 
      
    } catch (error) {
        console.log("MONGODB connection error" , error);
        process.exit(1)       
    }
}

export default connectdb