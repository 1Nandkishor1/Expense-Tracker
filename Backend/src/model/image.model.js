
let mongoose=require('mongoose');

let imageSchema=new mongoose.Schema({
    url:{
        type:String,
        required:[true,"image url is required"],
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,"User Id Is Required To Be Associated With Image"],
    }
})

let imageModel=mongoose.model('image',imageSchema);

module.exports=imageModel;