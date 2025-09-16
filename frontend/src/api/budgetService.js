import api from './config';

// Create a new budget
export const createBudget = async (budgetData) => {
  try {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create budget' };
  }
};

// Get all budgets
export const getBudgets = async (filters = {}) => {
  try {
    const response = await api.get('/budgets', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budgets' };
  }
};

// Get budgets by month and year
export const getBudgetsByMonth = async (month, year) => {
  try {
    const response = await api.get('/budgets', {
      params: { month, year }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budgets for the month' };
  }
};

// Get budget by ID
export const getBudgetById = async (id) => {
  try {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budget details' };
  }
};

// Update budget
export const updateBudget = async (id, budgetData) => {
  try {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update budget' };
  }
};

// Delete budget
export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete budget' };
  }
};

// Get budget summary with spending comparison
export const getBudgetSummary = async (month, year) => {
  try {
    const response = await api.get('/budgets/summary', {
      params: { month, year }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budget summary' };
  }
};