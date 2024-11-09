import {  asynchandle} from "../utils/async.js";
import {apierror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadOncloudnary} from "../utils/fileUpload.js"
import {apirsponse} from "../utils/apiResponse.js"


const registerUser = asynchandle( async (req, res ) => {
    // get user details from fontend 
    // validation - not empty 
    // check if user alredy exits  check hrough username nd email
    // check for images , check for avatar
    // upload them to cloudnary , avatar 
    // create user objects  - create entry in db 
    // remove password nd refesh token field from response 
    // check for user creation 
    // return res


      const {  username ,  email, fullname,pasword}= req.body
      console.log("email : ",email);

      // if(fullname === ""){
      //   throw new apierror(400 , "Full name is required")
      // }
      if (
        [fullname , email , username , pasword].some( (field) => field?.trim() === "")
      ){
        throw new apierror(400 , "All fields are required")
      }
     const existngUser = await  User.findOne({
        $or : [{ username },{ email }]
      })
      if(existngUser) {
        throw new apierror(409 , "User with email or username already exists")
      }
       const avatarLocalPath = req.files?.avatar[0]?.path;
       const imageLocalPath = req.files?.coverImage[0]?.path;

       if(!avatarLocalPath){
        throw new apierror(400 , "Avatar file  is required ")

       }
    const avatar = await uploadOncloudnary(avatarLocalPath) 
    const image = await uploadOncloudnary(imageLocalPath) 
    // shold be checked if pt db will be blasted

    if (!avatar) {
      throw new apierror(400 , "Avatar file  is required ")    
    }

   const user =   await User.create({
      fullname,
      avatar : avatar.url,
      coverImage : coverImage?.url || "",
      email,
      pasword,
      username : username.toLowerCase()
    })

   const createdUser =  await User.findById(user._id).select(
    "-pasword  -  refreshToken " 
   )

   if (!createdUser) {
    throw new apierror(500,"Somthing went wrong while regestering the user ")    
   }

   return res.status(201).json(
    new apirsponse(200 , createdUser , "User registered Succesfully")
   )




    })



export {registerUser}