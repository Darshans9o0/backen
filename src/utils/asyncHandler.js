const asyncHandler = (requesthandler) =>{
    return   (req , res , next) => {
     Promise.resolve(requesthandler (req , res , next)).catch((err) => next(err))
    }
}


export{asyncHandler}












// const ascnc = (fn) => async(req , res , nextx) => {
//     try {
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false ,
//             message : err.message
//         })
//     }
// }