import { useQuery } from '@tanstack/react-query';

type Project = {
  id: number;
  name: string;
};

const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch('/api/projects');

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
};

export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
