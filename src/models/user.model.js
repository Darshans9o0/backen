import mongoose, { Schema } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
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

userSchema.pre("save" , async  function (next) {
    if(!this.isMOdified("password")){
        return next()

    }
    this.pasword =  await bcrypt.hash(this.pasword,10)
    next()
})

userSchema.methods.isPasswodCorrect = async function (password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccesToken = function(){
   return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCES_TOKEN_SECRET,
    {
        exipresIn : process.env.ACCES_TOKEN_EXPIRY
    }
 )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESF_TOKEN_SECRET,
        {
            exipresIn : process.env.REFRESF_TOKEN_EXPIRY 
        }
     )

}
export const User = mongoose.model("User" , userSchema)