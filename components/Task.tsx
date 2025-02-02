"use client"
import { useTaskStore } from '@/store/useTaskStore';
import { useEffect, useState } from 'react';

const TaskPage = () => {
  const {
    tasks,
    fetchTasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTaskStore();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'low',
    dueDate: '',
    projectId: 1,
    categoryId: 1,
    category: 'work',
    completed: false,
  });
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskData, setEditTaskData] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    await addTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'low',
      dueDate: '',
      projectId: 1,
      categoryId: 1,
      category: 'work',
      completed: false,
    });
  };

  const handleEditTask = async () => {
    if (!editTaskData || !editTaskData.title.trim()) return;
    await editTask(editTaskData);
    setEditTaskId(null);
    setEditTaskData(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="New Task Title"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white p-2">
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2">
            {editTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editTaskData?.title || ''}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, title: e.target.value })
                  }
                  className="border p-2 mr-2"
                />
                <button
                  onClick={handleEditTask}
                  className="bg-green-500 text-white p-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {task.title} - {task.completed ? 'Completed' : 'Pending'}
                <button
                  onClick={() => {
                    setEditTaskId(task.id);
                    setEditTaskData(task);
                  }}
                  className="bg-yellow-500 text-white p-2 ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white p-2 ml-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="bg-blue-500 text-white p-2 ml-2"
                >
                  Toggle Status
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;
