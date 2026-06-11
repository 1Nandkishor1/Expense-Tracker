let groupMemberModel=require('../model/groupmember.model');
async function isMember(req,res,next) {
    let member=await groupMemberModel.findOne({
        group:req.params.id,
        user:req.user.id    
    })

    if(!member){
        return res.status(403).json({
            message:"You are not a member of this group"
        })
    }

    req.member=member;
    next();
}

module.exports={isMember}