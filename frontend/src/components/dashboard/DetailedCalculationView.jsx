import React, { useState } from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

const DetailedCalculationView = ({ expenses = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get all unique categories
  const categories = ['all', ...new Set(expenses.map(expense => expense.category))];
  
  // Filter expenses by selected category
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory);
  
  // Calculate filtered total
  const filteredTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate percentage of each expense relative to filtered total
  const calculatePercentage = (amount) => {
    if (filteredTotal === 0) return 0;
    return ((amount / filteredTotal) * 100).toFixed(2);
  };
  
  // Calculate rupee breakdown (how much of each rupee goes to this expense)
  const calculateRupeeBreakdown = (amount) => {
    if (totalExpenses === 0) return 0;
    return (amount / totalExpenses).toFixed(3);
  };
  
  if (expenses.length === 0) {
    return (
      <Card title="Detailed Calculation View">
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">No expense data available</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Detailed Calculation View">
      <div className="mb-4">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Category
        </label>
        <select
          id="category-filter"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {selectedCategory === 'all' ? 'All Expenses' : selectedCategory} Summary
        </h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Total Amount:</span>
            <span className="text-sm font-bold">{formatCurrency(filteredTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Percentage of All Expenses:</span>
            <span className="text-sm font-bold">
              {((filteredTotal / totalExpenses) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-3 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-3 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Selection</th>
              <th className="px-3 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">₹ per Rupee</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map(expense => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{expense.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  {calculatePercentage(expense.amount)}%
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  ₹{calculateRupeeBreakdown(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan="2" className="px-3 py-2 text-sm font-medium text-gray-700">Total</td>
              <td className="px-3 py-2 text-sm text-right font-bold">{formatCurrency(filteredTotal)}</td>
              <td className="px-3 py-2 text-sm text-right font-bold">100%</td>
              <td className="px-3 py-2 text-sm text-right font-bold">
                ₹{(filteredTotal / totalExpenses).toFixed(3)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Rupee Breakdown</h3>
        <p className="text-sm text-gray-600 mb-3">
          For every rupee you spend, here's how it's distributed across your expenses:
        </p>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex h-8">
            {categories
              .filter(category => category !== 'all')
              .map(category => {
                const categoryExpenses = expenses.filter(e => e.category === category);
                const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                const percentage = (categoryTotal / totalExpenses) * 100;
                
                if (percentage < 1) return null; // Don't show very small segments
                
                return (
                  <div 
                    key={category}
                    className="h-full tooltip"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getColorForCategory(category),
                    }}
                    title={`${category}: ${percentage.toFixed(1)}%`}
                  />
                );
              })}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
            {categories
              .filter(category => category !== 'all')
              .map(category => {
                const categoryExpenses = expenses.filter(e => e.category === category);
                const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                const percentage = (categoryTotal / totalExpenses) * 100;
                
                if (percentage < 1) return null; // Don't show very small segments
                
                return (
                  <div key={category} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getColorForCategory(category) }}
                    />
                    <span className="text-xs">
                      {category}: ₹{(categoryTotal / totalExpenses).toFixed(2)} per rupee
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Helper function to get a color for a category
const getColorForCategory = (category) => {
  const colors = {
    Food: '#FF6384',
    Transportation: '#36A2EB',
    Housing: '#FFCE56',
    Utilities: '#4BC0C0',
    Entertainment: '#9966FF',
    Healthcare: '#FF9F40',
    Education: '#C9CBCF',
    Shopping: '#7BC043',
    Investments: '#00A170',
    Savings: '#0094C6',
    Gym: '#EF767A',
    Personal: '#F37735',
    Other: '#8D8D8D',
  };
  
  return colors[category] || '#8D8D8D';
};

export default DetailedCalculationView;