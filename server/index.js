const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  }
});

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parser - webhooks necesitan raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use('/api/merch-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ==================== RUTAS API ====================

// --- PAYMENT (crear payment intent) ---
app.post('/api/payment', async (req, res) => {
  console.log('=== PAYMENT START ===');
  try {
    const data = req.body;
    const amount = data.programType === 'ultra-deluxe' ? 3500000 : 350000;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'mxn',
      metadata: {
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone || '',
        programType: data.programType,
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: { enabled: true }
    });

    console.log('Payment intent created:', paymentIntent.id);
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- CONTACT ---
app.post('/api/contact', async (req, res) => {
  console.log('=== CONTACT START ===');
  try {
    const data = req.body;

    if (!data.name?.trim() || !data.email?.trim()) {
      return res.status(400).json({ error: 'Nombre y email son requeridos', success: false });
    }

    const userData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || ''
    };

    // Email al usuario
    await transporter.sendMail({
      from: `"Golden Era Team" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: '🏆 Bienvenido a Golden Era',
      html: `<div style="font-family: Arial; max-width: 600px;">
        <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center;">
          <h1 style="color: #000;">🏆 GOLDEN ERA 🏆</h1>
        </div>
        <div style="padding: 30px;">
          <h2>¡Hola ${userData.name}!</h2>
          <p>Gracias por tu interés en Golden Era. ¡Tu transformación está a un click de distancia!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://wa.me/5217202533388?text=Hola%20soy%20${encodeURIComponent(userData.name)}"
               style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              💬 HABLAR POR WHATSAPP
            </a>
          </div>
        </div>
      </div>`
    });

    // Email al admin
    await transporter.sendMail({
      from: `"Golden Era System" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🚨 NUEVO LEAD: ${userData.name}`,
      html: `<h2>🚨 NUEVO LEAD - GOLDEN ERA</h2>
        <p><strong>Nombre:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Teléfono:</strong> ${userData.phone || 'No proporcionado'}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>`
    });

    res.json({ success: true, message: 'Formulario enviado exitosamente' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// --- APPLY PROMO CODE ---
const promoCodes = {
  'GOLDENTIME': { discount: 333, type: 'fixed' },
  'TEST100': { discount: 100, type: 'percentage' },
};

app.post('/api/apply-promo-code', (req, res) => {
  console.log('=== APPLY PROMO CODE ===');
  try {
    const { code, amount } = req.body;
    const promoCode = promoCodes[code.toUpperCase()];

    if (!promoCode) {
      return res.json({ valid: false, message: 'Código promocional inválido' });
    }

    let discountAmount = promoCode.type === 'percentage'
      ? (amount * promoCode.discount) / 100
      : promoCode.discount;

    discountAmount = Math.min(discountAmount, amount);
    const finalAmount = Math.max(0, amount - discountAmount);

    res.json({
      valid: true,
      discount: promoCode.discount,
      type: promoCode.type,
      discountAmount,
      finalAmount,
      message: finalAmount === 0 ? '¡GRATIS!' : `¡${promoCode.discount}${promoCode.type === 'percentage' ? '%' : ' MXN'} de descuento!`
    });
  } catch (error) {
    console.error('Promo error:', error);
    res.status(500).json({ error: 'Error procesando código' });
  }
});

// --- MERCH PAYMENT (confirmación de orden) ---
app.post('/api/merch-payment', async (req, res) => {
  console.log('=== MERCH ORDER ===');
  try {
    const data = req.body;
    const orderData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || '',
      productName: data.productName || 'Golden Era Merch',
      quantity: data.quantity || 1,
      size: data.size || 'M',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zipCode || '',
      promoCode: data.promoCode || '',
      finalAmount: data.finalAmount || 0,
      orderId: data.orderId || `ORDER_${Date.now()}`
    };

    // Email al cliente
    await transporter.sendMail({
      from: `"Golden Era Store" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `🏆 Confirmación de Pedido #${orderData.orderId}`,
      html: `<div style="font-family: Arial; max-width: 600px;">
        <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center;">
          <h1 style="color: #000;">🏆 GOLDEN ERA 🏆</h1>
        </div>
        <div style="padding: 30px;">
          <h2>¡Hola ${orderData.customerName}!</h2>
          <p>Tu pedido ha sido confirmado.</p>
          <p><strong>Producto:</strong> ${orderData.productName}</p>
          <p><strong>Talla:</strong> ${orderData.size}</p>
          <p><strong>Total:</strong> $${orderData.finalAmount} MXN</p>
          <p><strong>Dirección:</strong> ${orderData.address}, ${orderData.city}</p>
        </div>
      </div>`
    });

    // Email al admin
    await transporter.sendMail({
      from: `"Golden Era System" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🚨 NUEVA ORDEN: ${orderData.customerName}`,
      html: `<h2>🚨 NUEVA ORDEN DE MERCH</h2>
        <p><strong>Cliente:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Producto:</strong> ${orderData.productName}</p>
        <p><strong>Talla:</strong> ${orderData.size}</p>
        <p><strong>Total:</strong> $${orderData.finalAmount} MXN</p>
        <p><strong>Dirección:</strong> ${orderData.address}, ${orderData.city}, ${orderData.state} ${orderData.zipCode}</p>`
    });

    res.json({ success: true, message: 'Orden procesada' });
  } catch (error) {
    console.error('Merch error:', error);
    res.status(500).json({ success: false, error: 'Error enviando confirmación' });
  }
});

// --- WEBHOOK (Stripe para programas) ---
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = process.env.STRIPE_WEBHOOK_SECRET
      ? stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
      : JSON.parse(req.body);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('💰 Pago exitoso:', paymentIntent.id);
      // Aquí enviarías emails de confirmación
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- MERCH WEBHOOK ---
app.post('/api/merch-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = process.env.STRIPE_WEBHOOK_SECRET
      ? stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
      : JSON.parse(req.body);

    if (event.type === 'payment_intent.succeeded' && event.data.object.metadata.productId) {
      console.log('💰 Merch sale:', event.data.object.id);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Merch webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATIC FILES (PRODUCTION) ====================
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
