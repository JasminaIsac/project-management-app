import React, { useState } from 'react';
import { addProject, addCategory } from '../../api';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Platform, KeyboardAvoidingView, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asigură-te că ai acest import

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useProjects } from '../contexts/ProjectsContext';
import AddCategoryModal from '../components/AddCategoryModal';
import SelectDeadlineInput from '../components/SelectDeadlineInput'

const AddProjectForm = () => {
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category_id: '',
    deadline: '',
  });

  const { categories, addProjectToContext, loading, addCategoryToContext } = useProjects(); // Preia loading din context
  const navigation = useNavigation();
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);



  const handleInputChange = (name, value) => {
    setNewProject({ ...newProject, [name]: value });
  };

  
  const handleSubmit = async () => {
    if (loading) {
      Alert.alert('Loading...', 'Please wait until categories are loaded');
      return;
    }

    if (!newProject.name.trim()) {
      Alert.alert('Validation Error', 'Project name cannot be empty');
      return;
    }

    if (newProject.name.length < 3) {
      Alert.alert('Validation Error', 'Project name must be at least 3 characters long');
      return;
    }

    if (!newProject.description.trim()) {
      Alert.alert('Validation Error', 'Project description cannot be empty');
      return;
    }

    if (newProject.description.length < 3) {
      Alert.alert('Validation Error', 'Project description must be at least 3 characters long');
      return;
    }

    if (!newProject.category_id) {
      Alert.alert('Validation Error', 'Category must be selected');
      return;
    }

    let deadline = newProject.deadline.trim();

    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      Alert.alert('Validation Error', 'Invalid deadline format. Use YYYY-MM-DD');
      return;
    }

    //deadline = deadline ? `${deadline} 00:00:00` : null;

    try {
      const manager_id = 1; // Exemplu hardcodat
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        category_id: newProject.category_id,
        manager_id: manager_id,
        deadline: deadline,
      };

      const addedProject = await addProject(projectData);
      addProjectToContext(addedProject);
      setNewProject({ name: '', description: '', category_id: '', deadline: '' });

      Alert.alert('Success', 'Project added successfully');
      navigation.navigate('View Project', { project: addedProject });
    } catch (error) {
      console.error('Error adding project:', error);
      Alert.alert('Error', 'Failed to add project');
    }
  };
  
  const handleAddCategory = async (categoryName) => {
    try {
      const newCategory = await addCategory({ title: categoryName });
      addCategoryToContext(newCategory);
      setNewProject({ ...newProject, category_id: newCategory.id });
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <Text style={styles.label}>Project Title</Text>
            <TextInput
              style={styles.input}
              value={newProject.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Project name..."
            />

            <Text style={styles.label}>Category</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Picker
                selectedValue={newProject.category_id}
                onValueChange={(value) => {
                  if (value === 'add_new') {
                    setCategoryModalVisible(true);
                  } else {
                    handleInputChange('category_id', value);
                  }
                }}
              >
              <Picker.Item label="Add new category" value="add_new" />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.title} value={category.id} />
              ))}
              </Picker>
            )}

            <Text style={styles.label}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={newProject.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Project description..."
              multiline
            />
            <SelectDeadlineInput
            deadline={newProject.deadline}
            onChange={(value) => handleInputChange('deadline', value)}
            />
            <Button title="Create" onPress={handleSubmit} disabled={loading} />

            <AddCategoryModal
              isVisible={isCategoryModalVisible}
              onClose={() => setCategoryModalVisible(false)}
              onAddCategory={handleAddCategory}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  textarea: {
    height: 80,
  },
});

export default AddProjectForm;
