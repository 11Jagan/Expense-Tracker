const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide an expense title'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an expense amount'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Food', 'Groceries', 'Shopping', 'Transport', 'Entertainment', 'Utilities', 'Health and Fitness', 'Home rent or loan', 'Saving', 'Child Education', 'Medical', 'Transportation', 'Housing', 'Healthcare', 'Education', 'Investments', 'Savings', 'Gym', 'Personal', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly', 'None'],
    default: 'None'
  }
}, {
  timestamps: true
});

// Create index for faster queries by user and date
ExpenseSchema.index({ user: 1, date: -1 });

// Static method to get monthly expenses for a user
ExpenseSchema.statics.getMonthlyExpenses = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

module.exports = mongoose.model('Expense', ExpenseSchema);