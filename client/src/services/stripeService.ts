// client/src/services/stripeService.ts
import { Stripe } from '@stripe/stripe-js';
import axios from 'axios';
import { stripePromise } from './stripe';

export interface CustomerData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  programType: 'ultra-deluxe' | 'golden-standard';
}

class StripeService {
  private stripe: Stripe | null = null;
  private readonly apiUrl = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : '/api';

  async getStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  async createPaymentIntent(data: CustomerData): Promise<{ clientSecret: string; amount: number }> {
    try {
      const response = await axios.post(`${this.apiUrl}/payment`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(clientSecret: string, cardElement: any, customerData: CustomerData) {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    return await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerData.customerName,
          email: customerData.customerEmail,
          phone: customerData.customerPhone,
        },
      },
    });
  }
}

export default new StripeService();