import axios from 'axios';

const API_URL = 'http://192.168.100.21:5000';

//PROJECTS
export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const addProject = async (projectData) => {
  // console.log('Received project data:', projectData);  // Verifică dacă datele sunt primite
  try {
    const response = await axios.post(`${API_URL}/projects`, projectData);
    // console.log('Project added:', response.data);  // Verifică răspunsul serverului
    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    // console.log(projectId);
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting this project:', error);
    throw error;
  }
};

export const updateProject = async (updatedProject) => {
  // console.log(`Sending project with id:${updatedProject.id}.`, );
  try {
    // console.log("project deadline: ", updatedProject.deadline);
    const response = await axios.put(`${API_URL}/projects/${updatedProject.id}`, updatedProject);
    // console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};


//CATEGORIES
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (category) => {
  // console.log('sent data: ', category);
  try {
    const response = await axios.post(`${API_URL}/categories`, category);
    return response.data; 
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};


//USERS
export const fetchUsers = async () => {
  try{
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const addUser = async (user) => {
 //console.log('sent data: ', user);
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data; 
  } catch (error) {
    //console.log(error);
    //console.error('Error adding user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  // const {id} = user;
  try {
    // console.log(`ID: ${id}, userdata: ${user}`);
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting this user:', error);
    throw error;
  }
};

export const updateUser = async (updatedUser) => {
  //console.log(`Sending user with id:${updatedUser.id}, user: ${updatedUser}.`, );
  try {
    const response = await axios.patch(`${API_URL}/users/${updatedUser.id}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; 
  } catch (error) {
    // console.error('Login failed:', error);
    throw error.response?.data?.message || 'Authentication failed';
  }
};

export const changePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
  if (newPassword.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: 'New password and confirmation do not match.' };
  }

  try {
    const response = await axios.post(`${API_URL}/change-password`, {
      userId,
      oldPassword,
      newPassword,
    });

    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Something went wrong' };
  }
};


// TASKS
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getTasksByProjectId = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching tasks for project');
  }
};


export const addTask = async (taskData) => {
  // console.log('Received task data:', taskData);
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    // console.log('Task added:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    // console.log(projectId);
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting this task:', error);
    throw error;
  }
};

export const updateTask = async (updatedTask) => {
  // console.log(`Updating task with status:${updatedTask.status}`);
  try {
    const response = await axios.patch(`${API_URL}/tasks/${updatedTask.id}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};


// MESSAGES

export const getMessagesByTaskId = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/api/messages`, messageData);
    console.log('API message data: ', response.data);

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};