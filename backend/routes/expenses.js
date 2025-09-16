const express = require('express');
const router = express.Router();
const { 
  createExpense, 
  getExpenses, 
  getExpenseById, 
  updateExpense, 
  deleteExpense, 
  getMonthlyExpenseSummary 
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get monthly expense summary
router.get('/summary/monthly', getMonthlyExpenseSummary);

// CRUD operations for expenses
router.route('/')
  .post(createExpense)
  .get(getExpenses);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;