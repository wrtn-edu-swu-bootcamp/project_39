# 프로젝트 설정 가이드

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
# 또는
pnpm install
# 또는
yarn install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 데이터베이스 (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/group_challenge?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/group_challenge?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="랜덤한-비밀키-생성-필요"

# OAuth (선택사항 - 소셜 로그인 사용 시)
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NAVER_CLIENT_ID=""
NAVER_CLIENT_SECRET=""

# Vercel Blob Storage (이미지 업로드용)
BLOB_READ_WRITE_TOKEN=""
```

**중요**: `NEXTAUTH_SECRET`은 다음 명령어로 생성할 수 있습니다:
```bash
openssl rand -base64 32
```

### 3. 데이터베이스 설정

#### PostgreSQL 설치 및 실행

로컬에서 PostgreSQL을 실행하거나, Supabase 같은 클라우드 서비스를 사용할 수 있습니다.

#### Prisma 마이그레이션

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push

# 또는 마이그레이션 사용 (권장)
npm run db:migrate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 기능

### ✅ 구현 완료

- 인증 시스템 (이메일/비밀번호, 소셜 로그인 준비)
- 그룹 생성 및 참여
- 루틴 인증 시스템 (일일 1회 제한)
- 출석 기록 및 참여도 계산
- 포인트 시스템 (일일 인증 보상)
- 취미공유방 (하루 1개 글 제한)
- 지나온 길 (여정 기록)
- 프로필 페이지

### 🚧 향후 추가 예정

- 댓글 기능
- 신고 시스템 UI
- All Clear 자동 판정 및 보상
- 식물키우기 기능
- 알림 시스템
- 실시간 업데이트

## 문제 해결

### 데이터베이스 연결 오류

- `DATABASE_URL`이 올바른지 확인
- PostgreSQL이 실행 중인지 확인
- 데이터베이스가 생성되었는지 확인

### 이미지 업로드 오류

- `BLOB_READ_WRITE_TOKEN`이 설정되었는지 확인
- Vercel Blob Storage 계정이 활성화되었는지 확인

### 인증 오류

- `NEXTAUTH_SECRET`이 설정되었는지 확인
- 세션 쿠키 설정 확인

## 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [프로젝트 문서](./docs/)
