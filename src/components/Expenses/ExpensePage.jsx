import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const ExpensesPage = () => {
  const { expenses, users, addExpense, updateExpense, deleteExpense } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = useCallback((expenseData) => {
    addExpense(expenseData);
    setShowForm(false);
  }, [addExpense]);

  const handleUpdateExpense = useCallback((expenseData) => {
    updateExpense({ ...expenseData, id: currentExpense.id });
    setIsEditing(false);
    setCurrentExpense(null);
    setShowForm(false);
  }, [currentExpense, updateExpense]);

  const handleEditClick = useCallback((expense) => {
    setCurrentExpense(expense);
    setIsEditing(true);
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
    }
  }, [deleteExpense]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setCurrentExpense(null);
    setShowForm(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
        {!showForm && users.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Expense
          </button>
        )}
      </div>
      
      {users.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to create at least one user before adding expenses.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <ExpenseForm
            onSubmit={isEditing ? handleUpdateExpense : handleAddExpense}
            initialValues={currentExpense}
            isEditing={isEditing}
          />
        </div>
      )}
      
      <ExpenseList
        expenses={expenses}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};

export default ExpensesPage;