const API_URL = '/api/categories';

export async function fetchCategories() {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error('Could not fetch categories');
  }
  return await response.json();
}
