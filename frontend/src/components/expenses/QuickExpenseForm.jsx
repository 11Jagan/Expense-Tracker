import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import ModernButton from '../modern/ModernButton';
import Input from '../common/Input';

const QuickExpenseForm = ({ category, onSubmit, onBack, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: category.id,
      amount: parseFloat(formData.amount)
    });
  };

  const Icon = category.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <FiArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${category.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
            <p className="text-sm text-slate-500">Add new expense</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder={`Enter ${category.name.toLowerCase()} expense`}
          required
        />
        
        <Input
          label="Amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          placeholder="0.00"
          required
        />
        
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required
        />
        
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Optional description"
        />

        <ModernButton type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Expense'}
        </ModernButton>
      </form>
    </div>
  );
};

export default QuickExpenseForm;