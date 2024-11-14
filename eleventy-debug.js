// eleventy-debug.js

const { exec } = require("child_process");

// Set DEBUG environment variable and run eleventy
const command = process.platform === "win32"
    ? "set DEBUG=* && npx eleventy" // Windows
    : "DEBUG=* npx eleventy";        // macOS/Linux

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
});
