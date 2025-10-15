import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

// 로그인한 사용자만 접근
export default function ProtectedRoutes() {
  const location = useLocation();
  const claims = useAuthStore((state) => state.claims);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return null;

  if (!claims) {
    return <Navigate to={'/login'} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
