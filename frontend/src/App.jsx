import './App.css'
import CalendarAI from './Components/CalendarAI';
import EcommerceAI from './Components/EcommerceAI';
import DashboardAI from './Components/DashboardAI';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import WelcomePage from './Components/WelcomePage';
import NavbarComponent from './Components/NavbarComponent';
function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [appType, setAppType] = useState('calendar');
  const [isSwitchingApp, setIsSwitchingApp] = useState(false);
  const [targetAppType, setTargetAppType] = useState('calendar');
  
  // Create a mock user object for the application
  const mockUser = {
    user_id: 'anonymous_user',
    email: 'anonymous@example.com'
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleAppTypeChange = async (newAppType) => {
    if (newAppType === appType) return; // Don't switch if already on the same app
    
    setTargetAppType(newAppType);
    setIsSwitchingApp(true);
    
    // Clear any existing component data when switching apps
    // Note: We don't clear localStorage here anymore since each app type has its own keys
    // The localStorage is now app-specific: `${appType}_component_${userId}`
    
    // Small delay to show loading state
    setTimeout(() => {
      setAppType(newAppType);
      setIsSwitchingApp(false);
    }, 800);
  };

  const renderApp = () => {
    if (isSwitchingApp) {
      return (
        <>
          {/* Keep navbar visible during switching */}
        <NavbarComponent user={mockUser} generating={false} setGenerating={() => {}} setUser={() => {}} experiment={false} appType={appType} onAppTypeChange={handleAppTypeChange} isSwitchingApp={isSwitchingApp} />
          
          {/* Loading content */}
          <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Switching to {targetAppType === 'calendar' ? 'Calendar' : targetAppType === 'ecommerce' ? 'E-commerce' : 'Dashboard'}...</h5>
              <p className="text-muted small">Loading your selected app</p>
            </div>
          </div>
        </>
      );
    }
    
    switch(appType) {
      case 'calendar':
        return <CalendarAI user={mockUser} setUser={() => {}} appType={appType} onAppTypeChange={handleAppTypeChange} isSwitchingApp={isSwitchingApp} />;
      case 'ecommerce':
        return <EcommerceAI user={mockUser} setUser={() => {}} appType={appType} onAppTypeChange={handleAppTypeChange} isSwitchingApp={isSwitchingApp} />;
      case 'dashboard':
        return <DashboardAI user={mockUser} setUser={() => {}} appType={appType} onAppTypeChange={handleAppTypeChange} isSwitchingApp={isSwitchingApp} />;
      default:
        return <CalendarAI user={mockUser} setUser={() => {}} appType={appType} onAppTypeChange={handleAppTypeChange} isSwitchingApp={isSwitchingApp} />;
    }
  };

  return (
    <>
      {!isStarted ? (
        <WelcomePage onStart={handleStart} />
      ) : (
        renderApp()
      )}
    </>
  );
}

export default App