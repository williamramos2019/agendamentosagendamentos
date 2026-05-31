export class BaseRepository {
  protected static async fetchAPI(action: string, options: RequestInit = {}) {
    const response = await fetch(`/api/api.php?action=${action}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
}
