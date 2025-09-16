const Income = require('../models/Income');

// @desc    Create a new income
// @route   POST /api/income
// @access  Private
exports.createIncome = async (req, res) => {
  try {
    const { title, amount, source, date, description, isRecurring, recurringFrequency } = req.body;

    // Validate required fields
    if (!title || !amount || !source) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: {
          ...((!title) && { title: 'Title is required' }),
          ...((!amount) && { amount: 'Amount is required' }),
          ...((!source) && { source: 'Source is required' })
        }
      });
    }

    const income = await Income.create({
      user: req.user._id,
      title,
      amount,
      source,
      date: date || Date.now(),
      description,
      isRecurring,
      recurringFrequency
    });

    res.status(201).json(income);
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

// @desc    Get all income entries for a user
// @route   GET /api/income
// @access  Private
exports.getIncomes = async (req, res) => {
  try {
    const { year, month, source, startDate, endDate, sort, limit = 10, page = 1 } = req.query;
    const query = { user: req.user._id };
    
    // Filter by date range
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }
    
    // Filter by source
    if (source) {
      query.source = source;
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
    
    const incomes = await Income.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Income.countDocuments(query);
    
    res.json({
      incomes,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get income by ID
// @route   GET /api/income/:id
// @access  Private
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    // Check if income belongs to user
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this income' });
    }
    
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
exports.updateIncome = async (req, res) => {
  try {
    const { title, amount, source, date, description, isRecurring, recurringFrequency } = req.body;
    
    let income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    // Check if income belongs to user
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this income' });
    }
    
    income = await Income.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        source,
        date,
        description,
        isRecurring,
        recurringFrequency
      },
      { new: true, runValidators: true }
    );
    
    res.json(income);
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

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    // Check if income belongs to user
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this income' });
    }
    
    await Income.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Income removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get monthly income summary
// @route   GET /api/income/summary/monthly
// @access  Private
exports.getMonthlyIncomeSummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }
    
    const summary = await Income.getMonthlyIncome(req.user._id, year, month);
    
    // Calculate total income
    const totalIncome = summary.reduce((acc, curr) => acc + curr.totalAmount, 0);
    
    res.json({
      summary,
      totalIncome,
      year,
      month
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};