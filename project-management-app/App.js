import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Ecranele aplicației
import HomeScreen from './src/screens/HomeScreen';
import AllProjectsScreen from './src/screens/AllProjectsScreen';
import AddProjectForm from './src/screens/AddProjectForm';
import ViewProjectScreen from './src/screens/ViewProjectScreen';
import AllTasksScreen from './src/screens/AllTasksScreen';
import ViewUserScreen from './src/screens/ViewUserScreen';
import AllUsersScreen from './src/screens/AllUsersScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfile from './src/screens/EditProfile';

import { ProjectsProvider } from './src/contexts/ProjectsContext';
import { UserProvider } from './src/contexts/UserContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TasksProvider } from './src/contexts/TaskContext';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditProjectScreen from './src/screens/EditProjectScreen';
import ViewTaskScreen from './src/screens/ViewTaskScreen';

// Declarațiile pentru navigație
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componenta principală care controlează tab-urile și navigația de login
const AppNavigator = () => {

  const { currentUser } = useAuth();
  
  let canViewUsersTab = false; // Valoare implicită

  if (currentUser) {
    const { userData: user } = currentUser;
    canViewUsersTab = user?.role === 'root' || user?.role === 'admin';
  }

  return (
    <>
      {currentUser ? (
        // Dacă utilizatorul este autentificat, arată tab-urile
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Projects"
            component={AllProjectsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
          {canViewUsersTab && (
            <Tab.Screen
              name="Users"
              component={AllUsersScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people-outline" size={size} color={color} />
                ),
              }}
            />
          )}

          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        // Dacă utilizatorul nu este autentificat, arată ecranul de login
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

// Componenta principală care gestionează navigația globală
const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Tabs" 
      component={AppNavigator} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="View Project" 
      component={ViewProjectScreen} 
    />
    <Stack.Screen
      name="Add Project"
      component={AddProjectForm}
    />
    <Stack.Screen
      name="Edit Project"
      component={EditProjectScreen}
    />
    <Stack.Screen 
      name="View All Tasks" 
      component={AllTasksScreen} 
    />
    <Stack.Screen 
      name="View User" 
      component={ViewUserScreen} 
    />
    <Stack.Screen 
      name="Add Task" 
      component={AddTaskScreen} 
    />
    <Stack.Screen 
      name="View Task" 
      component={ViewTaskScreen} 
    />
    <Stack.Screen 
      name="Edit Profile" 
      component={EditProfile} 
    />
  </Stack.Navigator>
);

// Componenta de aplicație principală
const App = () => {


  return(
    <AuthProvider>
      <UserProvider>
        <ProjectsProvider>
          <TasksProvider>
            <NavigationContainer>
              <MainStackNavigator />
            </NavigationContainer>
          </TasksProvider>
        </ProjectsProvider>
      </UserProvider>
    </AuthProvider>
  );
}



export default App;
