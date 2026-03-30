# 🤝 Contributing to 치킨갤럭시

> 이 문서는 치킨갤럭시 프론트엔드 레포지토리에 기여할 때 따라야 하는 **협업 규칙과 코드 컨벤션**을 정리한 가이드입니다.

---

## 🌿 기본 워크플로우

1. Issue 생성 (작업 범위와 목적 정의)
2. 브랜치 생성 후 작업
3. PR 작성 및 리뷰 요청
4. 코드 리뷰 및 PR 승인
5. `dev`에 병합 후 작업 브랜치 삭제

---

## 🌱 브랜치 전략

### 브랜치 종류

| 구분 | 브랜치명 |
|------|---------|
| 배포용 | `main` |
| 개발용 | `dev` |
| 기능 개발용 | `feat/기능명` |

### 브랜치 네이밍 규칙

**형식:** `feat/기능명`

- `기능명`: `kebab-case`로 작성

**예시:**
```text
feat/main-page
feat/ranking-system
fix/login-redirect
```

---

## 🔁 Pull Request 규칙

### PR 제목 규칙

**형식:** `[Type] Subject`

- `Type`: 커밋 타입과 동일, 대괄호 `[]` 사용
- `Subject`: PR 핵심 내용을 **30자 이내**로 요약, 첫 글자 대문자

```text
[Feat] 메인 페이지 행성 UI 구현
[Fix] 로그인 리다이렉트 오류 수정
[Chore] 패키지 의존성 업데이트
```

**PR 전 체크리스트**
- [ ] PR 제목이 규칙에 맞게 작성되었는지 확인
- [ ] 작업 내용이 명확하게 설명되었는지 확인
- [ ] `console.log`, `debugger` 제거
- [ ] `npm run lint` 통과 확인
- [ ] 패키지 설치 여부 및 변경 사항 상세 기재
- [ ] UX에 영향을 주는 변경이라면 스크린샷/영상 첨부
- [ ] 본문 끝에 `Closes #이슈번호` 작성하여 이슈 자동 종료 연결

---

## 🪄 커밋 컨벤션 (Gitmoji)

**형식:** `{이모지} 작업 요약`

```text
✨ 메인 페이지 행성 UI 구현
🐛 useEffect 의존성 배열 누락 수정
```

### 커밋 타입

| 이모지 | 타입 | 설명 |
|--------|------|------|
| ✨ | `feat` | 새로운 기능 추가 |
| 🐛 | `fix` | 버그 수정 |
| 🎨 | `style` | 코드 포맷/스타일 변경 (기능 변경 없음) |
| 🔥 | `remove` | 파일/코드 삭제 |
| 📝 | `docs` | 문서 작성/수정 |
| ✅ | `test` | 테스트 추가/수정 |
| ♻️ | `refactor` | 코드 리팩토링 |

---

## 💻 코드 컨벤션

### 따옴표

```text
기본: 큰 따옴표 "
템플릿 리터럴: 백틱 `
```

### 들여쓰기

```text
소프트 탭 2칸
```

### 네이밍 규칙

| 구분 | 컨벤션 | 예시 |
|------|--------|------|
| 변수명 | `camelCase` | `userName` |
| 상수명 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| 타입명 | `PascalCase` | `UserProfile` |
| 컴포넌트명 | `PascalCase` | `MainPage` |
| Hook | `useName` | `useAuth` |

### 컴포넌트 작성

- 컴포넌트는 함수 선언식 사용
```typescript
export default function Component() {}
```
- 이벤트 핸들러: `handle~` (예: `handleDelete`)
- 콜백 Props: `on~` (예: `onEdit`, `onChange`, `onSubmit`)

---

## 📁 파일 & 폴더 네이밍

| 구분 | 컨벤션 |
|------|--------|
| 파일/폴더 | `kebab-case` |
| 컴포넌트 | `PascalCase` |
| Hook | `useName` |
| Zustand Store | `useNameStore` |
| Type/Interface | `Name`, `NameProps`, `NameType` |

---

## 🧭 이슈 & PR 템플릿

### 이슈 템플릿
- 요약
- 작업 내용
- 예상 결과
- 스크린샷
- 체크리스트

### PR 템플릿
- 작업 내용
- 작동 방식
- 확인 사항
- 스크린샷