import api from "../interceptor/axiosInterceptors";

export const createProjectTitle = async (values:any)=>{
    try {
        console.log("Sending data:", values);
        const response = await api.post(`/projecttitle`, {
            title: values.title,
            type: values.type,
            userId: values.userId
          });
      return response    
    } catch (error) {
        console.error('createProjectTitle error:', error);
    }
}


export const getProjectsByUserId = async (userId:any) =>{
    try {
        const response = await api.get(`/projecttitle/${userId}`)
        return response
    } catch (error) {
        console.error('Error in get Project:', error);
    }
}

