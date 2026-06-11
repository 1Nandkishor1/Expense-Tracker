
let mongoose=require('mongoose');

let splitSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    isPaid:{
        type:String,
        required:true
    }

},{_id:false})

let expenseSchema=new mongoose.Schema({
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group',
        required:true,
    },
    paidBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        enum:['food','travel','shopping','bills','entertainment','other'],
        default:'other',
    },
    amount:{
        type:Number,
        required:true,

    },
    splits:[splitSchema]
},{timestamps:true})

let expenseModel=mongoose.model('expense',expenseSchema);

module.exports=expenseModel;