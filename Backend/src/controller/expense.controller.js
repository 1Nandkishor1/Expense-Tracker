let inviteModel = require("../model/invite.model");
let groupMemberModel = require("../model/groupmember.model");
let groupModel = require("../model/group.model");
let expenseModel = require("../model/expense.model");
let settlementModel=require('../model/settlement.model')

async function addExpense(req, res) {
  try {
    let groupId = req.params.id;
    let { description, category, amount, splitType, customSplits } = req.body;

    console.log(splitType)

    if (!amount || amount <= 0) {
      return res.status(403).json({
        message: "Amount Should be Greater than 0",
      });
    }

    let members = await groupMemberModel.find({ group: groupId });

    if (members.length == 1) {
      return res
        .status(400)
        .json({
          message: "Cannot add expense with only 1 member in the group",
        });
    }

    let splits = [];

    if (splitType == "equal") {
      let shareAmount = parseFloat((amount / members.length).toFixed(2));
      let totalAssigned = 0;

      splits = members.map((member, index) => {
        // console.log("member.user:", member.user.toString());
        //   console.log("req.user.id:", req.user.id);
          console.log(member.user.toString() == req.user.id ? "true" : "false");
        if (index == members.length - 1) {
          return {
            user: member.user,
            amount: parseFloat((amount - totalAssigned).toFixed(2)),
            isPaid: member.user == req.user.id ? "true" : "false",
          };
        }
        totalAssigned += shareAmount;

        return {
          user: member.user,
          amount: shareAmount,
          isPaid: member.user.toString() == req.user.id ? "true" : "false",
        };
      });
    } else if (splitType == "custom") {
      if (!customSplits || customSplits.length === 1) {
        return res.status(400).json({ message: "Custom splits are required" });
      }

      const totalSplit = customSplits.reduce(
        (sum, split) => sum + split.amount,
        0,
      );

      if (parseFloat(totalSplit.toFixed(2)) != parseFloat(amount.toFixed(2))) {
        return res.status(403).json({
          message: "Sum of splits must equal total amount ",
        });
      }
      let members = await groupMemberModel.find({ group: groupId });
      let membersId = members.map((member) => {
        return member.user.toString();
      });

      for (let split of customSplits) {
        if (!membersId.includes(split.user)) {
          return res.status(400).json({
            message: `user ${split.user} is not a member of this group`,
          });
        }
      }

      splits = customSplits.map((split) => {
        return {
          user: split.user,
          amount: split.amount,
          isPaid: split.user.toString() == req.user.id ? "true" : "false",
        };
      });
    }

    console.log(splits)

    let expense = await expenseModel.create({
      group: groupId,
      paidBy: req.user.id,
      description: description,
      category: category || "other",
      amount: amount,
      splits: splits,
    });

    await expense.populate("paidBy", "name eamil avatar");
    await expense.populate("splits.user", "name eamil avatar");

    return res.status(201).json({
      message: "EXpense added successfully",
      expense:expense,
    });
  } catch (err) {
    return res.status(403).json({
      message: "SOnthing went wrong",
      error: err.message,
    });
  }
}

async function getAllExpense(req,res){
    try{
    let groupId=req.params.id; 
    let expenses=await expenseModel.find({group:groupId})
    .populate('paidBy','user email avatar')
    .populate('splits.user','user email avatar')
    .sort({createdAt:-1})

    return res.status(200).json({
        message:"All Expenses Fetches Successfully",
        total:"expanses.length",
        expenses:expenses
    })
}
catch(err){
    return res.status(500).json({
        message:"Sometyhing went wrong",
        error:err.message
    })
}    

}

async function deleteExpense(req,res){
    try{
    let expenseId=req.params.expenseId;

    let isExpensed=await expenseModel.findById(expenseId);

    if(!isExpensed){
        return res.status(403).json({
            message:"Expense IS Required To Delte "
        })
    }
    const settledExists = await settlementModel.exists({
    group: isExpensed.group,
    isSettled: true
});

if (settledExists) {
    return res.status(400).json({
        message: "Cannot delete expenses after settlements have been made"
    });
}

    if(isExpensed.paidBy.toString()!=req.user.id){
        return res.status(403).json({
            message:"Expense Can Only Be Delted By The One Who Paid"
        })
    }


    let expense=await expenseModel.findByIdAndDelete(expenseId)

    return res.status(201).json({
        message:"Expensed Deleted Successfully",
        deleted:expense
    })
}
catch(err){
    return res.status(500).json({
        message:"Somehting Went Wrong",
        error:err.message
    })
}

}

module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense
};
