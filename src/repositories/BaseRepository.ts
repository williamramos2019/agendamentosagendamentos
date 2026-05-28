import { supabase } from "@/integrations/supabase/client";

export class BaseRepository {
  protected async fetchApi<T>(action: string, options: RequestInit = {}): Promise<T> {
    const sb = supabase as any;
    
    // Extrai o nome da tabela e possíveis parâmetros da query
    const parts = action.split('&');
    const tableNamePart = parts[0];
    const queryParams: Record<string, string> = {};
    
    for (let i = 1; i < parts.length; i++) {
      const [key, value] = parts[i].split('=');
      if (key && value) queryParams[key] = value;
    }
    
    // Mapeamento de ações para tabelas do Supabase
    const actionToTable: Record<string, string> = {
      'appointments': 'appointments',
      'sales': 'sales',
      'sales_create': 'sales',
      'cash_operations': 'cash_operations',
      'cash_operations_create': 'cash_operations',
      'leads': 'leads',
      'blog': 'blog_posts',
      'notifications': 'notifications',
      'neighborhood': 'neighborhoods',
      'neighborhoods': 'neighborhoods',
      'track_visit': 'site_visits',
      'track_event': 'site_events' 
    };

    const tableName = actionToTable[tableNamePart] || tableNamePart;
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    try {
      if (method === 'GET') {
        // Caso especial para contagem de notificações não lidas
        if (tableName === 'notifications' && queryParams.unread_count === 'true') {
          const { count, error } = await sb
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);
          
          if (error) throw error;
          return { count: count || 0 } as any;
        }

        let query = sb.from(tableName).select('*');
        
        // Aplica filtros baseados nos queryParams
        if (queryParams.token) {
          query = query.eq('access_token', queryParams.token).maybeSingle();
        } else if (queryParams.slug && queryParams.city) {
          // Filtro para bairros/SEO
          query = query.eq('city', queryParams.city).eq('slug', queryParams.slug).maybeSingle();
        } else if (queryParams.slug) {
          query = query.eq('slug', queryParams.slug).maybeSingle();
        } else {
          // Check if column created_at exists to avoid errors on tables without it (most have it)
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as T;
      } 
      
      if (method === 'POST' && !body?.update_status && !body?.mark_read) {
        const { data, error } = await sb
          .from(tableName)
          .insert(body)
          .select()
          .maybeSingle();
        
        if (error) throw error;
        return data as T;
      }

      if (method === 'PATCH' || (method === 'POST' && (body?.update_status || body?.mark_read))) {
        const { id, ...updateData } = body;
        
        // Mapeamento de campos legados para Supabase
        if (updateData.mark_read) {
          updateData.is_read = true;
          delete updateData.mark_read;
        }
        delete updateData.update_status; 

        const { data, error } = await sb
          .from(tableName)
          .update(updateData)
          .eq('id', id)
          .select()
          .maybeSingle();
        
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
