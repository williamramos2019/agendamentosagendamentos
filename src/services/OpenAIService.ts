import { getApiUrl } from "@/config/api";

export class OpenAIService {
  static async generateBlogContent(prompt: string): Promise<string | null> {
    try {
      const response = await fetch(getApiUrl('generate_content'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("OpenAI Generation error:", error);
      return null;
    }
  }

  static async getChatResponse(messages: { role: string; content: string }[]) {
    try {
      const response = await fetch(getApiUrl('chat_atendimento'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) throw new Error();
      return await response.json();
    } catch (error) {
      console.error("Chat service error:", error);
      throw error;
    }
  }
}
