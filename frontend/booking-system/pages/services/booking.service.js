import axios from "axios";

const API_URL = "http://localhost:3001";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

export const getUserBookings = (userId) => {
  const token = getToken(); 

  return axios.get(`${API_URL}/user/getBookingsByUserId/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createBooking = (bookingData) => {
  const token = getToken(); 

  return axios.post(`${API_URL}/user/createBooking`, bookingData, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};


export const adminGetAllBookings = () => {
  const token = getToken(); 

  return axios.get(`${API_URL}/admin/getAllBookings`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};


export const adminGetAllUsers = () => {
  const token = getToken();
  return axios.get(`${API_URL}/admin/getAllUsers`, {
    headers: { 
      Authorization: `Bearer ${token}` },
  });
};