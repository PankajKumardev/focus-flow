import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Example interface for a Project object in your database
interface Project {
  id: number;
  name: string;
  userId: number;
  createdAt?: string;
}

// Fetch all projects
async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/project');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

// Create a new project
async function createProject(newProject: Partial<Project>): Promise<Project> {
  const response = await fetch('/api/project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProject),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
}

// Update a project
async function updateProject(
  updatedProject: Partial<Project>
): Promise<Project> {
  const response = await fetch('/api/project', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProject),
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  return response.json();
}

// Delete a project
async function deleteProject(projectId: number): Promise<void> {
  const url = `/api/project?id=${projectId}`;
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
}

export function useProjects() {
  const queryClient = useQueryClient();

  // READ: Fetch projects
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // CREATE
  const createMutation = useMutation(createProject, {
    onSuccess: () => {
      // Refresh projects after creation
      queryClient.invalidateQueries(['projects']);
    },
  });

  // UPDATE
  const updateMutation = useMutation(updateProject, {
    onSuccess: () => {
      // Refresh projects after update
      queryClient.invalidateQueries(['projects']);
    },
  });

  // DELETE
  const deleteMutation = useMutation(deleteProject, {
    onSuccess: () => {
      // Refresh projects after deletion
      queryClient.invalidateQueries(['projects']);
    },
  });

  return {
    projects,
    error,
    isLoading,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
  };
}
