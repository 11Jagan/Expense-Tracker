import api from './config';

// Create a new income entry
export const createIncome = async (incomeData) => {
  try {
    const response = await api.post('/income', incomeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create income entry' };
  }
};

// Get all income entries with optional filters
export const getIncomes = async (filters = {}) => {
  try {
    const response = await api.get('/income', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch income entries' };
  }
};

// Get income by ID
export const getIncomeById = async (id) => {
  try {
    const response = await api.get(`/income/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch income details' };
  }
};

// Update income
export const updateIncome = async (id, incomeData) => {
  try {
    const response = await api.put(`/income/${id}`, incomeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update income entry' };
  }
};

// Delete income
export const deleteIncome = async (id) => {
  try {
    const response = await api.delete(`/income/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete income entry' };
  }
};

// Get monthly income summary
export const getMonthlyIncomeSummary = async (year, month) => {
  try {
    const response = await api.get('/income/summary/monthly', {
      params: { year, month }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch income summary' };
  }
};