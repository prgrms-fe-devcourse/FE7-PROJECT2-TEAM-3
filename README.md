<p align="center">
  <a href="https://fe-7-project-2-team-3.vercel.app/home" target="_blank">
<img width="436" height="103" alt="image" src="https://github.com/user-attachments/assets/ebd07ae9-760d-4958-b0a1-fa8c0644d5f9" />
  </a>
</p>

# 🍗 치킨갤럭시 (Chicken Galaxy)

> 치킨을 사랑하는 모든 한국인들을 위한 치킨 전용 커뮤니티 플랫폼

- **개발 기간**: 2025.10.27 ~ 2025.11.20 (약 3주)
- **서비스 링크**: [치킨갤럭시 바로가기](https://fe-7-project-2-team-3.vercel.app/home)
- **레포지토리**: [GitHub](https://github.com/prgrms-fe-devcourse/FE7-PROJECT2-TEAM-3)

---

## 1️⃣ 프로젝트 개요

### 📖 소개

**치킨갤럭시**는 치킨 애호가들이 취향과 경험을 공유하며 최적의 치킨을 선택할 수 있도록
우주를 테마로 한 커뮤니티 중심의 정보 교류 플랫폼입니다.

### ✅ 주요 기능

- **치킨별자리 UI**: 우주 테마의 행성(Planet) UI로 각 커뮤니티 게시판을 직관적으로 탐색
- **랭킹 & 레벨 시스템**: 경험치 기반 유저 랭킹으로 지속적인 커뮤니티 참여 동기 부여
- **실시간 알림**: Supabase Realtime 기반 읽지 않은 메시지 상태 관리
- **실시간 검색 & 필터링**: 유저 검색, 해시태그 필터링, 최근 검색어 저장/삭제

### 🔎 팀원 소개

| 이름   | 역할                                                  | GitHub                                       |
| ------ | ----------------------------------------------------- | -------------------------------------------- |
| 박상아 | FE 팀장, Git 총괄, 디자인 총괄, 메인·검색·랭킹 시스템 | [@garlatonic](https://github.com/garlatonic) |
| 정진환 | Supabase Realtime 실시간 알림, 게시글 작성·필터링     | [@stupilman](https://github.com/stupilman)   |
| 김준영 | 소셜 로그인·인증, 마이페이지, 채팅                    | [@kkjun0](https://github.com/kkjun0)         |
| 김수연 | 게시글 상세 CRUD, 좋아요·댓글 시스템                  | [@suyeon1104](https://github.com/suyeon1104) |

---

## 2️⃣ 기술 스택

| 분류        | 기술                                         |
| ----------- | -------------------------------------------- |
| Framework   | React 19, React Router v7                    |
| Language    | TypeScript 5                                 |
| Build Tool  | Vite (rolldown-vite)                         |
| Styling     | Tailwind CSS v4                              |
| 상태관리    | Zustand v5                                   |
| 백엔드/DB   | Supabase (PostgreSQL, Realtime)              |
| 성능 최적화 | React Compiler (babel-plugin-react-compiler) |
| 협업 도구   | Figma, Git, Vercel                           |

---

## 3️⃣ 개발 환경 설정

### 📋 요구 사항

- **Node.js**: `>= 18.0.0`
- **패키지 매니저**: `npm`
- **추천 IDE 플러그인**: ESLint, Prettier, Tailwind CSS IntelliSense

### 🚀 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/prgrms-fe-devcourse/FE7-PROJECT2-TEAM-3.git
cd FE7-PROJECT2-TEAM-3

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

### 📜 주요 스크립트

| 명령어            | 설명               |
| ----------------- | ------------------ |
| `npm run dev`     | 개발 서버 실행     |
| `npm run build`   | 프로덕션 빌드      |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint`    | ESLint 검사        |

---

## 4️⃣ 프로젝트 구조

```
src/
├── App.tsx # 라우터 및 앱 진입점
├── main.tsx # 앱 마운트
├── index.css # 전역 스타일
├── assets/ # 이미지, 아이콘 등 정적 파일
├── components/ # 재사용 가능한 공통 UI 컴포넌트
├── hooks/ # 커스텀 React Hook
├── pages/ # 페이지 컴포넌트
├── stores/ # Zustand 전역 상태 스토어
├── types/ # TypeScript 공용 타입 정의
└── utils/ # 유틸리티 함수
```

---

## 5️⃣ 핵심 구현 포인트

### 🪐 치킨별자리 UI & 인터랙션

- 행성(Planet) UI의 드래그 방지, 이미지 줌 인/아웃 등 디테일한 인터랙션 구현
- `react-zoom-pan-pinch` 기반 줌 기능과 이벤트 핸들러 분리로 커서 UX 최적화

### ⚡ React Compiler 도입

- `babel-plugin-react-compiler` 선제적 도입으로 `useMemo`, `useCallback` 없이도 런타임 렌더링 성능 최적화
- 코드 복잡도 감소로 팀 전체 유지보수성 향상

### 🔍 검색 시스템

- 유저 검색, 해시태그 필터링, 최근 검색어 저장/삭제 등 검색 라이프사이클 전체 구현
- Skeleton UI 기반 로딩 최적화로 레이아웃 흔들림 없는 안정적인 UX 제공

### 🔔 실시간 알림 & 권한 분기

- Supabase Realtime 기반 읽지 않은 메시지(Unread) 상태 관리로 유저 리텐션 강화
- 비회원/회원 상태에 따른 좋아요, 사이드바 노출 등 동적 기능 제어

---

더 자세한 개발 컨벤션과 PR 작성 가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고해주세요.
