import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, Alert } from 'react-native';

const AddCategoryModal = ({ isVisible, onClose, onAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSave = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }
    onAddCategory(newCategoryName);
    setNewCategoryName(''); // Resetează câmpul după salvare
    onClose(); // Închide modalul
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Add New Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
});

export default AddCategoryModal;
