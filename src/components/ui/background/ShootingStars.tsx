const SHOOTING_STAR_COUNT = 5;

export default function ShootingStars() {
  const stars = Array.from({ length: SHOOTING_STAR_COUNT }).map((_, i) => {
    const style = {
      // 시작 위치를 화면 오른쪽 바깥으로 설정하여 자연스럽게 등장하도록 함
      top: `${Math.random() * 80 - 20}%`, // -20% ~ 60%
      left: `${Math.random() * 50 + 80}%`, // 80% ~ 130%
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${Math.random() * 2 + 3}s`, // 3s ~ 5s
    };
    return (
      <div key={i} className="fixed animate-shootingStar" style={style}>
        {/* 유성의 꼬리 부분 */}
        <div className="w-40 h-px bg-gradient-to-l from-white to-transparent" />
      </div>
    );
  });

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {stars}
    </div>
  );
}
