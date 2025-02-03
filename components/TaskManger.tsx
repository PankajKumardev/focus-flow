// components/TaskManager.tsx
'use client';
import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';

export const TaskManager = () => {
  const { tasks, addTask, editTask, deleteTask, toggleTaskCompletion } =
    useTaskStore();
  const { projects } = useProjectStore();
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'low' as string,
    dueDate: new Date().toISOString().split('T')[0],
    projectId: projects[0]?.id || 1,
    category: 'work' as string,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projects.some((p) => p.id === taskData.projectId)) {
      alert('Please select a valid project');
      return;
    }
    if (editingTask) {
      await editTask({ ...taskData, id: editingTask.id });
    } else {
      await addTask(taskData);
    }
    setTaskData({
      title: '',
      description: '',
      priority: 'low',
      dueDate: new Date().toISOString().split('T')[0],
      projectId: projects[0]?.id || 0,
      category: 'work',
    });
    setEditingTask(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={taskData.description}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
          className="p-2 border rounded"
        />

        <select
          value={taskData.projectId}
          onChange={(e) =>
            setTaskData({ ...taskData, projectId: Number(e.target.value) })
          }
          className="p-2 border rounded"
          disabled={projects.length === 0}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          value={taskData.category}
          onChange={(e) =>
            setTaskData({ ...taskData, category: e.target.value as string })
          }
          className="p-2 border rounded"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="hobby">Hobby</option>
        </select>

        <input
          type="date"
          value={taskData.dueDate}
          onChange={(e) =>
            setTaskData({ ...taskData, dueDate: e.target.value })
          }
          className="p-2 border rounded"
        />

        <select
          value={taskData.projectId}
          onChange={(e) =>
            setTaskData({ ...taskData, projectId: Number(e.target.value) })
          }
          className="p-2 border rounded"
        >
          {projects.length === 0 ? (
            <option>Create a project first</option>
          ) : (
            projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))
          )}
        </select>

        <button
          type="submit"
          className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="w-4 h-4"
              />
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {task.priority}
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    {task.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setTaskData({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    dueDate: new Date(task.dueDate).toISOString().split('T')[0],
                    projectId: task.projectId,
                    category: task.category,
                  });
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
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
