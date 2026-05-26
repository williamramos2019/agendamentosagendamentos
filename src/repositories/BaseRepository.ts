import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

export class BaseRepository {
  protected supabase = supabase;

  protected handleError(error: PostgrestError | null) {
    if (error) {
      console.error(`[Repository Error]: ${error.message}`, error);
      throw new Error(error.message);
    }
  }
}
