import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import supabase from '../utils/supabase';

export default function AuthBootstrap() {
  const hydrateFromAuth = useAuthStore((state) => state.hydrateFromAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    hydrateFromAuth();

    // supabase의 인증 상태가 변경될 때마다 실행
    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') clearAuth();
    });
    return () => sub.subscription.unsubscribe();
  }, [hydrateFromAuth, clearAuth]);

  return null;
}
