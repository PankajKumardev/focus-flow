'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';

export default function TestCRUDPage() {
  const {
    tasks,
    isLoading: tasksLoading,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const {
    projects,
    isLoading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const {
    categories,
    isLoading: categoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Local form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Example create task
  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    try {
      await createTask({ title: newTaskTitle, priority: 'low' });
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Example update task
  const handleUpdateTask = async (id: number) => {
    try {
      await updateTask({ id, title: 'Updated Task Title' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Example delete task
  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Example create project
  const handleCreateProject = async () => {
    if (!newProjectName) return;
    try {
      await createProject({ name: newProjectName });
      setNewProjectName('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Example update project
  const handleUpdateProject = async (id: number) => {
    try {
      await updateProject({ id, name: 'Updated Project Name' });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Example delete project
  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Example create category
  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Example update category
  const handleUpdateCategory = async (id: number) => {
    try {
      await updateCategory({ id, name: 'Updated Category Name' });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Example delete category
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Test CRUD Page</h1>

      {/* Tasks Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Tasks</h2>
        {tasksLoading && <p>Loading tasks...</p>}
        {tasks && (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.title} (ID: {task.id})
                <button
                  onClick={() => handleUpdateTask(task.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button onClick={handleCreateTask} style={{ marginLeft: '0.5rem' }}>
            Create Task
          </button>
        </div>
      </section>

      {/* Projects Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Projects</h2>
        {projectsLoading && <p>Loading projects...</p>}
        {projects && (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                {project.name} (ID: {project.id})
                <button
                  onClick={() => handleUpdateProject(project.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            onClick={handleCreateProject}
            style={{ marginLeft: '0.5rem' }}
          >
            Create Project
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Categories</h2>
        {categoriesLoading && <p>Loading categories...</p>}
        {categories && (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                {category.name} (ID: {category.id})
                <button
                  onClick={() => handleUpdateCategory(category.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button
            onClick={handleCreateCategory}
            style={{ marginLeft: '0.5rem' }}
          >
            Create Category
          </button>
        </div>
      </section>
    </div>
  );
}
