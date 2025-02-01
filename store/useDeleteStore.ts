import { create } from 'zustand';

type DeleteStore = {
  deleteConfirmationOpen: boolean;
  itemToDelete: {
    id: number | null;
    type: 'task' | 'project' | null;
  };
  actions: {
    openDeleteConfirmation: (id: number, type: 'task' | 'project') => void;
    closeDeleteConfirmation: () => void;
  };
};

export const useDeleteStore = create<DeleteStore>((set) => ({
  deleteConfirmationOpen: false,
  itemToDelete: { id: null, type: null },
  actions: {
    openDeleteConfirmation: (id, type) =>
      set({
        deleteConfirmationOpen: true,
        itemToDelete: { id, type },
      }),
    closeDeleteConfirmation: () =>
      set({
        deleteConfirmationOpen: false,
        itemToDelete: { id: null, type: null },
      }),
  },
}));
