const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('.env file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    const [key, ...valueParts] = line.split('=');
    let value = valueParts.join('=');

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }

    if (key && value) {
        try {
            console.log(`Adding ${key} to Vercel...`);
            // Use printf to handle special characters in values
            execSync(`printf "%s" "${value}" | npx vercel env add ${key} production`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Failed to add ${key}: ${error.message}`);
        }
    }
}

console.log('All environment variables processed. Deploying to Vercel production...');
try {
    execSync('npx vercel --prod --yes', { stdio: 'inherit' });
} catch (error) {
    console.error('Final deployment failed. Check the logs above.');
}
