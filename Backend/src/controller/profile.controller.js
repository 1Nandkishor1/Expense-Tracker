
let userModel=require('../model/user.model');
let Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

async function getProfile(req,res){
    try{
    let isUserExist=await userModel.findById(req.user.id).select('-password');

    if(!isUserExist){
        return res.status(400).json({
            message:"User Do Not Exist"
        })
    }
    
    return res.status(200).json({
        message:"Profile Data Fetched Successfully",
        profile:isUserExist
    })
}
catch(err){
    return res.status(500).json({
        message:"Something went wrong",
        error:err.message
    })
}

}

async function updateProfile(req,res){
    try{
    let isProfileExist=await userModel.findById(req.user.id).select('-password');
    let{name,email}=req.body;
    
    if(!isProfileExist){
        return res.status(400).json({
            message:"Profile Is Required To Update"
        })
    }

    if(email){
        let isEmailExist=await userModel.findOne({email:email})
        if(isEmailExist && isEmailExist._id.toString()!=req.user.id){
            return res.status(400).json({
                message:"User Already in Use"
            })
        }
    }

    let user=await userModel.findByIdAndUpdate(req.user.id,
        {name,email},
        {new:true}
    ).select('-password')

    return res.status(201).json({
        message:"Profile Updated Successfully",
        profile:user
    })
}
catch(err){
    return res.status(500).json({
        message:"Sonthing Went Wrong",
        error:err.message
    })
}

}

async function uploadAvatar(req,res){
    try{
    let imagekit = new Imagekit({
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        });

    if(!req.file){
        return res.status(500).json({
            message:"File Not Uploaded"
        })
    }

    let user=await userModel.findById(req.user.id);

    if(!user){
        return res.status(400).json({
            message:"User Not Found"
        })
    }
    if(user.avatar.fileId){
        await imagekit.deleteFile(user.avatar.fileId)
    }

    let upload=await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
        fileName:`avatar_${req.user.id}_${Date.now()}`,
        folder:'/avatars'
    })

    user.avatar.url = upload.url;
    user.avatar.fileId = upload.fileId;
    await user.save()

    return res.status(201).json({
        message:"Avatar Added Successfully",
        avatar:user.avatar
        
    })
}
catch(err){
    return res.status(500).json({
        message:"Sonthing Went Wrong",
        error:err.message
    })
}

}

module.exports={
    getProfile,
    updateProfile,
    uploadAvatar
}