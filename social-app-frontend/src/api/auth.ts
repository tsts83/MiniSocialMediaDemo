import axios from "axios";
import { AppDispatch } from "../store/store";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials, dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      dispatch(loginSuccess(res.data));  // Dispatch the success action with the response data
      return res.data;
    } catch (error: any) {
      dispatch(loginFailure(error.response.data.message));  // Dispatch failure if error occurs
      throw error;  // Throw the error to handle it in the component
    }
  };

export const registerUser = async (userData: RegisterData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (error: any) {
    return { error: error.response.data.message };
  }
};