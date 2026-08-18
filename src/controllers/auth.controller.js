import { registerService } from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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
 * - Response: AccessToken, RefreshToken
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

});

