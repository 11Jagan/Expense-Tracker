import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { validateTransactionForm } from '../../utils/validators';

const TransactionForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  type = 'expense', // 'expense' or 'income'
}) => {
  const defaultFormData = {
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: type === 'expense' ? '' : undefined,
    source: type === 'income' ? '' : undefined,
    description: '',
  };

  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });
  const [errors, setErrors] = useState({});

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      // Format date if it exists
      const formattedData = { ...initialData };
      if (formattedData.date) {
        formattedData.date = new Date(formattedData.date).toISOString().split('T')[0];
      }
      setFormData(formattedData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      const validation = validateTransactionForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      // Clear errors
      setErrors({});
      
      // Format data before submission
      const formattedData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        description: formData.description || '',
      };
      
      // Add type-specific fields
      if (type === 'expense') {
        formattedData.category = formData.category;
      } else {
        formattedData.source = formData.category; // Map category to source for income
      }
      
      // Submit form data
      await onSubmit(formattedData);
    } catch (error) {
      // Handle submission errors
      console.error('Form submission error:', error);
      if (error.errors) {
        // Set field-specific errors if available
        setErrors(error.errors);
      } else {
        // Set a generic error
        setErrors({ form: error.message || 'Failed to save. Please try again.' });
      }
    }
  };

  // Category options based on transaction type
  const categoryOptions = type === 'expense'
    ? [
        { value: 'Food', label: 'Food' },
        { value: 'Groceries', label: 'Groceries' },
        { value: 'Shopping', label: 'Shopping' },
        { value: 'Transport', label: 'Transport' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Utilities', label: 'Utilities (electricity, water, phone, internet)' },
        { value: 'Health and Fitness', label: 'Health and Fitness' },
        { value: 'Home rent or loan', label: 'Home rent or loan' },
        { value: 'Saving', label: 'Saving' },
      ]
    : [
        { value: 'Salary', label: 'Salary & Wages' },
        { value: 'Freelance', label: 'Freelance' },
        { value: 'Business', label: 'Business Income' },
        { value: 'Investment', label: 'Investment' },
        { value: 'Gift', label: 'Gift' },
        { value: 'Other', label: 'Other' },
      ];

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder={`Enter ${type} title`}
        error={errors.title}
        required
      />

      <Input
        label="Amount"
        type="number"
        id="amount"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="0.00"
        min="0.01"
        step="0.01"
        error={errors.amount}
        required
      />

      <Input
        label="Date"
        type="date"
        id="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <Select
        label="Category"
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categoryOptions}
        placeholder={`Select ${type} category`}
        error={errors.category}
        required
      />

      <Input
        label="Description"
        id="description"
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Add any additional description (optional)"
      />

      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;