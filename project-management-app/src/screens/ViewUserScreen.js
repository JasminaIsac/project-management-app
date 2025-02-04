    import React, { useState } from 'react';
    import { View, Text, StyleSheet, Button, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
    import { useNavigation } from '@react-navigation/native';
    import { Picker } from '@react-native-picker/picker';
    import { useUsers } from '../contexts/UserContext';
    import { updateUser, deleteUser } from '../../api'

    const ViewUserScreen = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    
    const { updateUserInContext, deleteUserFromContext } = useUsers();

    const handleDelete = async () => {
        try {
        await deleteUser(user.id);
        Alert.alert('Success', 'User deleted successfully');
        deleteUserFromContext(user.id);
        navigation.goBack();
        } catch (error) {
        console.error('Error deleting user:', error);
        Alert.alert('Error', 'Failed to delete user');
        }
    };

    const handleSave = async () => {
        console.log(editedUser.tel);

        if (!editedUser.name.trim()) {
          Alert.alert('Validation Error', 'User name cannot be empty');
          return;
        }

        if (!editedUser.email.trim() || !/\S+@\S+\.\S+/.test(editedUser.email)) {
            Alert.alert('Validation Error', 'Please enter a valid email');
            return;
        }

        if (!editedUser.tel.trim() || !/^(\+\d{1,3}\d{6,14}|0\d{8,14})$/.test(editedUser.tel)) {
            console.log(editedUser.tel);
            Alert.alert('Validation Error', 'Please enter a valid phone number');
            return;
        }
        


        try {
        console.log("User to update: ",editedUser);
        await updateUser(editedUser);
        Alert.alert('Success', 'User updated successfully');
        setEditMode(false);
        navigation.setParams({ user: editedUser });
        updateUserInContext(editedUser);
        } catch (error) {
        console.error('Error updating user:', error);
        Alert.alert('Error', 'Failed to update user');
        }
    };

    return (
        <View style={styles.container}>
        {/* <Text style={styles.title}>User Details</Text> */}

        {editMode ? (
            <>
            <TextInput
                style={styles.input}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="Email"
            />
            <TextInput
                style={styles.input}
                value={editedUser.tel}
                onChangeText={(text) => setEditedUser({ ...editedUser, tel: text })}
                placeholder="Tel"
            />

            <Picker
                selectedValue={editedUser.role}
                style={styles.picker}
                onValueChange={(value) => setEditedUser({ ...editedUser, role: value })}
            >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Project Manager" value="manager" />
                <Picker.Item label="Developer" value="developer" />
            </Picker>

            <TextInput
                style={styles.input}
                value={editedUser.location}
                onChangeText={(text) => setEditedUser({ ...editedUser, location: text })}
                placeholder="Location"
            />

            <Picker
                selectedValue={editedUser.status}
                style={styles.picker}
                onValueChange={(value) => setEditedUser({ ...editedUser, status: value })}
            >
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Inactive" value="inactive" />
                <Picker.Item label="Blocked" value="blocked" />
            </Picker>

            </>
        ) : (
            <>
            <Text style={styles.title}>{user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Tel: {user.tel}</Text>
            <Text>Role: {user.role}</Text>
            {user.location && (
            <Text>Location: {user.location}</Text>
            )}
            <Text>Status: {user.status}</Text>
            </>
        )}

        <TouchableOpacity
            style={styles.editButton}
            onPress={() => (editMode ? handleSave() : setEditMode(true))}
        >
            <Text style={styles.editButtonText}>{editMode ? 'Save Changes' : 'Edit User'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setModalVisible(true)}
        >
            <Text style={styles.deleteButtonText}>Delete User</Text>
        </TouchableOpacity>

        {/* Modal de confirmare */}
        <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Are you sure you want to delete this user?</Text>
                <View style={styles.modalButtons}>
                <Button title="Yes" onPress={handleDelete} />
                <Button title="No" onPress={() => setModalVisible(false)} />
                </View>
            </View>
            </View>
        </Modal>
        
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    picker: {
        height: 50,
        marginBottom: 10
    },
    editButton: {
        marginTop: 20,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    }
    });

    export default ViewUserScreen;
