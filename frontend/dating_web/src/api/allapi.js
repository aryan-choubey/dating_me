
import api from "./axios";


export const signupApi = (signupdata) =>{
    return api.post("/auth/signup", signupdata)
}

export const loginApi = (logindata) =>{
    return api.post("/auth/login", logindata);
}


export const userDetail = (formData) =>{
    return api.put("/auth/userdetail", formData);
}



export const discover =()=>{
    return api.get("/auth/discover");
}

export const swipeUser =(data)=>{
    return api.post("/auth/swipeuser",data);
}