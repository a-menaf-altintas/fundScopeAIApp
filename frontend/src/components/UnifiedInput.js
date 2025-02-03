import React, { useState, useRef } from 'react';
import axios from 'axios';
/** CHANGED: Imported Tooltip to show explanations on hover */
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Tooltip
} from '@mui/material';

import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';

/**
 * PDF worker path configuration remains the same as before.
 * This line ensures PDF processing can happen in the browser.
 */
GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const UnifiedInput = () => {
  // States remain mostly unchanged
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Reference for the speech recognition instance
  const recognitionRef = useRef(null);

  /**
   * CHANGED: The startListening and stopListening functions remain logically
   * the same, but we’ll label them with comments to clarify.
   */
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

  /**
   * CHANGED: The file reading logic is unchanged except for minor
   * clarifications in comments. We still handle PDF and text files.
   */
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

  /**
   * CHANGED: The handleSubmit function logic remains the same.
   * We just ensure that after receiving a response we update `result`.
   */
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

  /**
   * CHANGED: The Card now has more styling (boxShadow, borderRadius, etc.).
   * A bolded title, spacing between elements, and Tooltips for the mic and file attach icons.
   * The recommendation box is given a subtle background color from the theme ('grey.100').
   */
  return (
    <Card
      style={{
        maxWidth: 600,
        margin: '32px auto',          // More space around
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: 8,
        backgroundColor: 'white'      // Uses the paper color from the theme or fallback white
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" style={{ fontWeight: 'bold', marginBottom: 16 }}>
          Find Funding Options
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter company profile or load file/voice input"
            placeholder="Enter your company details or funding requirements here..."
            multiline
            fullWidth
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/** CHANGED: Wrapped mic IconButton in a Tooltip for clarity. */}
            <Tooltip title={isListening ? "Stop Listening" : "Start Voice Input"} arrow>
              <IconButton onClick={isListening ? stopListening : startListening} color="primary">
                <MicIcon color={isListening ? "secondary" : "inherit"} />
              </IconButton>
            </Tooltip>

            {/** CHANGED: Wrapped file attach Button in a Tooltip. */}
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

        {errorMsg && (
          <Typography color="error" style={{ marginTop: 16, textAlign: 'center' }}>
            {errorMsg}
          </Typography>
        )}

        {result && (
          <Box
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: '#f2f2f2',  // A subtle gray background
              borderRadius: 4
            }}
          >
            <Typography variant="subtitle1" align="center" style={{ fontWeight: 600 }}>
              Recommendation:
            </Typography>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
              {result}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedInput;
