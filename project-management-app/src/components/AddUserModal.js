import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert } from 'react-native';
import { useUsers } from '../contexts/UserContext';
import { addUser } from '../../api';
import { Ionicons } from '@expo/vector-icons';

const AddUserModal = ({ visible, onClose }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    tel: '',
    role: 'developer', // Valoare implicită
    location: '',
    status: 'active', // Valoare implicită
    password: '', 
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { addUserToContext } = useUsers();

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
  });

  const handleAddUser = async () => {
    // Reset errors before validation
    setErrors({
      name: '',
      email: '',
      tel: '',
      password: '',
    });

    let formIsValid = true;

    if (!newUser.name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'User name cannot be empty' }));
      formIsValid = false;
    }

    if (!newUser.email.trim() || !/\S+@\S+\.\S+/.test(newUser.email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      formIsValid = false;
    }

    if (!newUser.tel.trim() || !/^(\+\d{1,3}\d{6,14}|0\d{8,14})$/.test(newUser.tel)) {
      setErrors((prev) => ({ ...prev, tel: 'Please enter a valid phone number' }));
      formIsValid = false;
    }

    if (!newUser.password.trim() || newUser.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters long' }));
      formIsValid = false;
    }

    if (newUser.password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      formIsValid = false;
    }

    if (!formIsValid) return; // If there are validation errors, stop the process

    try {
      const userToAdd = { ...newUser, password: newUser.password };
      await addUser(userToAdd);
      addUserToContext(userToAdd);
      Alert.alert('Success', 'User added successfully');

      setNewUser({
        name: '',
        email: '',
        tel: '',
        role: 'developer',
        location: '',
        status: 'active',
        password: '',
      });
      setConfirmPassword('');
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        if (error.response.data.field === 'email') {
          setErrors((prev) => ({ ...prev, email: error.response.data.error }));
        } else if (error.response.data.field === 'tel') {
          setErrors((prev) => ({ ...prev, tel: error.response.data.error }));
        }
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New User</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Name"
            value={newUser.name}
            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Email"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.tel && styles.errorInput]}
            placeholder="Tel"
            value={newUser.tel}
            keyboardType="phone-pad"
            onChangeText={(text) => setNewUser({ ...newUser, tel: text })}
          />
          {errors.tel && <Text style={styles.errorText}>{errors.tel}</Text>}

          <View style={[styles.inputContainer, errors.password && styles.errorInput]}>
            <TextInput
              style={styles.passinput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={newUser.password}
              onChangeText={(text) => setNewUser({ ...newUser, password: text })}
            />
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
              style={styles.icon}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={[styles.inputContainer, errors.confirmPassword && styles.errorInput]}>
            <TextInput
              style={[styles.passinput, errors.confirmPassword && styles.errorInput]}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
              style={styles.icon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <View style={styles.modalButtons}>
            <Button title="Add User" onPress={handleAddUser} />
            <Button title="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  passinput:{
    width: '92%',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
});

export default AddUserModal;
