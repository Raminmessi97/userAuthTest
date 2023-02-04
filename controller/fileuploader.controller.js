const fileUpload = require("../middleware/file-middleware");
const db = require("../models");
const Files = db.files;

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

class FileuploaderController{
    constructor(){
    }
    async uploadFile(req, res,next){
        console.log(req.files,'req.files')
        try{
            //save files to db
            const files = req.files;
            const filesData = [];
            files.forEach(file=>{
                filesData.push({
                    name:file.originalname,
                    data:file.buffer,
                    type:file.mimetype,
                    size:file.size,
                    path:file.path
                })
            }
            )
            const result = await Files.bulkCreate(filesData);
            res.status(200).send({
                message: "Uploaded the file successfully: " + req.files,
                data:result
            });
        }
        catch (e) {
            next(e)
        }
    }


    async listFile(req, res){
        // get files from db
        const files = await Files.findAll();
        res.status(200).send(files);

    }

    async downloadFile(req, res){
        // get files from db
        const {id} = req.params;
        const file = await Files.findOne({where:{id}});
        res.status(200).send(file);

    }

    async deleteFile(req, res){
        // delete file from db and file system
        const {id} = req.params;
        let findFile = await Files.findOne({where:{id}});
        const file = await Files.destroy({where:{id}});
        //delete file from file system
        await unlinkAsync(findFile.path)
        res.status(200).send({message:"File deleted",file:JSON.stringify(file)});


    }

}

module.exports = new FileuploaderController();