const API_KEY = 'AIzaSyBLmQBSCycGDUk60EnDckHr5VnneOf9zkQ';

async function test() {
    // Test gemini-1.5-pro with v1beta
    console.log('Testing gemini-1.5-pro with v1beta...');
    let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Hello' }] }]
            })
        }
    );
    console.log(`Status: ${response.status}`);
    if (!response.ok) {
        const error = await response.text();
        console.log('Error:', error);
    } else {
        const data = await response.json();
        console.log('Success:', JSON.stringify(data, null, 2));
    }
}

test();
