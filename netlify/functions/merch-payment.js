const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Merch order function started');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed', success: false })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Order received:', { 
      name: data.customerName, 
      email: data.customerEmail,
      product: data.productName 
    });

    // Verificar configuración
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Configuración SMTP faltante');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuración de email faltante',
          success: false 
        })
      };
    }

    const orderData = {
      customerName: data.customerName.trim(),
      customerEmail: data.customerEmail.trim().toLowerCase(),
      customerPhone: data.customerPhone?.trim() || '',
      productName: data.productName || 'Golden Era Merch',
      quantity: data.quantity || 1,
      size: data.size || 'M',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zipCode || '',
      promoCode: data.promoCode || '',
      originalAmount: data.originalAmount || 888,
      discountAmount: data.discountAmount || 0,
      finalAmount: data.finalAmount || 0,
      orderId: data.orderId || `ORDER_${Date.now()}`
    };

    console.log('Creating transporter...');
    
    // Crear transporter - EXACTAMENTE como contact.js
   // Crear transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      });

    // Template para el cliente
    const customerEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center;">
          <h1 style="color: #000; margin: 0;"> GOLDEN ERA </h1>
          <p style="color: #000; margin: 10px 0;">OFFICIAL MERCHANDISE</p>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>¡Hola ${orderData.customerName}!</h2>
          <p style="font-size: 1.1rem; line-height: 1.6;">
            Tu pedido ha sido <strong>confirmado exitosamente</strong>.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #FFD700;">
            <h3 style="color: #333; margin-top: 0;"> Detalles del Pedido:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0;">Producto:</td>
                <td style="text-align: right; font-weight: bold;">${orderData.productName}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Cantidad:</td>
                <td style="text-align: right;">${orderData.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Talla:</td>
                <td style="text-align: right;">${orderData.size}</td>
              </tr>
              ${orderData.promoCode ? `
              <tr>
                <td style="padding: 5px 0;">Código Promo:</td>
                <td style="text-align: right; color: #4CAF50; font-weight: bold;">${orderData.promoCode}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Descuento:</td>
                <td style="text-align: right; color: #4CAF50;">-$${orderData.discountAmount} MXN</td>
              </tr>
              ` : ''}
              <tr style="border-top: 2px solid #ddd;">
                <td style="padding: 10px 0 5px 0; font-size: 1.2em; font-weight: bold;">Total:</td>
                <td style="text-align: right; font-size: 1.2em; color: ${orderData.finalAmount === 0 ? '#4CAF50' : '#FFD700'}; font-weight: bold;">
                  ${orderData.finalAmount === 0 ? '¡GRATIS!' : `$${orderData.finalAmount} MXN`}
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px 0;"><strong> Dirección de envío:</strong></p>
            <p style="margin: 5px 0;">
              ${orderData.address}<br>
              ${orderData.city}, ${orderData.state} ${orderData.zipCode}
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; color: #856404; font-weight: bold;">
              Tu pedido será enviado en 3-5 días hábiles
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">¿Tienes preguntas?</p>
            <a href="https://wa.me/5217202533388?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20mi%20pedido%20${orderData.orderId}"
               style="background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Contáctanos por WhatsApp
            </a>
          </div>
          
          <p style="color: #999; font-size: 0.9em; text-align: center;">
            ID de orden: ${orderData.orderId}
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;"><strong>GOLDEN ERA</strong> - Donde nacen los guerreros</p>
          <p style="margin: 5px 0 0 0;">
            WhatsApp: +52 55 7696 6262 | Instagram: @mateo.haces
          </p>
        </div>
      </div>
    `;

    // Template para el admin
    const adminEmail = `
      <div style="font-family: Arial, sans-serif;">
        <h2> NUEVA ORDEN DE MERCH - GOLDEN ERA</h2>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h3>Información del Cliente</h3>
          <p><strong>Nombre:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Teléfono:</strong> ${orderData.customerPhone || 'No proporcionado'}</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h3>Detalles del Pedido</h3>
          <p><strong>Producto:</strong> ${orderData.productName}</p>
          <p><strong>Cantidad:</strong> ${orderData.quantity}</p>
          <p><strong>Talla:</strong> ${orderData.size}</p>
          <p><strong>Código Promo:</strong> ${orderData.promoCode || 'N/A'}</p>
          <p><strong>Subtotal:</strong> $${orderData.originalAmount} MXN</p>
          <p><strong>Descuento:</strong> $${orderData.discountAmount} MXN</p>
          <p><strong>TOTAL:</strong> $${orderData.finalAmount} MXN</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h3>Dirección de Envío</h3>
          <p>${orderData.address}</p>
          <p>${orderData.city}, ${orderData.state} ${orderData.zipCode}</p>
        </div>
        <div style="background: #fff3cd; padding: 15px; margin: 15px 0;">
          <strong>ACCIÓN REQUERIDA:</strong> Procesar envío en las próximas 24 horas
        </div>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <p><strong>ID de Orden:</strong> ${orderData.orderId}</p>
      </div>
    `;

    console.log(' Sending emails...');

    // Enviar email al cliente
    await transporter.sendMail({
      from: `"Golden Era Store" <${process.env.SMTP_USER}>`,
      to: orderData.customerEmail,
      subject: ` Confirmación de Pedido #${orderData.orderId}`,
      html: customerEmail,
    });

    // Enviar email al admin
    await transporter.sendMail({
      from: `"Golden Era System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: ` NUEVA ORDEN: ${orderData.customerName} - $${orderData.finalAmount} MXN`,
      html: adminEmail,
    });

    console.log(' Emails sent successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Orden procesada y emails enviados'
      })
    };

  } catch (error) {
    console.error(' Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Error enviando confirmación'
      })
    };
  }
};
