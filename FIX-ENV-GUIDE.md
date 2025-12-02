# .env 파일 수정 가이드

## 문제
`DATABASE_URL`이 여러 줄로 나뉘어져 있어서 데이터베이스 연결이 실패합니다.

## 해결 방법

메모장에서 `.env` 파일을 열었습니다. 다음과 같이 수정하세요:

### 1. DATABASE_URL 수정
현재 여러 줄로 나뉘어진 `DATABASE_URL`을 찾아서 **한 줄**로 만드세요:

```
DATABASE_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
```

### 2. DIRECT_URL 추가
두 번째 줄에 `DIRECT_URL`이 없다면 추가하세요:

```
DIRECT_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### 3. Supabase 클라이언트 키 추가 (선택사항)
Supabase anon key를 사용하여 클라이언트 측 연결을 설정하려면 다음을 추가하세요:

```
# Supabase Client Keys for anonymous access
SUPABASE_URL="https://tpebtbcypwefishdbnlt.supabase.co"
SUPABASE_ANON_KEY="[YOUR_ANON_KEY_HERE]"
```

Supabase anon key는 [Supabase Dashboard > Settings > API](https://supabase.com/dashboard/settings/api)에서 확인할 수 있습니다.

### 4. 최종 파일 형식
`.env` 파일은 다음과 같아야 합니다:

```
DATABASE_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres"
GOOGLE_API_KEY="AIzaSyBLmQBSCycGDUk60EnDckHr5VnneOf9zkQ"
CRON_SECRET="43e30249-4d65-429d-ab99-6e558e5603ce"

# Supabase Client Keys for anonymous access
SUPABASE_URL="https://tpebtbcypwefishdbnlt.supabase.co"
SUPABASE_ANON_KEY="[YOUR_ANON_KEY_HERE]"

# News API Keys
GNEWS_API_KEY="09fe211d25156bd6050ae47e4b59347b"
NAVER_CLIENT_ID="5q5NdmQc_11Hq_FpcIdD"
NAVER_CLIENT_SECRET="jy30yOl4m0"
```

### 4. 저장 후
1. 메모장에서 저장하고 닫기
2. VS Code에서 `.env` 파일을 닫기 (중요!)
3. 개발 서버 재시작: `Ctrl+C` 후 `npm run dev`
