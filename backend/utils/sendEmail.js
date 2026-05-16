const nodemailer = require('nodemailer');

const ADMIN_EMAIL = 'spedyservice40@gmail.com';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;

    this.initTransporter();
  }

  initTransporter() {
    const {
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_FROM
    } = process.env;

    console.log('📧 Email config check:', {
      user: EMAIL_USER ? 'set' : 'missing',
      pass: EMAIL_PASS ? 'set' : 'missing',
      host: EMAIL_HOST || 'smtp.gmail.com',
      port: EMAIL_PORT || '587',
      from: EMAIL_FROM || EMAIL_USER
    });

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn('⚠️ Email credentials missing. Email sending disabled.');
      this.isConfigured = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: EMAIL_HOST || 'smtp.gmail.com',
        port: Number(EMAIL_PORT) || 587,
        secure: false,

        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        },

        pool: true,
        maxConnections: 5,
        maxMessages: 100,

        family: 4,

        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,

        tls: {
          rejectUnauthorized: false
        }
      });

      this.isConfigured = true;

      console.log('✅ Email service configured successfully');

      // Do not crash app if verify fails
      this.verifyConnection();

    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error.message);
      this.isConfigured = false;
    }
  }

  async verifyConnection() {
    try {
      if (!this.transporter) return;

      await this.transporter.verify();

      console.log('✅ Email transporter verified');
    } catch (error) {
      console.error('❌ Email transporter verification failed:', error.message);

      // Keep service enabled even if verification fails
      // because Render sometimes blocks verify but sendMail still works
    }
  }

  async sendEmail(options) {
    try {
      if (!this.isConfigured || !this.transporter) {
        console.error('❌ Email service not configured');
        return false;
      }

      const mailOptions = {
        from:
          process.env.EMAIL_FROM ||
          `"Spedy Service" <${process.env.EMAIL_USER}>`,

        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || undefined
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log(`✅ Email sent successfully to ${options.to}`);

      return info;

    } catch (error) {
      console.error('❌ Email send error:', error.message);

      if (error.code) {
        console.error('❌ Error code:', error.code);
      }

      if (error.response) {
        console.error('❌ SMTP response:', error.response);
      }

      return false;
    }
  }

  // =========================
  // BOOKING EMAILS
  // =========================

  async sendBookingConfirmation(booking, customerEmail) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }

          .header {
            background: #2563eb;
            color: white;
            padding: 30px;
            text-align: center;
          }

          .content {
            padding: 30px;
          }

          .card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
          }

          .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 13px;
          }

          .status {
            display: inline-block;
            padding: 6px 12px;
            background: orange;
            color: white;
            border-radius: 5px;
            font-size: 12px;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <div class="header">
            <h1>Spedy Service</h1>
            <p>Booking Confirmation</p>
          </div>

          <div class="content">

            <h2>Hello ${booking.customerName},</h2>

            <p>
              Your booking has been successfully received.
            </p>

            <div class="card">

              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>

              <p>
                <strong>Status:</strong>
                <span class="status">
                  ${booking.status.toUpperCase()}
                </span>
              </p>

              <p><strong>Product:</strong> ${booking.productCategory}</p>

              <p><strong>Brand:</strong> ${booking.brandName}</p>

              <p><strong>Issue:</strong> ${booking.issueDescription}</p>

              <p>
                <strong>Date:</strong>
                ${new Date(booking.preferredDate).toLocaleDateString('en-IN')}
              </p>

              <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>

              <p>
                <strong>Address:</strong>
                ${booking.address}, ${booking.pincode}
              </p>

            </div>

            <p>
              Our technician will contact you shortly.
            </p>

          </div>

          <div class="footer">
            © ${new Date().getFullYear()} Spedy Service
          </div>

        </div>
      </body>
      </html>
    `;

    try {
      await this.sendEmail({
        to: customerEmail,
        subject: `Booking Confirmation - ${booking.bookingId}`,
        html
      });

      await this.sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Booking - ${booking.bookingId}`,
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send booking confirmation:',
        error.message
      );
    }
  }

  async sendBookingStatusUpdate(
    booking,
    customerEmail,
    oldStatus,
    newStatus
  ) {

    const html = `
      <h2>Hello ${booking.customerName}</h2>

      <p>Your booking status has been updated.</p>

      <p>
        <strong>Old Status:</strong> ${oldStatus}
      </p>

      <p>
        <strong>New Status:</strong> ${newStatus}
      </p>

      <p>
        <strong>Booking ID:</strong> ${booking.bookingId}
      </p>
    `;

    try {
      await this.sendEmail({
        to: customerEmail,
        subject: `Booking Status Update - ${booking.bookingId}`,
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send booking status update:',
        error.message
      );
    }
  }

  // =========================
  // ORDER EMAILS
  // =========================

  async sendOrderConfirmation(order, customerEmail) {

    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `).join('');

    const html = `
      <h2>
        Hello ${order.shippingAddress?.fullName || 'Customer'}
      </h2>

      <p>Your order has been placed successfully.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>

      <table border="1" cellpadding="10" cellspacing="0">
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>

        ${itemsHtml}
      </table>

      <h3>Total: ₹${order.totalPrice}</h3>
    `;

    try {
      await this.sendEmail({
        to: customerEmail,
        subject: `Order Confirmation - ${order._id}`,
        html
      });

      await this.sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Order - ${order._id}`,
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send order confirmation:',
        error.message
      );
    }
  }

  async sendOrderStatusUpdate(
    order,
    customerEmail,
    oldStatus,
    newStatus
  ) {

    const html = `
      <h2>
        Hello ${order.shippingAddress?.fullName || 'Customer'}
      </h2>

      <p>Your order status has been updated.</p>

      <p><strong>Old Status:</strong> ${oldStatus}</p>

      <p><strong>New Status:</strong> ${newStatus}</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
    `;

    try {
      await this.sendEmail({
        to: customerEmail,
        subject: `Order Status Update - ${order._id}`,
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send order status update:',
        error.message
      );
    }
  }

  // =========================
  // AUTH EMAILS
  // =========================

  async sendWelcomeEmail(user) {

    const html = `
      <h2>Welcome ${user.name}</h2>

      <p>
        Thank you for registering with Spedy Service.
      </p>
    `;

    try {
      await this.sendEmail({
        to: user.email,
        subject: 'Welcome to Spedy Service',
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send welcome email:',
        error.message
      );
    }
  }

  async sendPasswordResetEmail(user, resetCode) {

    const html = `
      <h2>Password Reset</h2>

      <p>Hello ${user.name}</p>

      <p>Your password reset code is:</p>

      <h1>${resetCode}</h1>

      <p>
        This code expires in 1 hour.
      </p>
    `;

    try {
      await this.sendEmail({
        to: user.email,
        subject: 'Password Reset Code',
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send password reset email:',
        error.message
      );
    }
  }

  async sendVerificationEmail(user, verificationToken) {

    const verifyUrl =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const html = `
      <h2>Email Verification</h2>

      <p>Hello ${user.name}</p>

      <p>
        Please click the button below to verify your email.
      </p>

      <a href="${verifyUrl}">
        Verify Email
      </a>
    `;

    try {
      await this.sendEmail({
        to: user.email,
        subject: 'Verify Your Email',
        html
      });

    } catch (error) {
      console.error(
        '❌ Failed to send verification email:',
        error.message
      );
    }
  }
}

const emailService = new EmailService();

module.exports = emailService;