import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: number) => {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
