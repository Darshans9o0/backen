import { asyncHandler } from "../utils/asyncHandler.js"
import {apierror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadOncloudnary} from "../utils/fileUpload.js"
import {apirsponse} from "../utils/apiResponse.js"
import {jwt} from "jsonwebtoken"

const genrateAccesAndrefreshToken = async(userId)  =>{
  try {
  // get user info from db
  const user =   await User.findById(userId)
  // generate token for session
 const accesToken =  await user.generateAccesToken()

 const refreshToken =  await user.generateRefreshToken()
 console.log('refresh token', refreshToken)
          
   user.refreshToken = refreshToken
  await user.save({validateBeforeSave : false})

  return {accesToken , refreshToken}
   
  } catch (error) {console
    throw new apierror (500 , "something wennt wrong")
  }
}


const registerUser = asyncHandler( async (req, res ) => {
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
      console.log(req.files)
       const avatarLocalPath = req.files?.avatar[0]?.path;
      // const imageLocalPath = req.files?.coverImage[0]?.path;

      let coverImageLocalPath;
      if(req.files && Array.isArray(req.files.coverImage)  && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
      } 

       if(!avatarLocalPath){ 
        throw new apierror(400 , "Avatar file  is required ")

       }
    const avatar = await uploadOncloudnary(avatarLocalPath) 
   const coverImage = await uploadOncloudnary(coverImageLocalPath) 
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

   const createdUser =  await User.findById(user._id).select([
    "-pasword  -  refreshToken " 
   ])

   if (!createdUser) {
    throw new apierror(500,"Somthing went wrong while regestering the user ")    
   }

   return res.status(201).json(
    new apirsponse(200 , createdUser , "User registered Succesfully")
   )
   
  })

   const loginUser = asyncHandler (async (req , res) => {
    // req body take data 
    // username or email  logn
    // find thr user
    // passwrd check 
    // acces nd refresh token 
    // snd cookie 
    // sned response 
    
    const {username , email , pasword} = req.body

    
    
    if(!username && !email){
      throw new apierror(400 , "username or email is reqired ")
    }

    const user = await User.findOne({
      $or : [{username} , {email}]
    })
     if (!user){
      throw new apierror (404 , "user doesnt exists")
     }
     console.log('passowrd ',pasword)
   const isPasswordValid =   await user.isPasswodCorrect(pasword)
   console.log(isPasswordValid);
   

   if (!isPasswordValid){
    throw new apierror (401 , "Inavalid password ")
   }
  const {accesToken, refreshToken} =   await  genrateAccesAndrefreshToken(user._id)



  const loggedUser = User.findById(user._id).select(" -pasword  -refreshToken")
     

     const options = {    // cookis
      httpOnly : true,
      secure : true
     }
     return res
     .status(200)
     .cookie("accesToken", accesToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
       new apirsponse(
         200,
         {
           user: { username: user.username, email: user.email },
           accesToken,
           refreshToken,
         },
         "User logged succesfully"
       )
     );
 });
    const logoutUser = asyncHandler(async (req ,res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
        $set  : {
        refreshToken : undefined
        } 
      },
        {
          new : true
        },
      
    )
    const options = {    // cookis
      httpOnly : true,
      secure : true
     }
     return res
     .status(200)
     .clearCookie("accesToken" ,options)
     .clearCookie("refreshToken" ,options)
     .json(new apirsponse(200 , {} ,"User loggout"))
    })

    const refreshAccessToken = asyncHandler(async (req , res ) =>{
       const incomingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken

       if(!incomingRefreshToken){
        throw new apierror(401 , "Unauthorised request")
       } 
      try {
          const decodedToken  = jwt.verify(
          incomingRefreshToken ,
          process.env.REFRESF_TOKEN_SECRET
         )
  
        const user =  User.findById(decodedToken?. _id)
        if(!user){
          throw new apierror (401 , "Invalid refresh token ")
        }
        if(incomingRefreshToken !== user?.refreshToken){
          throw new apierror(401 , "Refresh token is expired or used ")
        }
        const options ={
          httpOnly : true,
          secure : true
        }
  
        const {accesToken , newrefreshToken}  = await genrateAccesAndrefreshToken(user._id)
  
         return res
         .status(200)
         .cookie("accesToken" , accesToken , options)
         .cookie("refreshToken" , newrefreshToken , options)
         .json(
          new apierror(
            200,
            {accesToken , refreshToken : newrefreshToken },
            "Acces token refrehed"
          )
         )
      } catch (error) {
        throw new apierror(401 ,error?.message || "Invalid refresh token")
      }
    })



export {registerUser , loginUser , logoutUser , refreshAccessToken }