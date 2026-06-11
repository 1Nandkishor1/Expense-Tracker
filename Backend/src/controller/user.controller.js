let userModel=require('../model/user.model');
let jwt=require('jsonwebtoken');
let bcrypt=require('bcryptjs');
let redis=require('../config/redis.connnection')



async function  registerUser(req,res){
    let{name,email,password}=req.body;

    let isUserExist= await userModel.findOne({
        email:email
    })

    if(isUserExist){
        return res.status(400).json({
            message:'User already exist'
        })
    }

    let hashedPassword=bcrypt.hashSync(password,8);

    let user=await userModel.create({
        name:name,
        email:email,
        password:hashedPassword
    })

    let token=jwt.sign({
        id:user._id,
        email:user.email,
    },process.env.JWT_SECRET)

    // res.cookie('token', token);

    return res.status(201).json({
        message:'User registered successfully',
        userdata:{
        id:user._id,
        name:user.name,
        email:user.email,
        },
        token:token
    })

}

async function loginUser(req,res){
    let {email,password}=req.body;

    let isUserExist= await userModel.findOne({
        email:email
    }).select('+password')

    if(!isUserExist){
        return res.status(400).json({
            message:'User not exist'
        })
    }

    let isPasswordCorrect=bcrypt.compareSync(password,isUserExist.password);

    if(!isPasswordCorrect){
        return res.status(400).json({
            message:'Incorrect password'
        })
    }

    let token=jwt.sign({
        id:isUserExist._id,
        email:isUserExist.email,
    },process.env.JWT_SECRET)

    // res.cookie('token', token);

    return res.status(200).json({
        message:'User logged in successfully',
        logindata:{
         id:isUserExist._id,
        name:isUserExist.name,
        email:isUserExist.email,
        },
        token:token
    })
}

async function getMe(req,res){
    let user=await userModel.findById(req.user.id);

    if(!user){
        return res.status(404).json({
            message:'User not found'
        })
    }

    return res.status(200).json({
        message:'User details fetched successfully',
        userdata:{
        id:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar
        }
    })

}

async function logoutUser(req,res){
   let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({
            message: 'Token not provided'
        });
    }

    let token = authHeader.split(' ')[1];

    await redis.set(token, 'blacklisted');

    return res.status(200).json({
        message:'User logged out successfully'
    })

}






module.exports={
    registerUser,
    loginUser,
    getMe,
    logoutUser
}