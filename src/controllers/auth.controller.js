import { loginService, RefreshService, registerService } from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import emailTemplate from "../utils/emailTemplate.js";

// Get user details
const UserDetails = (user)=>{
    return {
        _id:user._id,
        name:user.name,
        email:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        __v:user.__v
    }
}

/**
 * - User registration
 * - /api/auth/register (POST)
 * - Body: email, password, name
 * - Response: AccessToken, RefreshToken, userinfo
 * - Status: 201
 */

export const UserRegister = asyncHandler(async (req, res) => {
    const {AccessToken, RefreshToken, newUser} = await registerService(req.body)

    res.cookie("AccessToken",AccessToken,{
        httpOnly:true,
        secure:true,
        maxAge:20*60*1000 // 20 minutes
    })

    res.cookie("RefreshToken",RefreshToken,{
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000 // 1 day
    })

    res.status(201).json(new ApiResponse("User registered successfully",UserDetails(newUser)))

    await emailTemplate(newUser.email,newUser.name)

});

/** 
 * - User login
 * - /api/auth/login (POST)
 * - Body: email, password
 * - Response: AccessToken, RefreshToken, userinfo
 * - Status: 200
*/

export const UserLogin = asyncHandler(async (req, res) => {
    const {AccessToken, RefreshToken, isExistedUser} = await loginService(req.body)

    res.cookie("AccessToken",AccessToken,{
        httpOnly:true,
        secure:true,
        maxAge:20*60*1000 // 20 minutes
    })

    res.cookie("RefreshToken",RefreshToken,{
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000 // 1 day
    })

    res.status(200).json(new ApiResponse("User logged in successfully",UserDetails(isExistedUser)))
})

/**
 * - Get refresh token
 * - /api/auth/getRefresh (GET)
 * - Response: AccessToken, userinfo
 * - Status: 200
 */

export const GetRefresh = asyncHandler(async (req, res) => {
    const {AccessToken, isExistedUser} = await RefreshService(req.cookies.RefreshToken)

    res.cookie("AccessToken",AccessToken,{
        httpOnly:true,
        secure:true,
        maxAge:20*60*1000 // 20 minutes
    })

    res.status(200).json(new ApiResponse("Refresh SuccessFully",UserDetails(isExistedUser)))
});