import React, { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import stripeService, { CustomerData } from '../../services/stripeService';
import { stripePromise } from '../../services/stripe';
import useMetaPixel from '../../hooks/useMetaPixel'; // SOLO ESTO
import './StripeCheckout.scss';

interface CheckoutFormProps {
  program: {
    id: string;
    name: string;
    price: number;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ program, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const { trackInitiateCheckout, trackPurchase } = useMetaPixel(); // SOLO ESTO
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  // SOLO AGREGAR ESTE EFECTO
  useEffect(() => {
    trackInitiateCheckout({
      value: program.price,
      currency: 'MXN',
      content_ids: [program.id],
      content_type: 'product',
      num_items: 1
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe no está disponible');
      return;
    }

    if (!formData.customerName || !formData.customerEmail) {
      onError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);

    try {
      const customerData: CustomerData = {
        ...formData,
        programType: program.id as 'ultra-deluxe' | 'golden-standard'
      };

      const { clientSecret } = await stripeService.createPaymentIntent(customerData);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const result = await stripeService.confirmPayment(clientSecret, cardElement, customerData);

      if (result.error) {
        onError(result.error.message || 'Error en el pago');
      } else {
        // SOLO AGREGAR ESTA LÍNEA
        trackPurchase({
          value: program.price,
          currency: 'MXN',
          content_ids: [program.id],
          content_name: program.name,
          num_items: 1
        });
        onSuccess();
      }
    } catch (error: any) {
      onError(error.message || 'Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  // TU JSX EXACTO SIN CAMBIOS
  return (
    <form onSubmit={handleSubmit} className="stripe-checkout">
      <div className="checkout-header">
        <h3>{program.name}</h3>
        <div className="price">${program.price.toLocaleString()}</div>
      </div>
      
      <div className="form-group">
        <label>Nombre completo *</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Información de la tarjeta *</label>
        <div className="card-element">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className={`submit-button ${isProcessing ? 'processing' : ''}`}
      >
        {isProcessing ? 'Procesando...' : `Pagar $${program.price.toLocaleString()}`}
      </button>
    </form>
  );
};

interface StripeCheckoutProps {
  program: {
    id: string;
    name: string;
    price: number;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ program, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        program={program} 
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeCheckout;