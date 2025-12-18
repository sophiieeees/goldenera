import axios from "axios";

// In production (Railway), use relative URLs since server serves both API and static files
// In development, use the proxy configured in package.json or REACT_APP_API_URL
const API_URL = process.env.NODE_ENV === "production"
  ? ""
  : (process.env.REACT_APP_API_URL || "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const paymentAPI = {
  getPrograms: async () => {
    const response = await api.get("/api/payment/programs");
    return response.data;
  },
  
  createPaymentIntent: async (programId: string) => {
    const response = await api.post("/api/payment/create-payment-intent", {
      programId,
    });
    return response.data;
  },
};

export default api;
