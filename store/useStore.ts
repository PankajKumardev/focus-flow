import { create } from 'zustand';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: number;
  userId: number;
}

interface Project {
  id: number;
  name: string;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}));
