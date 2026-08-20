import { CreateService } from "../services/account.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const CreateAccount = asyncHandler(async (req, res) => {
    
    const newAccount = await CreateService(req.user)
    
    res.status(201).json(new ApiResponse("Account created successfully",newAccount));
});

