import axios from "axios";

const API_BASE = "http://localhost:5000"; // change if your backend runs elsewhere

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE}/api/dashboard/stats`);
  return response.data;
};