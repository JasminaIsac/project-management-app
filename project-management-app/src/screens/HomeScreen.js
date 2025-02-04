import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TodayProgress from '../components/today-progress.js';
import moment from 'moment';
import { useProjects } from '../contexts/ProjectsContext.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ProjectCard from '../components/ProjectCard.js';
import { Ionicons } from '@expo/vector-icons';


const today = moment().format('MMM, Do');

const HomeScreen = () => {
  const { projects, categories } = useProjects();
  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <Text style={{ marginRight: 8, fontWeight: 'bold' }}>{today}</Text>
          <Ionicons name="calendar-outline" size={24} color="black" />
        </TouchableOpacity>
      )
    });
  }, [navigation]);


  const handleProjectClick = (project) => {
    navigation.navigate('View Project', { project });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };


  return (
    <View style={styles.container}>
      <TodayProgress />
      <Text style={styles.header}>Continue with your projects:</Text>
      {/* <Text style={styles.header}>{today}</Text> */}

      <FlatList
        data={projects
          .filter((project) => project.status === 'in progress')
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 4)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectCard
            item={item}
            onPress={handleProjectClick}
            getCategoryName={getCategoryName}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No projects in progress</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default HomeScreen;
