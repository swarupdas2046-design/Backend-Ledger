/**
 * - To handle async errors
 * - Used in all the controllers
 */

const asyncHandler = (requestHandler)=>{
    return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch(error => next(error))
    }
}

export default asyncHandler