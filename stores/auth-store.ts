import { create } from 'zustand';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  projectId: number;
};

type TaskState = {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  setTasks: (tasks) => set({ tasks }),
}));
