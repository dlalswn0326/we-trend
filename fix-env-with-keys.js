const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

// Correct .env content with actual API keys from env-template.txt
const correctContent = `DATABASE_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres"
GOOGLE_API_KEY="AIzaSyBLmQBSCycGDUk60EnDckHr5VnneOf9zkQ"
CRON_SECRET="43e30249-4d65-429d-ab99-6e558e5603ce"

# News API Keys
GNEWS_API_KEY="09fe211d25156bd6050ae47e4b59347b"
NAVER_CLIENT_ID="5q5NdmQc_11Hq_FpcIdD"
NAVER_CLIENT_SECRET="jy30yOl4m0"
`;

try {
    fs.writeFileSync(envPath, correctContent, 'utf8');
    console.log('✅ .env file has been fixed with all API keys!');
    console.log('\n⚠️  IMPORTANT STEPS:');
    console.log('1. Close the .env file in VS Code if it is open');
    console.log('2. Restart your dev server (Ctrl+C then npm run dev)');
    console.log('3. The app should now work properly!');
    console.log('\n💡 If you need to edit .env in the future, make sure each line stays on ONE line (no line breaks!)');
} catch (e) {
    console.error('❌ Error writing .env:', e.message);
    console.log('\n🔧 Please close the .env file in your editor and try again');
}
