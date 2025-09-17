import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import SummaryCards from '../components/dashboard/SummaryCards';
import { getExpenses } from '../api/expenseService';
import { getIncomes } from '../api/incomeService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    previousIncome: null,
    previousExpenses: null
  });
  const [loading, setLoading] = useState(false);
  const [expensesExpanded, setExpensesExpanded] = useState(false);
  const [incomesExpanded, setIncomesExpanded] = useState(false);
  const [expensesPeriod, setExpensesPeriod] = useState('weekly');
  const [incomesPeriod, setIncomesPeriod] = useState('weekly');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePos({ x: x * 20, y: y * 20 });
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, incomesRes] = await Promise.all([
        getExpenses(),
        getIncomes()
      ]);
      
      const expenses = expensesRes.expenses || [];
      const incomes = incomesRes.incomes || [];
      
      setData({
        totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
        previousIncome: null,
        previousExpenses: null,
        recentExpenses: expenses.sort((a, b) => new Date(b.date) - new Date(a.date)),
        recentIncomes: incomes.sort((a, b) => new Date(b.date) - new Date(a.date))
      });
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const netBalance = data.totalIncome - data.totalExpenses;
  const savingsRate = data.totalIncome > 0 ? ((netBalance / data.totalIncome) * 100).toFixed(1) : 0;

  const filterByPeriod = (transactions, period) => {
    const now = new Date();
    const filtered = transactions?.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      switch (period) {
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'monthly':
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        case 'yearly':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    }) || [];
    return filtered;
  };

  return (
    <MainLayout>
      <div ref={containerRef} className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen relative overflow-hidden">
        {/* 3D Background Elements */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0) rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * 0.1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-40 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-xl"></div>
        </div>
        {/* Header Section */}
        <div 
          className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg relative"
          style={{
            transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Financial Dashboard</h1>
              <p className="text-gray-600 flex items-center font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right bg-gray-100 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500 font-medium mb-1">Savings Rate</p>
              <p className="text-3xl font-bold text-gray-600">
                {savingsRate}%
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-8">
              <SummaryCards 
                totalIncome={data.totalIncome}
                totalExpenses={data.totalExpenses}
                previousIncome={data.previousIncome}
                previousExpenses={data.previousExpenses}
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
                <button 
                  onClick={() => navigate('/expenses')}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm transition-all duration-300 ease-out border-2 border-gray-100 group hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0) rotateX(${mousePos.y * 0.08}deg) rotateY(${mousePos.x * 0.08}deg)`,
                    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                  }}
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Add Expense</p>
                </button>
                
                <button 
                  onClick={() => navigate('/income')}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm transition-all duration-300 ease-out border-2 border-gray-100 group hover:-translate-y-2 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px, 0) rotateX(${mousePos.y * 0.06}deg) rotateY(${mousePos.x * 0.06}deg)`,
                    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                  }}
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Add Income</p>
                </button>
                
                <button 
                  onClick={() => navigate('/reports')}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm transition-all duration-300 ease-out border-2 border-gray-100 group hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.35}px, ${mousePos.y * 0.35}px, 0) rotateX(${mousePos.y * 0.07}deg) rotateY(${mousePos.x * 0.07}deg)`,
                    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                  }}
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">View Reports</p>
                </button>
                
                <button 
                  onClick={() => navigate('/budget')}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm transition-all duration-300 ease-out border-2 border-gray-100 group hover:-translate-y-2 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.28}px, ${mousePos.y * 0.28}px, 0) rotateX(${mousePos.y * 0.09}deg) rotateY(${mousePos.x * 0.09}deg)`,
                    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                  }}
                >
                  <div>
                    <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Set Budget</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ perspective: '1000px' }}>
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{
                  transform: `translate3d(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px, 0) rotateX(${mousePos.y * 0.03}deg) rotateY(${mousePos.x * 0.03}deg)`,
                  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                }}
              >
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                      Recent Expenses
                    </h2>
                    <select 
                      value={expensesPeriod} 
                      onChange={(e) => setExpensesPeriod(e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="p-4">
                  {filterByPeriod(data.recentExpenses, expensesPeriod).length === 0 ? (
                    <div className="text-center py-4">
                      <span className="text-2xl text-gray-400 mb-2 block">□</span>
                      <p className="text-sm text-gray-500">No expenses found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filterByPeriod(data.recentExpenses, expensesPeriod).slice(0, expensesExpanded ? 10 : 2).map((expense) => (
                        <div key={expense._id} className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-xs font-medium text-gray-900">{expense.category}</p>
                            <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-xs font-semibold text-gray-900">₹{expense.amount}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => navigate('/expenses')}
                      className="flex-1 bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View More
                    </button>
                    <button 
                      onClick={() => navigate('/expenses')}
                      className="bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Add New
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{
                  transform: `translate3d(${mousePos.x * 0.12}px, ${mousePos.y * 0.12}px, 0) rotateX(${mousePos.y * 0.04}deg) rotateY(${mousePos.x * 0.04}deg)`,
                  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                }}
              >
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                      Recent Income
                    </h2>
                    <select 
                      value={incomesPeriod} 
                      onChange={(e) => setIncomesPeriod(e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="p-4">
                  {filterByPeriod(data.recentIncomes, incomesPeriod).length === 0 ? (
                    <div className="text-center py-4">
                      <span className="text-2xl text-gray-400 mb-2 block">□</span>
                      <p className="text-sm text-gray-500">No income found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filterByPeriod(data.recentIncomes, incomesPeriod).slice(0, incomesExpanded ? 10 : 2).map((income) => (
                        <div key={income._id} className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-xs font-medium text-gray-900">{income.source}</p>
                            <p className="text-xs text-gray-500">{new Date(income.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-xs font-semibold text-gray-900">₹{income.amount}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => navigate('/income')}
                      className="flex-1 bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View More
                    </button>
                    <button 
                      onClick={() => navigate('/income')}
                      className="bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Add New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;