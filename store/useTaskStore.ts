import { create } from 'zustand';
import {
  createTask,
  getTasks,
  editTask,
  deleteTask,
  toggleTask,
} from '@/actions/taskActions';

interface TaskState {
  tasks: any[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: any) => Promise<void>;
  editTask: (task: any) => Promise<void>;
  deleteTask: (taskId: number | number[]) => Promise<void>;
  toggleTaskCompletion: (taskId: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true });
    try {
      await createTask(task);
      await useTaskStore.getState().fetchTasks();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to create task', loading: false });
    }
  },

  editTask: async (task) => {
    set({ loading: true });
    try {
      await editTask(task);
      await useTaskStore.getState().fetchTasks();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to edit task', loading: false });
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true });
    try {
      await deleteTask(taskId);
      await useTaskStore.getState().fetchTasks();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to delete task', loading: false });
    }
  },

  toggleTaskCompletion: async (taskId) => {
    set({ loading: true });
    try {
      await toggleTask(taskId);
      await useTaskStore.getState().fetchTasks();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to toggle task', loading: false });
    }
  },
}));
