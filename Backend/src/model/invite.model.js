
let mongoose=require('mongoose');

let inviteSchema=new mongoose.Schema({
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group',
        requred:true,
    },
    token:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        default:"",
    },
    type:{
        type:String,
        enum:["email","qr","link"],
         default:"email",

    },
    expiresAt:{
        type:Date,
        required:true,
    }
},{timestamps:true})

let inviteModel=mongoose.model('invite',inviteSchema);

module.exports=inviteModel;