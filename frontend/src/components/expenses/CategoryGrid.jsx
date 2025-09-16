import React from 'react';
import { FiShoppingCart, FiZap, FiShoppingBag, FiTruck, FiMusic, FiHome, FiPiggyBank, FiHeart, FiMoreHorizontal } from 'react-icons/fi';

const CategoryGrid = ({ onCategorySelect }) => {
  const categories = [
    { id: 'Food', name: 'Groceries', icon: FiShoppingCart, color: 'bg-green-50 text-green-600', border: 'border-green-200' },
    { id: 'Utilities', name: 'Electricity Bill', icon: FiZap, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200' },
    { id: 'Shopping', name: 'Shopping', icon: FiShoppingBag, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
    { id: 'Transportation', name: 'Transport', icon: FiTruck, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
    { id: 'Entertainment', name: 'Entertainment', icon: FiMusic, color: 'bg-pink-50 text-pink-600', border: 'border-pink-200' },
    { id: 'Housing', name: 'Rent & Loans', icon: FiHome, color: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
    { id: 'Savings', name: 'Savings', icon: FiPiggyBank, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
    { id: 'Healthcare', name: 'Health & Fitness', icon: FiHeart, color: 'bg-red-50 text-red-600', border: 'border-red-200' },
    { id: 'Other', name: 'Other', icon: FiMoreHorizontal, color: 'bg-gray-50 text-gray-600', border: 'border-gray-200' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className={`p-6 rounded-xl border-2 ${category.border} ${category.color} hover:shadow-md transition-all duration-200 hover:scale-105 group`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-lg bg-white/50 group-hover:bg-white/80 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <span className="font-medium text-sm">{category.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;