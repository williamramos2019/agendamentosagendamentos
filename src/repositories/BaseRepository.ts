import { supabase } from "@/integrations/supabase/client";

export class BaseRepository {
  protected async fetchApi<T>(action: string, options: RequestInit = {}): Promise<T> {
    // Extrai o nome da tabela e possíveis parâmetros da query (token)
    const [tableNamePart, queryPart] = action.split('&');
    
    // Mapeamento de ações para tabelas do Supabase
    const actionToTable: Record<string, string> = {
      'appointments': 'appointments',
      'sales': 'sales',
      'sales_create': 'sales',
      'cash_operations': 'cash_operations',
      'cash_operations_create': 'cash_operations',
      'leads': 'leads',
      'blog': 'blog_posts',
      'track_visit': 'site_visits',
      'track_event': 'site_events' // Mapear para tabela correta se existir
    };

    const tableName = actionToTable[tableNamePart] || tableNamePart;
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    try {
      if (method === 'GET') {
        let query = supabase.from(tableName).select('*');
        
        // Suporte para busca por token (?action=appointments&token=...)
        if (queryPart && queryPart.startsWith('token=')) {
          const token = queryPart.split('=')[1];
          query = query.eq('access_token', token).maybeSingle() as any;
        } else {
          query = query.order('created_at', { ascending: false }) as any;
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as T;
      } 
      
      if (method === 'POST') {
        const { data, error } = await supabase
          .from(tableName)
          .insert(body)
          .select()
          .single();
        
        if (error) throw error;
        return data as T;
      }

      if (method === 'PATCH' || (method === 'POST' && body?.update_status)) {
        // Lógica específica para atualização de status baseada no id no body
        const { id, ...updateData } = body;
        delete updateData.update_status; // remove flag auxiliar

        const { data, error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as T;
      }

      throw new Error(`Método ${method} não suportado pelo BaseRepository Supabase`);
    } catch (error: any) {
      console.error(`[Supabase Repository Error] Action: ${action}:`, error);
      throw error;
    }
  }

  protected handleError(error: any): never {
    console.error(`[Repository Error]:`, error);
    throw error;
  }
}
