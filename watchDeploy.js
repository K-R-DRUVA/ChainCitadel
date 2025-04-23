import fs from 'fs';
import * as readline from 'readline/promises';
// Hardcoded path to .env file
const envFilePath = "backend/.env";

// Load .env file content (or create if missing)
let envContent = "";
if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, 'utf8');
} else {
    console.log(`No .env file found at ${envFilePath}. A new one will be created.`);
}

const envLines = envContent.split(/\r?\n/);

// Regex to match contract address output
const regex = /(CRIMCHECK_CONTRACT_ADDRESS|CANDIDATE_REGISTRATION_CONTRACT_ADDRESS|VOTER_REGISTRATION_CONTRACT_ADDRESS|VOTING_CONTRACT_ADDRESS|ADMIN_CONTROL_CONTRACT_ADDRESS|RESULT_COMPILATION_ADDRESS):\s*(0x[a-fA-F0-9]{40})/g;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    let match;
    while ((match = regex.exec(line)) !== null) {
        const variable = match[1];
        const address = match[2];

        let found = false;

        // Search for the variable in the current .env content
        for (let i = 0; i < envLines.length; i++) {
            if (envLines[i].startsWith(variable + "=")) {
                envLines[i] = `${variable}=${address}`;
                found = true;
                break;
            }
        }

        // If variable is not found, append a new line to the .env file
        if (!found) {
            envLines.push(`${variable}=${address}`);
        }

        console.log(`✅ Updated: ${variable} = ${address}`);
    }
});

rl.on('close', () => {
    // Save the updated content back to the .env file
    fs.writeFileSync(envFilePath, envLines.join('\n'), 'utf8');
    console.log(`💾 Contract addresses saved to ${envFilePath}`);
});
