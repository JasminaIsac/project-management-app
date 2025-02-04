// AllProjectsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Ionicons } from '@expo/vector-icons';
import { useProjects } from '../contexts/ProjectsContext';
import ProjectCard from '../components/ProjectCard';

const AllProjectsScreen = () => {

  const navigation = useNavigation();
  const { projects, categories } = useProjects();

    React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Add Project')}>
          <Ionicons name="add" size={24} color="black" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    return dateB - dateA;
  });

  const handleProjectClick = (project) => {
    navigation.navigate('View Project', { project });
  };

  // const renderProjectCard = ({ item }) => {
  //   const completedTasks = item.tasks ? item.tasks.filter(task => task.status === 'completed').length : 0;
  //   const totalTasks = item.tasks ? item.tasks.length : 0;
    
  //   const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
   
  //   const deadline = item.deadline ? item.deadline.split('T')[0] : 'No deadline';
  //   const updated_at = item.updated_at.split('T')[0];

  //   return (
  //     <TouchableOpacity style={styles.card} onPress={() => handleProjectClick(item)}>
  //       <View style={styles.cardContent}>
  //         <View style={styles.textSection}>
  //           <Text style={styles.projectTitle}>{item.name}</Text>
  //           <Text style={styles.projectCategory}>{getCategoryName(item.category_id)}</Text>
  //           {/* <Text style={styles.projectTeam}>Team: {item.team}</Text> */}
  //           <Text style={styles.projectTeam}>Updated: {updated_at}</Text>

  //         </View>
  //         <CircularProgress
  //           value={percentComplete}
  //           radius={40}
  //           maxValue={100}
  //           duration={1500}
  //           activeStrokeColor="#3399FF"
  //           inActiveStrokeColor="#ccc"
  //           inActiveStrokeOpacity={0.4}
  //           textColor="#333"
  //           fontSize={18}
  //         />
  //       </View>

  //       {item.deadline ? 
  //         <Text style={styles.deadline}>By {deadline}</Text>
  //         : <Text style={styles.deadline}>No deadline</Text>
  //       }
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <View style={styles.layout}>
      {/* <Text style={styles.title}>Your projects</Text> */}
      <FlatList
        data={sortedProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectCard
            item={item}
            onPress={handleProjectClick}
            getCategoryName={getCategoryName}
          />
        )}
        ListEmptyComponent={<Text style={styles.noProjects}>No more projects</Text>}
      />
            
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
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
    marginTop: 10,
    fontSize: 14,
    color: '#ff9800',
  },
  noProjects: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AllProjectsScreen;
