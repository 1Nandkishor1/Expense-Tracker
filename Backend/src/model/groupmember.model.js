
let mongoose=require('mongoose');

let groupSchema=new mongoose.Schema({
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group',
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    role:{
        type:String,
        enum:['admin','member'],
        default:'member',
        required:true
    }

},{timestamp:true})

let groupMemberModel=mongoose.model('groupmember',groupSchema);

module.exports=groupMemberModel;