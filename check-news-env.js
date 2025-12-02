const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env file manually since we might not have dotenv or --env-file support guaranteed
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        console.log('--- Keys found in .env ---');
        envConfig.split('\n').forEach(line => {
            console.log('Line:', JSON.stringify(line));
            const match = line.match(/^([^=]+)\s*=\s*(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
                process.env[key] = value;
                console.log(`- ${key}`);
            }
        });
        console.log('--------------------------');
    } else {
        console.error('.env file not found!');
    }
} catch (e) {
    console.error('Error loading .env:', e);
}

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

console.log('--- Environment Check ---');
console.log('GNEWS_API_KEY:', GNEWS_API_KEY ? 'Present' : 'MISSING');
console.log('NAVER_CLIENT_ID:', NAVER_CLIENT_ID ? 'Present' : 'MISSING');
console.log('NAVER_CLIENT_SECRET:', NAVER_CLIENT_SECRET ? 'Present' : 'MISSING');

async function testGNews() {
    console.log('\n--- Testing GNews ---');
    if (!GNEWS_API_KEY) {
        console.log('Skipping GNews test (Key missing)');
        return;
    }
    const url = `https://gnews.io/api/v4/search?q=AI&lang=en&token=${GNEWS_API_KEY}&max=1`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const json = JSON.parse(data);
                    console.log(`Success! Found ${json.totalArticles} articles.`);
                } else {
                    console.error(`Error: Status ${res.statusCode}`);
                    console.error('Response:', data);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.error('Network Error:', err.message);
            resolve();
        });
    });
}

async function testNaver() {
    console.log('\n--- Testing Naver News ---');
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        console.log('Skipping Naver test (Keys missing)');
        return;
    }

    const options = {
        hostname: 'openapi.naver.com',
        path: '/v1/search/news.json?query=' + encodeURIComponent('AI') + '&display=1',
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    };

    return new Promise((resolve) => {
        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const json = JSON.parse(data);
                    console.log(`Success! Found ${json.total} items.`);
                } else {
                    console.error(`Error: Status ${res.statusCode}`);
                    console.error('Response:', data);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.error('Network Error:', err.message);
            resolve();
        });
    });
}

async function run() {
    await testGNews();
    await testNaver();
}

run();
