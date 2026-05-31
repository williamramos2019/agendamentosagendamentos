import { supabase } from "@/integrations/supabase/client";

export interface RepositoryRequest {
  table: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, string>;
}

export class BaseRepository {
  protected async fetchApi<T>(action: string, options: RequestInit = {}): Promise<T> {
    const parts = action.split('&');
    const table = parts[0];
    const params: Record<string, string> = {};
    
    for (let i = 1; i < parts.length; i++) {
      const [key, value] = parts[i].split('=');
      if (key && value) params[key] = value;
    }

    return this.request<T>({
      table,
      method: (options.method as any) || 'GET',
      body: options.body ? JSON.parse(options.body as string) : undefined,
      params
    });
  }

  protected async request<T>(req: RepositoryRequest): Promise<T> {
    const { table: actionName, method = 'GET', body, params = {} } = req;
    const sb = supabase as any;
    
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

    const tableName = actionToTable[actionName] || actionName;

    try {
      if (method === 'GET') {
        if (tableName === 'notifications' && params.unread_count === 'true') {
          const { count, error } = await sb
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);
          
          if (error) throw error;
          return { count: count || 0 } as any;
        }

        let query = sb.from(tableName).select('*');
        
        if (params.token) {
          query = query.eq('access_token', params.token).maybeSingle();
        } else if (params.slug && params.city) {
          query = query.eq('city', params.city).eq('slug', params.slug).maybeSingle();
        } else if (params.slug) {
          query = query.eq('slug', params.slug).maybeSingle();
        } else {
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

      throw new Error(`Método ${method} não suportado pelo BaseRepository`);
    } catch (error: any) {
      console.error(`[Repository Error] Table: ${tableName}:`, error);
      throw error;
    }
  }

  protected handleError(error: any): never {
    console.error(`[Repository Error]:`, error);
    throw error;
  }
}
