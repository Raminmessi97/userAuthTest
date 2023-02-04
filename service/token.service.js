const jwt = require("jsonwebtoken")
const db = require('../models');
const tokenModel = db.token;
class TokenService{
    generateTokens(payload){
        console.log('process.env.JWT_ACCESS_SECRET',process.env.JWT_ACCESS_SECRET)
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
            expiresIn: '10m'
        })
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
            expiresIn: '30d'
        })

        return {accessToken,refreshToken}
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch (e) {
            return null;
        }
    }
    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch (e) {
            return null;
        }
    }

    async saveToken(userId,refreshToken){
        const token = await tokenModel.findOne({where:{userId:userId}});
        if(token){
            token.refreshToken = refreshToken;
            return token.save()
        }
        console.log('userId,refreshToken',userId,refreshToken)
        const tokenData = await tokenModel.create({userId:userId,refreshToken:refreshToken})
        return tokenData;
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.destroy({where:{refreshToken:refreshToken}});
        return tokenData;
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({where:{refreshToken:refreshToken}});
        return tokenData;
    }

    // async saveToken(userId,refreshToken){
    //     const tokenData = await tokenModel.findOne({user:userId});
    //     if(tokenData){
    //         tokenData.refreshToken = refreshToken;
    //         return tokenData.save()
    //     }
    //     const token = await tokenModel.create({user:userId,refreshToken})
    //     return token;
    // }
    //
    // async removeToken(refreshToken){
    //     const tokenData = await tokenModel.deleteOne({refreshToken});
    //     return tokenData;
    // }
    // async findToken(refreshToken){
    //     const tokenData = await tokenModel.findOne({refreshToken});
    //     return tokenData;
    // }


}

module.exports = new TokenService();