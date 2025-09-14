import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
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
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(product.price);
  const [promoMessage, setPromoMessage] = useState('');
  
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

  useEffect(() => {
    // Animación de entrada con GSAP
    gsap.fromTo('.merch-checkout-form', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  // FUNCIÓN ÚNICA para calcular el total
  const calculateTotal = () => {
    if (promoApplied && finalAmount !== undefined) {
      return finalAmount;
    }
    return product.price * formData.quantity;
  };

  // Log para debugging
  useEffect(() => {
    console.log('=== ESTADO ACTUAL ===');
    console.log('Promo aplicado:', promoApplied);
    console.log('Descuento:', discount);
    console.log('Monto final:', finalAmount);
    console.log('Total calculado:', calculateTotal());
  }, [promoApplied, discount, finalAmount, formData.quantity]);

  const applyPromoCode = async () => {
    if (!promoCode) {
      setPromoMessage('Por favor ingresa un código');
      return;
    }

    console.log('Applying promo code:', promoCode);
    console.log('Current amount:', product.price * formData.quantity);

    try {
      const response = await merchService.validatePromoCode(
        promoCode, 
        product.price * formData.quantity
      );
      
      console.log('Promo code response:', response);

      if (response.valid) {
        setPromoApplied(true);
        setDiscount(response.discountAmount || 0);
        setFinalAmount(response.finalAmount || 0);
        setPromoMessage(response.message);
        
        console.log('Estado actualizado:');
        console.log('- Descuento:', response.discountAmount);
        console.log('- Monto final:', response.finalAmount);
        
        // Animación de éxito
        if (typeof gsap !== 'undefined') {
          gsap.to('.promo-success', {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        }
      } else {
        setPromoMessage(response.message);
        setPromoApplied(false);
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoMessage('Error validando el código');
      setPromoApplied(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscount(0);
    setFinalAmount(product.price * formData.quantity);
    setPromoMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));

    // Recalcular si cambia la cantidad
    if (name === 'quantity' && promoApplied) {
      setPromoApplied(false);
      setDiscount(0);
      setPromoMessage('Aplica el código nuevamente para la nueva cantidad');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validación básica
  if (!formData.customerName || !formData.customerEmail || !formData.address) {
    onError('Por favor completa todos los campos requeridos');
    return;
  }

  const totalAmount = calculateTotal();
  console.log('Total a pagar:', totalAmount);

  // Si el total es 0, no necesitamos tarjeta
  if (totalAmount === 0 && (!stripe || !elements)) {
    console.log('Procesando orden gratuita...');
  } else if (totalAmount > 0 && (!stripe || !elements)) {
    onError('Stripe no está disponible');
    return;
  }

  setIsProcessing(true);

  try {
    // Track initiate checkout
    trackInitiateCheckout({
      value: totalAmount,
      currency: 'MXN',
      content_ids: [product.id],
      num_items: formData.quantity
    });

    // Preparar datos con información del descuento
    const paymentData: MerchData = {
      ...formData,
      originalAmount: product.price * formData.quantity,
      discountAmount: discount,
      finalAmount: totalAmount,
      promoCode: promoApplied ? promoCode : undefined
    };

    // Crear payment intent
    const response = await merchService.createPaymentIntent(paymentData);
    
    // Si el backend devuelve success:true o freeOrder:true es una orden gratuita
    // O si no hay clientSecret porque el monto es 0
    if (totalAmount === 0 || !response.clientSecret) {
      console.log('Orden gratuita procesada');
      
      // Guardar código usado
      if (promoApplied && promoCode) {
        merchService.saveUsedCode(promoCode);
      }
      
      // Track purchase
      trackPurchase({
        value: 0,
        currency: 'MXN',
        content_ids: [product.id],
        content_name: product.name,
        num_items: formData.quantity
      });
      
      // Animación de éxito y callback
      gsap.to('.merch-checkout-form', {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        onComplete: onSuccess
      });
      
      return;
    }

    // Para órdenes con pago normal (totalAmount > 0)
    const { clientSecret } = response;
    const cardElement = elements!.getElement(CardElement);
    
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    // Track add payment info
    trackAddPaymentInfo({
      value: totalAmount,
      currency: 'MXN'
    });

    // Confirmar el pago con Stripe
    const result = await stripe!.confirmCardPayment(clientSecret, {
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
      // Guardar código usado
      if (promoApplied && promoCode) {
        merchService.saveUsedCode(promoCode);
      }

      // Track purchase exitoso
      trackPurchase({
        value: totalAmount,
        currency: 'MXN',
        content_ids: [product.id],
        content_name: product.name,
        num_items: formData.quantity
      });

      // Animación de éxito
      gsap.to('.merch-checkout-form', {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        onComplete: onSuccess
      });
    }
  } catch (error: any) {
    console.error('Error en el proceso:', error);
    // Si el error indica que es una orden gratuita exitosa
    if (error.response?.data?.success || error.response?.data?.freeOrder) {
      if (promoApplied && promoCode) {
        merchService.saveUsedCode(promoCode);
      }
      onSuccess();
      return;
    }
    onError(error.response?.data?.error || error.message || 'Error procesando el pago');
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <form onSubmit={handleSubmit} className="merch-checkout-form">
      {/* Product Summary */}
      <div className="product-summary">
        <h3>{product.name}</h3>
        <p className="price">${product.price} MXN</p>
      </div>

      {/* Product Details */}
      <div className="form-section">
        <h4>Detalles del Producto</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Cantidad</label>
            <select 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleInputChange}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Talla</label>
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
        </div>
      </div>

      {/* Personal Info */}
      <div className="form-section">
        <h4>Información Personal</h4>
        
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
        
        <div className="form-row">
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
        </div>
      </div>

      {/* Shipping Address */}
      <div className="form-section">
        <h4>Dirección de Envío</h4>
        
        <div className="form-group">
          <label>Dirección *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
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

      {/* Promo Code Section */}
      <div className="form-section promo-section">
        <h4>Código Promocional</h4>
        
        {!promoApplied ? (
          <div className="promo-input-group">
            <input
              type="text"
              placeholder="Ingresa tu código"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="promo-input"
            />
            <button 
              type="button" 
              onClick={applyPromoCode}
              className="apply-promo-btn"
            >
              Aplicar
            </button>
          </div>
        ) : (
          <div className="promo-applied promo-success">
            <span className="promo-badge">{promoCode}</span>
            <span className="promo-discount">-${discount.toFixed(2)} MXN</span>
            <button 
              type="button" 
              onClick={removePromoCode}
              className="remove-promo"
            >
              ✕
            </button>
          </div>
        )}
        
        {promoMessage && (
          <motion.p 
            className={`promo-message ${promoApplied ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {promoMessage}
          </motion.p>
        )}
      </div>

      {/* Payment Info - Solo mostrar si el total NO es 0 */}
      {calculateTotal() > 0 && (
        <div className="form-section">
          <h4>Información de Pago</h4>
          
          <div className="form-group">
            <label>Tarjeta de Crédito/Débito *</label>
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
        </div>
      )}

      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal ({formData.quantity} items)</span>
          <span>${(product.price * formData.quantity).toFixed(2)} MXN</span>
        </div>
        
        {promoApplied && (
          <div className="summary-row discount-row">
            <span>Descuento ({promoCode})</span>
            <span className="discount-amount">-${discount.toFixed(2)} MXN</span>
          </div>
        )}
        
        <div className="summary-row">
          <span>Envío</span>
          <span>GRATIS</span>
        </div>
        
        <div className="summary-row total-row">
          <span>Total</span>
          <span className="total-amount">
            {calculateTotal() === 0 ? (
              <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '1.3rem' }}>
                ¡GRATIS!
              </span>
            ) : (
              `$${calculateTotal().toFixed(2)} MXN`
            )}
          </span>
        </div>
      </div>

      {/* Submit Button - Texto dinámico */}
      <motion.button 
        type="submit" 
        disabled={isProcessing}
        className={`submit-button ${isProcessing ? 'processing' : ''} ${calculateTotal() === 0 ? 'free-order' : ''}`}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <>
            <span className="spinner"></span>
            Procesando...
          </>
        ) : calculateTotal() === 0 ? (
          '🎉 ¡OBTENER GRATIS!'
        ) : (
          `Pagar $${calculateTotal().toFixed(2)} MXN`
        )}
      </motion.button>

      {/* Security Badges */}
      <div className="security-badges">
      
        <span>Powered by Stripe</span>
      </div>
    </form>
  );
};

export default MerchCheckoutForm;