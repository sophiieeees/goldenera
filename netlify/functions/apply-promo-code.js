// Códigos promocionales - TODOS con 'discount'
const promoCodes = {

  'GOLDENTIME': { discount: 333, type: 'fixed' },
  'TEST100': { discount: 100, type: 'percentage' },  // 100% descuento
  
};

exports.handler = async (event, context) => {
  console.log('=== APPLY PROMO CODE ===');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { code, amount } = JSON.parse(event.body);
    console.log(`Código: ${code}, Monto original: $${amount} MXN`);
    
    const promoCode = promoCodes[code.toUpperCase()];
    
    if (!promoCode) {
      console.log('Código no encontrado:', code);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          message: 'Código promocional inválido' 
        })
      };
    }

    console.log('Código encontrado:', promoCode);

    // Validar monto mínimo si existe
    if (promoCode.minAmount && amount < promoCode.minAmount) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          message: `Este código requiere una compra mínima de $${promoCode.minAmount} MXN` 
        })
      };
    }

    let discountAmount = 0;
    
    // Calcular descuento basado en el tipo
    if (promoCode.type === 'percentage') {
      // Para porcentaje
      discountAmount = (amount * promoCode.discount) / 100;
      console.log(`Descuento porcentaje: ${promoCode.discount}% de $${amount} = $${discountAmount}`);
    } else if (promoCode.type === 'fixed') {
      // Para monto fijo
      discountAmount = promoCode.discount;
      console.log(`Descuento fijo: $${discountAmount}`);
    }

    // Asegurar que el descuento no sea mayor que el monto total
    discountAmount = Math.min(discountAmount, amount);
    
    // Calcular monto final
    const finalAmount = Math.max(0, amount - discountAmount);
    
    console.log(`Descuento aplicado: $${discountAmount}`);
    console.log(`Monto final: $${finalAmount}`);

    // Mensaje personalizado
    let message = '';
    if (finalAmount === 0) {
      message = '¡Código aplicado! 100% de descuento - ¡GRATIS!';
    } else {
      message = `¡Código aplicado! ${promoCode.discount}${promoCode.type === 'percentage' ? '%' : ' MXN'} de descuento`;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        discount: promoCode.discount,
        type: promoCode.type,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        message: message
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error procesando el código promocional' 
      })
    };
  }
};