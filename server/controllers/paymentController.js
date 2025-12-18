const stripe = require('../config/stripe');

// Programas disponibles
const programs = {
  'standard': {
    id: 'standard',
    name: 'Programa Standard',
    price: 350000, // $3,500 MXN en centavos
    currency: 'mxn'
  },
  'ultra-deluxe': {
    id: 'ultra-deluxe',
    name: 'Programa Ultra Deluxe',
    price: 3500000, // $35,000 MXN en centavos
    currency: 'mxn'
  }
};

// Obtener información de programas
exports.getPrograms = async (req, res) => {
  try {
    res.json(Object.values(programs));
  } catch (error) {
    console.error('Error getting programs:', error);
    res.status(500).json({ error: 'Error al obtener programas' });
  }
};

// Crear intención de pago
exports.createPaymentIntent = async (req, res) => {
  try {
    const { programType, customerEmail, customerName, customerPhone } = req.body;

    console.log('=== CREATE PAYMENT INTENT ===');
    console.log('Program type:', programType);

    const amount = programType === 'ultra-deluxe' ? 3500000 : 350000;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'mxn',
      metadata: {
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        programType: programType || 'standard',
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
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: error.message,
      type: error.type
    });
  }
};
