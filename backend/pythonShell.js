// backend/pythonShell.js
const { PythonShell } = require('python-shell');
const path = require('path');

exports.getFundingRecommendations = (req, res) => {
    const { userProfile } = req.body;
    console.log("Received userProfile:", userProfile);

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // unbuffered output
        pythonPath: path.join('/Users/aaltintas/local_venvs/fundScopeEnv/bin/python'),
        args: [userProfile],
        cwd: '/Users/aaltintas/tmp_ai', // Use the symlinked directory to avoid spaces
        maxBuffer: 1024 * 1024,  // 1MB output buffer
        encoding: 'utf8'
    };

    // Use the symlinked path for the Python script.
    const scriptPath = path.join('/Users/aaltintas/tmp_ai', 'llamaModel.py');
    console.log("Using script at:", scriptPath);

    let outputMessages = [];
    let pyshell = new PythonShell(scriptPath, options);

    pyshell.on('message', (message) => {
        console.log("Message from Python:", message);
        outputMessages.push(message);
    });

    pyshell.end((err, code, signal) => {
        console.log("PythonShell process ended with code:", code, "signal:", signal);
        if (err) {
            console.error("PythonShell error on end:", err);
            return res.status(500).json({ error: 'Error generating recommendations', details: err });
        }
        // Assume the last message is the JSON output.
        let jsonOutput = outputMessages[outputMessages.length - 1];
        try {
            let parsed = JSON.parse(jsonOutput);
            console.log("Parsed recommendation:", parsed.recommendation);
            res.json({ recommendation: parsed.recommendation });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.json({ recommendations: outputMessages });
        }
    });
};
