import React, { useState, useEffect, useRef } from 'react';
import './LoadingComponent.css';

const LoadingComponent = ({isLoading = false}) => {
  const [loadingText, setLoadingText] = useState('Preparing your AI service...');
  const [isFading, setIsFading] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    let texts = ""
    if (isLoading==false){
     texts = [
      'Analyzing data...',
      'Generating UI components...',
      'Optimizing performance...',
      'Almost there...'
    ];
    }else{
      texts = [
        'Loading'
      ];
    }

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setLoadingText(prev => {
          const index = texts.indexOf(prev);
          return texts[(index + 1) % texts.length];
        });
        setIsFading(false);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-page">
      <div className="spinner"></div>
      <h1
        className={`loading-text ${isFading ? 'fade-out' : 'fade-in'}`}
        ref={textRef}
      >
        {loadingText}
      </h1>
    </div>
  );
};

export default LoadingComponent;
