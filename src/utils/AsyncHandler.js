//promise way of writing the async handler
const AsyncHandler = (requestHandler)=>{
    return async(req,res,next)=>{
        try{
            Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
        }catch(err){
            next(err); //catch synchronous errors and pass them to the error handler
        }
    }
}

export {AsyncHandler}

