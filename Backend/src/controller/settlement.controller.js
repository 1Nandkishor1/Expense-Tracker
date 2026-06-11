
let settlementModel=require('../model/settlement.model');
let groupMemberModel=require('../model/groupmember.model');
let Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

async function createSettlement(req,res){
    try{
    let groupId=req.params.id;
    let {paidTo,amount}=req.body;

    let ispaidToExist=await groupMemberModel.findOne({
        group:groupId,
        user:paidTo
    })

    if(!ispaidToExist){
        return res.status(400).json({
            message:"The User You Want To Paid Do Not Exist"
        })
    }

    if(paidTo==req.user.id){
        return res.status(400).json({
            message:"You Can Not Do Settlement By Your Own"
        })
    }

    let isSettled=await settlementModel.findOne({
        group:groupId,
        paidTo:paidTo,
        amount:amount,
        paidBy:req.user.id,
        isSettled:'true'
    })
console.log('check1');
    if(isSettled){
        return res.status(400).json({
            message:"Settlement is Already Done"
        })
    }

    let settlement=await settlementModel.create({
        group:groupId,
        paidBy:req.user.id,
        paidTo:paidTo,
        amount:amount,
        isSettled:'false'
    })
console.log('check2');
    await settlement.populate('paidBy','name email avatar')
    await settlement.populate('paidTo','name email avatar')

    return res.status(201).json({
        message:"Request For Settlement Is Suceessful",
        settlement:settlement
    })
}
catch(err){
    return res.status(500).json({
        message:"Something Went Wrong",
        error:err.message
    })
}





}

async function getGroupSettlements(req,res){
    try{
    let groupId=req.params.id;

    let settlements=await settlementModel.find({group:groupId})
    .populate('paidBy','name email avatar')
    .populate('paidTo','name email avatar')
    .sort({createdAt:-1})

    return res.status(200).json({
        message:"All Settlements Fetched Successfully",
        settlements:settlements
    })
}
catch(err){
    return res.status(500).json({
        message:"Something Went Wrong",
        error:err.message
    })
}



}

async function confirmSettlement(req,res){
    try{
    let settlementId=req.params.settlementId;

    let settlement=await settlementModel.findById(settlementId)

    if(!settlement){
        return res.status(400).json({
            message:"Settlement Not Found"
        })
    }

    if(settlement.paidTo!=req.user.id){
        return res.status(403).json({
            message:"Only The Receiver Can Conform The Settlement "
        })
    }

    if(settlement.isSettled=='true'){
        return res.status(400).json({
            message:"The Settlement Is Already Confirmed"
        })
    }

   settlement.isSettled=true;
   await settlement.save();

   return res.status(200).json({
     message:"Settlement Confirmed Successfully",
     settlement:settlement
   })
}
catch(err){
    return res.status(500).json({
        message:"Something Went Wrong",
        error:err.message
    })
}


}

async function uploadScreenshot(req,res){
    let imagekit = new Imagekit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });

    let settlementId=req.params.settlementId;

    let settlement=await settlementModel.findById(settlementId);

    if(!settlement){
        return res.status(400).json({
            message:"Settlement Is Required To upload Screenshot"
        })
    }

    if(!req.file){
        return res.status(400).json({
            message:"No File Uploaded"
        })
    }

    if(settlement.paidBy.toString()!=req.user.id){
        return res.status(403).json({
            message:"Only The User Who Paid Can Upload Screenshot"
        })
    }

    if(settlement.screenshot.fileId){
        await imagekit.deleteFile(settlement.screenshot.fileId)
    }

    let response=await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
        fileName:`settlement_${settlementId}_${Date.now()}`,
        folder:'/settlements'
    })

    settlement.screenshot.url=response.url;
    settlement.screenshot.fileId=response.fileId
    await settlement.save()

    return res.status(201).json({
        message:"Screenshot Uploaded Successfully",
        screenshot:settlement.screenshot
    })

}

module.exports={
    createSettlement,
    getGroupSettlements,
    confirmSettlement,
    uploadScreenshot
}