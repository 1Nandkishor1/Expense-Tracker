
let express=require('express');
let inviteRouter=express.Router();
let inviteController=require('../controller/invite.controller');
let authUser=require('../middleware/authuser.middleware');

inviteRouter.get('/join/:token',authUser.authUser,inviteController.joinByLink);

inviteRouter.post('/invite/:groupId',authUser.authUser,inviteController.inviteByLink);

module.exports=inviteRouter;
