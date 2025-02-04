import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import SelectDeadlineInput from '../components/SelectDeadlineInput';
import { useTasks } from '../contexts/TaskContext';
import { useProjects } from '../contexts/ProjectsContext';
import { useUsers } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { updateTask } from '../../api'
import { useAuth } from '../contexts/AuthContext';
import { getProjectById } from '../../api';
import MessagesList from '../components/MessagesList';

const ViewTaskScreen = ({ route }) => {
  const { task } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const { projects } = useProjects();
  const { users } = useUsers();
  const { updateTaskInContext } = useTasks();

  const { currentUser } = useAuth();
  const { userData: user } = currentUser;
  const navigation = useNavigation();

  const [projectName, setProjectName] = useState(''); // Inițializare stării

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const projectArray = await getProjectById(task.project_id); // Obține array-ul
        const project = projectArray[0];
        setProjectName(project.name); // Setăm numele proiectului în stare
      } catch (error) {
        console.error('Error fetching project name:', error);
        setProjectName('Error loading project name');
      }
    };

    fetchProjectName();
  }, [task.project_id]);

  React.useLayoutEffect(() => {
    if (user.role !== 'developer') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons
              name="pencil"
              size={22}
              color="black"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, task.project_id]);



  const handleSave = async () => {
    try {
      const updatedTask = { ...editedTask, updated_at: new Date().toISOString() };
      navigation.setParams({ task: updatedTask });
      await updateTask(updatedTask);
      updateTaskInContext(updatedTask);
      Alert.alert('Success', 'Task updated successfully');
      setModalVisible(false); // Închide modalul după salvare
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  return (
    <View style={styles.container}>
      {/* Vizualizare Task */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{projectName}</Text>

        {task.description && (
        <Text style={styles.description}>{task.description}</Text>
        )}
        <Text style={styles.label}>Assigned to: {users.find((user) => user.id === task.assigned_to)?.name}</Text>
        <Text style={styles.label}>Priority: {task.priority}</Text>
        <Text style={styles.label}>Status: {editedTask.status || task.status}</Text>

        {
          user.role === 'developer' &&(
            <View style={{flexDirection:'row'}}>
              <Picker
                selectedValue={editedTask.status || task.status} // Asigură fallback-ul la statusul inițial
                style={{ flex:2, borderColor: '#eaeaea' }}
                onValueChange={(value) => {
                  setEditedTask((prev) => ({ ...prev, status: value })); // Actualizează starea locală
                }}
              >
                <Picker.Item label="New" value="new" />
                <Picker.Item label="Paused" value="paused" />
                <Picker.Item label="In Progress" value="in progress" />
                <Picker.Item label="To check" value="to check" />
              </Picker>

              <TouchableOpacity
                onPress={handleSave} // Apelăm handleSave separat
                style={{
                  backgroundColor: '#283271',
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                  marginTop: 20,
                  flex:1
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Status</Text>
              </TouchableOpacity>
            </View>)
        } 
        
        <Text style={styles.label}>
          Deadline: {task.deadline 
            ? new Date(task.deadline).toDateString().split(' ').slice(1, 3).join(', ') // "Jan 25 2025"
            : 'Not set'}
        </Text>
      </View>

      {/* {user.role !== 'developer' && (
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="pencil" size={20} color="white" />
          <Text style={styles.editButtonText}>Edit Task</Text>
        </TouchableOpacity>
      )} */}

      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>Messages:</Text>
        <MessagesList taskId={task.id} currentUser_id={user.id}/>
      </View>


      {/* Modal pentru Editare */}
      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>

            <TextInput
              style={styles.input}
              value={editedTask.title}
              onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
              placeholder="Task Name"
            />
            <TextInput
              style={[styles.input, { textAlignVertical: 'top', height: 120 }]}
              value={editedTask.description}
              onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
              placeholder="Task Description"
              multiline={true}
            />

            <Picker
              selectedValue={editedTask.project_id}
              style={styles.picker}
              onValueChange={(value) => setEditedTask({ ...editedTask, project_id: value })}
            >
              {projects.map((project) => (
                <Picker.Item key={project.id} label={project.name} value={project.id} />
              ))}
            </Picker>

            <Picker
              selectedValue={editedTask.status} // Asigură fallback-ul la statusul inițial
              style={styles.picker}
              onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
            >
              <Picker.Item label="New" value="new" />
              <Picker.Item label="Returned" value="returned" />
              <Picker.Item label="Completed" value="completed" />
            </Picker>

            <Picker
              selectedValue={editedTask.assigned_to}
              style={styles.picker}
              onValueChange={(value) => setEditedTask({ ...editedTask, assigned_to: value })}
            >
              {users
                .filter((user) => user.role === 'developer')
                .map((user) => (
                  <Picker.Item key={user.id} label={user.name} value={user.id} />
                ))}
            </Picker>

            <SelectDeadlineInput
              deadline={editedTask.deadline || ''}
              onChange={(date) => setEditedTask({ ...editedTask, deadline: date })}
              placeholder="Deadline"
            />

            <View style={styles.modalButtons}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  detailContainer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ViewTaskScreen;
