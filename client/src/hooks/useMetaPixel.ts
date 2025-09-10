import { useCallback } from 'react';

// Declarar fbq globalmente
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

interface CustomerData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface LeadData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  [key: string]: any;
}

interface PurchaseData {
  value: number;
  currency: string;
  content_ids?: string[];
  content_type?: string;
  content_name?: string;
  num_items?: number;
  transaction_id?: string;
  [key: string]: any;
}

interface AddToCartData {
  value: number;
  currency: string;
  content_ids: string[];
  content_type?: string;
  content_name?: string;
  [key: string]: any;
}

interface InitiateCheckoutData {
  value: number;
  currency: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  [key: string]: any;
}

const useMetaPixel = () => {
  // Función auxiliar para hashear datos sensibles
  const hashData = useCallback((data: string): string => {
    return data.toLowerCase().trim();
  }, []);

  // Función para formatear datos de usuario avanzados
  const formatUserData = useCallback((customerData?: CustomerData) => {
    if (!customerData) return {};

    const userData: any = {};

    if (customerData.email) {
      userData.em = hashData(customerData.email);
    }
    if (customerData.phone) {
      userData.ph = hashData(customerData.phone.replace(/\D/g, ''));
    }
    if (customerData.firstName) {
      userData.fn = hashData(customerData.firstName);
    }
    if (customerData.lastName) {
      userData.ln = hashData(customerData.lastName);
    }
    if (customerData.city) {
      userData.ct = hashData(customerData.city);
    }
    if (customerData.state) {
      userData.st = hashData(customerData.state);
    }
    if (customerData.zipCode) {
      userData.zp = hashData(customerData.zipCode);
    }
    if (customerData.country) {
      userData.country = hashData(customerData.country);
    }

    return userData;
  }, [hashData]);

  // Track Lead
  const trackLead = useCallback((data?: LeadData, customerData?: CustomerData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const eventData = {
        content_name: 'Golden Era Training Program',
        content_category: 'Fitness',
        value: data?.value || 1997, // Valor en MXN
        currency: data?.currency || 'MXN',
        ...data
      };

      if (customerData) {
        const userData = formatUserData(customerData);
        window.fbq('track', 'Lead', eventData, { eventID: `lead_${Date.now()}` });
        window.fbq('init', '719797664420191', userData);
      } else {
        window.fbq('track', 'Lead', eventData);
      }

      console.log('🎯 Meta Pixel: Lead tracked', eventData);
    }
  }, [formatUserData]);

  // Track InitiateCheckout
  const trackInitiateCheckout = useCallback((data: InitiateCheckoutData, customerData?: CustomerData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const eventData = {
        content_type: 'product',
        content_ids: data.content_ids || ['golden-era-program'],
        num_items: data.num_items || 1,
        value: data.value,
        currency: data.currency || 'MXN'
      };

      if (customerData) {
        const userData = formatUserData(customerData);
        window.fbq('init', '719797664420191', userData);
      }

      window.fbq('track', 'InitiateCheckout', eventData, {
        eventID: `checkout_${Date.now()}`
      });

      console.log('🛒 Meta Pixel: InitiateCheckout tracked', eventData);
    }
  }, [formatUserData]);

  // Track AddToCart
  const trackAddToCart = useCallback((data: AddToCartData, customerData?: CustomerData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const eventData = {
        content_type: 'product',
        value: data.value,
        currency: data.currency || 'MXN',
        content_ids: data.content_ids,
        content_name: data.content_name
      };

      if (customerData) {
        const userData = formatUserData(customerData);
        window.fbq('init', '719797664420191', userData);
      }

      window.fbq('track', 'AddToCart', eventData, {
        eventID: `cart_${Date.now()}`
      });

      console.log('🛍️ Meta Pixel: AddToCart tracked', eventData);
    }
  }, [formatUserData]);

  // Track AddPaymentInfo
  const trackAddPaymentInfo = useCallback((data?: any, customerData?: CustomerData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const eventData = {
        content_category: 'Fitness',
        content_name: 'Golden Era Program',
        currency: 'MXN',
        ...data
      };

      if (customerData) {
        const userData = formatUserData(customerData);
        window.fbq('init', '719797664420191', userData);
      }

      window.fbq('track', 'AddPaymentInfo', eventData, {
        eventID: `payment_info_${Date.now()}`
      });

      console.log('💳 Meta Pixel: AddPaymentInfo tracked', eventData);
    }
  }, [formatUserData]);

  // Track Purchase - CORREGIDO sin duplicados
  const trackPurchase = useCallback((data: PurchaseData, customerData?: CustomerData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Extraer las propiedades que queremos controlar
      const { 
        value, 
        currency, 
        content_ids, 
        content_name, 
        content_type,
        num_items,
        transaction_id,
        ...otherData 
      } = data;
      
      // Crear el objeto sin duplicados
      const eventData = {
        value: value,
        currency: currency || 'MXN',
        content_type: content_type || 'product',
        content_ids: content_ids || ['golden-era-program'],
        content_name: content_name || 'Golden Era Training Program',
        num_items: num_items || 1,
        transaction_id: transaction_id,
        ...otherData // Solo datos adicionales que no se duplican
      };

      if (customerData) {
        const userData = formatUserData(customerData);
        window.fbq('init', '719797664420191', userData);
      }

      const eventID = transaction_id || `purchase_${Date.now()}`;
      
      window.fbq('track', 'Purchase', eventData, { eventID });

      console.log('💰 Meta Pixel: Purchase tracked', eventData, 'EventID:', eventID);
    }
  }, [formatUserData]);

  // Track ViewContent
  const trackViewContent = useCallback((contentName: string, value?: number, contentIds?: string[]) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: contentName,
        content_category: 'Fitness',
        content_ids: contentIds || [],
        content_type: 'product',
        value: value || 0,
        currency: 'MXN'
      });
      
      console.log('👁️ Meta Pixel: ViewContent tracked', contentName);
    }
  }, []);

  // Track CompleteRegistration
  const trackCompleteRegistration = useCallback((value?: number, customerData?: CustomerData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const eventData = {
        content_name: 'Golden Era Membership',
        status: true,
        value: value || 0,
        currency: 'MXN'
      };

      if (customerData) {
        const userData = formatUserData(customerData);
        window.fbq('init', '719797664420191', userData);
      }

      window.fbq('track', 'CompleteRegistration', eventData);
      
      console.log('✅ Meta Pixel: CompleteRegistration tracked', eventData);
    }
  }, [formatUserData]);

  // Track Custom Events
  const trackCustom = useCallback((eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, data);
      console.log(`📊 Meta Pixel: Custom event '${eventName}' tracked`, data);
    }
  }, []);

  // Track PageView
  const trackPageView = useCallback(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      console.log('📄 Meta Pixel: PageView tracked');
    }
  }, []);

  // Track Search
  const trackSearch = useCallback((searchString: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Search', {
        search_string: searchString,
        content_category: 'Fitness'
      });
      console.log('🔍 Meta Pixel: Search tracked', searchString);
    }
  }, []);

  return {
    trackLead,
    trackInitiateCheckout,
    trackAddToCart,
    trackAddPaymentInfo,
    trackPurchase,
    trackViewContent,
    trackCompleteRegistration,
    trackCustom,
    trackPageView,
    trackSearch
  };
};

export default useMetaPixel;