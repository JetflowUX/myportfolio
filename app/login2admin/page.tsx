import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) {
    return <AdminDashboard />;
  }

  return <AdminLoginForm />;
}
