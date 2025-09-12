const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  console.log('=== MERCH PAYMENT FUNCTION START ===');
  console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
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
    const data = JSON.parse(event.body);
    console.log('Parsed merch data:', data);

    // Precio fijo de 888 MXN (77700 centavos)
    const unitPrice = 88800;
    const quantity = data.quantity || 1;
    const amount = unitPrice * quantity;
    
    console.log('Amount to charge:', amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'mxn',
      metadata: {
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone || '',
        productId: data.productId,
        productName: data.productName || 'Golden Era Merch',
        quantity: quantity.toString(),
        size: data.size || 'M',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: { enabled: true }
    });

    console.log('Payment intent created:', paymentIntent.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100
      })
    };
  } catch (error) {
    console.error('ERROR in merch payment function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        type: error.type
      })
    };
  }
};