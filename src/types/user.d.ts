import type { JwtPayload } from '@supabase/supabase-js';

type Claims =
  | (JwtPayload & {
      sub: string;
      role?: string;
      user_metadata?: {
        avatar_url: string;
        email: string;
        email_verified: boolean;
        iss: string;
        phone_verified: boolean;
        preferred_username: string;
        provider_id: string;
        sub: string;
        user_name: string;
      };
    })
  | null;
