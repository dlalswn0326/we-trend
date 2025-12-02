const axios = require('axios');

async function testProfileApi() {
    try {
        console.log('Testing GET /api/profile...');
        const getRes = await axios.get('http://localhost:3000/api/profile');
        console.log('GET Status:', getRes.status);
        console.log('GET Data:', getRes.data);

        console.log('\nTesting PUT /api/profile...');
        const putRes = await axios.put('http://localhost:3000/api/profile', {
            name: 'API Test User',
            bio: 'Bio updated via API script',
            profileImage: null
        });
        console.log('PUT Status:', putRes.status);
        console.log('PUT Data:', putRes.data);

        console.log('\nVerifying update...');
        const verifyRes = await axios.get('http://localhost:3000/api/profile');
        console.log('Verify Data:', verifyRes.data);

        if (verifyRes.data.name === 'API Test User' && verifyRes.data.bio === 'Bio updated via API script') {
            console.log('\nSUCCESS: Profile updated correctly.');
        } else {
            console.log('\nFAILURE: Profile update mismatch.');
        }
    } catch (error) {
        console.error('API Test Failed:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

testProfileApi();
