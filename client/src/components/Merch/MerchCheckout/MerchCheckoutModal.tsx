import React, { useState } from 'react';
import Modal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../services/stripe'; // USAR LA MISMA INSTANCIA
import MerchCheckoutForm from './MerchCheckoutForm';
import './MerchCheckoutModal.scss';

interface MerchCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    sizes: string[];
  } | null;
}

const MerchCheckoutModal: React.FC<MerchCheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
      setError('');
    }, 3000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="merch-checkout-modal"
      overlayClassName="merch-checkout-overlay"
      ariaHideApp={false}
    >
      <button className="close-btn" onClick={onClose}>×</button>
      
      {showSuccess ? (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>¡Compra Exitosa!</h2>
          <p>Te hemos enviado un correo de confirmación</p>
          <p className="success-subtitle">Tu merch oficial está en camino</p>
        </div>
      ) : (
        <>
          <div className="modal-header">
        
            
          </div>
          
          <Elements stripe={stripePromise}>
            <MerchCheckoutForm 
              product={product}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>
          
          {error && <div className="error-message">{error}</div>}
        </>
      )}
    </Modal>
  );
};

export default MerchCheckoutModal;