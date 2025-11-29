import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Badge, Modal, Card, Container, ListGroup, Table, Carousel, Form, InputGroup, Dropdown, ProgressBar } from 'react-bootstrap';
import * as babel from '@babel/standalone';
import LoadingComponent from './Components/LoadingComponent';


const preprocessCode = (codeString) => {
  const importRegex = /(?:import\s+(?:[\w*,\s{}]+\s+from\s+)?['"](.*)['"]|export\s+.*from\s+['"](.*)['"])\s*;?/g;
  const imports = new Set();
  let match;

  while ((match = importRegex.exec(codeString)) !== null) {
    if (match[1]) {
      imports.add(match[1]);
    }
    if (match[2]) {
      imports.add(match[2]);
    }
  }
  const cleanedCode = codeString.replace(importRegex, '');
  return { imports: Array.from(imports), cleanedCode };
};
const loadAndCompileComponent = async (user, existingDependencies, appType) => {
  const userId = user.user_id
  const dependencyNames = Object.keys(existingDependencies);
  const dependencyValues = dependencyNames.map(name => existingDependencies[name]);
  try {
    // Try to get component code from localStorage first
    let scriptContent = localStorage.getItem(`${appType || 'calendar'}_component_${userId}`);

    // If no code in localStorage, get default code from API with appType
    if (!scriptContent) {
      const response = await fetch(`/api/default-component-code?appType=${appType || 'calendar'}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      scriptContent = data.code;

      // Save default code to localStorage for future use
      localStorage.setItem(`${appType || 'calendar'}_component_${userId}`, scriptContent);
    }

    const { imports, cleanedCode } = preprocessCode(scriptContent);

    const compiledCode = babel.transform(cleanedCode, {
      presets: ['react', ['es2017', { modules: false }]],
    }).code;

    const func = new Function('props', ...dependencyNames, `
        return ${compiledCode}
      `);

    const EvaluatedComponent = (props) => {
      const Component = func(props, ...dependencyValues);
      return <Component {...props} />;
    };

    return EvaluatedComponent;

  } catch (error) {
    console.error(`Error loading component`, error);
    // Return a fallback component if everything fails
    return (props) => <div>Error loading component: {error.message}</div>;
  }
};

const DynamicComponent = ({ user, props, appType, isSwitchingApp }) => {
  const [RetrievedData, setRetrievedData] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const dependencies = {
    React,
    ListGroup,
    Row,
    Col,
    Button,
    Badge,
    Modal,
    Card,
    Container,
    Table,
    Form,
    InputGroup,
    Dropdown,
    ProgressBar,
    useState,
    useEffect,
    DynamicComponent,
    Carousel,
    useRef
  };

  const loadComponent = async () => {
    // Don't load component if we're switching apps
    if (isSwitchingApp) {
      return;
    }

    try {
      const mainComponent = await loadAndCompileComponent(user, dependencies, appType);
      if (mainComponent) {
        setRetrievedData(() => mainComponent);
      }

    } catch {
      setRetrievedData(() => <><div>Fail!</div></>)
    }

  };

  useEffect(() => {
    loadComponent();
  }, [reloadTrigger, appType, isSwitchingApp]);

  // Listen for localStorage changes to reload component
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `${appType || 'calendar'}_component_${user.user_id}`) {
        setReloadTrigger(prev => prev + 1);
      }
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (from same tab)
    const handleCustomStorageChange = () => {
      setReloadTrigger(prev => prev + 1);
    };

    window.addEventListener('componentUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('componentUpdated', handleCustomStorageChange);
    };
  }, [user.user_id]);

  return (
    <>
      {RetrievedData ? (
        <RetrievedData {...props} />
      ) : (
        <div>Oh, Something went wrong!</div>
      )}
    </>
  );
};

export default DynamicComponent;
