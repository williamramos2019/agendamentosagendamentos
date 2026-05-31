import { AdminLogin } from "@/components/admin/AdminLogin";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  return (
    <AdminLogin 
      onBack={() => navigate("/")} 
      onSuccess={() => navigate(from, { replace: true })} 
    />
  );
}
