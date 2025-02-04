// ViewProjectScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects } from '../contexts/ProjectsContext';
import { useTasks } from '../contexts/TaskContext';
import CompletedTasksProgress from '../components/CompletedTasksProgress';
import TaskList from '../components/TaskList';
import { useAuth } from '../contexts/AuthContext';

const ViewProjectScreen = ({ route }) => {
  const { project: initialProject } = route.params; 
  const [project, setProject] = useState(initialProject); 
  const { projects, categories } = useProjects();
  const { fetchTasksByProjectId } = useTasks();
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  const { currentUser } = useAuth();
  const { userData: user } = currentUser;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedProject = projects.find((p) => p.id === initialProject.id);
      if (updatedProject) {
        setProject(updatedProject);
        const loadTasks = async () => {
          try {
            const tasksData = await fetchTasksByProjectId(updatedProject.id);
            setTasks(tasksData);
          } catch (error) {
            console.error('Error fetching tasks:', error);
          }
        };
        loadTasks();
      }
    });

    return unsubscribe;
  }, [navigation, projects, initialProject.id, fetchTasksByProjectId]);

  React.useLayoutEffect(() => {
    if (user.role !== 'developer') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Edit Project', { project })}>
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
  }, [navigation, project, user.role]);

  const deadline = project.deadline ? project.deadline.split('T')[0] : 'No deadline';

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };

  // const handleTaskPress = (task) => {
  //   navigation.navigate('View Task', { task });
  // };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.projectDetails, { flexDirection: 'row' }]}>
        <View style={{ flex: 2 }}>
          <Text style={[styles.title, { color: '#fff' }]}>{project.name}</Text>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>Category: {getCategoryName(project.category_id)}</Text>
          <Text style={{ color: '#fff' }}>{project.description}</Text>
          <Text style={{ color: '#fff' }}>Status: {project.status}</Text>
          <Text style={{ color: '#fff' }}>Deadline: {deadline ? new Date(deadline).toDateString().split(' ').slice(1).join(', ') : 'Not set'}</Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end' }}>
          <CompletedTasksProgress projectId={project.id} />
        </View>
      </View>
      <View style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <Text style={styles.title}>Tasks:</Text>
          {user.role !== 'developer' && (
            <TouchableOpacity onPress={() => navigation.navigate("Add Task", { projectId: project.id })}>
              <Ionicons
                name="add"
                size={24}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* Afișarea listei de task-uri utilizând TaskList */}
        <TaskList tasks={tasks} projectId={project.id} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'Montserrat',
  },
  projectDetails: {
    color: '#fff',
    backgroundColor: '#283271',
    padding: 20,
    justifyContent: 'center',
  },
  tasksContainer: {
    padding: 12,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: 5,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ViewProjectScreen;
