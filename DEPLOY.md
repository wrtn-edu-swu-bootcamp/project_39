# 배포 가이드

이 문서는 그룹 챌린지 앱을 프로덕션 환경에 배포하는 방법을 안내합니다.

## 배포 전 체크리스트

### ✅ 필수 확인 사항

- [ ] 프로젝트가 정상적으로 빌드되는지 확인 (`npm run build`)
- [ ] 모든 환경 변수가 설정되어 있는지 확인
- [ ] 프로덕션 데이터베이스가 준비되어 있는지 확인
- [ ] Prisma 마이그레이션이 완료되었는지 확인
- [ ] 이미지 업로드 서비스(Vercel Blob)가 설정되어 있는지 확인

---

## 배포 방법

### 방법 1: Vercel 배포 (권장) ⭐

Vercel은 Next.js를 만든 회사에서 제공하는 플랫폼으로, Next.js 앱에 최적화되어 있습니다.

#### 1.1 Vercel 계정 생성 및 프로젝트 연결

1. [Vercel](https://vercel.com)에 가입/로그인
2. 대시보드에서 "Add New Project" 클릭
3. GitHub/GitLab/Bitbucket 저장소 연결
4. 프로젝트 선택 후 "Import" 클릭

#### 1.2 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

**필수 환경 변수:**
```env
# 데이터베이스 (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
DIRECT_URL=postgresql://user:password@host:5432/database?schema=public

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-token
```

**선택적 환경 변수 (소셜 로그인 사용 시):**
```env
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
```

**환경 변수 설정 방법:**
1. Vercel 프로젝트 대시보드 → Settings → Environment Variables
2. 각 변수를 추가 (Production, Preview, Development 환경별로 설정 가능)
3. `NEXTAUTH_SECRET` 생성 방법:
   ```bash
   openssl rand -base64 32
   ```

#### 1.3 빌드 설정

Vercel은 자동으로 Next.js를 감지하지만, 필요시 수정할 수 있습니다:

**Build Command:**
```bash
prisma generate && next build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

#### 1.4 데이터베이스 마이그레이션

**옵션 A: Vercel Build Command에서 자동 실행 (권장)**

Build Command를 다음과 같이 수정:
```bash
prisma generate && prisma migrate deploy && next build
```

**옵션 B: 수동 실행**

배포 후 Vercel CLI를 사용하여 마이그레이션:
```bash
npm i -g vercel
vercel login
vercel link
npx prisma migrate deploy
```

#### 1.5 배포 실행

1. 코드를 Git 저장소에 푸시
2. Vercel이 자동으로 배포 시작
3. 배포 완료 후 제공되는 URL로 접속 확인

#### 1.6 커스텀 도메인 설정 (선택)

1. Vercel 대시보드 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 안내에 따라 도메인 연결

---

### 방법 2: 다른 플랫폼 배포

#### 2.1 Netlify

1. [Netlify](https://www.netlify.com)에 가입
2. "Add new site" → "Import an existing project"
3. Git 저장소 연결
4. 빌드 설정:
   - **Build command:** `prisma generate && next build`
   - **Publish directory:** `.next`
5. 환경 변수 설정 (Vercel과 동일)
6. Netlify Functions 설정 필요 (API Routes용)

#### 2.2 Railway

1. [Railway](https://railway.app)에 가입
2. "New Project" → "Deploy from GitHub repo"
3. 프로젝트 선택
4. PostgreSQL 데이터베이스 추가
5. 환경 변수 설정
6. 빌드 및 배포 자동 실행

#### 2.3 Docker를 사용한 배포

**Dockerfile 생성:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**next.config.ts 수정:**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Docker 배포를 위해 추가
  // ... 기존 설정
}
```

---

## 프로덕션 데이터베이스 설정

### Supabase (권장)

1. [Supabase](https://supabase.com) 계정 생성
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. `DATABASE_URL`과 `DIRECT_URL`에 설정

### Neon

1. [Neon](https://neon.tech) 계정 생성
2. 새 프로젝트 생성
3. Connection string 복사하여 환경 변수에 설정

### Railway PostgreSQL

1. Railway에서 PostgreSQL 서비스 추가
2. Connection string 복사하여 환경 변수에 설정

### 데이터베이스 마이그레이션

프로덕션 데이터베이스에 스키마 적용:
```bash
# 환경 변수 설정 후
npx prisma migrate deploy
```

---

## Vercel Blob Storage 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) → Storage
2. "Create Database" → "Blob" 선택
3. 프로젝트 연결
4. 생성된 토큰을 `BLOB_READ_WRITE_TOKEN` 환경 변수에 설정

---

## 배포 후 확인 사항

### ✅ 기능 테스트

- [ ] 회원가입/로그인 작동 확인
- [ ] 그룹 생성 및 참여 기능 확인
- [ ] 이미지 업로드 기능 확인
- [ ] 루틴 인증 기능 확인
- [ ] 취미공유방 기능 확인

### ✅ 성능 확인

- [ ] 페이지 로딩 속도 확인
- [ ] 이미지 최적화 확인
- [ ] API 응답 시간 확인

### ✅ 보안 확인

- [ ] HTTPS 연결 확인
- [ ] 환경 변수 노출 여부 확인
- [ ] 인증 토큰 보안 확인

---

## 문제 해결

### 빌드 오류

**Prisma 관련 오류:**
```bash
# 로컬에서 먼저 테스트
npm run build

# Prisma 클라이언트 재생성
npx prisma generate
```

**환경 변수 오류:**
- 모든 필수 환경 변수가 설정되었는지 확인
- 변수 이름의 오타 확인
- Vercel 대시보드에서 환경 변수 재확인

### 데이터베이스 연결 오류

- `DATABASE_URL` 형식 확인
- 데이터베이스가 외부 접속을 허용하는지 확인 (Supabase, Neon은 기본 허용)
- 방화벽 설정 확인

### 이미지 업로드 오류

- `BLOB_READ_WRITE_TOKEN` 확인
- Vercel Blob Storage가 프로젝트에 연결되었는지 확인
- 업로드 파일 크기 제한 확인

---

## CI/CD 자동화

### GitHub Actions (선택)

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
```

---

## 모니터링 및 분석

### Vercel Analytics

1. Vercel 대시보드 → Analytics
2. Web Vitals 자동 수집
3. 사용자 행동 분석

### 에러 추적 (향후 추가)

- Sentry 통합 고려
- Vercel Logs 확인

---

## 추가 리소스

- [Vercel 배포 가이드](https://vercel.com/docs)
- [Next.js 배포 문서](https://nextjs.org/docs/deployment)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)
- [NextAuth 배포 가이드](https://next-auth.js.org/configuration/options#nextauth_url)
