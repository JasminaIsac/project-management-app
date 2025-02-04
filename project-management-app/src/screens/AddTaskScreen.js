import React, { useState, useEffect } from 'react';
import { addProject, addCategory } from '../../api';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Platform, KeyboardAvoidingView, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useProjects } from '../contexts/ProjectsContext';
import { useUsers } from '../contexts/UserContext';
import { addTask } from '../../api';
import { useTasks } from '../contexts/TaskContext';
import SelectDeadlineInput from '../components/SelectDeadlineInput';

const AddTaskScreen = ({ route }) => {

  const { projectId } = route.params;

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: projectId,
    priority:'medium',
    assigned_to: '',
    deadline:'',
  });

  const { projects, loading: loadingProjects } = useProjects();
  const { users, loading: loadingUsers } = useUsers();
  const { addTaskToContext } = useTasks();
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async () => {

    if (!newTask.title) {
        Alert.alert('Validation Error', 'Title is required');
        return;
      }

    let deadline = newTask.deadline.trim();

    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      Alert.alert('Validation Error', 'Invalid deadline format. Use YYYY-MM-DD');
      return;
    }

    deadline = deadline ? `${deadline} 00:00:00` : null;

    try {
      const taskData = { ...newTask, deadline };
      const addedTask = await addTask(taskData);
      Alert.alert('Success', 'Task added successfully');
      addTaskToContext(addedTask);
      setNewTask({
        title: '',
        description: '',
        project_id: projectId,
        priority: '',
        assigned_to: '',
        deadline: '',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
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
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              value={newTask.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Task name..."
            />

            <Text style={styles.label}>Project</Text>
            {loadingProjects ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Picker
                selectedValue={newTask.project_id}
                onValueChange={(value) => {
                    handleInputChange('project_id', value);
                }}
              >
              {projects.map((project) => (
                <Picker.Item key={project.id} label={project.name} value={project.id} />
              ))}
              </Picker>
            )}

            <Text style={styles.label}>Developer</Text>
            {loadingUsers ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Picker
                selectedValue={newTask.assigned_to}
                onValueChange={(value) => {
                    handleInputChange('assigned_to', value);
                }}
              >
              {users.filter((user) => user.role === 'developer')
              .map((user) => (
                <Picker.Item key={user.id} label={user.name} value={user.id} />
              ))}
              </Picker>
            )}
            <Text style={styles.label}>Priority</Text>
            <Picker
              selectedValue='medium'
              onValueChange={(value) => {
                  handleInputChange('priority', value);
              }}
            >
              <Picker.Item label="High" value="high" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Low" value="low" />
            </Picker>

            <Text style={styles.label}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={newTask.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Task description..."
              multiline
            />

            <SelectDeadlineInput
              deadline={newTask.deadline}
              onChange={(value) => handleInputChange('deadline', value)}
            />

            <Button title="Create" onPress={handleSubmit} />

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
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textarea: {
    height: 80,
  },
});

export default AddTaskScreen;
