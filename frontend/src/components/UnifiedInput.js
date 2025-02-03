import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Tooltip,
  Fade
} from '@mui/material';

import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';

// PDF Worker Setup
GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const UnifiedInput = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice input logic
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + " " + transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Handle file input (PDF or plain text)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        getDocument({ data: typedarray }).promise
          .then(pdf => {
            const maxPages = pdf.numPages;
            let pageTextPromises = [];
            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
              pageTextPromises.push(
                pdf.getPage(pageNum).then(page =>
                  page.getTextContent().then(textContent => {
                    return textContent.items.map(item => item.str).join(' ');
                  })
                )
              );
            }
            Promise.all(pageTextPromises).then(pagesText => {
              const fullText = pagesText.join('\n');
              setInputText(fullText);
            });
          })
          .catch(err => {
            console.error("Error reading PDF:", err);
            setErrorMsg("Error processing PDF file: " + (err.message || err));
          });
      };
      fileReader.readAsArrayBuffer(file);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file type. Please upload a text file or PDF.");
    }
  };

  // Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult('');

    try {
      const response = await axios.post('/api/llama/recommend', { userProfile: inputText });
      if (response.data && response.data.recommendation) {
        setResult(response.data.recommendation);
      } else {
        setErrorMsg('No recommendation received.');
      }
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setErrorMsg("Error fetching recommendation.");
    }
    setLoading(false);
  };

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden' // ensures the header background color covers full width
      }}
    >
      {/** Distinct header area with light background */}
      <Box sx={{ backgroundColor: '#f2f2f2', p: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
          Find Funding Options
        </Typography>
        <Typography variant="body2" align="center">
          {/* Subheading / Tagline */}
          Enter details about your company, or attach a file to let FundScope AI recommend funding options.
        </Typography>
      </Box>

      <CardContent>
        {/* 
          Provide a quick example or helper text for the user:
          e.g. "We are a fintech startup seeking $500k..."
        */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Company Profile / Funding Requirements"
            placeholder="E.g. We are a fintech startup seeking $500k in seed funding..."
            multiline
            fullWidth
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            helperText="Provide a brief description of your company, funding needs, and any relevant info."
            sx={{ mt: 2, mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={isListening ? "Stop Listening" : "Start Voice Input"} arrow>
              <IconButton onClick={isListening ? stopListening : startListening} color="primary">
                <MicIcon color={isListening ? "secondary" : "inherit"} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Attach a text or PDF file" arrow>
              <Button variant="outlined" component="label" startIcon={<AttachFileIcon />}>
                Attach File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept="text/plain,application/pdf"
                />
              </Button>
            </Tooltip>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </form>

        {/* Error message if any */}
        {errorMsg && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {errorMsg}
          </Typography>
        )}

        {/* Animate the result panel with a Fade */}
        <Fade in={Boolean(result)}>
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: '#e8f4fa',
              borderRadius: 2,
              boxShadow: 1,
              display: result ? 'block' : 'none'
            }}
          >
            <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>
              Recommendation:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
              {result}
            </Typography>
          </Box>
        </Fade>

        {/* 
          Mini step-by-step / FAQ 
          Helps user understand quickly how to use the tool 
        */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            How it Works
          </Typography>
          <ol style={{ marginLeft: '1rem' }}>
            <li>
              Provide a quick description in the text box or upload your company profile (PDF or text).
            </li>
            <li>
              Optionally use the <strong>microphone</strong> to dictate your details (Chrome only).
            </li>
            <li>
              Click <strong>Submit</strong> to get AI-generated funding recommendations.
            </li>
          </ol>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UnifiedInput;
