"use client"
import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

// Page 1: Project Management Page
const ProjectPage = () => {
  const { projects, fetchProjects, addProject, updateProject, removeProject } =
    useProjectStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectId, setEditProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async () => {
    if (newProjectName.trim() === '') return;
    await addProject({ name: newProjectName });
    setNewProjectName('');
  };

  const handleUpdateProject = async () => {
    if (editProjectId === null || editProjectName.trim() === '') return;
    await updateProject(editProjectId, editProjectName);
    setEditProjectId(null);
    setEditProjectName('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New Project Name"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddProject}
          className="bg-blue-500 text-white p-2"
        >
          Add Project
        </button>
      </div>

      <ul>
        {projects.filter(project => project !== undefined).map((project) => (
          <li key={project.id} className="mb-2">
            {editProjectId === project.id ? (
              <div>
                <input
                  type="text"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={handleUpdateProject}
                  className="bg-green-500 text-white p-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {project.name}{' '}
                <button
                  onClick={() => {
                    setEditProjectId(project.id);
                    setEditProjectName(project.name);
                  }}
                  className="bg-yellow-500 text-white p-2 ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProject(project.id)}
                  className="bg-red-500 text-white p-2 ml-2"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectPage;
