// AuthLayout.tsx
import { Outlet } from 'react-router-dom';
import GalaxyBackground from '../../components/ui/background/GalaxyBackground';
import ShootingStars from '../../components/ui/background/ShootingStars';
// *경로를 실제 파일 위치에 맞게 수정하세요.

export default function AuthLayout() {
  return (
    // 1. 최상위 컨테이너: 화면을 꽉 채우고(w-screen h-screen) 상대적 기준점(relative) 설정
    <div className="w-screen h-screen relative overflow-hidden">
      {/* 2. 배경 레이어: 컴포넌트 내부에서 z-index를 설정하여 맨 뒤로 보냅니다. */}
      {/* GalaxyBackground 컴포넌트 내부의 div에 -z-10이 있는지 확인하세요. */}
      <GalaxyBackground />
      <ShootingStars />

      {/* 3. 콘텐츠 레이어: Outlet을 담는 컨테이너에 중앙 정렬을 확실히 적용하고 z-index를 높입니다. */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* 중앙 정렬의 대상인 로그인 폼(Outlet)이 z-10 레이어에 위치 */}
        <Outlet />
      </div>
    </div>
  );
}
