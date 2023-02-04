const multer = require('multer');
const files={
    storage:function(){
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public')
            },
            filename: function (req, file, cb) {
                file.originalname = file.originalname.replace(/\s/g, '');
                const fileName = `${Date.now()}_${file.originalname}`
                cb(null, fileName);
            }
        })

        return storage;
    },
    allowedFiles:function(req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
            return cb(new Error('Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
        }
        cb(null, true);
    }
}


const upload = multer({
    storage: files.storage(),
    allowedFiles:files.allowedFiles
});
module.exports = upload;