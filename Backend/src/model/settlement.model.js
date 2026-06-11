
let mongoose=require('mongoose');

const settlementSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  paidTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  screenshot: {
    url: { type: String, default: "" },
    fileId: { type: String, default: "" }
  },
  isSettled: { type: Boolean, default: false }
}, { timestamps: true })

 let settlementModel=mongoose.model("Settlement", settlementSchema);

 module.exports=settlementModel;

