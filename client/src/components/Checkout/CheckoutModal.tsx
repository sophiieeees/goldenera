import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import StripeCheckout from './StripeCheckout';
import './CheckoutModal.scss';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: {
    id: string;
    name: string;
    price: number;
    description?: string;
  } | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, program }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
      setError('');
    }, 4000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setError('');
    onClose();
  };

  if (!program) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="checkout-modal"
      overlayClassName="checkout-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
      </div>
      
      {showSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>¡Pago Exitoso!</h2>
          <p>Gracias por unirte a Golden Era.</p>
          <p>Te hemos enviado un email de confirmación y nuestro equipo se pondrá en contacto contigo pronto.</p>
          <div className="golden-badge">GOLDEN ERA</div>
        </div>
      ) : (
        <div className="checkout-content">
          <StripeCheckout 
            program={program} 
            onSuccess={handleSuccess}
            onError={handleError}
          />
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CheckoutModal;