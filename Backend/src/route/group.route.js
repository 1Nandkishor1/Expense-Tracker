
let express=require('express');
let authUser=require('../middleware/authuser.middleware');
let groupRouter=express.Router();
let groupController=require('../controller/group.controller');
let isMember=require('../middleware/ismember.middleware')

groupRouter.post('/create',authUser.authUser,groupController.createGroup)

groupRouter.get('/mygroups',authUser.authUser,groupController.getMyGroups);

groupRouter.get('/groupmember/:id', authUser.authUser,isMember.isMember,groupController.getSingleGroup);

module.exports=groupRouter;