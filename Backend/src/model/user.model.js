
let mongoose=require('mongoose');
const { type } = require('node:os');

let userScehma=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,   
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    avatar:{
        url:{
            type:String,
        },
        fileId:{
            type:String,
        }
    }
},{ timestamps:true })

let userModel=mongoose.model('user',userScehma);

module.exports=userModel;
