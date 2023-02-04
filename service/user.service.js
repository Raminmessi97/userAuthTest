const bcrypt = require("bcrypt")
const uuid = require("uuid")
const db = require("../models");
const User = db.user;
const ApiError = require("../exceptions/api-error")
const tokenService = require("../service/token.service")
class UserService{
    async registration(email,password,username,phone){
        //registration logic in mysql with jsonwebtoken

        //find user by email or phone
        const candidate = await User.findOne({where:{email:email}})
        if(candidate){
            throw ApiError.BadRequest(`User with email ${email} already exists`);
        }

        //hash password
        const hashPassword = await bcrypt.hash(password,3);
        const user = await User.create({email,password:hashPassword,username,phone})

        //generate tokens and save to db
        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id,tokens.refreshToken)

        console.log("tokens",tokens)
        console.log('user',user)
        return {...tokens, user}
    }

    async login(email,password){
        //login logic in mysql with jsonwebtoken
        const user = await User.findOne({where:{email:email}})
        if(!user){
            throw ApiError.BadRequest("User with email not found");
        }
        const isPassEquals = await bcrypt.compare(password,user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest("Password wrong")
        }

        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id,tokens.refreshToken)
        return {...tokens, user}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findOne({where:{id:userData.id}})
        const tokens = tokenService.generateTokens({...user});
        await tokenService.saveToken(user.id,tokens.refreshToken)
        return {...tokens, user}
    }

    async getUserInfo(id){
        //get user info
        const user = await User.findOne({where:{id:id}})
        return user
    }

}

module.exports = new UserService();