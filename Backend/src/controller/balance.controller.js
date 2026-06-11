let expenseModel = require("../model/expense.model");
let groupMemberModel = require("../model/groupmember.model");
let userModel = require("../model/user.model");
let settlementModel = require("../model/settlement.model");

async function getGroupBalance(req, res) {
  try {
    let groupId = req.params.id;

    console.log("check1");

    // let expense=await expenseModel.findOne({group:groupId})
    // if(!expense){
    //   return res.status(401).json({
    //     message: "Expense Is Required For Balance Data",
    //   });
    // }

    let allexpense = await expenseModel.find({ group: groupId });
    let settlements = await settlementModel.find({
      group: groupId,
      isSettled: true,
    });

    if (!allexpense) {
      return res.status(401).json({
        message: "Expense Is Required For Balance Data",
      });
    }

    let balanceMap = {};

    for (let expense of allexpense) {
      const paidBy = expense.paidBy.toString();
      if (!balanceMap[paidBy]) balanceMap[paidBy] = 0;
      balanceMap[paidBy] += expense.amount;

      for (let split of expense.splits) {
        const userId = split.user.toString();
        if (!balanceMap[userId]) balanceMap[userId] = 0;
        balanceMap[userId] -= split.amount;
      }
    }
    for (let settlement of settlements) {
      const paidBy = settlement.paidBy.toString();
      const paidTo = settlement.paidTo.toString();

      if (!balanceMap[paidBy]) balanceMap[paidBy] = 0;
      if (!balanceMap[paidTo]) balanceMap[paidTo] = 0;

      balanceMap[paidBy] += settlement.amount; // debtor's debt reduces
      balanceMap[paidTo] -= settlement.amount; // creditor's credit reduces
    }

    let creditors = [];
    let debtors = [];

    for (let [userId, amount] of Object.entries(balanceMap)) {
      if (amount > 0.01) {
        creditors.push({ userId, amount });
      }
      if (amount < -0.01) {
        debtors.push({ userId, amount: Math.abs(amount) });
      }
    }
    console.log("check3");

    let transcation = [];

    let i = 0;
    let j = 0;

    creditors.sort((a, b) => {
      return b.amount - a.amount;
    });
    debtors.sort((a, b) => {
      return b.amount - a.amount;
    });

    while (i < creditors.length && j < debtors.length) {
      let creditor = creditors[i];
      let debtor = debtors[j];

      let settleAmount = Math.min(creditor.amount, debtor.amount);

      transcation.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: settleAmount,
      });

      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      if (creditor.amount < 0.01) {
        i++;
      }
      if (debtor.amount < 0.01) {
        j++;
      }
    }
    console.log("check4");
    await Promise.all(
      transcation.map(async (t) => {
        let from = await userModel.findById(t.from, "name email avatar");
        let to = await userModel.findById(t.to, "name email avatar");
        ((t.from = from), (t.to = to));
      }),
    );
    console.log("check5");
    return res.status(200).json({
      message: "Balance Calculated SuccessFully",
      balance: balanceMap,
      settlements: transcation,
    });
    console.log("check6");
  } catch (err) {
    return res.status(500).json({
      message: "Sonthing Went Wrong",
      error: err.message,
    });
  }
}

module.exports = { getGroupBalance };
