// components/TaskForm.tsx
'use client';
import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';

export const TaskForm = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    dueDate: '',
    projectId: 0,
    category: 'work' as 'work' | 'personal' | 'hobby',
  });

  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask({
      ...task,
      dueDate: new Date().toISOString().split('T')[0], // Default to today
    });
    // Reset form
    setTask({ ...task, title: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {/* Add other form fields */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Task
      </button>
    </form>
  );
};
