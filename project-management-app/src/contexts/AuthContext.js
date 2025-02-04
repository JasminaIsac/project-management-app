import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Utilizatorul logat
  const [loading, setLoading] = useState(true); // Stare de încărcare inițială

  // Funcție pentru încărcarea datelor utilizatorului
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        setCurrentUser(JSON.parse(savedUserData)); // Setează utilizatorul din AsyncStorage
      }
    } catch (error) {
      console.error('Error loading user from AsyncStorage', error);
    } finally {
      setLoading(false); // Finalizează procesul de încărcare
    }
  };

  // UseEffect pentru încărcarea datelor la inițializare
  useEffect(() => {
    loadUserData();
  }, []);

  // Funcție pentru login
  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const { token, ...userData } = response;
      setCurrentUser(userData); // Setează datele utilizatorului în context
      await AsyncStorage.setItem('userData', JSON.stringify({ ...userData, token })); // Salvează în AsyncStorage
    } catch (error) {
      throw error; // Aruncă eroarea pentru gestionare
    }
  };

  const updateUserInContext = async (updatedUser) => {  
    try {
      const newUserData = { ...currentUser, userData: updatedUser };
      setCurrentUser(newUserData);
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Error updating user in AsyncStorage', error);
    }
  };
  

  // Funcție pentru logout
  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem('userData'); // Șterge datele utilizatorului
  };

  // Expunem contextul doar când datele sunt complet încărcate
  if (loading) {
    return null; // Poți adăuga aici un spinner sau un ecran de încărcare
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUserInContext, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
