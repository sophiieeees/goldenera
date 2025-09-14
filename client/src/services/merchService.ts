import { stripePromise } from './stripe';
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
  // Nuevos campos para promo codes
  promoCode?: string;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
}

export interface PromoCodeResponse {
  valid: boolean;
  discount?: number;
  type?: 'percentage' | 'fixed';
  discountAmount?: number;
  finalAmount?: number;
  message: string;
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

  async validatePromoCode(code: string, amount: number): Promise<PromoCodeResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/apply-promo-code`, {
        code,
        amount
      });
      return response.data;
    } catch (error: any) {
      console.error('Error validating promo code:', error);
      return {
        valid: false,
        message: error.response?.data?.message || 'Código inválido'
      };
    }
  }

  // Guardar códigos usados en localStorage
  saveUsedCode(code: string) {
    const usedCodes = this.getUsedCodes();
    usedCodes.push({
      code,
      usedAt: new Date().toISOString()
    });
    localStorage.setItem('golden_era_used_codes', JSON.stringify(usedCodes));
  }

  getUsedCodes(): Array<{code: string, usedAt: string}> {
    const codes = localStorage.getItem('golden_era_used_codes');
    return codes ? JSON.parse(codes) : [];
  }

  isCodeUsed(code: string): boolean {
    const usedCodes = this.getUsedCodes();
    return usedCodes.some(item => item.code === code);
  }

  async getStripe() {
    return await stripePromise;
  }
}

export default new MerchService();