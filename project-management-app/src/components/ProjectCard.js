import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTasks } from '../contexts/TaskContext';
import { useNavigation } from '@react-navigation/native';
import CompletedTasksProgress from './CompletedTasksProgress';

const ProjectCard = ({ item, onPress, getCategoryName }) => {
  // const { fetchTasksByProjectId } = useTasks();
  // const [tasks, setTasks] = useState([]);
  // const [percentComplete, setPercentComplete] = useState(0);
  const navigation = useNavigation();

  // const loadTasks = async () => {
  //   if (item) {
  //     try {
  //       const tasksData = await fetchTasksByProjectId(item.id); // Apel API
  //       setTasks(tasksData);
  //     } catch (error) {
  //       console.error('Error fetching tasks for project:', error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // Apel inițial
  //   loadTasks();
  // }, []);

  // useEffect(() => {
  //   // Ascultăm când cardul revine în focus
  //   const unsubscribe = navigation.addListener('focus', loadTasks);
  //   return unsubscribe; // Cleanup la demontare
  // }, [navigation, item.id]);

  // useEffect(() => {
  //   if (tasks.length > 0) {
  //     const completedTasks = tasks.filter(task => task.status === 'completed').length;
  //     const totalTasks = tasks.length;
  //     const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  //     setPercentComplete(percentage);
  //   }
  // }, [tasks]);

  const deadline = item.deadline ? item.deadline.split('T')[0] : 'No deadline';
  const updated_at = item.updated_at.split('T')[0];

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.cardContent}>
        <View style={styles.textSection}>
          <Text style={styles.projectTitle}>{item.name}</Text>
          <Text style={styles.projectCategory}>{getCategoryName(item.category_id)}</Text>
          <Text style={styles.projectTeam}>Updated: {updated_at}</Text>
        </View>
        <View style={styles.progressSection}>
          <CompletedTasksProgress projectId={item.id}/>
          <Text style={styles.deadline}>{item.deadline ? `By ${deadline}` : 'No deadline'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        margin: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
      cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      textSection: {
        flex: 2,
      },
      progressSection: {
        flex:1,
        alignItems: 'flex-end',
      },
      projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      projectCategory: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
      },
      projectTeam: {
        fontSize: 14,
        color: '#555',
      },
      deadline: {
        // marginTop: 10,
        fontSize: 14,
        color: '#ff9800',
        textAlign: 'center',
      },
});

export default ProjectCard;
