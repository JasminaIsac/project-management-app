import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const navigation = useNavigation();

//console.log("current user in profile",currentUser);

  // Starea locală pentru a păstra datele actualizate ale utilizatorului
  const [user, setUser] = useState(currentUser?.userData || null);

  // Actualizează starea locală când currentUser se schimbă
  useEffect(() => {
      setUser(currentUser?.userData || null);
  }, [currentUser]);

    React.useLayoutEffect(() => {
      if (user) {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Edit Profile', { user })}>
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
    }, [navigation, user]);

    if (!user) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>No user is logged in.</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role || 'User'}</Text>
        </View>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    value: {
      fontSize: 16,
      color: '#555',
    },
    error: {
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
    },
  });
  
  export default ProfileScreen;