import { create } from 'zustand';
import { useTasks } from '@/lib/api/useTasks';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  projectId: number;
  userId: number;
};

type TaskState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  fetchTasks: () => {
    const { data, isError, isLoading } = useTasks();

    if (isLoading) {
      console.log('Loading tasks...');
      return;
    }

    if (isError) {
      console.log('Error fetching tasks');
      return;
    }

    if (data) {
      set({ tasks: data });
    }
  },
}));
