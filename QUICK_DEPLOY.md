# 빠른 배포 가이드

## 🚀 Vercel 배포 (5분 안에 배포하기)

### 1단계: 프로젝트 준비

```bash
# 빌드 테스트 (로컬에서 먼저 확인)
npm run build
```

### 2단계: Vercel에 배포

1. **Vercel 가입/로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인 (권장)

2. **프로젝트 연결**
   - 대시보드 → "Add New Project"
   - GitHub 저장소 선택
   - 프로젝트 Import

3. **환경 변수 설정**
   
   Vercel 대시보드 → Settings → Environment Variables에서 다음 변수들을 추가하세요:

   **필수 변수:**
   ```
   DATABASE_URL=postgresql://...
   DIRECT_URL=postgresql://...
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=(아래 명령어로 생성)
   BLOB_READ_WRITE_TOKEN=...
   ```

   **NEXTAUTH_SECRET 생성:**
   ```bash
   openssl rand -base64 32
   ```

4. **자동 배포**
   - 코드를 Git에 푸시하면 자동으로 배포됩니다
   - 또는 Vercel 대시보드에서 "Deploy" 버튼 클릭

### 3단계: 데이터베이스 설정

**Supabase 사용 (무료):**
1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. Vercel 환경 변수에 `DATABASE_URL`과 `DIRECT_URL` 설정

**데이터베이스 마이그레이션:**
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link

# 마이그레이션 실행
npx prisma migrate deploy
```

또는 Vercel Build Command에 추가:
```
prisma generate && prisma migrate deploy && next build
```

### 4단계: Vercel Blob Storage 설정

1. Vercel 대시보드 → Storage
2. "Create Database" → "Blob" 선택
3. 프로젝트 연결
4. 생성된 토큰을 `BLOB_READ_WRITE_TOKEN` 환경 변수에 설정

### 5단계: 확인

배포 완료 후 제공되는 URL로 접속하여 확인하세요!

---

## 📋 배포 전 체크리스트

- [ ] `npm run build` 성공 확인
- [ ] 프로덕션 데이터베이스 준비 완료
- [ ] 모든 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 이미지 업로드 서비스 설정 완료

---

## 🔧 문제 해결

**빌드 실패:**
- 환경 변수가 모두 설정되었는지 확인
- 로컬에서 `npm run build` 테스트

**데이터베이스 연결 오류:**
- `DATABASE_URL` 형식 확인
- 데이터베이스가 외부 접속을 허용하는지 확인

**이미지 업로드 오류:**
- `BLOB_READ_WRITE_TOKEN` 확인
- Vercel Blob Storage가 프로젝트에 연결되었는지 확인

---

자세한 내용은 [DEPLOY.md](./DEPLOY.md)를 참고하세요.
