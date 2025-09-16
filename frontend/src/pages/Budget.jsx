import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '../components/layout/MainLayout';
import BottomDrawer from '../components/ui/BottomDrawer';
import { getExpenses } from '../api/expenseService';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const categories = [
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

  const fetchData = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.expenses || []);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchData();
    // Load budgets from localStorage
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || !budgetAmount) return;

    const parsedAmount = parseFloat(budgetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    const newBudget = {
      id: Date.now(),
      category: selectedCategory,
      amount: parsedAmount,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };

    const updatedBudgets = budgets.filter(b => 
      !(b.category === selectedCategory && b.month === newBudget.month && b.year === newBudget.year)
    );
    updatedBudgets.push(newBudget);

    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
    
    setSelectedCategory('');
    setBudgetAmount('');
    setShowForm(false);
    toast.success('Budget set successfully');
  };

  const getCurrentMonthSpent = (category) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expense.category === category && 
               expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBudgetForCategory = (category) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return budgets.find(b => 
      b.category === category && 
      b.month === currentMonth && 
      b.year === currentYear
    );
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'Over Budget!';
    if (percentage >= 90) return 'Almost Over!';
    if (percentage >= 70) return 'Watch Spending';
    return 'On Track';
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Budget</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Set Budget'}
          </button>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const budget = getBudgetForCategory(category.name);
            const spent = getCurrentMonthSpent(category.name);
            
            if (!budget && spent === 0) return null;
            
            return (
              <div key={category.name} className="bg-white border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-gray-600 mr-3">{category.icon}</div>
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Spent: ₹{spent}</span>
                    <span>Budget: ₹{budget?.amount || 0}</span>
                  </div>
                  
                  {budget && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getProgressColor(spent, budget.amount)}`}
                          style={{ width: `${Math.min((spent / budget.amount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          ₹{Math.max(budget.amount - spent, 0)} remaining
                        </p>
                        <span className={`text-sm font-medium ${
                          spent >= budget.amount ? 'text-red-600' : 
                          spent >= budget.amount * 0.9 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getStatusText(spent, budget.amount)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {!budget && spent > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">No budget set</p>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowForm(true);
                        }}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Set Budget
                      </button>
                    </div>
                  )}
                  
                  {budget && (
                    <button
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setBudgetAmount(budget.amount.toString());
                        setShowForm(true);
                      }}
                      className="w-full text-blue-600 text-sm hover:underline mt-2"
                    >
                      Update Budget
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Form Bottom Drawer */}
      <BottomDrawer 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title="Set Monthly Budget"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Budget amount"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
            step="0.01"
            min="0.01"
          />
          
          <div className="flex space-x-2">
            <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Set Budget
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </BottomDrawer>
    </MainLayout>
  );
};

export default Budget;