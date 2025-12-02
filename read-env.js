const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(process.cwd(), '.env');
    console.log('Reading:', envPath);
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        console.log('--- Content Start ---');
        console.log(content);
        console.log('--- Content End ---');
    } else {
        console.log('File does not exist.');
    }
} catch (e) {
    console.error('Error:', e.message);
}
