import { create } from 'zustand';

type TaskStore = {
  selectedTask: number | null;
  isTaskModalOpen: boolean;
  actions: {
    selectTask: (id: number | null) => void;
    openTaskModal: () => void;
    closeTaskModal: () => void;
  };
};

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  isTaskModalOpen: false,
  actions: {
    selectTask: (id) => set({ selectedTask: id }),
    openTaskModal: () => set({ isTaskModalOpen: true }),
    closeTaskModal: () => set({ isTaskModalOpen: false }),
  },
}));
