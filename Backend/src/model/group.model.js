
let mongoose=require('mongoose');

let groupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }


},{timestamps:true})

let groupModel=mongoose.model('group',groupSchema);

module.exports=groupModel;