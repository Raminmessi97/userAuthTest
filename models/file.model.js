//
module.exports = (sequilize,Sequelize)=>{
    // Path: models/token.model.js
    const Files= sequilize.define("files",{
      name:{
        type:Sequelize.STRING
      },
        path:{
            type:Sequelize.STRING
        },
        type:{
            type:Sequelize.STRING
        },
        size:{
            type:Sequelize.STRING
        }
    })

    return Files;
}