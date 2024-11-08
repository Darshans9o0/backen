import dotenv from "dotenv"

import mongoose from "mongoose";
import {DB_NAME} from "./constant.js"
import connectdb from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path:'./env'
})
connectdb()
.then(() =>{
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(` Server is running at a port :${process.env.PORT}`);
    
  })
})
.catch((err) => {
  console.log("MONGODB CONNECTION FAILED !!" , err);
  

})
























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