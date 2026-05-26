import { getApiUrl } from "@/config/api";

export class UploadService {
  static async uploadFile(file: File, folder: string = "uploads"): Promise<string | null> {
    try {
      // Validação de segurança básica (tamanho)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Arquivo muito grande (max 5MB)");
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch(getApiUrl('upload'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha no upload');
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }
}
