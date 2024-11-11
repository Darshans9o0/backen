import mongoose, { Schema } from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        username : {
            type  : String ,
            required  :true,
            unique : true,
            lowercase : true,
            trim : true ,
            index : true,
        },
        email : {
            type  : String ,
            required  :true,
            unique : true,
            lowercase : true,
            trim : true ,
         
        },
        fullname : {
            type  : String ,
            required  :true,        
            trim : true ,
            index : true,
        },
        avatar: {
            type  : String , // cloudinary url
            required  :true,
            
        },
        coverImage : {
            type  : String , // cloudinary url
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref   : "Video"
            }
        ],
        pasword : {
            type: String,
            required : [true  , "Password required"]
        },
        refreshToken : {
            type : String
        },
    },

        {
            timestamps  : true
        }

)

userSchema.pre("save" , async  function (next) {console.log("withing presave")
 
if (this.isNew || this.isModified("pasword")) {
        // used for save function
        this.pasword =  await bcrypt.hash(this.pasword,10)       
        return next()

    }
   
    next()
})

userSchema.methods.isPasswodCorrect = async function (pasword){
    return await bcrypt.compare(pasword , this.pasword)
}

userSchema.methods.generateAccesToken = async function(){
   
 
    const token = await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCES_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCES_TOKEN_EXPIRY
        }
     )
    
   return token;
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESF_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESF_TOKEN_EXPIRY 
        }
     )

}
export const User = mongoose.model("User" , userSchema)