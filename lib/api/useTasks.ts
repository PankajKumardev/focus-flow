import { useQuery } from '@tanstack/react-query';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  projectId: number;
  userId: number;
};

const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks');

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
};

export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
