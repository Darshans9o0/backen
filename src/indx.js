import dotenv from "dotenv"

import mongoose from "mongoose";
import {DB_NAME} from "./constant.js"
import connectdb from "./db/index.js";


dotenv.config({
    path:'./env'
})
connectdb()
























/*
import express from "express"
const app = express()
// iffy
;( async() => {
    try {
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error" , (error)=>{
        console.log("ERROR : " , error);
        throw error
        
      })
      app.listen(process.env.PORT,()=>{
        console.log(`app is listing on port ${process.env.PORT}`);
        
      })
    } catch (error) {
        console.error("ERROR :" ,error)
        throw error
    }
}) ()
*/