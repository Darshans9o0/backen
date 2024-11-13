 import { Router } from "express";
import { loginUser, logoutUser, registerUser  ,refreshAccessToken, changeCurrentPasswod, getCurrentUser, 
    updateAccountDetails, updateUserAvatar, updateUserCoverImage, 
    getUserChannelProfile , getWtachHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

 const router = Router()

 router.route("/register").post(
   upload.fields([
      {
            name : "avatar",
            maxCount : 1     
        },
        {
            name : "coverImage",
            maxCount : 1
        }

    ]),
    registerUser
)


router.route("/login").post( loginUser);
 
// secured routes
router.route("/logout").post( verifyJwt , logoutUser) // yes 
router.route("/refresh-token").post(refreshAccessToken) // yes
router.route("/change-password").post(verifyJwt , changeCurrentPasswod)
router.route("/current-user").get(verifyJwt , getCurrentUser) // worked
router.route("/update-details").patch(verifyJwt , updateAccountDetails) 
router.route("/avatar").patch(verifyJwt , upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJwt , upload.single("coverIamge"),updateUserCoverImage)
router.route("/c/:username").get(verifyJwt , getUserChannelProfile) // no
router.route("/history").get(verifyJwt , getWtachHistory) // worked

 export default router

// /// fdsfsdfsddsfsdfsdfsdfsdpre/ 
// global config for prettier