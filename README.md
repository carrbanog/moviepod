[프로젝트 개요]

목표: Next.js의 기본기(서버 컴포넌트, App Router, 데이터 페칭)를 탄탄하게 익히고 프론트엔드 개발자 포트폴리오로 활용하기 위한 웹 프로젝트.

개발 철학: 복잡한 기능은 배제하고 "기본에 충실하며 사용자 경험(UX)이 매끄러운 완성도"에 집중.

개발 및 최적화 전략: 빠른 초기 개발 후 성능 지표(Before/After) 비교 분석.

[개발 및 성능 최적화 단계]

1단계 (빠른 구현 & 필수 최적화):

기능 구현을 최우선으로 진행하여 빠르게 프로덕트를 완성함.

Next.js가 기본 제공하는 효율적인 최적화 도구만 선별하여 우선 적용.

next/font: 폰트 메타데이터를 서버에서 미리 계산해 폰트 다운로드 지연으로 인한 레이아웃 시프트(Reflow)를 방지.

next/image: 이미지 WebP 변환 및 Lazy Loading 적용.

2단계 (성능 측정 및 심화 최적화):

초기 배포 후 Lighthouse 등을 사용하여 성능(LCP, CLS, FCP 등) 수치 측정.

데이터 분석 후 병목 지점을 파악하여 추가 최적화(코드 스플리팅, 불필요한 렌더링 방지, API 응답 캐싱 세밀화 등) 진행 및 수치 개선율(Before & After) 문서화.

[기술 스택]

Core: Next.js (App Router), TypeScript

Styling & UI: Tailwind CSS, shadcn/ui

Database: MongoDB (Mongoose 활용 - 프론트엔드와 통합된 API 라우트 사용)

State & Fetching: TanStack Query (React Query) - 무한 스크롤 및 클라이언트 데이터 페칭 최적화용

Auth: NextAuth.js (소셜 로그인 처리)

[핵심 구현 기능]

영화 데이터 렌더링: 외부 API(TMDB)를 활용한 영화 목록 제공.

장르별 라우팅: /genre/[id] 동적 라우팅 및 React Query를 이용한 무한 스크롤.

로그인 및 인증: NextAuth를 이용한 소셜 로그인.

유저 인터랙션 (찜하기): MongoDB 연동 및 낙관적 업데이트(Optimistic UI)를 적용한 찜하기 기능, 내 프로필(/profile) 모아보기.

[폴더 및 아키텍처 구조 (실무 프래그마틱 패턴)]
중소기업 및 실무에서 유지보수하기 좋은 직관적인 관심사 분리 구조를 채택함.

app/: 라우팅 및 뷰 렌더링, loading.tsx, error.tsx 적극 활용.

components/ui/: shadcn/ui 등 단순 디자인(Dumb) 컴포넌트.

components/domain/: 비즈니스 로직(상태, API 호출)이 섞인(Smart) 컴포넌트 (예: MovieCard, FavoriteButton).

services/: 외부 API(TMDB) 통신 로직 중앙 집중화.

lib/: MongoDB 연결 설정 및 공통 유틸리티 함수.

types/: TypeScript 타입 및 인터페이스 정의.

[AI 어시스턴트 지시사항]
위 명세서를 바탕으로 내 질문에 답변해 줘.

오버엔지니어링을 피하고 직관적이고 깔끔한 코드를 제시할 것.

에러 발생 시의 예외 처리(try-catch, error.tsx 등)를 항상 고려할 것.

컴포넌트 분리 시 ui/와 domain/의 관심사 분리 원칙을 지킬 것.
