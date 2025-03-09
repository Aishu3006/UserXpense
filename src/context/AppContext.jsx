// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  users: {},
  expenses: {},
  userExpenseTotals: {},
  categoryTotals: {
    Meals: 0,
    Travel: 0,
    Software: 0,
    Other: 0
  }
};

// Action types
const ADD_USER = 'ADD_USER';
const UPDATE_USER = 'UPDATE_USER';
const DELETE_USER = 'DELETE_USER';
const ADD_EXPENSE = 'ADD_EXPENSE';
const UPDATE_EXPENSE = 'UPDATE_EXPENSE';
const DELETE_EXPENSE = 'DELETE_EXPENSE';

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_USER: {
      const userId = uuidv4();
      return {
        ...state,
        users: {
          ...state.users,
          [userId]: { ...action.payload, id: userId }
        },
        userExpenseTotals: {
          ...state.userExpenseTotals,
          [userId]: 0
        }
      };
    }

    case UPDATE_USER: {
      const { id, ...userData } = action.payload;
      
      // Create a copy of expenses with updated user references
      const updatedExpenses = { ...state.expenses };
      
      // Update user references in expenses
      Object.keys(updatedExpenses).forEach(expenseId => {
        if (updatedExpenses[expenseId].userId === id) {
          updatedExpenses[expenseId] = {
            ...updatedExpenses[expenseId],
            userName: `${userData.firstName} ${userData.lastName}`
          };
        }
      });
      
      return {
        ...state,
        users: {
          ...state.users,
          [id]: { ...userData, id }
        },
        expenses: updatedExpenses
      };
    }

    case DELETE_USER: {
      const userId = action.payload;
      const newUsers = { ...state.users };
      const newExpenses = { ...state.expenses };
      const newUserExpenseTotals = { ...state.userExpenseTotals };
      const newCategoryTotals = { ...state.categoryTotals };
      
      // Remove user
      delete newUsers[userId];
      delete newUserExpenseTotals[userId];
      
      // Find and remove all expenses associated with the user
      // and update category totals
      Object.keys(newExpenses).forEach(expenseId => {
        if (newExpenses[expenseId].userId === userId) {
          const { category, cost } = newExpenses[expenseId];
          newCategoryTotals[category] -= cost;
          delete newExpenses[expenseId];
        }
      });
      
      return {
        ...state,
        users: newUsers,
        expenses: newExpenses,
        userExpenseTotals: newUserExpenseTotals,
        categoryTotals: newCategoryTotals
      };
    }

    case ADD_EXPENSE: {
      const expenseId = uuidv4();
      const { userId, category, cost } = action.payload;
      const user = state.users[userId];
      
      // Create new expense with user's full name
      const newExpense = {
        ...action.payload,
        id: expenseId,
        userName: `${user.firstName} ${user.lastName}`
      };
      
      // Update user's total expenses
      const updatedUserTotal = (state.userExpenseTotals[userId] || 0) + cost;
      
      // Update category total
      const updatedCategoryTotal = state.categoryTotals[category] + cost;
      
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [expenseId]: newExpense
        },
        userExpenseTotals: {
          ...state.userExpenseTotals,
          [userId]: updatedUserTotal
        },
        categoryTotals: {
          ...state.categoryTotals,
          [category]: updatedCategoryTotal
        }
      };
    }

    case UPDATE_EXPENSE: {
      const { id, ...expenseData } = action.payload;
      const oldExpense = state.expenses[id];
      const user = state.users[expenseData.userId];
      
      // Create updated expense with user's full name
      const updatedExpense = {
        ...expenseData,
        id,
        userName: `${user.firstName} ${user.lastName}`
      };
      
      // Update user expense totals
      const userExpenseTotals = { ...state.userExpenseTotals };
      
      // If user changed, update both old and new user totals
      if (oldExpense.userId !== expenseData.userId) {
        userExpenseTotals[oldExpense.userId] = (userExpenseTotals[oldExpense.userId] || 0) - oldExpense.cost;
        userExpenseTotals[expenseData.userId] = (userExpenseTotals[expenseData.userId] || 0) + expenseData.cost;
      } 
      // If only cost changed, update the same user's total
      else if (oldExpense.cost !== expenseData.cost) {
        userExpenseTotals[expenseData.userId] = (userExpenseTotals[expenseData.userId] || 0) - oldExpense.cost + expenseData.cost;
      }
      
      // Update category totals
      const categoryTotals = { ...state.categoryTotals };
      
      // If category changed, update both old and new category totals
      if (oldExpense.category !== expenseData.category) {
        categoryTotals[oldExpense.category] = categoryTotals[oldExpense.category] - oldExpense.cost;
        categoryTotals[expenseData.category] = categoryTotals[expenseData.category] + expenseData.cost;
      } 
      // If only cost changed, update the same category total
      else if (oldExpense.cost !== expenseData.cost) {
        categoryTotals[expenseData.category] = categoryTotals[expenseData.category] - oldExpense.cost + expenseData.cost;
      }
      
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [id]: updatedExpense
        },
        userExpenseTotals,
        categoryTotals
      };
    }

    case DELETE_EXPENSE: {
      const expenseId = action.payload;
      const expense = state.expenses[expenseId];
      
      // Create new state objects
      const newExpenses = { ...state.expenses };
      const newUserExpenseTotals = { ...state.userExpenseTotals };
      const newCategoryTotals = { ...state.categoryTotals };
      
      // Update user total
      newUserExpenseTotals[expense.userId] = newUserExpenseTotals[expense.userId] - expense.cost;
      
      // Update category total
      newCategoryTotals[expense.category] = newCategoryTotals[expense.category] - expense.cost;
      
      // Remove expense
      delete newExpenses[expenseId];
      
      return {
        ...state,
        expenses: newExpenses,
        userExpenseTotals: newUserExpenseTotals,
        categoryTotals: newCategoryTotals
      };
    }

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Memoized action creators
  const addUser = useCallback((userData) => {
    dispatch({ type: ADD_USER, payload: userData });
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: UPDATE_USER, payload: userData });
  }, []);

  const deleteUser = useCallback((userId) => {
    dispatch({ type: DELETE_USER, payload: userId });
  }, []);

  const addExpense = useCallback((expenseData) => {
    dispatch({ type: ADD_EXPENSE, payload: expenseData });
  }, []);

  const updateExpense = useCallback((expenseData) => {
    dispatch({ type: UPDATE_EXPENSE, payload: expenseData });
  }, []);

  const deleteExpense = useCallback((expenseId) => {
    dispatch({ type: DELETE_EXPENSE, payload: expenseId });
  }, []);

  // Calculate derived data
  const getUsers = useCallback(() => {
    return Object.values(state.users).map(user => ({
      ...user,
      totalExpenses: state.userExpenseTotals[user.id] || 0
    }));
  }, [state.users, state.userExpenseTotals]);

  const getExpenses = useCallback(() => {
    return Object.values(state.expenses);
  }, [state.expenses]);

  const getCategoryTotals = useCallback(() => {
    return Object.entries(state.categoryTotals).map(([category, total]) => ({
      category,
      total
    }));
  }, [state.categoryTotals]);

  // Context value
  const value = {
    users: getUsers(),
    expenses: getExpenses(),
    categoryTotals: getCategoryTotals(),
    addUser,
    updateUser,
    deleteUser,
    addExpense,
    updateExpense,
    deleteExpense
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};