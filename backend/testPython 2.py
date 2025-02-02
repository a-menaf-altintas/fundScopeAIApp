const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const scriptPath = path.join(__dirname, 'ai', 'llamaModel.py');
console.log("Using script at:", scriptPath);

if (!fs.existsSync(scriptPath)) {
    console.error("Script not found:", scriptPath);
    process.exit(1);
}

let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: path.join('/Users/aaltintas/local_venvs/fundScopeEnv/bin/python'),
    args: ["Test profile"],
    cwd: path.join(__dirname, 'ai'), // set working directory explicitly
    timeout: 10000
};

console.log("Invoking PythonShell...");
PythonShell.run(scriptPath, options, (err, results) => {
    console.log("Inside PythonShell callback");
    if (err) {
        console.error("PythonShell error:", err);
    } else {
        console.log("PythonShell results:", results);
    }
});
