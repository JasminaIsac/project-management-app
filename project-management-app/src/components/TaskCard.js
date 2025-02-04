import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects } from '../contexts/ProjectsContext';
import { useUsers } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const TaskCard = ({ item }) => {

  const { projects } = useProjects();
  const { users } = useUsers();

  const deadline = item.deadline ? item.deadline.split('T')[0] : 'No deadline';
  const updated_at = item.updated_at.split('T')[0];
  const navigation = useNavigation();

  const getProjectName = (projectId) =>
    projects.find((p) => p.id === projectId)?.name || 'Unknown Project';

  const getUserName = (userId) =>
   users.find((u) => u.id === userId)?.name || 'Unknown user';


   const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-CA', { month: 'short' }); // "Jan"
    const year = date.getFullYear();
    return { day, month, year };
  };

  const { day, month, year } = formatDate(deadline.toLocaleString('en-CA'));

  const handleTaskPress = (task) => {
    navigation.navigate('View Task', { task });
  };

  // if(item.deadline){
  //   const deadline = item.deadline.split('T')[0];
  //   const { day, month, year } = formatDate(deadline);
  // }

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return '#95a5a6';
    }
  }

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return styles.newStatus;
      case 'in progress':
        return styles.inProgressStatus;
      case 'paused':
        return styles.pausedStatus;
      case 'to check':
        return styles.toCheckStatus;
      case 'completed':
        return styles.completedStatus;
      case 'returned':
        return styles.returnedStatus;
      default:
        return '#95a5a6';
    }
  }

  return (
    <TouchableOpacity style={[styles.card, item.status === 'completed' && styles.completedCard]} onPress={() => handleTaskPress(item)}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
        <View style={{flexDirection:'row', alignItems:'center', flex:2 }}>
          <Text style={[styles.label, getPriorityStyle(item.priority)]}>{item.priority}</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={[ styles.statusLabel, getStatusStyle(item.status), {marginRight:5}]}>●</Text>
            <Text style={[ styles.statusLabel, {textTransform: 'capitalize'}]}>{item.status}</Text>
          </View>
        </View >

        <Text style={styles.developerName}>{getUserName(item.assigned_to)}</Text>

      </View>

      <View style={[styles.cardContent, item.status === 'completed' && styles.completedCard]}>
        {/* <View style={styles.prioritySection}>
          <TouchableOpacity onPress={() => item.status = 'completed'} >
            <Ionicons
              name={'checkmark-circle'}
              size={50}
              color="orange"
              style={styles.statusButton}
          />
          </TouchableOpacity>
        </View> */}
        <View style={styles.textSection}>

          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskProject}>{getProjectName(item.project_id)}</Text>
          {item.description && (
            <Text style={styles.taskDescription}>{item.description}</Text>
          )}
        </View>
        <View style={styles.infoSection}>
          <View>
            <Text style={[styles.deadline,styles.deadlineDate]}>{day}</Text>
            <Text style={styles.deadline}>{month}, {year}</Text>
          </View>
          {/* <Text style={styles.developerName}>{getUserName(item.assigned_to)}</Text> */}
        </View>
        
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#eaeaea',
  },
  cardContent: {
    backgroundColor:'#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius:20,
    padding:9,
    paddingLeft:12,
  },
  prioritySection: {
    flex: 1,
    alignItems: 'flex-start',
    padding:0,
    margin:0,
  },
  textSection: {
    flex: 4,
  },
  infoSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label:{
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 5,
    alignSelf: 'flex-start', 
    marginRight:6,
    fontSize:12,
    fontWeight:700,
    letterSpacing:1.2
  },
  priorityLabel: {
    backgroundColor: '#ff0000',
  },
  statusLabel: {
    //backgroundColor: '#800080',
    fontWeight:700,

  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskProject:{
    fontSize: 14,
    fontWeight:600,
    color: '#0da8ea',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  deadline: {
    fontSize: 14,
    color: '#ff9800',
    textAlign: 'center',
    fontWeight:700
  },
  deadlineDate:{
    fontSize:22,
    fontWeight:900,
  },
  developerName: {
    fontSize: 14,
    color: '#4579FB',
    fontWeight:700,
    textAlign: 'right',
    paddingRight:11
  },
  statusButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0, 
  },
  highPriority: {
    backgroundColor: '#e74c3c',
  },
  mediumPriority: {
    backgroundColor: '#f1c40f',
  },
  lowPriority: {
    backgroundColor: '#2ecc71',
  },
  newStatus: {
    color: '#e224f9',
  },
  inProgressStatus:{
    color: '#4579FB',
  },
  pausedStatus:{
    color: '#f0d700'
  },
  toCheckStatus: {
    color: '#9ce62a',
  },
  completedStatus: {
    color: '#009a28',
  },
  returnedStatus:{
    color: '#f9245b'
  },
});

export default TaskCard;