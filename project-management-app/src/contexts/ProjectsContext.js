import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, fetchCategories } from '../../api';

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // Starea globală de încărcare

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Pornește starea de încărcare
      try {
        const projectsData = await getProjects();
        const categoriesData = await fetchCategories();
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Oprește încărcarea
      }
    };

    fetchData();
  }, []);

  const updateProjectInContext = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
  };

  const addProjectToContext = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };
  

  const deleteProjectFromContext = (projectId) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
  };


  const addCategoryToContext = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        categories,
        loading,
        setProjects,
        setCategories,
        updateProjectInContext,
        addProjectToContext,
        deleteProjectFromContext,
        addCategoryToContext
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
