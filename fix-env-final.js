const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

// Correct .env content - DATABASE_URL MUST be on a single line
const correctContent = `DATABASE_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres"
GOOGLE_API_KEY="AIzaSyBLmQBSCycGDUk60EnDckHr5VnneOf9zkQ"
CRON_SECRET="43e30249-4d65-429d-ab99-6e558e5603ce"

# News API Keys - Replace these with your actual keys
GNEWS_API_KEY="PLACEHOLDER_ENTER_YOUR_KEY_HERE"
NAVER_CLIENT_ID="PLACEHOLDER_ENTER_YOUR_KEY_HERE"
NAVER_CLIENT_SECRET="PLACEHOLDER_ENTER_YOUR_KEY_HERE"
`;

try {
    fs.writeFileSync(envPath, correctContent, 'utf8');
    console.log('✅ .env file has been fixed!');
    console.log('\n⚠️  IMPORTANT STEPS:');
    console.log('1. DO NOT open .env file yet');
    console.log('2. Restart your dev server (Ctrl+C then npm run dev)');
    console.log('3. Verify the app works');
    console.log('4. THEN open .env and add your API keys');
    console.log('5. Save and restart server again');
    console.log('\n💡 When editing .env, make sure each line stays on ONE line (no line breaks!)');
} catch (e) {
    console.error('❌ Error writing .env:', e.message);
    console.log('\n🔧 Please close the .env file in your editor and try again');
}
