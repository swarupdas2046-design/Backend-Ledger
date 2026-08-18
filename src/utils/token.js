import jwt from 'jsonwebtoken'

/** 
 * - Generate access token that will be used for authentication
 * - create token through JsonWebToken
*/
export const GENERATE_ACCESS_TOKEN = (userId)=>{
return jwt.sign({id:userId},process.env.ACCESS_SECRET,{
        expiresIn:"20M"
    })
}

/**
 * - Generate refresh token that will be used for authentication
 * - create token through JsonWebToken
 */

export const GENERATE_REFRESH_TOKEN = (userId)=>{
return  jwt.sign({id:userId},process.env.REFRESH_SECRET,{
        expiresIn:"1D"
    })
}

/**
 * - Verify access token that will be used for authMiddleware
 * - verify token through JsonWebToken
 */

export const Verify_AccessToken = (token)=>{
return jwt.verify(token,process.env.ACCESS_SECRET)
}

/**
 * - Verify refresh token that will be used to generate new access token
 * - verify token through JsonWebToken
 */

export const Verify_RefreshToken = (token)=>{
return jwt.verify(token,process.env.REFRESH_SECRET)
}
