const multer = require("multer");
// const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    console.log(file,req)
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};


const upload3 = multer({
    fileFilter,limits:{fileSize:100000000,files:10}
})

module.exports = upload3;