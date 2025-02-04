import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const AllTasksScreen = () => {
  const { tasks } = useTasks();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Format: yyyy-mm-dd
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [isCalendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const taskDate = new Date(task.deadline).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });
    // console.log(filtered);
    setFilteredTasks(filtered);
  }, [selectedDate, tasks]);

  const getTaskCountsByDate = () => {
    const taskCounts = {};
    tasks.forEach((task) => {
      const date = new Date(task.deadline).toISOString().split('T')[0];
      taskCounts[date] = (taskCounts[date] || 0) + 1;
    });
    return taskCounts;
  };

  const taskCounts = getTaskCountsByDate();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setCalendarVisible(true)}>
          <Ionicons name="calendar-outline" size={24} color="black" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
    
  }, [navigation, selectedDate, tasks]);

  const renderDaysCarousel = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
  
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map((day, index) => {
          const dayString = day.toISOString().split('T')[0]; // Format: yyyy-mm-dd
          const taskCount = tasks.filter(
            (task) => new Date(task.deadline).toISOString().split('T')[0] === dayString
          ).length;
  
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                selectedDate === dayString && styles.selectedDay,
              ]}
              onPress={() => setSelectedDate(dayString)}
            >
              <Text style={styles.daySmall}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
              <Text style={styles.dayLarge}>{day.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</Text>
              <Text style={styles.taskCount}>{taskCount} task{taskCount !== 1 ? 's' : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };
  

  const renderTasks = () => (
    <FlatList
      style={{ paddingBottom: 15 }}
      data={filteredTasks.sort((a, b) => {
        // Sortare: prioritate (high > medium > low) și deadline
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const priorityA = priorityOrder[a.priority.toLowerCase()] || 4;
        const priorityB = priorityOrder[b.priority.toLowerCase()] || 4;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        const deadlineA = new Date(a.deadline);
        const deadlineB = new Date(b.deadline);

        return deadlineA - deadlineB;
      })}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskCard
          item={item}
          onPress={() => {
            navigation.navigate('Edit Task', { task: item });
          }}
        />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks for today!</Text>
          <Text style={styles.emptyText}>Have a rest!</Text>

        </View>
      )}
      scrollEnabled={false}
    />
  );

  return (
    <View style={styles.container}>
      <View >
      {renderDaysCarousel()}
      </View>
      <View >
        <Text style={styles.subHeader}>Daily Tasks</Text>
        {renderTasks()}
      </View>

{/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Calendar style={styles.modalContent}
            markedDates={Object.keys(taskCounts).reduce((acc, date) => {
              acc[date] = {
                marked: true,
                customStyles: {
                  container: {
                    backgroundColor: '#eaeaea',
                  },
                  text: {
                    color: taskCounts[date] > 0 ? 'blue' : 'gray',
                  },
                },
              };
              return acc;
            }, {})}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setCalendarVisible(false);
            }}
            renderHeader={(date) => {
              const headerDate = new Date(date);
              return (
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarHeaderText}>
                    {headerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                </View>
              );
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCalendarVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
  daysContainer: {
    marginVertical: 10,
  },
  dayContainer: {
    width: 60,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    marginHorizontal: 5,
  },
  selectedDay: {
    backgroundColor: '#283271',
  },
  daySmall: {
    fontSize: 12,
    color: '#888',
  },
  dayLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  taskCount: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  selectedDay: {
    backgroundColor: '#4A90E2',
  },
  dayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 14,
    color: '#888',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    paddingTop:10,
    paddingRight:15,
    paddingLeft:15,
    paddingBottom:20,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#283271',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AllTasksScreen;
