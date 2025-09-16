import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { getExpenseCategories } from '../../api/expenseService';

const BudgetForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    category: initialData.category || '',
    amount: initialData.amount || '',
    month: initialData.month || new Date().getMonth() + 1,
    year: initialData.year || new Date().getFullYear(),
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const categories = getExpenseCategories();
  
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate years (current year and 2 years ahead)
  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, label: currentYear.toString() },
    { value: currentYear + 1, label: (currentYear + 1).toString() },
    { value: currentYear + 2, label: (currentYear + 2).toString() }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert amount to number
    const submittedData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Category"
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categories.map(category => ({ value: category, label: category }))}
        placeholder="Select a category"
        error={errors.category}
        required
      />

      <Input
        label="Budget Amount"
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Enter budget amount"
        error={errors.amount}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Month"
          id="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          options={months}
          error={errors.month}
          required
        />

        <Select
          label="Year"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          options={years}
          error={errors.year}
          required
        />
      </div>

      <div className="mt-6">
        <Button type="submit" variant="primary" fullWidth>
          {isEditing ? 'Update Budget' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;