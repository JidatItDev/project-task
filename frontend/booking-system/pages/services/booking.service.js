import axios from "axios";

const API_URL = "http://localhost:3001";

export const getUserBookings = (userId) => {
  return axios.get(`${API_URL}/user/getBookingsByUserId/${userId}`);
};

export const createBooking = (bookingData) => {
  return axios.post(`${API_URL}/user/createBooking`, bookingData);
};
