import { create } from 'zustand';

interface TaskStore {
  selectedProjectId: number | null;
  setSelectedProject: (id: number | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedProjectId: null,
  setSelectedProject: (id) => set({ selectedProjectId: id }),
}));
