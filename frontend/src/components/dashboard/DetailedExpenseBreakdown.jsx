import React, { useState } from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { groupByCategory } from '../../utils/formatters';

const DetailedExpenseBreakdown = ({ expenses = [] }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Group expenses by category
  const expensesByCategory = groupByCategory(expenses);
  
  // Get total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  // Get categories sorted by amount (highest first)
  const sortedCategories = Object.keys(expensesByCategory).sort(
    (a, b) => expensesByCategory[b] - expensesByCategory[a]
  );
  
  // Get detailed expenses for a specific category
  const getDetailedExpenses = (category) => {
    return expenses.filter(expense => expense.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  // Toggle category expansion
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };
  
  if (expenses.length === 0) {
    return (
      <Card title="Detailed Expenditure Breakdown">
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">No expense data available</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Detailed Expenditure Breakdown">
      <div className="overflow-hidden">
        {sortedCategories.map(category => {
          const amount = expensesByCategory[category];
          const percentage = ((amount / totalExpenses) * 100).toFixed(1);
          const isExpanded = expandedCategory === category;
          const categoryExpenses = isExpanded ? getDetailedExpenses(category) : [];
          
          return (
            <div key={category} className="mb-4">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">{category}</span>
                  <span className="ml-2 text-sm text-gray-500">{percentage}%</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                  <svg 
                    className={`w-5 h-5 ml-2 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-2 pl-4 pr-2 animate-fadeIn">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoryExpenses.map(expense => (
                          <tr key={expense._id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{expense.title}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-3 py-2 text-sm font-medium text-gray-700">Total for {category}</td>
                          <td className="px-3 py-2 text-sm text-right font-bold">{formatCurrency(amount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">Total Expenditure</span>
            <span className="font-bold text-xl">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DetailedExpenseBreakdown;