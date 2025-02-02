// backend/testExec.js
const { execFile } = require('child_process');
const path = require('path');

// Define the Python executable from your virtual environment.
const pythonExecutable = path.join('/Users/aaltintas/local_venvs/fundScopeEnv/bin/python');
// Use the symlink path for the script.
const scriptPath = path.join('/Users/aaltintas/tmp_ai', 'llamaModel.py');

console.log("Using Python executable:", pythonExecutable);
console.log("Using script at:", scriptPath);

// Set the working directory to the symlink folder.
const options = {
    cwd: '/Users/aaltintas/tmp_ai',
    maxBuffer: 1024 * 1024, // 1MB output buffer
    encoding: 'utf8'
};

// Execute the Python script with the argument "Test profile".
execFile(pythonExecutable, [scriptPath, "Test profile"], options, (error, stdout, stderr) => {
    console.log("Inside execFile callback");
    if (error) {
        console.error("Error executing script:", error);
        return;
    }
    console.log("Script stdout:");
    console.log(stdout);
    if (stderr) {
        console.error("Script stderr:");
        console.error(stderr);
    }
});
