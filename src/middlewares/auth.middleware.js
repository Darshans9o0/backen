import { apierror } from "../utils/apierror.js"
import{  asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJwt = asyncHandler(async(req, res , next) => {
try {
      const token =   req.cookies.accesToken || req.header("Authorization")?.replace("Bearer ","")
    
      if(!token){
        throw new apierror (401 , "unthorized request")
      }
       const decoded = jwt.verify(token ,process.env.ACCES_TOKEN_SECRET)
    
      const user =  await User.findById(decoded ?._id).select(" -pasword -refreshToken")
    
      if(!user){
        // todo Frontend
        throw new apierror(401 , "Inavalid acces token ")
      }
    
      req.user = user;
      next()
} catch (error) {
    throw new apierror (401 , error?.message || "Invalid   acces token")
}
})