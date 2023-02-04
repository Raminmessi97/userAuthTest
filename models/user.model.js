module.exports = (sequilize,Sequelize)=>{
    const User = sequilize.define("users",{
        username:{
            type:Sequelize.STRING,
        },
        email:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        }
    })

    return User;
}