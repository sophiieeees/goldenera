const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const programNames = {
  'golden-standard': 'GOLDEN STANDARD',
  'standard': 'GOLDEN STANDARD',
  'ultra-deluxe': 'ULTRA DELUXE'
};

exports.sendConfirmationEmail = async (paymentData) => {
  const programName = programNames[paymentData.programType] || paymentData.programType;
  const amount = (paymentData.amount / 100).toLocaleString();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: paymentData.customerEmail,
    subject: '¡Bienvenido a Golden Era! - Confirmación de Pago',
    html: '<div style="font-family: Arial; max-width: 600px; background: #000; color: #fff;">' +
      '<div style="background: #EAC31B; padding: 40px; text-align: center;">' +
      '<h1 style="color: #000;">GOLDEN ERA</h1></div>' +
      '<div style="padding: 40px;">' +
      '<h2 style="color: #EAC31B;">¡Pago Confirmado!</h2>' +
      '<p>Hola <strong>' + paymentData.customerName + '</strong>,</p>' +
      '<p>Tu pago ha sido procesado exitosamente.</p>' +
      '<div style="background: #111; padding: 20px; border-left: 5px solid #EAC31B;">' +
      '<p><strong>Programa:</strong> ' + programName + '</p>' +
      '<p><strong>Monto:</strong> $' + amount + ' MXN</p>' +
      '<p><strong>ID:</strong> ' + paymentData.paymentIntentId + '</p>' +
      '</div></div></div>'
  };
  await transporter.sendMail(mailOptions);
  console.log('Email confirmación enviado a:', paymentData.customerEmail);
};

exports.notifyAdminOfPurchase = async (paymentData) => {
  const programName = programNames[paymentData.programType] || paymentData.programType;
  const amount = (paymentData.amount / 100).toLocaleString();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'NUEVA VENTA - ' + programName,
    html: '<div style="font-family: Arial;">' +
      '<h1 style="background: #EAC31B; padding: 20px;">NUEVA VENTA</h1>' +
      '<div style="padding: 20px;">' +
      '<p><strong>Cliente:</strong> ' + paymentData.customerName + '</p>' +
      '<p><strong>Email:</strong> ' + paymentData.customerEmail + '</p>' +
      '<p><strong>Telefono:</strong> ' + (paymentData.customerPhone || 'No proporcionado') + '</p>' +
      '<p><strong>Programa:</strong> ' + programName + '</p>' +
      '<p><strong>Monto:</strong> $' + amount + ' MXN</p>' +
      '<p><strong>ID Stripe:</strong> ' + paymentData.paymentIntentId + '</p>' +
      '</div></div>'
  };
  await transporter.sendMail(mailOptions);
  console.log('Email notificación enviado al admin');
};

exports.notifyPaymentError = async (errorData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'ERROR DE PAGO - Golden Era',
    html: '<div style="font-family: Arial;">' +
      '<h1 style="color: #dc3545;">Error en Pago</h1>' +
      '<p><strong>Error:</strong> ' + errorData.error + '</p>' +
      '<p><strong>Cliente:</strong> ' + (errorData.customerName || 'N/A') + '</p>' +
      '<p><strong>Email:</strong> ' + (errorData.customerEmail || 'N/A') + '</p>' +
      '</div>'
  };
  await transporter.sendMail(mailOptions);
  console.log('Email de error enviado al admin');
};
