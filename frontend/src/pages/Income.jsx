import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '../components/layout/MainLayout';
import BottomDrawer from '../components/ui/BottomDrawer';
import { getIncomes, createIncome, deleteIncome } from '../api/incomeService';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [incomesVisible, setIncomesVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('weekly');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const categories = [
    { name: 'Salary', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> },
    { name: 'Freelance', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { name: 'Business', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { name: 'Investment', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
    { name: 'Gift', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> },
    { name: 'Other', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> }
  ];

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await getIncomes();
      setIncomes(response.incomes || []);
    } catch (error) {
      toast.error('Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
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
      await createIncome({
        title: selectedCategory.name,
        amount: parsedAmount,
        source: selectedCategory.name,
        description: description,
        date: new Date().toISOString()
      });
      toast.success('Income added successfully');
      setSelectedCategory(null);
      setAmount('');
      setDescription('');
      setShowModal(false);
      fetchIncomes();
    } catch (error) {
      toast.error('Failed to save income');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this income?')) {
      try {
        await deleteIncome(id);
        toast.success('Income deleted');
        fetchIncomes();
      } catch (error) {
        toast.error('Failed to delete income');
      }
    }
  };

  const filterByPeriod = (incomes, period) => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      switch (period) {
        case 'weekly':
          const weekAgo = new Date(currentMonth.getTime() - 7 * 24 * 60 * 60 * 1000);
          return incomeDate >= weekAgo && incomeDate.getMonth() === currentMonth.getMonth() && incomeDate.getFullYear() === currentMonth.getFullYear();
        case 'monthly':
          return incomeDate.getMonth() === currentMonth.getMonth() && incomeDate.getFullYear() === currentMonth.getFullYear();
        case 'yearly':
          return incomeDate.getFullYear() === currentMonth.getFullYear();
        default:
          return true;
      }
    });
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Income</h1>
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
            {categories.map((category) => {
              const totalEarned = incomes
                .filter(income => {
                  const incomeDate = new Date(income.date);
                  return income.source === category.name &&
                         incomeDate.getMonth() === currentMonth.getMonth() &&
                         incomeDate.getFullYear() === currentMonth.getFullYear();
                })
                .reduce((sum, income) => sum + income.amount, 0);
              
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 group relative overflow-hidden transform hover:scale-105"
                >
                  <div className="text-gray-600 mb-3 flex justify-center">{category.icon}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">₹{totalEarned}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer for adding income */}
        <BottomDrawer 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
            setAmount('');
            setDescription('');
          }}
          title={selectedCategory ? `Add ${selectedCategory.name} Income` : 'Add Income'}
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
                Add Income
              </button>
            </form>
          )}
        </BottomDrawer>

        <div className="bg-white border rounded-lg mt-6">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Income</h2>
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
                  onClick={() => setIncomesVisible(!incomesVisible)}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                  aria-label={incomesVisible ? 'Hide income' : 'Show income'}
                >
                  {incomesVisible ? '▲' : '▼'}
                </button>
              </div>
            </div>
          </div>
          {incomesVisible && (
            <div className="p-4">
              {loading ? (
                <p>Loading...</p>
              ) : filterByPeriod(incomes, filterPeriod).length === 0 ? (
                <p>No income found for selected period</p>
              ) : (
                <div className="space-y-3">
                  {filterByPeriod(incomes, filterPeriod).map((income) => (
                    <div key={income._id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center">
                        <div className="text-gray-600 mr-3">
                          {categories.find(c => c.name === income.source)?.icon || <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{income.source}</h3>
                            <span className="text-sm text-gray-500">• {new Date(income.date).toLocaleDateString()}</span>
                          </div>
                          {income.description && <p className="text-sm text-gray-600">{income.description}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-600">₹{income.amount}</p>
                        <button 
                          onClick={() => handleDelete(income._id)}
                          className="text-red-500 text-sm hover:underline"
                          aria-label="Delete income"
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

export default Income;