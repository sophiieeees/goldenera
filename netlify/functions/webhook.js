// netlify/functions/webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

// Configurar Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmails = async (paymentData) => {
  const programNames = {
    'golden-standard': 'GOLDEN STANDARD',
    'ultra-deluxe': 'ULTRA DELUXE'
  };

  const customerEmail = {
    from: process.env.EMAIL_FROM,
    to: paymentData.customerEmail,
    subject: '¡Bienvenido a Golden Era! - Confirmación de Pago',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff;">
        <div style="background: linear-gradient(135deg, #EAC31B 0%, #d4ac16 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #000; font-size: 2.5rem; margin: 0; font-weight: 900;">GOLDEN ERA</h1>
          <p style="color: #000; margin: 10px 0; font-size: 1.1rem;">Transform your physique. Transform your life.</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #EAC31B; margin-top: 0; font-size: 2rem;">¡Pago Confirmado!</h2>
          <p style="font-size: 1.2rem; line-height: 1.6;">Hola <strong style="color: #EAC31B;">${paymentData.customerName}</strong>,</p>
          <p style="font-size: 1.1rem; line-height: 1.6;">¡Felicidades! Acabas de unirte a la élite. Tu pago ha sido procesado exitosamente y ahora eres oficialmente parte de Golden Era.</p>
          
          <div style="background: #111; padding: 30px; border-radius: 10px; border-left: 5px solid #EAC31B; margin: 30px 0;">
            <h3 style="color: #EAC31B; margin-top: 0; font-size: 1.5rem;"> Detalles de tu Inversión</h3>
            <table style="width: 100%; color: #ccc; font-size: 1.1rem;">
              <tr><td style="padding: 8px 0;"><strong>Programa:</strong></td><td style="color: #EAC31B; font-weight: bold;">${programNames[paymentData.programType] || paymentData.programType}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Inversión:</strong></td><td style="color: #EAC31B; font-weight: bold;">$${(paymentData.amount / 100).toLocaleString()} MXN</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Fecha:</strong></td><td>${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>ID de Transacción:</strong></td><td style="font-family: monospace; font-size: 0.9rem;">${paymentData.paymentIntentId}</td></tr>
            </table>
          </div>
          
          <div style="background: linear-gradient(135deg, #222 0%, #111 100%); padding: 30px; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #EAC31B; margin-top: 0; font-size: 1.5rem;"> ¿Qué sigue ahora?</h3>
            <ul style="color: #ccc; font-size: 1.1rem; line-height: 1.8; padding-left: 20px;">
              <li><strong style="color: #EAC31B;">En las próximas 24 horas:</strong> Nuestro equipo se pondrá en contacto contigo</li>
              <li><strong style="color: #EAC31B;">Primera semana:</strong> Recibirás tu plan de entrenamiento personalizado</li>
              <li><strong style="color: #EAC31B;">Plan nutricional:</strong> Diseñado específicamente para tus objetivos</li>
              <li><strong style="color: #EAC31B;">Acceso VIP:</strong> Comunidad exclusiva de Golden Era</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #EAC31B 0%, #d4ac16 100%); border-radius: 10px;">
            <h3 style="color: #000; margin: 0; font-size: 1.8rem; font-weight: 900;">¡Tu transformación comienza HOY!</h3>
            <p style="color: #000; margin: 10px 0; font-size: 1.2rem;">Prepárate para convertirte en la mejor versión de ti mismo</p>
          </div>
          
          <div style="border-top: 2px solid #333; padding-top: 30px; text-align: center; color: #666; margin-top: 40px;">
            <p style="font-size: 1rem;">¿Tienes preguntas? Responde a este email o contáctanos.</p>
            <p style="font-size: 0.9rem; margin-top: 20px;">Golden Era® - Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    `
  };

  const adminEmail = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🎯 NUEVA VENTA - ${programNames[paymentData.programType]} - $${(paymentData.amount / 100).toLocaleString()} MXN`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f8f9fa; padding: 0;">
        <div style="background: linear-gradient(135deg, #EAC31B 0%, #d4ac16 100%); padding: 20px; text-align: center;">
          <h1 style="color: #000; margin: 0; font-size: 1.8rem;"> NUEVA VENTA GOLDEN ERA</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <div style="background: #e8f5e8; border-left: 5px solid #28a745; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #155724; margin: 0 0 10px 0;">Cliente: ${paymentData.customerName}</h2>
            <p style="color: #155724; margin: 0; font-size: 1.4rem; font-weight: bold;">Programa: ${programNames[paymentData.programType]}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;"> Email</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${paymentData.customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;"> Teléfono</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${paymentData.customerPhone || 'No proporcionado'}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;"> Monto</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; color: #28a745; font-weight: bold; font-size: 1.2rem;">$${(paymentData.amount / 100).toLocaleString()} MXN</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;"> Fecha</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date().toLocaleString('es-MX')}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;"> ID Stripe</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-family: monospace; font-size: 0.9rem;">${paymentData.paymentIntentId}</td>
            </tr>
          </table>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 25px 0;">
            <h3 style="color: #856404; margin: 0 0 10px 0;"> ACCIÓN REQUERIDA</h3>
            <p style="color: #856404; margin: 0; font-weight: bold;">Contactar al cliente en las próximas 24 horas para iniciar su transformación.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #EAC31B;">
            <p style="color: #666; margin: 0;">Golden Era - Sistema de Notificaciones</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(adminEmail)
    ]);
    console.log(' Emails enviados exitosamente a:', paymentData.customerEmail);
  } catch (error) {
    console.error(' Error enviando emails:', error.message);
    throw error;
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      stripeEvent = JSON.parse(event.body);
    }

    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object;
      console.log(' Pago exitoso:', paymentIntent.id);
      
      const paymentData = {
        ...paymentIntent.metadata,
        amount: paymentIntent.amount,
        paymentIntentId: paymentIntent.id
      };

      await sendConfirmationEmails(paymentData);
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ received: true }) 
    };
  } catch (error) {
    console.error(' Webhook error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
