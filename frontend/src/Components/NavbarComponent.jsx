import React, { useState, useEffect } from 'react';
import { Container, Navbar, Offcanvas, Button, Accordion, Form, Row, Col, FormLabel, Dropdown } from 'react-bootstrap';
import { WiStars } from 'react-icons/wi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './NavbarComponent.css';
import { FaBackward, FaTrash } from "react-icons/fa";
import { LuDatabaseBackup } from "react-icons/lu"
// Removed useAuth import - no authentication needed
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { FaBroom } from "react-icons/fa";

const calendarElements = ["-- Select an Element --", "Weekly Calendar View", "Navigation Buttons", "Events Badge", "Calendar Header", "Custom Component"];
const ecommerceElements = ["-- Select an Element --", "Product Grid", "Product Cards", "Search Bar", "Category Filter", "Sort Dropdown", "Pagination", "Product Modal", "Custom Component"];
const dashboardElements = ["-- Select an Element --", "Revenue Chart", "Metric Cards", "Sales Chart", "Region Chart", "Product Table", "Chart Legend", "Color Scheme", "Custom Component"];
let MAX_GEN = 10

const getAppTypeDisplayName = (type) => {
  switch (type) {
    case 'calendar': return '📅 Calendar';
    case 'ecommerce': return '🛒 E-commerce';
    case 'dashboard': return '📊 Dashboard';
    default: return '📅 Calendar';
  }
};

const getElementsForAppType = (type) => {
  switch (type) {
    case 'calendar': return calendarElements;
    case 'ecommerce': return ecommerceElements;
    case 'dashboard': return dashboardElements;
    default: return calendarElements;
  }
};

function NavbarComponent({ user, generating, setGenerating, setUser, experiment, appType, onAppTypeChange, isSwitchingApp }) {
  // Removed authentication - no login/logout needed
  const [genCount, setGenCount] = useState(0)
  const [textSizeRange, setTextSizeRange] = useState([12, 32]);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [structureText, setStructureText] = useState('');
  const [styleText, setStyleText] = useState('');
  const [imitationImageUrl, setImitationImageUrl] = useState('');
  const [goalText, setgoalText] = useState('');
  const [imageError, setImageError] = useState(false)
  const [elementConfigurations, setElementConfigurations] = useState({});
  const [selectedElements, setSelectedElements] = useState([]);
  const [hasPreviousUI, setHasPreviousUI] = useState(false);


  const handleConfigurationChange = (element, field, value) => {
    setElementConfigurations({
      ...elementConfigurations,
      [element]: {
        ...elementConfigurations[element],
        [field]: value,
      },
    });
  };
  const handleElementSelect = (event) => {
    const selectedElement = event.target.value;
    if (selectedElement == "-- Select an Element --") {
      return
    }


    if (!selectedElements.includes(selectedElement)) {
      setSelectedElements([...selectedElements, selectedElement]);
      setElementConfigurations({
        ...elementConfigurations,
        [selectedElement]: { what: '', how: '' },
      });
    }

  };

  const handleRemoveElement = (element) => {
    setSelectedElements(selectedElements.filter(el => el !== element));
    const { [element]: _, ...remainingConfigurations } = elementConfigurations;
    setElementConfigurations(remainingConfigurations);
  };

  const handleTextSizeRangeChange = (value) => {
    setTextSizeRange(value);
  };

  const handleFontFamilyChange = (event) => {
    setFontFamily(event.target.value);
  };

  const handlePrimaryColorChange = (event) => {
    setPrimaryColor(event.target.value);
  };

  const handleSecondaryColorChange = (event) => {
    setSecondaryColor(event.target.value);
  };

  const handleColorBlindToggle = () => {
    setColorBlindMode(!colorBlindMode);
  };

  function getCleanedImageURL(url) {
    const cleanUrl = url.split('?')[0];

    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const urlExtension = cleanUrl.substring(cleanUrl.lastIndexOf('.')).toLowerCase();

    const isValid = validExtensions.includes(urlExtension);

    return { isValid, cleanUrl };
  }
  const fetchGenerationCount = async () => {
    try {
      // Read from localStorage instead of API
      const count = localStorage.getItem(`${appType}_generation_count_${user.user_id}`) || '0';
      setGenCount(parseInt(count));
    } catch (err) {
      console.log(err)
    }
  };

  const checkPreviousUI = () => {
    const previousCode = localStorage.getItem(`${appType}_component_prev_${user.user_id}`);
    setHasPreviousUI(!!previousCode);
  };

  useEffect(() => {
    fetchGenerationCount();
    checkPreviousUI();
  }, [appType])

  // Clear selected elements when switching apps
  useEffect(() => {
    setSelectedElements([]);
    setElementConfigurations({});
  }, [appType])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imitationImageUrl != "") {
      const cleanedUrl = getCleanedImageURL(imitationImageUrl)
      if (!cleanedUrl.isValid) {
        setImageError(true)
        return
      } else {
        setImitationImageUrl(cleanedUrl.cleanUrl)
      }
    }

    const data = {
      textSizeRange,
      fontFamily,
      primaryColor,
      secondaryColor,
      colorBlindMode,
      structureText,
      styleText,
      imitationImageUrl,
      goalText,
      elementConfigurations
    };

    try {
      setGenerating(true);

      // Get current UI code to use as base for generation
      const currentCode = localStorage.getItem(`${appType}_component_${user.user_id}`);

      // Save current UI as previous before generating new one
      if (currentCode) {
        localStorage.setItem(`${appType}_component_prev_${user.user_id}`, currentCode);
      }

      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please restart the application.');
      }

      const response = await fetch(`/api/update-customization?userId=${user.user_id}&appType=${appType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, apiKey, currentCode }),
      })
      if (!response.ok) {
        setGenerating(false);
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      const generatedCode = responseData.code;

      // Save new generated code as current UI
      localStorage.setItem(`${appType}_component_${user.user_id}`, generatedCode);

      // Dispatch custom event to notify DynamicComponent of the update
      window.dispatchEvent(new CustomEvent('componentUpdated'));

      // Update generation count in localStorage
      const currentCount = parseInt(localStorage.getItem(`${appType}_generation_count_${user.user_id}`) || '0');
      localStorage.setItem(`${appType}_generation_count_${user.user_id}`, (currentCount + 1).toString());
      setGenCount(currentCount + 1);

      // Update previous UI availability
      checkPreviousUI();

      setGenerating(false);

    } catch (error) {
      setGenerating(false);
      console.error('Error updating customization status:', error)
    }

  };

  const handleReset = async () => {
    try {
      setGenerating(true)

      // Save current UI as previous before resetting
      const currentCode = localStorage.getItem(`${appType}_component_${user.user_id}`);
      if (currentCode) {
        localStorage.setItem(`${appType}_component_prev_${user.user_id}`, currentCode);
      }

      // Get default component code from API with current app type
      const response = await fetch(`/api/default-component-code?appType=${appType}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const defaultCode = data.code;

      // Save default code as current UI
      localStorage.setItem(`${appType}_component_${user.user_id}`, defaultCode);

      // Dispatch custom event to notify DynamicComponent of the update
      window.dispatchEvent(new CustomEvent('componentUpdated'));

      // Update previous UI availability
      checkPreviousUI();

      setGenerating(false)
    } catch (error) {
      console.error(`Fatal reset component:`, error);
      setGenerating(false)
    }
  }

  const handlePrevious = async () => {
    try {
      setGenerating(true)

      // Get previous code from localStorage
      const previousCode = localStorage.getItem(`${appType}_component_prev_${user.user_id}`);

      if (!previousCode) {
        throw new Error('No previous code found');
      }

      // Get current code to save as new previous (for potential future "previous" calls)
      const currentCode = localStorage.getItem(`${appType}_component_${user.user_id}`);

      // Restore previous code as current
      localStorage.setItem(`${appType}_component_${user.user_id}`, previousCode);

      // Save current code as the new previous (so we can go back to it if needed)
      if (currentCode) {
        localStorage.setItem(`${appType}_component_prev_${user.user_id}`, currentCode);
      }

      // Dispatch custom event to notify DynamicComponent of the update
      window.dispatchEvent(new CustomEvent('componentUpdated'));

      // Update previous UI availability
      checkPreviousUI();

      setGenerating(false)

    } catch (error) {
      console.error(`Fatal previous component:`, error);
      setGenerating(false)
    }
  }

  const handleClean = async () => {
    try {
      setGenerating(true)

      // Clear all localStorage data for this user and app type
      localStorage.removeItem(`${appType}_component_${user.user_id}`);
      localStorage.removeItem(`${appType}_component_prev_${user.user_id}`);
      localStorage.removeItem(`${appType}_generation_count_${user.user_id}`);

      // Get default component code from API with current app type
      const response = await fetch(`/api/default-component-code?appType=${appType}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const defaultCode = data.code;

      // Save default code to localStorage
      localStorage.setItem(`${appType}_component_${user.user_id}`, defaultCode);

      // Reset generation count
      setGenCount(0);

      // Dispatch custom event to notify DynamicComponent of the update
      window.dispatchEvent(new CustomEvent('componentUpdated'));

      // Update previous UI availability
      checkPreviousUI();

      setGenerating(false)

    } catch (error) {
      console.error(`Fatal clean component:`, error);
      setGenerating(false)
    }
  }
  // Removed logout functionality - no authentication needed
  return (
    <Navbar expand={false} className="custom-navbar mb-3">
      <Container fluid>
        <div className="d-flex align-items-center">

          <Navbar.Brand href="#" className="navbar-brand">
            MorphGUI
          </Navbar.Brand>
          <div className="app-selector-section me-3">
            <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
              Select App
            </small>
            <Dropdown >
              <Dropdown.Toggle
                variant="outline-light"
                id="app-type-dropdown"
                className="app-type-dropdown"
                disabled={isSwitchingApp || generating}
              >
                {isSwitchingApp ? (
                  <>

                    <span className='text-muted'>Switching </span>
                  </>
                ) : generating ? (
                  <>
                    <span className='text-muted'>Generating </span>
                  </>
                ) : (
                  getAppTypeDisplayName(appType)
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header className="text-white small">Choose your app type</Dropdown.Header>
                <Dropdown.Item
                  onClick={() => onAppTypeChange('calendar')}
                  className={appType === 'calendar' ? 'active' : ''}
                >
                  📅 Calendar App
                  <small className="d-block text-muted">Schedule and manage events</small>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => onAppTypeChange('ecommerce')}
                  className={appType === 'ecommerce' ? 'active' : ''}
                >
                  🛒 E-commerce App
                  <small className="d-block text-muted">Product catalog and shopping</small>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => onAppTypeChange('dashboard')}
                  className={appType === 'dashboard' ? 'active' : ''}
                >
                  📊 Dashboard App
                  <small className="d-block text-muted">Analytics and data visualization</small>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            className="navbar-toggle"
            disabled={isSwitchingApp || generating}
            style={{
              opacity: (isSwitchingApp || generating) ? 0.5 : 1,
              cursor: (isSwitchingApp || generating) ? 'not-allowed' : 'pointer'
            }}
          >
            <WiStars color="white" size={100} />
          </Navbar.Toggle>
        </div>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="custom-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Enhance With AI
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Accordion defaultActiveKey="0">
              <Form onSubmit={handleSubmit}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Static Settings</Accordion.Header>
                  <Accordion.Body>
                    <Form.Label style={{ fontWeight: 'bold', fontSize: 17 }}>Typography</Form.Label>
                    <Form.Group controlId="textSizeRange">
                      <Form.Label>Text Size</Form.Label>
                      <Slider
                        range
                        min={8}
                        max={48}
                        defaultValue={textSizeRange}
                        onChange={handleTextSizeRangeChange}
                      />
                      <div className="d-flex justify-content-between">
                        <span>Min: {textSizeRange[0]}px</span>
                        <span>Max: {textSizeRange[1]}px</span>
                      </div>
                    </Form.Group>

                    <Form.Group controlId="fontFamily" className='mt-3'>
                      <Form.Label>Font Family</Form.Label>
                      <Form.Control as="select" value={fontFamily} onChange={handleFontFamilyChange}>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Label style={{ fontWeight: 'bold', fontSize: 17 }} className='mt-3'>Colors</Form.Label>
                    <Row>
                      <Col>

                        <Form.Group controlId="primaryColor">
                          <Form.Label>Primary Color</Form.Label>
                          <Form.Control type="color" value={primaryColor} onChange={handlePrimaryColorChange} />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="secondaryColor">
                          <Form.Label>Secondary Color</Form.Label>
                          <Form.Control type="color" value={secondaryColor} onChange={handleSecondaryColorChange} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="colorBlindToggle">
                      <Form.Check
                        type="switch"
                        label="Color Blind Mode"
                        className='mt-3'
                        checked={colorBlindMode}
                        onChange={handleColorBlindToggle}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Dynamic Settings</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="elementSelect" className="mb-3">
                      <Form.Label style={{ fontWeight: 'bold', fontSize: 20 }} className='mt-3'>Personalize!</Form.Label>
                      <Form.Control as="select" value={getElementsForAppType(appType)[0]}
                        onChange={handleElementSelect}>
                        {getElementsForAppType(appType).filter(el => !selectedElements.includes(el)).map((el, idx) => (
                          <option key={idx} value={el}>{el}</option>
                        ))}

                      </Form.Control>
                    </Form.Group>

                    {selectedElements.map((element, idx) => (
                      element != "-- Select an Element --" &&

                      <div key={idx} className="mb-4">

                        <Form.Group controlId={`cosa-${element}`} className="mb-2">
                          <Form.Label style={{ fontWeight: 'bold', fontSize: 16 }} className='mt-3'>
                            {element}
                            <Button variant="link" onClick={() => handleRemoveElement(element)}>
                              <IoMdRemoveCircleOutline color='#DB4437' size={25} className='pb-1' />
                            </Button>
                          </Form.Label>

                          <br></br>

                          <Form.Label>What it should do</Form.Label>
                          <Form.Control
                            type="text"
                            value={elementConfigurations[element]?.what || ''}
                            onChange={(e) => handleConfigurationChange(element, 'what', e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group controlId={`come-${element}`}>
                          <Form.Label>How it should appear</Form.Label>
                          <Form.Control
                            type="text"
                            value={elementConfigurations[element]?.how || ''}
                            onChange={(e) => handleConfigurationChange(element, 'how', e.target.value)}
                          />
                        </Form.Group>
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>

                {/* <Accordion.Item eventKey="2">
                  <Accordion.Header>AI Imitation</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="imitationImageUrl">
                      <Form.Label style={{fontWeight: 'bold', fontSize: 17}}>Imitation</Form.Label>
                      <Form.Text><br />Imitation overrides the dynamic settings</Form.Text>
                      <Form.Control
                        className="mt-3"
                        type="text"
                        value={imitationImageUrl}
                        onChange={(e) => setImitationImageUrl(e.target.value)}
                        placeholder="Enter image url"
                      />
                      {imageError ? <Form.Label style={{color:'red', fontSize: 13}}>Invalid image URL</Form.Label>:null}
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>*/}

                <Button className="generate-button mt-3" type="submit" disabled={generating}>
                  Generate < WiStars color="white" size={40} />
                </Button>
              </Form>
              <Button variant="warning" className="restore-button mt-3" disabled={generating || !hasPreviousUI} onClick={() => handlePrevious()}>
                Previous {hasPreviousUI ? <FaBackward color="white" size={30} className='ps-1' /> : <FaBackward color="#6c757d" size={30} className='ps-1' />}
              </Button>
              <Button variant="danger" className="restore-button mt-3" disabled={generating} onClick={() => handleClean()}>
                Restore <LuDatabaseBackup color="white" size={30} className='ps-1' />
              </Button>

            </Accordion>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
