# 그룹 챌린지 앱

그룹과 함께하는 루틴 챌린지 어플리케이션

## 기술 스택

- **프레임워크**: Next.js 15.1.6 (App Router)
- **언어**: TypeScript 5.9
- **UI**: React 19.2.3, Tailwind CSS 3.4.17
- **인증**: NextAuth.js 4.24.13
- **데이터베이스**: PostgreSQL (Prisma 6.1.0)
- **상태 관리**: Zustand 5.0.3

## 시작하기

### 1. 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/group_challenge?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/group_challenge?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다.

**배포된 사이트**: [https://project-39-r7acdhr4e-yujeongs-projects-ab054c47.vercel.app/groups](https://project-39-r7acdhr4e-yujeongs-projects-ab054c47.vercel.app/groups)

### 배포 환경 변수

프로덕션 환경에서는 다음 환경 변수들이 설정되어야 합니다:
- `DATABASE_URL`: 프로덕션 데이터베이스 연결 문자열
- `DIRECT_URL`: Prisma용 직접 연결 문자열
- `NEXTAUTH_URL`: 프로덕션 사이트 URL
- `NEXTAUTH_SECRET`: NextAuth 세션 암호화 키
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage 토큰 (이미지 업로드용)

## 주요 기능

- ✅ 인증 시스템 (소셜 로그인, 이메일/비밀번호)
- ✅ 그룹 생성 및 참여
- ✅ 루틴 인증 시스템
- ✅ 댓글 및 소통 기능
- ✅ 신고 시스템
- ✅ 보상 시스템 (포인트, 배지, All Clear)
- ✅ 취미공유방
- ✅ 식물키우기
- ✅ 지나온 길 (여정 기록)
- ✅ 프로필 및 설정

## 프로젝트 구조

```
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
├── lib/              # 유틸리티 및 설정
├── prisma/           # Prisma 스키마
└── docs/             # 문서
```

## 문서

자세한 내용은 `docs/` 폴더의 문서를 참고하세요:

- [기획안](./docs/기획안.md)
- [디자인 가이드](./docs/디자인가이드.md)
- [Wireframe](./docs/wireframe.md)
- [코드 아키텍처](./docs/코드아키텍처.md)
- [개발 계획](./docs/개발계획.md)

## 라이선스

MIT
