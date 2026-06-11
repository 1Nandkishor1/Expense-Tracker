let groupModel=require('../model/group.model');
let groupMemberModel=require('../model/groupmember.model');

async function createGroup(req,res){
        let {name,description}=req.body;

        try{
            let group=await groupModel.create({
                name:name,
                description:description,
                createdBy:req.user.id
            })

            let groupMember=await groupMemberModel.create({
                group:group._id,
                user:req.user.id,
                role:'admin'
            })

            return res.status(201).json({
                message:'Group created successfully',
                group:group,
                groupMember:groupMember
            })
        }
        catch(err){
            return res.status(500).json({
                message:'Something went wrong',
                error:err.message
            })
        }

}

async function getMyGroups(req, res) {
  try {
    let memberships = await groupMemberModel.find({ user: req.user.id })
      .populate('group') // gets full group details

    let groups = memberships.map(m => m.group) // extract just the group objects

    return res.status(200).json({
      message: 'Groups fetched successfully',
      groups: groups
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message
    })
  }
}

async function getSingleGroup(req,res){
    try{
        let group=await groupModel.findById(req.params.id);
        if(!group){
            return res.status(404).json({
                message:'Group not found'
            })
        }

        let groupMembers=await groupMemberModel.find({
            group:req.params.id
        }).populate('user', 'name email avatar')  


        return res.status(200).json({
            message:'Group fetched successfully',
            group:{
                id:group._id,
                name:group.name,
                description:group.description,
                createdBy:group.createdBy,
                members:groupMembers
            }
        })

    }
    catch(err){
        return res.status(500).json({
            message:'Something went wrong',
            error:err.message
        })
    }

}

module.exports={
    createGroup,
    getMyGroups,
    getSingleGroup
}