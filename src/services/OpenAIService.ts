import { supabase } from "@/integrations/supabase/client";

export class OpenAIService {
  /**
   * Gera conteúdo para o blog utilizando a Edge Function do Supabase.
   * Esta abordagem mantém a chave de API segura no servidor.
   */
  static async generateBlogContent(prompt: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt }
      });
      
      if (error) {
        console.error("Erro na chamada da Edge Function:", error);
        throw error;
      }
      
      return data.content;
    } catch (error) {
      console.error("OpenAI Generation error:", error);
      return null;
    }
  }

  /**
   * Método auxiliar para chat de atendimento, mantendo a consistência
   * com a arquitetura de serviços centralizada.
   */
  static async getChatResponse(messages: { role: string; content: string }[]) {
    try {
      const { data, error } = await supabase.functions.invoke('chat-atendimento', {
        body: { messages }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Chat service error:", error);
      throw error;
    }
  }
}
