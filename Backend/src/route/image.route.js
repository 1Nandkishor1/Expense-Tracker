
let express=require('express');
let imageRouter=express.Router();
let multer=require('multer');
let uploadController=require('../controller/upload.controller');
let upload=require('../middleware/multer.middleware')

imageRouter.post('/upload',upload.single('image'),uploadController.uploadImage);

module.exports=imageRouter;

