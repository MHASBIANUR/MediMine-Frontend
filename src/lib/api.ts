// src/lib/api.ts
import axios from "axios";
import type { User } from "@/types/user";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1",
});

export interface LoginResult {
  message?: string;
  user?: User;
  session?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: number;
  };
  error?: string;
}

export interface RegisterResult {
  message?: string;
  user?: User;
  error?: string;
}

// REGISTER
export const registerUser = async (payload: {
  email: string;
  password: string;
  username: string;
}): Promise<RegisterResult> => {
  const res = await API.post("/auth/register", payload);
  return res.data as RegisterResult;
};

// LOGIN
export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  const res = await API.post("/auth/login", payload);
  return res.data as LoginResult;
};
