import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { changePassword } from '../../api';

const ChangePasswordModal = ({ visible, onClose, userId }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswords = () => {
    let errors = {};

    if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters.';
    }

    if (newPassword === oldPassword) {
      errors.newPassword = 'New password must be different from old password.';
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    setErrors({});

    const response = await changePassword(userId, oldPassword, newPassword, confirmPassword);

    if (response.success) {
      Alert.alert('Succes', 'Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } else {
      setErrors({ apiError: response.message });
    }

    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change Password</Text>

          {/* Old Password */}
          <View style={[styles.inputContainer, errors.apiError && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              secureTextEntry={!showPassword.old}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity onPress={() => toggleShowPassword('old')}>
              <Ionicons name={showPassword.old ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!showPassword.new}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => toggleShowPassword('new')}>
              <Ionicons name={showPassword.new ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

          {/* Confirm New Password */}
          <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry={!showPassword.confirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => toggleShowPassword('confirm')}>
              <Ionicons name={showPassword.confirm ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          {errors.apiError && <Text style={styles.errorText}>{errors.apiError}</Text>}

          <Button title={loading ? "Changing..." : "Change Password"} onPress={handleChangePassword} disabled={loading} />
          <Button title="Cancel" onPress={onClose} color="red" />
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
    width: 320,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ChangePasswordModal;
