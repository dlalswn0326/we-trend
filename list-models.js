const API_KEY = 'AIzaSyBLmQBSCycGDUk60EnDckHr5VnneOf9zkQ';

async function listModels() {
    console.log('Fetching available models...\n');
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    if (!response.ok) {
        console.log('Error:', response.status);
        return;
    }

    const data = await response.json();
    console.log('Available models:');
    data.models.forEach(model => {
        console.log(`\n- Model: ${model.name}`);
        console.log(`  Display Name: ${model.displayName}`);
        console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
    });
}

listModels();
