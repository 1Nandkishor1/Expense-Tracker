
let express=require('express');
let balanceRouter=express.Router();
let authuser=require('../middleware/authuser.middleware');
let isMember=require('../middleware/ismember.middleware');
let balanceController=require('../controller/balance.controller')

balanceRouter.get('/:id',authuser.authUser,isMember.isMember,balanceController.getGroupBalance)


module.exports=balanceRouter;