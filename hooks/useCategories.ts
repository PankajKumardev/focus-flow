import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Example interface for a Category
interface Category {
  id: number;
  name: string;
  userId: number;
}

// Fetch all categories
async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

// Create a new category
async function createCategory(
  newCategory: Partial<Category>
): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCategory),
  });
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return response.json();
}

// Update an existing category
async function updateCategory(
  updatedCategory: Partial<Category>
): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCategory),
  });
  if (!response.ok) {
    throw new Error('Failed to update category');
  }
  return response.json();
}

// Delete a category
async function deleteCategory(categoryId: number): Promise<void> {
  const url = `/api/categories?id=${categoryId}`;
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}

export function useCategories() {
  const queryClient = useQueryClient();

  // READ: Fetch categories
  const {
    data: categories,
    error,
    isLoading,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // CREATE
  const createMutation = useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  // UPDATE
  const updateMutation = useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  // DELETE
  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  return {
    categories,
    error,
    isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
  };
}
