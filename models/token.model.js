//
module.exports = (sequilize,Sequelize)=>{
    // Path: models/token.model.js
    const Token = sequilize.define("token",{
        userId:{
            type:Sequelize.INTEGER
        },
        refreshToken:{
            type:Sequelize.TEXT
        },
    })

    return Token;
}