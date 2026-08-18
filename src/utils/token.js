import jwt from 'jsonwebtoken'

export const GENERATE_ACCESS_TOKEN = (userId)=>{
return jwt.sign({id:userId},process.env.ACCESS_SECRET,{
        expiresIn:"20M"
    })
}

export const GENERATE_REFRESH_TOKEN = (userId)=>{
return  jwt.sign({id:userId},process.env.REFRESH_SECRET,{
        expiresIn:"1D"
    })
}

export const Verify_AccessToken = (token)=>{
return jwt.verify(token,process.env.ACCESS_SECRET)
}

export const Verify_RefreshToken = (token)=>{
return jwt.verify(token,process.env.REFRESH_SECRET)
}
