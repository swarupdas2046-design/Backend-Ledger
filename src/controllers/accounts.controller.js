import accountModel from "../models/account.model.js";
import { CreateService } from "../services/account.service.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const CreateAccount = asyncHandler(async (req, res) => {
    
    const newAccount = await CreateService(req.user)
    
    res.status(201).json(new ApiResponse("Account created successfully",newAccount));
});

export const GetUserAccounts = asyncHandler(async (req, res) => {
    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json(new ApiResponse("Accounts fetched successfully",accounts));
}); // GetUserAccounts

export const GetAccountBalance = asyncHandler(async (req, res) => {
    const {accountId} = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) throw new ApiError(404, "Account not found");

    const balance = await account.getBalance();

    res.status(200).json(new ApiResponse("Account balance fetched successfully",{
        accountId,
        balance
    }));

    // res.status(200).json(new ApiResponse("Account fetched successfully",account));
});