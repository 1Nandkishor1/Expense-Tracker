
let express=require('express')
let expenseRouter=express.Router();
let authUser=require('../middleware/authuser.middleware');
let isMember=require('../middleware/ismember.middleware');
let expenseController=require('../controller/expense.controller')

expenseRouter.post('/add/:id',authUser.authUser,isMember.isMember,expenseController.addExpense);

expenseRouter.get('/get/:id',authUser.authUser,isMember.isMember,expenseController.getAllExpense);

expenseRouter.delete('/remove/:expenseId',authUser.authUser,expenseController.deleteExpense);





module.exports=expenseRouter;