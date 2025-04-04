import api from "../interceptor/axiosInterceptors";
import { ProfileData } from "../../types/auth";

export const signupUser = async (values:any)=>{
    try {
        const response = await api.post(`/auth/signup`, {
            email: values.email,
            password: values.password
          });
      return response    
    } catch (error) {
        console.error('signup error:', error);
    }
}

export const loginUser =async (values:any)=>{
    try {
        const response = await api.post(`/auth/signin`, {
            email: values.email,
            password: values.password
          });
          return response.data
    } catch (error) {
        console.error('Login error:', error);
    }
}

export const updateProfile = async (values: ProfileData) => {
    try {
        const response = await api.put('/auth/profile', values);
        return response.data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
}