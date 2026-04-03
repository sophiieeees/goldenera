import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './JoinForm.scss';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Refs
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formElementRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  
  // Estados
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');

  // Animación de entrada simple
  useEffect(() => {
    if (!formRef.current) return;

    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(formElementRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
      "-=0.3"
    );

  }, []);

  // Validación
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        if (!/^[a-zA-ZáéíóúñÑüÜ\s]+$/.test(value)) return 'Solo letras y espacios';
        return '';
        
      case 'phone':
        if (!value.trim()) return 'El teléfono es requerido';
        const phoneClean = value.replace(/[\s\-\(\)\.]/g, '');
        if (!/^[\+]?[0-9]{8,15}$/.test(phoneClean)) return 'Teléfono inválido';
        return '';
        
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
        
      default:
        return '';
    }
  };

  // Handlers simplificados
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedField(e.target.name);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFocusedField('');
    
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      if (formElementRef.current) {
        gsap.to(formElementRef.current, {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      console.log('📤 Enviando formulario...', formData);
      
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📨 Respuesta:', result);

      if (result.success) {
        setIsSuccess(true);
        
        if (submitButtonRef.current) {
          gsap.to(submitButtonRef.current, {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1
          });
        }
        
        setTimeout(() => {
          navigate('/join');
        }, 2000);
        
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
      
    } catch (error: any) {
      console.error('Error:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="JoinForm" className="join-form" ref={formRef}>
      <div className="join-form__container">
        <div className="join-form__content">
          
          <div className="join-form__header" ref={titleRef}>
            <h1 className="join-form__title">
              ÚNETE A LA <span className="join-form__title-highlight">GOLDEN ERA</span>
            </h1>
            <p className="join-form__subtitle">
              Reclama tu respeto hoy. Únete a la élite.
            </p>
          </div>

          <form 
            className="join-form__form" 
            ref={formElementRef} 
            onSubmit={handleSubmit}
            noValidate
          >
            
            <div className="join-form__field">
              <label className="join-form__label">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={`join-form__input ${errors.name ? 'join-form__input--error' : ''} ${focusedField === 'name' ? 'join-form__input--focused' : ''}`}
                disabled={isLoading}
                autoComplete="given-name"
                placeholder="Ingresa tu nombre completo"
              />
              {errors.name && (
                <span className="join-form__error">{errors.name}</span>
              )}
            </div>

            <div className="join-form__field">
              <label className="join-form__label">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={`join-form__input ${errors.phone ? 'join-form__input--error' : ''} ${focusedField === 'phone' ? 'join-form__input--focused' : ''}`}
                disabled={isLoading}
                autoComplete="tel"
                placeholder="Ej: +1 234 567 8900"
              />
              {errors.phone && (
                <span className="join-form__error">{errors.phone}</span>
              )}
            </div>

            <div className="join-form__field">
              <label className="join-form__label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={`join-form__input ${errors.email ? 'join-form__input--error' : ''} ${focusedField === 'email' ? 'join-form__input--focused' : ''}`}
                disabled={isLoading}
                autoComplete="email"
                placeholder="Ej: goldenera@gmail.com"
              />
              {errors.email && (
                <span className="join-form__error">{errors.email}</span>
              )}
            </div>

            <button
              type="submit"
              ref={submitButtonRef}
              className="join-form__submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="join-form__spinner"></span>
                  Enviando...
                </>
              ) : (
                'COMENZAR MI TRANSFORMACIÓN'
              )}
            </button>

            {isSuccess && (
              <div className="join-form__message join-form__message--success">
                ¡Perfecto! Te hemos enviado un email. Redirigiendo...
              </div>
            )}

            {isError && (
              <div className="join-form__message join-form__message--error">
                Error al enviar. Por favor intenta nuevamente.
              </div>
            )}

          </form>

        </div>
      </div>
    </section>
  );
};

export default JoinForm;
