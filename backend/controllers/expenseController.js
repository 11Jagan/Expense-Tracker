const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description, isRecurring, recurringFrequency } = req.body;

    // Validate required fields
    if (!title || !amount || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: {
          ...((!title) && { title: 'Title is required' }),
          ...((!amount) && { amount: 'Amount is required' }),
          ...((!category) && { category: 'Category is required' })
        }
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      description,
      isRecurring,
      recurringFrequency
    });

    res.status(201).json(expense);
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { year, month, category, startDate, endDate, sort, limit = 10, page = 1 } = req.query;
    const query = { user: req.user._id };
    
    // Filter by date range
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Sort options
    const sortOptions = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortOptions[field.substring(1)] = -1;
        } else {
          sortOptions[field] = 1;
        }
      });
    } else {
      sortOptions.date = -1; // Default sort by date descending
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const expenses = await Expense.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Expense.countDocuments(query);
    
    res.json({
      expenses,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Check if expense belongs to user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this expense' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description, isRecurring, recurringFrequency } = req.body;
    
    let expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Check if expense belongs to user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this expense' });
    }
    
    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        category,
        date,
        description,
        isRecurring,
        recurringFrequency
      },
      { new: true, runValidators: true }
    );
    
    res.json(expense);
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Check if expense belongs to user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this expense' });
    }
    
    await Expense.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get monthly expense summary
// @route   GET /api/expenses/summary/monthly
// @access  Private
exports.getMonthlyExpenseSummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }
    
    const summary = await Expense.getMonthlyExpenses(req.user._id, year, month);
    
    // Calculate total expenses
    const totalExpenses = summary.reduce((acc, curr) => acc + curr.totalAmount, 0);
    
    // Get user's monthly income
    const user = await User.findById(req.user._id);
    const monthlyIncome = user.monthlyIncome;
    
    // Calculate remaining budget
    const remainingBudget = monthlyIncome - totalExpenses;
    
    res.json({
      summary,
      totalExpenses,
      monthlyIncome,
      remainingBudget,
      year,
      month
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};