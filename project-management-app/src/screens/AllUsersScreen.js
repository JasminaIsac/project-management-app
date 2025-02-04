import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUsers } from '../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import AddUserModal from '../components/AddUserModal';

const AllUsersScreen = () => {
  const navigation = useNavigation();
  const { users } = useUsers();
  const [modalVisible, setModalVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="black" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleUserClick = (user) => {
    navigation.navigate('View User', { user });
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleUserClick(item)}>
      <View style={styles.cardContent}>
        <View style={styles.textSection}>
          <Text style={styles.projectTitle}>{item.name}</Text>
          <Text style={styles.projectCategory}>{item.email}</Text>
          <Text style={styles.projectTeam}>{item.tel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.layout}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserCard}
        ListEmptyComponent={<Text style={styles.noProjects}>No users</Text>}
      />

      {/* Modal separat */}
      <AddUserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  noProjects: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AllUsersScreen;
