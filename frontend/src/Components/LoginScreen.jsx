import React, { useState} from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import { logger } from './API';
import { useAuth } from './AuthProvider';


const  RegisterLoginScreen=({handleLogin})=> {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log('Login attempted with:', { email, password });
      try {
       const currentUser =  await login(email, password); // Await login before navigating
        if(currentUser == null){
          setErrors({ login: 'Failed to log in. Please try again.' });
        }else{
          handleLogin(currentUser)
          await logger.start(currentUser, "User Logged In")
          
        }
      } catch (error) {
        console.error('Login failed:', error);
        setErrors({ login: 'Failed to log in. Please try again.' });
      }
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>


          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {errors != {} ? <h5 style={{color:'red'}}>{errors.login}</h5>: null}
          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}


export default RegisterLoginScreen;