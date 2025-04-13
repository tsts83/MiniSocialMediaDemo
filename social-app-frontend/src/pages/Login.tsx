import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../api/auth';
import { RootState } from '../store/store';
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/authSlice";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Log user state whenever it changes
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const userData = await loginUser(formData, dispatch);
      dispatch(loginSuccess(userData));

      if (userData) {
        console.log("Login successful:", userData);
        navigate("/feed");
      }
    } catch {
      return "Invalid credentials. Please try again.";
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default Login;
