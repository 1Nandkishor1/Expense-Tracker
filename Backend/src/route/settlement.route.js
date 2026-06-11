
let express=require('express');
let settlementRouter=express.Router();
let authUser=require('../middleware/authuser.middleware');
let isMember=require('../middleware/ismember.middleware');
let settlementController=require('../controller/settlement.controller');
let upload=require('../middleware/multer.middleware')

settlementRouter.post('/:id',authUser.authUser,isMember.isMember,settlementController.createSettlement);

settlementRouter.get('/all/:id',authUser.authUser,isMember.isMember,settlementController.getGroupSettlements);

settlementRouter.patch('/confirm/:settlementId',authUser.authUser,settlementController.confirmSettlement);

settlementRouter.patch('/screenshot/:settlementId',authUser.authUser,upload.single('screenshot'),settlementController.uploadScreenshot);

module.exports=settlementRouter;