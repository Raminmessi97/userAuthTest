const express = require("express");
const cors = require("cors");
require( 'dotenv' ).config();
const {body} = require("express-validator")
const errorMiddleware = require("./middleware/error-middleware");
const authMiddleware = require("./middleware/auth-middleware");

const app = express();
const corsOptions = {
    origin:"http://localhost:8081"
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.json({message:"Welcome to bezkoder"});
})

const userController = require("./controller/user.controller");
app.post("/api/register",
    body("email").isEmail(),
    body("password").isLength({min:6,max:40}),
    userController.registration);


app.post("/api/login",
    body("email").isEmail(),
    body("password").isLength({min:6,max:40}),
    userController.login);

app.post("/api/logout",userController.logout);
app.get("/refresh",userController.refresh);
app.get("/api/info",authMiddleware,userController.getUserInfo);
app.get("/api/users",authMiddleware,userController.getUsers);

const fileUploadController = require("./controller/fileuploader.controller");
const fileUploadMiddleware1 = require("./middleware/file-middleware");
app.post("/api/file/upload",authMiddleware,fileUploadMiddleware1.array("files"),fileUploadController.uploadFile);
app.get("/api/file/list",authMiddleware,fileUploadController.listFile);
app.get("/api/file/:id",authMiddleware,fileUploadController.downloadFile);
app.delete("/api/file/:id",authMiddleware,fileUploadController.deleteFile);

app.use(errorMiddleware)


const db = require("./models");
const Role = db.role;

db.sequelize.sync().then(()=>{
    console.log("Drop and resync db");
})


const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log("Server run on port ",PORT);
})