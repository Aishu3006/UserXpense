import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../data/categories';

const ExpenseForm = ({ onSubmit, initialValues, isEditing }) => {
  const { users } = useAppContext();
  
  const [formData, setFormData] = useState({
    userId: '',
    category: '',
    description: '',
    cost: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        cost: initialValues.cost.toString()
      });
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) {
      newErrors.userId = 'User is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }else if (formData.description.length > 300) {
      newErrors.description = 'Description cannot exceed 300 characters';
    }
    
    if (!formData.cost) {
      newErrors.cost = 'Cost is required';
    } else {
      const costValue = parseFloat(formData.cost);
      if (isNaN(costValue) || costValue <= 0) {
        newErrors.cost = 'Cost must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert cost to number before submitting
      const formattedData = {
        ...formData,
        cost: parseFloat(formData.cost)
      };
      
      onSubmit(formattedData);
      
      if (!isEditing) {
        // Reset form after submission if not editing
        setFormData({
          userId: '',
          category: '',
          description: '',
          cost: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
          User
        </label>
        <select
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.userId ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        >
          <option value="">Select a category</option>
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          maxLength={300}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className={`mt-1 text-xs ${formData.description.length > 300 ? 'text-red-600' : 'text-gray-500'}`}>
          {formData.description.length} / 300 characters
        </p>
      </div>
      
      <div>
        <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
          Cost ($)
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          id="cost"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.cost ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.cost && (
          <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;