import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, StyleSheet } from 'react-native';
import { updateUser } from '../../api'; 
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useUsers } from '../contexts/UserContext';

const EditProfile = ({ route }) => {
  const { user } = route.params; // Asigură-te că user vine din route.params
  const { updateUserInContext } = useAuth();
  const navigation = useNavigation();
  const [editedUser, setEditedUser] = useState(user || {});

  //console.log('set ed:', editedUser);

  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [errors, setErrors] = useState({ name: '', tel: '' });

  const validateInputs = () => {
    let valid = true;
    let newErrors = { name: '', tel: '' };

    // Validare nume (obligatoriu)
    if (!editedUser.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    const phoneRegex = /^(\+\d{1,3}\d{6,14}|0\d{8,14})$/;
    if (!editedUser.tel.trim()) {
      newErrors.tel = 'Phone number is required';
      valid = false;
    } else if (!phoneRegex.test(editedUser.tel)) {
      newErrors.tel = 'Invalid phone number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    try {
      const updatedUser = { ...editedUser, updated_at: new Date().toISOString() };

      const response = await updateUser(updatedUser);
      console.log("updated user data::", updatedUser);

      const successMessage = response?.message || 'Profile updated successfully.';

      navigation.setParams({ user: updatedUser });
      updateUserInContext(updatedUser);
      Alert.alert('Success', successMessage);

    } catch (error) {
      console.error("Error in profile edit:", error);
      Alert.alert('Error in profile edit', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, errors.name ? styles.inputError : null]}
        value={editedUser.name}
        onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={editedUser.location}
        onChangeText={(text) => setEditedUser({ ...editedUser, location: text })}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={[styles.input, errors.tel ? styles.inputError : null]}
        value={editedUser.tel}
        onChangeText={(text) => setEditedUser({ ...editedUser, tel: text })}
        keyboardType="phone-pad"
      />
      {errors.tel ? <Text style={styles.errorText}>{errors.tel}</Text> : null}

      <Button title="Save Changes" onPress={handleSaveChanges} />
      <Button title="Change Password" onPress={() => setPasswordModalVisible(true)} color="red" />

        <ChangePasswordModal 
        visible={isPasswordModalVisible}
        userId={editedUser.id} 
        onClose={() => setPasswordModalVisible(false)} 
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 5, borderRadius: 5 },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: 2 },
});

export default EditProfile;
