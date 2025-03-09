import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import UserForm from './UserForm.jsx';
import UserList from './UserList.jsx';

const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddUser = useCallback((userData) => {
    addUser(userData);
    setShowForm(false);
  }, [addUser]);

  const handleUpdateUser = useCallback((userData) => {
    updateUser({ ...userData, id: currentUser.id });
    setIsEditing(false);
    setCurrentUser(null);
    setShowForm(false);
  }, [currentUser, updateUser]);

  const handleEditClick = useCallback((user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((userId) => {
    if (window.confirm('Are you sure you want to delete this user? All associated expenses will also be deleted.')) {
      deleteUser(userId);
    }
  }, [deleteUser]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setCurrentUser(null);
    setShowForm(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New User
          </button>
        )}
      </div>
      
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <UserForm
            onSubmit={isEditing ? handleUpdateUser : handleAddUser}
            initialValues={currentUser}
            isEditing={isEditing}
          />
        </div>
      )}
      
      <UserList
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};

export default UsersPage;