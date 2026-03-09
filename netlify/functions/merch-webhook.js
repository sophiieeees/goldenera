const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMerchConfirmationEmails = async (paymentData) => {
  const customerEmail = {
    from: process.env.EMAIL_FROM,
    to: paymentData.customerEmail,
    subject: 'Golden Era - Confirmación de Compra de Merch',
    html: `
      <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff;">
        <div style="background: linear-gradient(135deg, #EAC31B 0%, #d4ac16 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #000; font-size: 3rem; margin: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">GOLDEN ERA</h1>
          <p style="color: #000; margin: 10px 0; font-size: 1.2rem; font-weight: 600;">Official Merchandise</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #EAC31B; margin-top: 0; font-size: 2.2rem; text-transform: uppercase;">¡Compra Confirmada!</h2>
          
          <p style="font-size: 1.2rem; line-height: 1.8; color: #fff;">
            Hola <strong style="color: #EAC31B;">${paymentData.customerName}</strong>,
          </p>
          
          <p style="font-size: 1.1rem; line-height: 1.8; color: #ccc;">
            Tu pedido de merchandise oficial de Golden Era ha sido confirmado exitosamente.
          </p>
          
          <div style="background: #111; padding: 25px; border-radius: 10px; margin: 30px 0; border: 2px solid #EAC31B;">
            <h3 style="color: #EAC31B; margin-top: 0; font-size: 1.3rem; text-transform: uppercase;">Detalles del Pedido:</h3>
            <p style="color: #fff; margin: 10px 0;">
              <strong>Producto:</strong> ${paymentData.productName}
            </p>
            <p style="color: #fff; margin: 10px 0;">
              <strong>Cantidad:</strong> ${paymentData.quantity}
            </p>
            <p style="color: #fff; margin: 10px 0;">
              <strong>Talla:</strong> ${paymentData.size}
            </p>
            <p style="color: #fff; margin: 10px 0;">
              <strong>Total:</strong> <span style="color: #EAC31B; font-size: 1.3rem; font-weight: bold;">$${(paymentData.amount / 100).toLocaleString('es-MX')} MXN</span>
            </p>
            <p style="color: #fff; margin: 10px 0;">
              <strong>ID de Transacción:</strong> ${paymentData.paymentIntentId}
            </p>
          </div>
          
          <div style="background: #111; padding: 25px; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #EAC31B; margin-top: 0; font-size: 1.3rem; text-transform: uppercase;">Dirección de Envío:</h3>
            <p style="color: #ccc; margin: 10px 0; line-height: 1.6;">
              ${paymentData.address}<br/>
              ${paymentData.city}, ${paymentData.state}<br/>
              C.P. ${paymentData.zipCode}
            </p>
          </div>
          
          <div style="margin: 40px 0; padding: 20px; background: linear-gradient(135deg, rgba(234, 195, 27, 0.1), rgba(234, 195, 27, 0.05)); border-left: 4px solid #EAC31B;">
            <h3 style="color: #EAC31B; margin-top: 0;"> Próximos Pasos:</h3>
            <ul style="color: #ccc; line-height: 1.8;">
              <li>Tu pedido será procesado en las próximas 24-48 horas</li>
              <li>Recibirás un correo con el número de seguimiento</li>
              <li>Tiempo estimado de entrega: 5-7 días hábiles</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #EAC31B; font-size: 1.5rem; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
              Welcome to the Elite
            </p>
            <p style="color: #999; font-style: italic;">
              "The weak wear excuses. The strong wear Golden Era."
            </p>
          </div>
        </div>
        
        <div style="background: #111; padding: 30px; text-align: center; border-top: 2px solid #EAC31B;">
          <p style="color: #666; margin: 10px 0;">¿Tienes preguntas? Contáctanos:</p>
          <p style="color: #EAC31B; margin: 10px 0;">merch@goldenera.com</p>
          <div style="margin-top: 20px;">
            <a href="https://instagram.com/goldenera" style="color: #EAC31B; text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="https://goldenera.com" style="color: #EAC31B; text-decoration: none; margin: 0 10px;">Website</a>
          </div>
        </div>
      </div>
    `
  };

  const adminEmail = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: ` Nueva Venta de Merch - ${paymentData.productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nueva Venta de Merchandise</h2>
        <h3>Datos del Cliente:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${paymentData.customerName}</li>
          <li><strong>Email:</strong> ${paymentData.customerEmail}</li>
          <li><strong>Teléfono:</strong> ${paymentData.customerPhone}</li>
        </ul>
        <h3>Detalles del Pedido:</h3>
        <ul>
          <li><strong>Producto:</strong> ${paymentData.productName}</li>
          <li><strong>Cantidad:</strong> ${paymentData.quantity}</li>
          <li><strong>Talla:</strong> ${paymentData.size}</li>
          <li><strong>Total:</strong> $${(paymentData.amount / 100).toLocaleString('es-MX')} MXN</li>
        </ul>
        <h3>Dirección de Envío:</h3>
        <p>
          ${paymentData.address}<br/>
          ${paymentData.city}, ${paymentData.state}<br/>
          C.P. ${paymentData.zipCode}
        </p>
        <h3>Stripe:</h3>
        <p>Payment Intent ID: ${paymentData.paymentIntentId}</p>
        <p>Fecha: ${new Date().toLocaleString('es-MX')}</p>
      </div>
    `
  };

  try {
    await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(adminEmail)
    ]);
    console.log(' Merch emails sent successfully');
  } catch (error) {
    console.error(' Error sending merch emails:', error);
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
      
      // Solo procesar si es una venta de merch
      if (paymentIntent.metadata.productId) {
        console.log(' Merch sale successful:', paymentIntent.id);
        
        const paymentData = {
          ...paymentIntent.metadata,
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id
        };

        await sendMerchConfirmationEmails(paymentData);
      }
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ received: true }) 
    };
  } catch (error) {
    console.error(' Merch webhook error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
