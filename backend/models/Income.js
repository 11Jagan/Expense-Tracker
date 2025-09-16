const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide an income title'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an income amount'],
    min: [0, 'Amount cannot be negative']
  },
  source: {
    type: String,
    required: [true, 'Please provide a source'],
    enum: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
    default: 'Salary'
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
    default: true
  },
  recurringFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly', 'None'],
    default: 'Monthly'
  }
}, {
  timestamps: true
});

// Create index for faster queries by user and date
IncomeSchema.index({ user: 1, date: -1 });

// Static method to get monthly income for a user
IncomeSchema.statics.getMonthlyIncome = async function(userId, year, month) {
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
        _id: '$source',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

module.exports = mongoose.model('Income', IncomeSchema);