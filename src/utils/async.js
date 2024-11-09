const asynchandle = (requesthandle) =>{
    return   (req , res , next) => {
     Promise.resolve(requesthandle (req , res , next)).catch((err) => next(err))
    }
}


export {asynchandle}












// const ascnc = (fn) => async(req , res , nextx) => {
//     try {
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false ,
//             message : err.message
//         })
//     }
// }