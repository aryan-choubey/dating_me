




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
    return api.get("/swipe/discover");
}

export const swipeUser =(data)=>{
    return api.post("/swipe/swipeuser",data);
}


export const getLikes =()=>{
    return api.get("/swipe/getlikes");
}

export const sentLikes = ()=>{
    return api.get("/swipe/sentlikes");
}

export const getMatch = ()=>{
    return api.get("/match/getmatches");
}



// Get old messages with a particular user
export const getOldMessages = (userId) => {
  return api.get(`/message/${userId}`);
};


// Mark messages as read
export const markMessagesAsRead = (senderId) => {
  return api.post("/message/read", {
    senderId: senderId,
  });
};



export const getMyProfile = async()=>{
 const response = await api.get("/auth/me");
  return response.data;
}


export const logoutApi =()=>{
    return api.post("/auth/logout")
}