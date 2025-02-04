import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../contexts/TaskContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TodayProgress = () => {
  const navigation = useNavigation();
  const { tasks } = useTasks();
  const [percentComplete, setPercentComplete] = useState(0);
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    if (tasks.length > 0) {
      const today = new Date().toISOString().split('T')[0]; // Format: yyyy-mm-dd
      const taskForToday = tasks.filter(
        (task) => new Date(task.deadline).toISOString().split('T')[0] === today
      );
      setTodayTasks(taskForToday);
  
      const completedTasks = taskForToday.filter((task) => task.status === 'completed').length;
      const totalTasks = taskForToday.length;
      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
      setPercentComplete(percentage);
    }
  }, [tasks]);
  

  return (
    <View style={styles.card}>
      <View style={styles.content}>
      {todayTasks.length === 0 ? (
        <>
          <Text style={styles.title}>No tasks for today!</Text>
          <Text style={styles.subtitle}>Enjoy your free time!</Text>
        </>
      ) : (
        <>
          {percentComplete === 0 && <Text style={styles.title}>Time to start your daily tasks!</Text>}
          {percentComplete > 0 && percentComplete <= 30 && <Text style={styles.title}>Good Start! You’re making progress!</Text>}
          {percentComplete > 30 && percentComplete < 75 && <Text style={styles.title}>Halfway there! Keep up the good work!</Text>}
          {percentComplete >= 75 && percentComplete < 100 && <Text style={styles.title}>Almost done! Keep pushing!</Text>}
          {percentComplete === 100 && <Text style={styles.title}>Congratulations! All tasks are completed!</Text>}

          {percentComplete === 0 ? (
            <Text style={styles.subtitle}>Let's get started! Your tasks are waiting!</Text>
          ) : percentComplete < 100 ? (
            <Text style={styles.subtitle}>Keep going! You’ve got this!</Text>
          ) : (
            <Text style={styles.subtitle}>Great job! Take a break!</Text>
          )}
        </>
      )}

        <TouchableOpacity 
          style={styles.button} 
          onPress={()=> {navigation.navigate('View All Tasks')}}
        >
          <Text style={styles.buttonText}>See all your tasks</Text>
        </TouchableOpacity>
      </View>

      {todayTasks.length === 0 ? (
        <Ionicons name="cafe" size={64} color="white" style={{marginRight:15}} />
      ) : (
        <CircularProgress 
          style={{flex:1,}}
          value={percentComplete}
          radius={40}
          title=""
          maxValue={100}
          duration={1500}
          activeStrokeColor="#fff"
          inActiveStrokeColor="#72cef4"
          inActiveStrokeOpacity={0.5}
          textColor="#fff"
          fontSize={18}
          renderText={() => `${percentComplete}%`}
        />
      )
    }
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4a00e0',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  content: {
    flex: 2,
    marginRight: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 15,
    alignSelf: 'flex-start',
    padding:3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 10, 
    paddingVertical: 5,
  },
  
});

export default TodayProgress;
