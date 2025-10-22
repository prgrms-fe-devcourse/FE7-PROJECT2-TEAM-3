import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../stores/authStore";

// 로그인 하지 않은 사용자만 접근
export default function PublicOnlyRoute() {
  const location = useLocation();
  const claims = useAuthStore((state) => state.claims);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return null;

  if (claims) {
    const to = location.state?.from?.pathname ?? "/home";
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
