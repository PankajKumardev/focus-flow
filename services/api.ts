export const createTask = async (task: any) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
};

export const deleteTask = async (taskId: number) => {
  const response = await fetch(`/api/tasks?id=${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return response.json();
};

export const createProject = async (project: any) => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  return response.json();
};

export const deleteProject = async (projectId: number) => {
  const response = await fetch(`/api/projects?id=${projectId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return response.json();
};
