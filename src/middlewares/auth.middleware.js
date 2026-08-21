import authModel from "../models/auth.model.js";
import ApiError from "../utils/apiError.js";
import { Verify_AccessToken } from "../utils/token.js";

const authMiddleware = async (req, res, next) => {
  try {
    const AccessToken = req.cookies.AccessToken;
    if (!AccessToken) throw new ApiError(401, "Token not found");

    const decode = Verify_AccessToken(AccessToken);

    if (!decode) throw new ApiError(401, "invalid token");

    const isExistedUser = await authModel.findById(decode.id).select("-password -refreshToken");

    if (!isExistedUser) throw new ApiError(401, "Unauthorized Access");

    req.user = isExistedUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const authSystemMiddleware = async (req, res, next) => {
  try {

    const AccessToken = req.cookies.AccessToken;
    if (!AccessToken) throw new ApiError(401, "Token not found");

    const decode = Verify_AccessToken(AccessToken);

    if (!decode) throw new ApiError(401, "invalid token");

    const isExistedUser = await authModel.findById(decode.id).select("+systemUser");

    if (!isExistedUser.systemUser) throw new ApiError(403, "Forbidden Access, you are not a system user");

    req.user = isExistedUser;
    next();
    
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
