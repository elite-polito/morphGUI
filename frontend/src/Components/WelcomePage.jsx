import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { WiStars } from 'react-icons/wi';
import { FaKey, FaEye, FaEyeSlash, FaTrash, FaCheck } from 'react-icons/fa';
import './WelcomePage.css';

function WelcomePage({ onStart }) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidKey, setIsValidKey] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchMessage, setLaunchMessage] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);

  // Check for existing API key on component mount
  useEffect(() => {
    const existingKey = localStorage.getItem('openai_api_key');
    if (existingKey) {
      setHasExistingKey(true);
      setApiKey(existingKey);
      setIsValidKey(true);
    } else {
      setShowInputForm(true);
    }
  }, []);

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    setApiKey(key);
    // Basic validation for OpenAI API key format
    const basicValid = key.startsWith('sk-') && key.length > 20;
    setIsValidKey(basicValid);
    
    // Clear launch message when user types
    if (launchMessage) {
      setLaunchMessage('');
    }
  };

  const handleStart = async () => {
    if (!isValidKey) return;
    
    // If we have an existing key, skip validation and launch directly
    if (hasExistingKey && !showInputForm) {
      setLaunchMessage('✅ Using existing API key. Launching MorphGUI...');
      setTimeout(() => {
        onStart();
      }, 1000);
      return;
    }
    
    setIsLaunching(true);
    setLaunchMessage('Validating API key...');
    
    try {
      // Validate API key before proceeding
      const response = await fetch('http://localhost:3001/api/validate-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      
      const result = await response.json();
      
      if (result.valid) {
        setLaunchMessage('✅ API key validated! Launching MorphGUI...');
        
        // Small delay to show success message
        setTimeout(() => {
          // Save API key to localStorage
          localStorage.setItem('openai_api_key', apiKey);
          onStart();
        }, 1000);
      } else {
        setLaunchMessage(`❌ ${result.error}`);
        setIsLaunching(false);
      }
    } catch (error) {
      setLaunchMessage('❌ Failed to validate API key. Please check your connection.');
      setIsLaunching(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setHasExistingKey(false);
    setShowInputForm(true);
    setApiKey('');
    setIsValidKey(false);
    setLaunchMessage('');
  };

  const handleChangeKey = () => {
    setShowInputForm(true);
    setApiKey('');
    setIsValidKey(false);
    setLaunchMessage('');
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="welcome-page">
      <Container fluid className="h-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="welcome-card shadow-lg">
              <Card.Body className="text-center p-5">
                <div className="welcome-icon mb-4">
                  <WiStars size={80} color="#6f42c1" />
                </div>
                
                <h1 className="welcome-title mb-4">
                  MorphGUI
                </h1>
                
                <p className="welcome-subtitle mb-5">
                  Note: This demo version may differ from the one shown in the article, as it has been
                  adapted specifically for demonstration purposes.
                </p>

                <div className="api-key-section mb-5">
                  <div className="api-key-header mb-3">
                    <FaKey size={24} className="me-2" style={{ color: '#6f42c1' }} />
                    <h5 className="mb-0">OpenAI API Key</h5>
                  </div>
                  
                  {hasExistingKey && !showInputForm ? (
                    // Show existing key status
                    <div className="existing-key-section">
                      <div className="d-flex align-items-center justify-content-between p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded">
                        <div className="d-flex align-items-center">
                          <FaCheck className="text-success me-2" />
                          <span className="text-success fw-medium">API key is configured and ready</span>
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={handleChangeKey}
                          >
                            Change Key
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={handleClearKey}
                          >
                            <FaTrash className="me-1" />
                            Clear
                          </Button>
                        </div>
                      </div>
                      <Form.Text className="text-muted mt-2">
                        Your API key is stored locally and ready to use.
                      </Form.Text>
                    </div>
                  ) : (
                    // Show input form
                    <Form.Group className="mb-3">
                      <Form.Label className="text-start d-block">
                        Enter your OpenAI API Key
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showApiKey ? "text" : "password"}
                          placeholder="sk-..."
                          value={apiKey}
                          onChange={handleApiKeyChange}
                          className={`api-key-input ${isValidKey ? 'is-valid' : apiKey.length > 0 ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 top-50 translate-middle-y me-2"
                          onClick={toggleShowApiKey}
                          style={{ padding: '0.25rem', color: '#6c757d' }}
                        >
                          {showApiKey ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Your API key is stored locally in your browser and never shared.
                      </Form.Text>
                      {apiKey.length > 0 && !isValidKey && (
                        <Form.Text className="text-danger">
                          Please enter a valid OpenAI API key starting with "sk-"
                        </Form.Text>
                      )}
                    </Form.Group>
                  )}
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="start-button"
                  onClick={handleStart}
                  disabled={!isValidKey || isLaunching}
                >
                  {isLaunching ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {hasExistingKey && !showInputForm ? 'Launching...' : 'Validating...'}
                    </>
                  ) : (
                    <>
                      <WiStars className="me-2" />
                      Launch MorphGUI
                    </>
                  )}
                </Button>
                
                {launchMessage && (
                  <div className={`launch-message mt-3 ${launchMessage.includes('✅') ? 'success' : 'error'}`}>
                    {launchMessage}
                  </div>
                )}
                
                <p className="mt-3 small text-muted">
                  No registration required • Start transforming immediately
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default WelcomePage;
