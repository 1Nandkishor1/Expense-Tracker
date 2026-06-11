
let express=require('express');
let profileRouter=express.Router();
let authUser=require('../middleware/authuser.middleware');
let profileController=require('../controller/profile.controller');
let upload=require('../middleware/multer.middleware')

profileRouter.get('/get',authUser.authUser,profileController.getProfile);

profileRouter.patch('/update',authUser.authUser,profileController.updateProfile);

profileRouter.patch('/avatar',authUser.authUser,upload.single('avatar'),profileController.uploadAvatar);


module.exports=profileRouter;