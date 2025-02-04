import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTasks, getTasksByProjectId} from '../../api';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTasksByProjectId = async (projectId) => {
    setLoading(true);
    try {
      const tasksData = await getTasksByProjectId(projectId);
      return tasksData;
    } catch (error) {
      console.error('Error fetching tasks by project ID:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const addTaskToContext = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const deleteTaskFromContext = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const updateTaskInContext = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };


  return (
    <TasksContext.Provider value={{ tasks, loading, addTaskToContext, deleteTaskFromContext, updateTaskInContext, fetchTasksByProjectId }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
