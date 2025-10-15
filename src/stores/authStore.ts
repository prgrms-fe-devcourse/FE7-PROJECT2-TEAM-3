import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Claims } from '../types/user';
import supabase from '../utils/supabase';
import type { Profile } from '../types/profile';

const ALL_BADGES = [
  '치킨 미개봉자',
  '닭다리 초보자',
  '치밥 수련생',
  '소스 수집가',
  '닭껍질 연구원',
  '치킨 영웅',
  '치느님 추종자',
  '전설의 뼈 분리자',
  '갤럭시 맛 평가단장',
  '치킨 현자',
  '치느님 그 자체',
];

type AuthStore = {
  allBadges: string[];
  isLoading: boolean; // 데이터 패칭 로딩 여부
  claims: Claims; // JWTPayload(사용자 정보)
  profile: Profile | null; // Profiles 테이블의 데이터
  setClaims: (c: Claims) => void;
  hydrateFromAuth: () => void;
  clearAuth: () => void;
  setNextBadge: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        isLoading: true, // 데이터 패칭 로딩 여부
        claims: null, // JWTPayload
        profile: null, // profiles 테이블 데이터
        allBadges: ALL_BADGES,

        setNextBadge: async () => {
          const state = get();
          const profile = state.profile; // 타입 캐스팅
          const allBadges = state.allBadges;

          if (!profile || !profile.badge || !profile._id) {
            console.log(
              'profile || !profile.badge || !profile._id 중 하나가 없습니다.'
            );
            return;
          }

          const currentBadge = profile.badge;
          const userId = profile._id;

          const currentIndex = allBadges.indexOf(currentBadge);
          if (currentIndex === 10) {
            return;
          }
          const nextBadge = allBadges[currentIndex + 1];

          try {
            // Supabase DB 업데이트 요청
            const { error } = await supabase
              .from('profiles')
              .update({ badge: nextBadge })
              .eq('_id', userId)
              .select()
              .single();

            if (error) {
              throw error;
            }

            set((s) => {
              s.profile!.badge = nextBadge;
            });
          } catch (error) {
            console.error(error);
          }
        },

        setClaims: (c: Claims) =>
          set((state) => {
            state.claims = c;
          }),

        hydrateFromAuth: async () => {
          set({ isLoading: true });
          // (1) 클레임 가져오기 (JWT Payload)
          const { data: claimsData, error: claimsErr } =
            await supabase.auth.getClaims();
          // 세션 없음 or 초기화전일 수 있음
          if (claimsErr) {
            set({ claims: null, profile: null, isLoading: false });
            return;
          }

          const claims = claimsData?.claims;
          set({ claims: claims });

          // (2) 프로필을 조회
          if (claims?.sub) {
            const { data: profiles, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('_id', claims.sub)
              .single();

            if (error) {
              set({ claims: null, profile: null, isLoading: false });
              return;
            }

            set((state) => {
              state.profile = profiles;
            });
          }

          set({ isLoading: false });
        },
        clearAuth: () =>
          set((state) => {
            state.claims = null;
            state.profile = null;
          }),
      })),
      { name: 'auth-store' }
    )
  )
);
