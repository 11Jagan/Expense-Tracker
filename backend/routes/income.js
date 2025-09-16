const express = require('express');
const router = express.Router();
const { 
  createIncome, 
  getIncomes, 
  getIncomeById, 
  updateIncome, 
  deleteIncome, 
  getMonthlyIncomeSummary 
} = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get monthly income summary
router.get('/summary/monthly', getMonthlyIncomeSummary);

// CRUD operations for income
router.route('/')
  .post(createIncome)
  .get(getIncomes);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;