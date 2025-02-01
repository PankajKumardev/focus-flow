import { useEffect } from 'react';
import { useTaskStore, useProjectStore } from '@/store/useStore';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import {
  createTask,
  createProject,
  deleteTask,
  deleteProject,
} from '@/services/api'; // You'll define these API services

const Dashboard = () => {
  const { tasks, setTasks } = useTaskStore();
  const { projects, setProjects } = useProjectStore();

  const { data: fetchedTasks, isLoading: isLoadingTasks } = useTasks();
  const { data: fetchedProjects, isLoading: isLoadingProjects } = useProjects();

  useEffect(() => {
    if (fetchedTasks) setTasks(fetchedTasks);
  }, [fetchedTasks, setTasks]);

  useEffect(() => {
    if (fetchedProjects) setProjects(fetchedProjects);
  }, [fetchedProjects, setProjects]);

  const handleTaskSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = form.title.value;
    const description = form.description.value;
    const priority = form.priority.value;
    const projectId = form.projectId.value;

    const newTask = {
      title,
      description,
      priority,
      projectId: Number(projectId),
    };

    await createTask(newTask);
  };

  const handleProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = form.name.value;

    const newProject = { name };
    await createProject(newProject);
  };

  if (isLoadingTasks || isLoadingProjects) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Task List */}
        <div>
          <h2 className="text-xl font-semibold">Tasks</h2>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="p-2 border rounded">
                <div>
                  <strong>{task.title}</strong> - {task.description}
                </div>
                <div>Priority: {task.priority}</div>
                <button
                  className="text-red-500"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete Task
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleTaskSubmit} className="mt-4 space-y-2">
            <h3>Add New Task</h3>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="border p-2 w-full"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="border p-2 w-full"
            />
            <select name="priority" className="border p-2 w-full">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select name="projectId" className="border p-2 w-full">
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              Add Task
            </button>
          </form>
        </div>

        {/* Project List */}
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.id} className="p-2 border rounded">
                <div>{project.name}</div>
                <button
                  className="text-red-500"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete Project
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleProjectSubmit} className="mt-4 space-y-2">
            <h3>Add New Project</h3>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              className="border p-2 w-full"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              Add Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
