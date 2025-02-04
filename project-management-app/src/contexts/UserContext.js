import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Pornește starea de încărcare
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Oprește încărcarea
      }
    };

    fetchData();
  }, []);

  const addUserToContext = async (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const updateUserInContext = async (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
  };

  const deleteUserFromContext = async (userId) => {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
  };


  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        addUserToContext,
        updateUserInContext,
        deleteUserFromContext,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
