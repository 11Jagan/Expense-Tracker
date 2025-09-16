/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (default: 'short')
 * @returns {string} The formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    monthYear: { month: 'long', year: 'numeric' }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'INR')
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculate the percentage change between two numbers
 * @param {number} current - The current value
 * @param {number} previous - The previous value
 * @returns {string} The percentage change with sign
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous) return '+100%'; // If previous is 0 or null, assume 100% increase
  
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

/**
 * Group an array of transactions by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with categories as keys and sum as values
 */
export const groupByCategory = (transactions) => {
  if (!transactions || !transactions.length) return {};
  
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});
};