import { stripePromise } from './stripe'; // Usar la misma instancia de stripe
import axios from 'axios';

export interface MerchData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

class MerchService {
  private readonly apiUrl = process.env.NODE_ENV === 'production' 
    ? '/.netlify/functions' 
    : 'http://localhost:8888/.netlify/functions';

  async createPaymentIntent(data: MerchData): Promise<{ clientSecret: string; amount: number }> {
    try {
      const response = await axios.post(`${this.apiUrl}/merch-payment`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating merch payment intent:', error);
      throw error;
    }
  }

  async getStripe() {
    return await stripePromise;
  }
}

export default new MerchService();