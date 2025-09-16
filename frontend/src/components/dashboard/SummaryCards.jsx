import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Card, CardContent } from '../ui/card';
import { calculatePercentageChange } from '../../utils/formatters';

const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

const SummaryCard = ({ title, amount, previousAmount, icon, color }) => {
  const percentChange = previousAmount !== null ? calculatePercentageChange(amount, previousAmount) : null;
  const isPositive = percentChange && percentChange.startsWith('+');
  
  // Map color to Tailwind CSS classes
  const getColorClasses = () => {
    switch(color) {
      case 'gray':
      default:
        return {
          icon: 'bg-gray-100 text-gray-600',
          positive: 'text-gray-600',
          negative: 'text-gray-600'
        };
    }
  };
  
  const colorClasses = getColorClasses();
  
  return (
    <Card className="h-full border-2 border-gray-100 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(amount)}</p>
            
            {percentChange && (
              <div className="mt-1 flex items-center">
                {isPositive ? (
                  <FiArrowUp className={`mr-1 h-4 w-4 ${isPositive ? colorClasses.positive : colorClasses.negative}`} />
                ) : (
                  <FiArrowDown className={`mr-1 h-4 w-4 ${!isPositive ? colorClasses.positive : colorClasses.negative}`} />
                )}
                <span 
                  className={`text-sm font-medium ${isPositive ? colorClasses.positive : colorClasses.negative}`}
                >
                  {percentChange}
                </span>
                <span className="ml-1 text-sm text-gray-600">vs last month</span>
              </div>
            )}
          </div>
          <div className={`rounded-md p-3 ${colorClasses.icon.split(' ')[0]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SummaryCards = ({ 
  totalIncome = 0, 
  totalExpenses = 0, 
  previousIncome = null, 
  previousExpenses = null 
}) => {
  const balance = totalIncome - totalExpenses;
  const previousBalance = previousIncome !== null && previousExpenses !== null 
    ? previousIncome - previousExpenses 
    : null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        title="Total Income"
        amount={totalIncome}
        previousAmount={previousIncome}
        icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
        color="gray"
      />
      
      <SummaryCard
        title="Total Expenses"
        amount={totalExpenses}
        previousAmount={previousExpenses}
        icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
        color="gray"
      />
      
      <SummaryCard
        title="Current Balance"
        amount={balance}
        previousAmount={previousBalance}
        icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        color="gray"
      />
    </div>
  );
};

export default SummaryCards;