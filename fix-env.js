const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

// Read current content to preserve any API keys the user added
let currentContent = '';
try {
    currentContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('Could not read .env:', e.message);
}

// Extract API keys if they exist and are not placeholders
const extractKey = (content, keyName) => {
    const match = content.match(new RegExp(`${keyName}=["']?([^"'\\n]+)["']?`));
    if (match && match[1] && !match[1].includes('PLACEHOLDER')) {
        return match[1];
    }
    return 'PLACEHOLDER_ENTER_YOUR_KEY_HERE';
};

const gnewsKey = extractKey(currentContent, 'GNEWS_API_KEY');
const naverClientId = extractKey(currentContent, 'NAVER_CLIENT_ID');
const naverClientSecret = extractKey(currentContent, 'NAVER_CLIENT_SECRET');

// Clean .env content with proper database URLs
const cleanContent = `DATABASE_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.tpebtbcypwefishdbnlt:rhdtka26**@aws-ap-southeast-1.pooler.supabase.com:5432/postgres"
GOOGLE_API_KEY="AIzaSyBLmQBSCycGDUk60EnDckHr5VnneOf9zkQ"
CRON_SECRET="43e30249-4d65-429d-ab99-6e558e5603ce"

# News API Keys
GNEWS_API_KEY="${gnewsKey}"
NAVER_CLIENT_ID="${naverClientId}"
NAVER_CLIENT_SECRET="${naverClientSecret}"
`;

try {
    fs.writeFileSync(envPath, cleanContent, 'utf8');
    console.log('✅ .env file has been repaired!');
    console.log('\n📋 Current API Keys:');
    console.log(`   GNEWS_API_KEY: ${gnewsKey.substring(0, 20)}...`);
    console.log(`   NAVER_CLIENT_ID: ${naverClientId.substring(0, 20)}...`);
    console.log(`   NAVER_CLIENT_SECRET: ${naverClientSecret.substring(0, 20)}...`);
    console.log('\n⚠️  If any keys show "PLACEHOLDER...", please update them in .env');
    console.log('💡 After updating, restart your dev server (Ctrl+C then npm run dev)');
} catch (e) {
    console.error('Error writing .env:', e.message);
}
