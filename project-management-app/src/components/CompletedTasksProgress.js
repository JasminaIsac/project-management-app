import React, {useState, useEffect} from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTasks } from '../contexts/TaskContext';
import { useNavigation } from '@react-navigation/native';


const CompletedTasksProgress = ({ projectId }) => {
  const { fetchTasksByProjectId } = useTasks();
  const [tasks, setTasks] = useState([]);
  const [percentComplete, setPercentComplete] = useState(0);
  const navigation = useNavigation();

  const loadTasks = async () => {
    if (projectId) {
      try {
        const tasksData = await fetchTasksByProjectId(projectId);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks for project:', error);
      }
    }
  };

  useEffect(() => {
    // Apel inițial
    loadTasks();
  }, []);

  useEffect(() => {
    // Ascultăm când cardul revine în focus
    const unsubscribe = navigation.addListener('focus', loadTasks);
    return unsubscribe; // Cleanup la demontare
  }, [navigation, projectId]);

  useEffect(() => {
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const totalTasks = tasks.length;
      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      setPercentComplete(percentage);
    }
  }, [tasks]);

  return (
      <CircularProgress
        value={percentComplete}
        radius={40}
        title=""  // Set title to an empty string
        maxValue={100}
        duration={1500}
        activeStrokeColor="#3399FF"
        inActiveStrokeColor="#ccc"
        inActiveStrokeOpacity={0.4}
        textColor="#333"
        fontSize={18}
        // Custom text rendering
        renderText={() => `${percentComplete}%`} // Custom text renderer
      />
  );
};

export default CompletedTasksProgress;
