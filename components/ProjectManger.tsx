// components/ProjectManager.tsx
'use client';
import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

export const ProjectManager = () => {
  useEffect(() => {
    if (projects.length === 0) {
      addProject({ name: 'Default Project' });
    }
  }, []);
  const { projects, addProject, updateProject, removeProject } =
    useProjectStore();
  const [editingProject, setEditingProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      await updateProject(editingProject.id, newProjectName);
    } else {
      await addProject({ name: newProjectName });
    }
    setNewProjectName('');
    setEditingProject(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editingProject ? 'Update' : 'Create'} Project
        </button>
      </form>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded"
          >
            <span>{project.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingProject(project);
                  setNewProjectName(project.name);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
