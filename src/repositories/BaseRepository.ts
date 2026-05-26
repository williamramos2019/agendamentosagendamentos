import { getApiUrl } from "@/config/api";

export class BaseRepository {
  protected async fetchApi<T>(action: string, options: RequestInit = {}): Promise<T> {
    const url = getApiUrl(action);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  protected handleError(error: any): never {
    console.error(`[Repository Error]:`, error);
    throw error;
  }
}
