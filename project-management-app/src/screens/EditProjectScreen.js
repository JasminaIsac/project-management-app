import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteProject, updateProject, addCategory } from '../../api';
import { Picker } from '@react-native-picker/picker';
import { useProjects } from '../contexts/ProjectsContext';
import AddCategoryModal from '../components/AddCategoryModal';
import { ScrollView } from 'react-native-gesture-handler';
import { useTasks } from '../contexts/TaskContext';
import SelectDeadlineInput from '../components/SelectDeadlineInput';

const EditProjectScreen = ({ route }) => {
    const { project } = route.params;

    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const [editedProject, setEditedProject] = useState({ ...project });
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

    const { categories, addCategoryToContext, updateProjectInContext, deleteProjectFromContext } = useProjects();
    const { tasks } = useTasks();


    const checkCompleted = () => {
        const currentTasks = tasks.filter((task) => task.project_id === project.id);
        const incompleteTask = currentTasks.some((task) => task.status !== 'completed');
        
        if (incompleteTask) {
          Alert.alert(
            'Project not completed', 
            'Project status cannot be set to completed because there are incomplete tasks in this project.'
          );
          return false;
        }
        
        return true; 
      }
    
    
      const handleDelete = async () => {
        try {
          await deleteProject(project.id); // Șterge proiectul din baza de date
          Alert.alert('Success', 'Project deleted successfully');
          deleteProjectFromContext(project.id);
          navigation.goBack(); // Revine la ecranul anterior
        } catch (error) {
          console.error('Error deleting project:', error);
          Alert.alert('Error', 'Failed to delete project');
        }
      };
    
      const handleSave = async () => {
        try {
          if(editedProject.status === 'completed'){
            const canSetCompleted = checkCompleted();
            if (!canSetCompleted) {
              return; 
            }
          }
                
          const updatedProject = { ...editedProject, updated_at: new Date().toISOString() };
          await updateProject(updatedProject);
          Alert.alert('Success', 'Project updated successfully');
          //setEditMode(false);
          navigation.setParams({ project: updatedProject });
          updateProjectInContext(updatedProject);

          navigation.goBack();
        } catch (error) {
          console.error('Error updating project:', error);
          Alert.alert('Error', 'Failed to update project');
        }
      };
    
      const handleAddCategory = async (categoryName) => {
        try {
          const newCategory = await addCategory({ title: categoryName });
          addCategoryToContext(newCategory);
          setEditedProject({ ...editedProject, category_id: newCategory.id });
        } catch (error) {
          console.error('Error adding category:', error);
          Alert.alert('Error', 'Failed to add category');
        }
      };

      
      return(
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Edit Project</Text>
          <TextInput
            style={styles.input}
            value={editedProject.name}
            onChangeText={(text) => setEditedProject({ ...editedProject, name: text })}
            placeholder="Project Name"
          />
          <TextInput
            style={styles.input}
            value={editedProject.description}
            onChangeText={(text) => setEditedProject({ ...editedProject, description: text })}
            placeholder="Project Description"
          />

          <Picker
            selectedValue={editedProject.category_id}
            style={styles.picker}
            onValueChange={(value) => {
              if (value === 'add_new') {
                setCategoryModalVisible(true);
              } else {
                setEditedProject({ ...editedProject, category_id: value });
              }
            }}
          >
            <Picker.Item label="Add new category" value="add_new" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.title} value={category.id} />
            ))}
          </Picker>


          <Picker
            selectedValue={editedProject.status}
            style={styles.picker}
            onValueChange={(value) => setEditedProject({ ...editedProject, status: value })}
          >
            <Picker.Item label="New" value="new" />
            <Picker.Item label="In Progress" value="in progress" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
          {/* <TextInput
            style={styles.input}
            value={editedProject.deadline || ''}
            onChangeText={(text) => setEditedProject({ ...editedProject, deadline: text })}
            placeholder="Deadline"
          /> */}

          <SelectDeadlineInput
            deadline={editedProject.deadline || ''}
            onChange={(date) => setEditedProject({ ...editedProject, deadline: date })}
          />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleSave()}
          >
            <Text style={styles.editButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.deleteButtonText}>Delete Project</Text>
          </TouchableOpacity>

          <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this project?</Text>
            <View style={styles.modalButtons}>
              <Button title="Yes" onPress={handleDelete} />
              <Button title="No" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <AddCategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onAddCategory={handleAddCategory}
      />
        </ScrollView>
      
    )   
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor:'#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5
    },
    picker: {
      height: 50,
      marginBottom: 10
    },
    editButton: {
      marginTop: 20,
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center'
    },
    editButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    deleteButton: {
      marginTop: 20,
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center'
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
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
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%'
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 18,
      color: 'gray',
    },
  });

export default EditProjectScreen;