import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import merchService, { MerchData } from '../../../services/merchService';
import useMetaPixel from '../../../hooks/useMetaPixel';
import './MerchCheckoutForm.scss';

interface MerchCheckoutFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    sizes: string[];
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

const MerchCheckoutForm: React.FC<MerchCheckoutFormProps> = ({ 
  product, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } = useMetaPixel();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<MerchData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productId: product.id,
    productName: product.name,
    quantity: 1,
    size: 'M',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe no está disponible');
      return;
    }

    // Validación básica
    if (!formData.customerName || !formData.customerEmail || !formData.address) {
      onError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);

    try {
      // Track initiate checkout con Meta Pixel
      trackInitiateCheckout({
        value: product.price * formData.quantity,
        currency: 'MXN',
        content_ids: [product.id],
        num_items: formData.quantity
      });

      // Crear payment intent usando la misma lógica que ya tienes
      const { clientSecret } = await merchService.createPaymentIntent(formData);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Track add payment info
      trackAddPaymentInfo({
        value: product.price * formData.quantity,
        currency: 'MXN'
      });

      // Confirmar el pago con Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: 'MX'
            }
          },
        },
      });

      if (result.error) {
        console.error('Payment error:', result.error);
        onError(result.error.message || 'Error en el pago');
      } else {
        // Track purchase exitoso
        trackPurchase({
          value: product.price * formData.quantity,
          currency: 'MXN',
          content_ids: [product.id],
          content_name: product.name,
          content_type: 'product',
          num_items: formData.quantity,
          transaction_id: result.paymentIntent?.id
        });
        
        console.log('Payment successful:', result.paymentIntent);
        onSuccess();
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      onError(error.message || 'Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = product.price * formData.quantity;

  return (
    <form onSubmit={handleSubmit} className="merch-checkout-form">
      <div className="product-summary">
        <h3>{product.name}</h3>
        <div className="summary-details">
          <div className="quantity-selector">
            <label>Cantidad:</label>
            <select 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleInputChange}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="size-selector">
            <label>Talla:</label>
            <select 
              name="size" 
              value={formData.size} 
              onChange={handleInputChange}
            >
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="price-display">
            <span className="total-label">Total:</span>
            <span className="total-price">${totalPrice.toLocaleString()} MXN</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Información Personal</h4>
        <div className="form-row">
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
      </div>

      <div className="form-section">
        <h4>Dirección de Envío</h4>
        <div className="form-group">
          <label>Dirección *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Calle y número"
            required
          />
        </div>
        
        <div className="form-row three-columns">
          <div className="form-group">
            <label>Ciudad *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Estado *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>C.P. *</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Información de Pago</h4>
        <div className="form-group">
          <label>Tarjeta de crédito/débito *</label>
          <div className="card-element-wrapper">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#fff',
                    '::placeholder': {
                      color: '#999',
                    },
                    backgroundColor: 'transparent'
                  },
                  invalid: {
                    color: '#ff6b6b',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="secure-badge">
        <span className="lock-icon">🔒</span>
        Pago 100% seguro con Stripe
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className={`submit-button ${isProcessing ? 'processing' : ''}`}
      >
        {isProcessing ? (
          <>
            <span className="spinner"></span>
            Procesando...
          </>
        ) : (
          `Pagar $${totalPrice.toLocaleString()} MXN`
        )}
      </button>
    </form>
  );
};

export default MerchCheckoutForm;