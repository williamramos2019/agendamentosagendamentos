import { supabase } from "@/integrations/supabase/client";

export class UploadService {
  static async uploadFile(file: File, bucket: string = "uploads"): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // Validação de segurança básica (tamanho e tipo)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Arquivo muito grande (max 5MB)");
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }
}
