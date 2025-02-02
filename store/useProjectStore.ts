import { create } from 'zustand';
import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from '@/actions/projectAction';

interface ProjectState {
  projects: any[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: { name: string }) => Promise<void>;
  updateProject: (projectId: number, name: string) => Promise<void>;
  removeProject: (projectId: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const projects = await getProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },

  addProject: async (project) => {
    set({ loading: true });
    try {
      const newProject = { ...project, createdAt: new Date() };
      await createProject(newProject);
      await useProjectStore.getState().fetchProjects();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to create project', loading: false });
    }
  },

  updateProject: async (projectId, name) => {
    set({ loading: true });
    try {
      await updateProject(projectId, name);
      await useProjectStore.getState().fetchProjects();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to update project', loading: false });
    }
  },

  removeProject: async (projectId) => {
    set({ loading: true });
    try {
      await deleteProject(projectId);
      await useProjectStore.getState().fetchProjects();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to delete project', loading: false });
    }
  },
}));
