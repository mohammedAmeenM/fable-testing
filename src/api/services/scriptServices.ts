import { AxiosResponse } from "axios";
import api from "../interceptor/axiosInterceptors";
interface ScriptResponse {
  success: boolean;
  message: string;
  data: any;
}

export const createScript = async (values: any) => {
  try {
    const response = await api.post(`/script`, values);
    return response;
  } catch (error) {
    console.error("createScript error:", error);
  }
};
export const createComment = async (values: any) => {
  try {
    const response = await api.post(`/comment`, values);
    return response;
  } catch (error) {
    console.error("createScript error:", error);
  }
};
export const deleteComment = async (id: any) => {
  try {
    const response = await api.delete(`/comment/${id}`);
    return response;
  } catch (error) {
    console.error("createScript error:", error);
  }
};



export const getScriptsUsers = async (userId: string, projectTitleId: string): Promise<AxiosResponse<ScriptResponse>> => {
  try {
    const response = await api.get(`/script`, {
      params: {
        userId,
        projectTitleId
      }
    });
    return response;
  } catch (error) {
    console.error("getScripts error:", error);
    throw error;
  }
}