import {  asynchandle} from "../utils/async.js";


const registerUser = asynchandle( async (req, res ) => {
    res.status(200).json({
        message : " its done "
    })
})


export {registerUser}