const {validationResult} = require("express-validator")
const ApiError = require("../exceptions/api-error")
const userService = require("../service/user.service")
class UserController {
    async registration(req,res,next){
        try{
            const errors = validationResult(req);
            console.log("errors",errors)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Validation errors",errors.array()));
            }
            const {email,password,username,phone} = req.body;

            const userData = await userService.registration(email,password,username,phone);
            res.cookie("refreshToken",userData.refreshToken,{
                maxAge:30 * 24 * 60 * 60 * 1000,
                httpOnly:true,
                // secure:true
            })
            return res.json(userData)
        }catch (e) {
            //return error code 400
           next(e);
        }
    }

    async login(req,res,next){
        //login logic in mysql with jsonwebtoken
        try{
            const {email,password} = req.body;
            const userData = await userService.login(email,password);
            res.cookie("refreshToken",userData.refreshToken,{
                maxAge:30 * 24 * 60 * 60 * 1000,
                httpOnly:true,
                // secure:true
            })
            return res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }

    async logout(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        }catch (e) {
            next(e)
        }
    }

    async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie("refreshToken",userData.refreshToken,{
                maxAge:30 * 24 * 60 * 60 * 1000,
                httpOnly:true,
                // secure:true
            })
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }

    async getUsers(req,res,next){
        return res.json("ramin")
    }

    async getUserInfo(req,res,next){
        try{
            console.log("req.user",req.user)
            const {id} = req.user.dataValues;
            const userData = await userService.getUserInfo(id);
            return res.json(userData.id)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();