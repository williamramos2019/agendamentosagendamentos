import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!data) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
    }
    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) return <div className="min-h-screen bg-[#090F15] flex items-center justify-center text-white/50">Validando acesso...</div>;

  return <>{children}</>;
}