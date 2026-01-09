import {User} from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.utils.js'
import { hashToken } from '../utils/hashToken.utils.js'


const createNewUserService = async (
    {fullName , email, password, username}
) => {


    const user = await User.create({
        fullName : fullName,
        email : email,
        password : password,
        username : username.toLowerCase()
    })

    return user;
}

const generateAccessAndRefereshTokensService = async (userId) => {
    try {
        const user = await User.findById(userId);
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = hashToken(refreshToken);
        await user.save({
            validateBeforeSave : false
        })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token", {message : error?.message})
    }
}


export {
    createNewUserService,
    generateAccessAndRefereshTokensService
}