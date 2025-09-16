import api from './config';

// Get expense categories
export const getExpenseCategories = async () => {
  try {
    const response = await api.get('/expenses/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch expense categories' };
  }
};

// Create a new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create expense' };
  }
};

// Get all expenses with optional filters
export const getExpenses = async (filters = {}) => {
  try {
    const response = await api.get('/expenses', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch expenses' };
  }
};

// Get expense by ID
export const getExpenseById = async (id) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch expense details' };
  }
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update expense' };
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete expense' };
  }
};

// Get monthly expense summary
export const getMonthlyExpenseSummary = async (year, month) => {
  try {
    const response = await api.get('/expenses/summary/monthly', {
      params: { year, month }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch expense summary' };
  }
};