import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '../components/layout/MainLayout';
import BottomDrawer from '../components/ui/BottomDrawer';
import { getExpenses, createExpense, deleteExpense } from '../api/expenseService';

const EXPENSE_CATEGORIES = [
  { name: 'Food', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3M8 14V9a2 2 0 012-2h4a2 2 0 012 2v5M8 14h8m-4-8V4" /></svg> },
  { name: 'Groceries', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" /></svg> },
  { name: 'Shopping', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" /></svg> },
  { name: 'Transport', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
  { name: 'Entertainment', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1h10z" /></svg> },
  { name: 'Utilities', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
  { name: 'Health and Fitness', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { name: 'Home rent or loan', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { name: 'Saving', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  { name: 'Child Education', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
  { name: 'Medical', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expensesVisible, setExpensesVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('weekly');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses();
      setExpenses(response.expenses || []);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setAmount('');
    setDescription('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !selectedCategory) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await createExpense({
        title: selectedCategory.name,
        amount: parsedAmount,
        category: selectedCategory.name,
        description: description,
        date: new Date().toISOString()
      });
      toast.success('Expense added successfully');
      setSelectedCategory(null);
      setAmount('');
      setDescription('');
      setShowModal(false);
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const filterByPeriod = (expenses, period) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (period) {
        case 'weekly':
          const weekAgo = new Date(currentMonth.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expenseDate >= weekAgo && expenseDate.getMonth() === currentMonth.getMonth() && expenseDate.getFullYear() === currentMonth.getFullYear();
        case 'monthly':
          return expenseDate.getMonth() === currentMonth.getMonth() && expenseDate.getFullYear() === currentMonth.getFullYear();
        case 'yearly':
          return expenseDate.getFullYear() === currentMonth.getFullYear();
        default:
          return true;
      }
    });
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              ←
            </button>
            <span className="text-lg font-medium min-w-[120px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className={`p-2 rounded transition-colors ${
                currentMonth.getMonth() >= new Date().getMonth() && currentMonth.getFullYear() >= new Date().getFullYear()
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
              disabled={currentMonth.getMonth() >= new Date().getMonth() && currentMonth.getFullYear() >= new Date().getFullYear()}
            >
              →
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Select Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {EXPENSE_CATEGORIES.map((category) => {
              const totalSpent = expenses
                .filter(expense => {
                  const expenseDate = new Date(expense.date);
                  return expense.category === category.name &&
                         expenseDate.getMonth() === currentMonth.getMonth() &&
                         expenseDate.getFullYear() === currentMonth.getFullYear();
                })
                .reduce((sum, expense) => sum + expense.amount, 0);
              
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(category);
                    }
                  }}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 group relative overflow-hidden transform hover:scale-105"
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${category.name} category`}
                >
                  <div className="text-gray-600 mb-3 flex justify-center">{category.icon}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">₹{totalSpent}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer for adding expense */}
        <BottomDrawer 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
            setAmount('');
            setDescription('');
          }}
          title={selectedCategory ? `Add ${selectedCategory.name} Expense` : 'Add Expense'}
        >
          {selectedCategory && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="text-gray-600 mr-3">{selectedCategory.icon}</div>
                <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
              </div>
              
              <div>
                <label htmlFor="modal-amount" className="block text-sm font-medium mb-1">Amount</label>
                <input
                  id="modal-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border rounded-lg text-lg"
                  required
                  step="0.01"
                  min="0.01"
                  autoFocus
                />
              </div>
              
              <div>
                <label htmlFor="modal-description" className="block text-sm font-medium mb-1">Description (Optional)</label>
                <input
                  id="modal-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Add Expense
              </button>
            </form>
          )}
        </BottomDrawer>

        <div className="bg-white border rounded-lg mt-6">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Expenses</h2>
              <div className="flex items-center gap-2">
                <select 
                  value={filterPeriod} 
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <button
                  onClick={() => setExpensesVisible(!expensesVisible)}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                  aria-label={expensesVisible ? 'Hide expenses' : 'Show expenses'}
                >
                  {expensesVisible ? '▲' : '▼'}
                </button>
              </div>
            </div>
          </div>
          {expensesVisible && (
            <div className="p-4">
              {loading ? (
                <p>Loading...</p>
              ) : filterByPeriod(expenses, filterPeriod).length === 0 ? (
                <p>No expenses found for selected period</p>
              ) : (
                <div className="space-y-3">
                  {filterByPeriod(expenses, filterPeriod).map((expense) => (
                    <div key={expense._id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center">
                        <div className="text-gray-600 mr-3">
                          {EXPENSE_CATEGORIES.find(c => c.name === expense.category)?.icon || <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{expense.category}</h3>
                            <span className="text-sm text-gray-500">• {new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                          {expense.description && <p className="text-sm text-gray-600">{expense.description}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">₹{expense.amount}</p>
                        <button 
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-500 text-sm hover:underline"
                          aria-label="Delete expense"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Expenses;