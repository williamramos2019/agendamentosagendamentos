import { COMPANY_INFO } from "@/config/whatsappTemplate";

export class BaseRepository {
  protected static async fetchAPI(action: string, options: RequestInit = {}) {
    const baseUrl = '/api.php'; // Ponto de entrada HostGator
    const url = `${baseUrl}?action=${action}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
