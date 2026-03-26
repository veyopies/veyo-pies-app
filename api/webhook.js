const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

// Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASSWORD,
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body required
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const m = session.metadata;

    const emailBody = `
🥧 NEW VEYO PIES ORDER

Customer: ${m.customerName}
Email: ${session.customer_email}
Phone: ${m.customerPhone}

Pickup Date: ${m.pickupDate}
Pickup Time: ${m.pickupTime}

Order:
${m.orderSummary}

Total: $${m.total}
Special Instructions: ${m.specialInstructions}

Payment Status: PAID ✅
Stripe Session ID: ${session.id}
    `.trim();

    try {
      await transporter.sendMail({
        from: process.env.NOTIFY_EMAIL,
        to: process.env.NOTIFY_EMAIL,
        subject: `🥧 New Order — ${m.customerName} — Pickup ${m.pickupDate} ${m.pickupTime}`,
        text: emailBody,
      });
      console.log('Order notification email sent');
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }
  }

  res.status(200).json({ received: true });
};
