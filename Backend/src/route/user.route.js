
let express=require('express');
let router=express.Router();
let userModel=require('../model/user.model');
let userController=require('../controller/user.controller');
let authUser=require('../middleware/authuser.middleware');
let redis=require('../config/redis.connnection')

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/getme',authUser.authUser,userController.getMe);

router.post('/logout',authUser.authUser,userController.logoutUser);

module.exports=router;