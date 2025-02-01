import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Project = {
  id: number;
  name: string;
  userId: number;
};

const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch('/api/projects', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
