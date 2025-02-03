// frontend/src/components/UnifiedInput.js
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';

// Set up the worker source to point to our public file
GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const UnifiedInput = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Start voice recognition using the Web Speech API
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

  // Handle file selection: text files and PDFs
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        getDocument({ data: typedarray }).promise.then(pdf => {
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
        }).catch(err => {
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

  // Submit the input to the backend
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
    <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Find Funding Options
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter company profile or load file/voice input"
            placeholder="find funding options"
            multiline
            fullWidth
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <IconButton onClick={isListening ? stopListening : startListening} color="primary">
              <MicIcon color={isListening ? "secondary" : "inherit"} />
            </IconButton>
            <Button variant="outlined" component="label" startIcon={<AttachFileIcon />}>
              Attach File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="text/plain,application/pdf"
              />
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </form>
        {errorMsg && (
          <Typography color="error" sx={{ marginTop: 2, textAlign: 'center' }}>
            {errorMsg}
          </Typography>
        )}
        {result && (
          <Box sx={{ marginTop: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle1" align="center">
              Recommendation:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedInput;
