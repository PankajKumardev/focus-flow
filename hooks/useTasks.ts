import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useTasks = (projectId?: number) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?projectId=${projectId || ''}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      priority: string;
      projectId: number;
      categoryId: number;
    }) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },
    onSuccess: (_, { projectId }) =>
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: {
      id: number;
      title?: string;
      description?: string;
      priority?: string;
      completed?: boolean;
      categoryId: number;
    }) => {
      const res = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    },
    onSuccess: (_, id) =>
      queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};
