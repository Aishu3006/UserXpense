import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';

const CategoryCard = ({ category, total, highestTotal }) => {
  // Calculate percentage for the bar width
  const percentage = highestTotal > 0 ? (total / highestTotal) * 100 : 0;
  
  // Determine color based on category
  const getColorClass = (category) => {
    switch (category) {
      case 'Meals':
        return 'bg-green-500';
      case 'Travel':
        return 'bg-blue-500';
      case 'Software':
        return 'bg-purple-500';
      case 'Other':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{category}</h3>
          <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${percentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getColorClass(category)}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const { categoryTotals, expenses, users } = useAppContext();
  
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.cost, 0);
    const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const userWithMostExpenses = [...users].sort((a, b) => b.totalExpenses - a.totalExpenses)[0] || null;
    
    return {
      totalExpenses,
      averageExpense,
      userWithMostExpenses,
      expenseCount: expenses.length
    };
  }, [expenses, users]);
  
  // Find the highest total for scaling the bars
  const highestTotal = useMemo(() => {
    return categoryTotals.reduce((max, category) => Math.max(max, category.total), 0);
  }, [categoryTotals]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.totalExpenses.toFixed(2)}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Expense</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.averageExpense.toFixed(2)}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.expenseCount}</dd>
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <h3 className="text-xl font-medium text-gray-900 mt-8">Total Cost by Category</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        {categoryTotals.map(category => (
          <CategoryCard
            key={category.category}
            category={category.category}
            total={category.total}
            highestTotal={highestTotal}
          />
        ))}
      </div>
      
      {/* Highest Spender */}
      {stats.userWithMostExpenses && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-gray-900">Highest Spender</h3>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {stats.userWithMostExpenses.firstName} {stats.userWithMostExpenses.lastName}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Total of {expenses.filter(e => e.userId === stats.userWithMostExpenses.id).length} transactions
                  </p>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats.userWithMostExpenses.totalExpenses.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;