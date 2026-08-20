import ApiError from "../utils/apiError.js";
import accountModel from "../models/account.model.js";


export const CreateService = async (user) => {
    if (!user) throw new ApiError(401, "Unauthorized Access");

    const newAccount = await accountModel.create({ user: user._id });

    return newAccount;
};
