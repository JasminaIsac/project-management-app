// TaskList.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import TaskCard from './TaskCard';
import { useNavigation } from '@react-navigation/native';

const TaskList = ({ tasks, projectId }) => {
const navigation = useNavigation();

  // const handleTaskPress = (task) => {
  //   navigation.navigate('View Task', { task });
  // };

  return (
    <FlatList
      style={{ paddingBottom: 15 }}
      data={tasks
        .filter((task) => task.project_id === projectId)
        .sort((a, b) => {
          // Prioritatea in ordinea: high > medium > low
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          const priorityA = priorityOrder[a.priority.toLowerCase()] || 4; // Valoare implicita daca prioritatea lipseste
          const priorityB = priorityOrder[b.priority.toLowerCase()] || 4;

          if (priorityA !== priorityB) {
            return priorityA - priorityB; // Sortam dupa prioritate
          }

          // Daca prioritatile sunt egale, sortam dupa deadline (ascendent)
          const deadlineA = new Date(a.deadline);
          const deadlineB = new Date(b.deadline);

          return deadlineA - deadlineB; // Sortam dupa deadline
        })}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskCard item={item} />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks added</Text>
        </View>
      )}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
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

export default TaskList;
