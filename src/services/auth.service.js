import authModel from "../models/auth.model.js"
import ApiError from "../utils/apiError.js"
import { GENERATE_ACCESS_TOKEN, GENERATE_REFRESH_TOKEN } from "../utils/token.js"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * - This is register service
 * - checking ALL the validations
 * - create a new user
 * - generate access token and refresh token
 * - return new user, access token and refresh token
 */

export const registerService = async({email, password, name})=>{
    if(!email || !password || !name) throw new ApiError(400, "Please fill all the details")
    
    if(name.length < 3) throw new ApiError(400, "Name must be at least 3 characters long.")

    if(password.length < 6) throw new ApiError(400, "Password must be at least 6 characters long.")
    
    if(!emailRegex.test(email)) throw new ApiError(400, "Please fill a valid email address")
    
    const isUserExists = await authModel.findOne({email})

    if(isUserExists) throw new ApiError(400, "User already exists")

    const newUser = await authModel.create({email, password, name})
    
    const AccessToken = GENERATE_ACCESS_TOKEN(newUser._id)

    const RefreshToken = GENERATE_REFRESH_TOKEN(newUser._id)

    newUser.refreshToken = RefreshToken
    await newUser.save()
    
    return {newUser , AccessToken, RefreshToken} 
    
}

/** 
 * - This is login service
 * - checking ALL the validations
 * - generate access token and refresh token
 * - return access token and refresh token and isExistedUser
*/
export const loginService = async({email, password})=>{

    if(!email || !password) throw new ApiError(400, "Please fill all the details")

    if(!emailRegex.test(email)) throw new ApiError(400, "Please fill a valid email address")
    if(password.length < 6) throw new ApiError(400, "Password must be at least 6 characters long.")

    const isExistedUser = await authModel.findOne({email})

    if(!isExistedUser) throw new ApiError(400, "User not found")

    if(!isExistedUser.comparePassword(password)) throw new ApiError(400, "invalid Credentials")

    const AccessToken = GENERATE_ACCESS_TOKEN(isExistedUser._id)

    const RefreshToken = GENERATE_REFRESH_TOKEN(isExistedUser._id)

    isExistedUser.refreshToken = RefreshToken
    await isExistedUser.save()
    
    return {AccessToken, RefreshToken, isExistedUser}
}