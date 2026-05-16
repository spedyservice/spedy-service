const nodemailer = require('nodemailer');
const axios = require('axios');

const ADMIN_EMAIL = 'spedyservice40@gmail.com';

// Determine if we should use Brevo (production with API key) or nodemailer
const USE_BREVO = process.env.NODE_ENV === 'production' && process.env.BREVO_API_KEY;

class EmailService {
  constructor() {
    this.isConfigured = false;
    if (USE_BREVO) {
      this.initBrevo();
    } else {
      this.initNodemailer();
    }
  }

  // ---------- Nodemailer (Gmail) for development ----------
  initNodemailer() {
    const { EMAIL_USER, EMAIL_PASS } = process.env;
    console.log('📧 Nodemailer config:', { user: EMAIL_USER ? 'set' : 'missing', pass: EMAIL_PASS ? 'set' : 'missing' });

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn('⚠️ Email credentials missing. Email sending disabled.');
      this.isConfigured = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        family: 4, // prefer IPv4
      });
      this.isConfigured = true;
      console.log('✅ Nodemailer (Gmail) configured for development');
      this.verifyNodemailer();
    } catch (err) {
      console.error('❌ Failed to create email transporter:', err.message);
      this.isConfigured = false;
    }
  }

  async verifyNodemailer() {
    if (!this.transporter) return;
    try {
      await this.transporter.verify();
      console.log('✅ Nodemailer transporter verified');
    } catch (error) {
      console.error('❌ Nodemailer verification failed:', error.message);
    }
  }

  // ---------- Brevo API for production ----------
  initBrevo() {
    this.brevoApiKey = process.env.BREVO_API_KEY;
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
    this.senderName = process.env.BREVO_SENDER_NAME || "Spedy Service";
    this.isConfigured = true;
    console.log('✅ Brevo email service configured for production');
  }

  async sendViaBrevo(to, subject, html) {
    if (!this.brevoApiKey) {
      console.error('❌ BREVO_API_KEY missing');
      return false;
    }
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { email: this.senderEmail, name: this.senderName },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
        },
        {
          headers: {
            'api-key': this.brevoApiKey,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
      console.log(`✅ Brevo email sent to ${to}: ${response.data.messageId}`);
      return true;
    } catch (error) {
      console.error('❌ Brevo error:', error.response?.data || error.message);
      return false;
    }
  }

  // ---------- Unified send method ----------
  async sendEmail(options) {
    if (!this.isConfigured) {
      console.error('❌ Email service not configured. Cannot send to', options.to);
      return false;
    }
    if (USE_BREVO) {
      return this.sendViaBrevo(options.to, options.subject, options.html);
    } else {
      // Nodemailer
      try {
        const mailOptions = {
          from: `"Spedy Service" <${process.env.EMAIL_USER}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
        };
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Nodemailer sent to ${options.to}: ${info.messageId}`);
        return true;
      } catch (err) {
        console.error('❌ Nodemailer error:', err.message);
        return false;
      }
    }
  }

  // ------------------------ All email methods (identical to your original, but calling this.sendEmail) ------------------------
  async sendBookingConfirmation(booking, customerEmail) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .status { display: inline-block; padding: 5px 12px; background: #f59e0b; color: white; border-radius: 5px; font-size: 12px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          h2 { margin-top: 0; }
          .detail-row { margin-bottom: 10px; }
          .detail-label { font-weight: bold; width: 120px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spedy Service</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <h2>Dear ${booking.customerName},</h2>
            <p>Thank you for choosing Spedy Service! Your service request has been received and is being processed.</p>
            <div class="booking-details">
              <h3>Booking Details:</h3>
              <div class="detail-row"><span class="detail-label">Booking ID:</span> ${booking.bookingId}</div>
              <div class="detail-row"><span class="detail-label">Status:</span> <span class="status">${booking.status.toUpperCase()}</span></div>
              <div class="detail-row"><span class="detail-label">Product:</span> ${booking.productCategory}</div>
              <div class="detail-row"><span class="detail-label">Brand:</span> ${booking.brandName}</div>
              <div class="detail-row"><span class="detail-label">Issue:</span> ${booking.issueDescription}</div>
              <div class="detail-row"><span class="detail-label">Preferred Date:</span> ${new Date(booking.preferredDate).toLocaleDateString('en-IN')}</div>
              <div class="detail-row"><span class="detail-label">Time Slot:</span> ${booking.timeSlot}</div>
              <div class="detail-row"><span class="detail-label">Address:</span> ${booking.address}, ${booking.pincode}</div>
            </div>
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Our team will contact you within 24 hours</li>
              <li>A technician will be assigned to your service request</li>
              <li>Final price will be quoted after on-site inspection</li>
            </ul>
            <p>If you have any questions, please contact us at ${process.env.EMAIL_USER}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to customer
    this.sendEmail({
      to: customerEmail,
      subject: `Booking Confirmation - ${booking.bookingId}`,
      html,
    }).catch(err => console.error('Email error (booking customer):', err.message));

    // Send copy to admin
    const adminHtml = html.replace(`Dear ${booking.customerName}`, 'Admin Notification');
    this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Booking: ${booking.bookingId} - ${booking.customerName}`,
      html: adminHtml,
    }).catch(err => console.error('Email error (booking admin):', err.message));
  }

  async sendBookingStatusUpdate(booking, customerEmail, oldStatus, newStatus) {
    const statusMessages = {
      confirmed: 'Your booking has been confirmed! A technician will be assigned soon.',
      in_progress: 'Good news! Our technician is now working on your service request.',
      completed: 'Your service has been completed successfully. Thank you for choosing us!',
      cancelled: 'Your booking has been cancelled as requested.',
      rescheduled: `Your booking has been rescheduled to ${new Date(booking.preferredDate).toLocaleDateString('en-IN')}`,
    };
    const message = statusMessages[newStatus] || `Your booking status has been updated to ${newStatus}.`;
    const reviewLink = `${process.env.FRONTEND_URL || 'https://spedy-service.vercel.app'}/my-bookings`;
    const reviewHtml = newStatus === 'completed' ? `<p>We'd love to hear your feedback! <a href="${reviewLink}" style="color: #2563eb; font-weight: bold;">Leave a Review</a></p>` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Booking Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status-update { background: white; padding: 15px; margin: 15px 0; text-align: center; border-radius: 8px; }
          .old-status { color: #6b7280; text-decoration: line-through; }
          .new-status { color: #10b981; font-weight: bold; font-size: 18px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spedy Service</h1>
            <p>Booking Status Update</p>
          </div>
          <div class="content">
            <h2>Dear ${booking.customerName},</h2>
            <p>Your booking status has been updated.</p>
            <div class="status-update">
              <p>Status changed from: <span class="old-status">${oldStatus}</span></p>
              <p>To: <span class="new-status">${newStatus.toUpperCase()}</span></p>
            </div>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p>${message}</p>
            ${reviewHtml}
            ${booking.adminNotes ? `<p><strong>Admin Notes:</strong> ${booking.adminNotes}</p>` : ''}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service</p>
          </div>
        </div>
      </body>
      </html>
    `;

    this.sendEmail({
      to: customerEmail,
      subject: `Booking Status Update - ${booking.bookingId}`,
      html,
    }).catch(err => console.error('Email error (booking status):', err.message));
  }

  async sendOrderConfirmation(order, customerEmail) {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px;">${item.name}</td>
        <td style="padding: 8px;">${item.quantity}</td>
        <td style="padding: 8px;">₹${item.price}</td>
        <td style="padding: 8px;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const taxPrice = order.taxPrice || 0;
    const discount = order.discount || 0;
    const totalPrice = order.totalPrice || 0;
    const subtotal = totalPrice - taxPrice + discount;
    const customerName = order.shippingAddress?.fullName || order.user?.name || 'Customer';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .status { display: inline-block; padding: 5px 12px; background: #f59e0b; color: white; border-radius: 5px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 8px; background: #f3f4f6; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .total-row { font-weight: bold; }
          .detail-row { margin-bottom: 10px; }
          .detail-label { font-weight: bold; width: 120px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spedy Service</h1>
            <p>Order Confirmation</p>
          </div>
          <div class="content">
            <h2>Dear ${customerName},</h2>
            <p>Thank you for your order! We'll start processing it right away.</p>
            <div class="order-details">
              <h3>Order Details:</h3>
              <div class="detail-row"><span class="detail-label">Order ID:</span> ${order._id}</div>
              <div class="detail-row"><span class="detail-label">Status:</span> <span class="status">${order.orderStatus.toUpperCase()}</span></div>
              <div class="detail-row"><span class="detail-label">Order Date:</span> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
              <div class="detail-row"><span class="detail-label">Payment:</span> ${order.paymentMethod}</div>
            </div>
            <h3>Items Ordered</h3>
            <table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>${itemsHtml}</tbody></table>
            <div class="order-details" style="margin-top: 20px;">
              <div class="detail-row"><span class="detail-label">Subtotal:</span> ₹${subtotal}</div>
              <div class="detail-row"><span class="detail-label">Tax:</span> ₹${taxPrice}</div>
              <div class="detail-row"><span class="detail-label">Discount:</span> -₹${discount}</div>
              <div class="detail-row total-row"><span class="detail-label">Total:</span> ₹${totalPrice}</div>
            </div>
            <h3>Shipping Address</h3>
            <p>${order.shippingAddress?.fullName || ''}<br/>${order.shippingAddress?.address || ''}<br/>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}<br/>${order.shippingAddress?.phone || ''}</p>
            <p>If you have any questions, contact us at ${process.env.EMAIL_USER}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    this.sendEmail({
      to: customerEmail,
      subject: `Order Confirmed - ${order._id}`,
      html,
    }).catch(err => console.error('Email error (order customer):', err.message));

    const adminHtml = html.replace(`Dear ${customerName}`, 'Admin Notification');
    this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Order: ${order._id} - ${customerName}`,
      html: adminHtml,
    }).catch(err => console.error('Email error (order admin):', err.message));
  }

  async sendOrderStatusUpdate(order, customerEmail, oldStatus, newStatus) {
    const statusMessages = {
      Processing: 'Your order is now being processed.',
      Shipped: 'Your order has been shipped!',
      Delivered: 'Your order has been delivered. Enjoy!',
      Cancelled: 'Your order has been cancelled.',
      Returned: 'Your order has been returned.',
    };
    const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}.`;
    const customerName = order.shippingAddress?.fullName || 'Customer';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status-update { background: white; padding: 15px; margin: 15px 0; text-align: center; border-radius: 8px; }
          .old-status { color: #6b7280; text-decoration: line-through; }
          .new-status { color: #10b981; font-weight: bold; font-size: 18px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spedy Service</h1>
            <p>Order Status Update</p>
          </div>
          <div class="content">
            <h2>Dear ${customerName},</h2>
            <p>Your order status has been updated.</p>
            <div class="status-update">
              <p>Status changed from: <span class="old-status">${oldStatus}</span></p>
              <p>To: <span class="new-status">${newStatus.toUpperCase()}</span></p>
            </div>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p>${message}</p>
            ${order.adminNotes ? `<p><strong>Admin Notes:</strong> ${order.adminNotes}</p>` : ''}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service</p>
          </div>
        </div>
      </body>
      </html>
    `;

    this.sendEmail({
      to: customerEmail,
      subject: `Order Status Update - ${order._id}`,
      html,
    }).catch(err => console.error('Email error (order status):', err.message));
  }

  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Welcome to Spedy Service</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Spedy Service!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Thank you for registering with Spedy Service!</p>
            <p>With your account, you can:</p>
            <ul>
              <li>Book service requests online</li>
              <li>Track your booking status</li>
              <li>View your service history</li>
            </ul>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/book-now" class="button">Book Your First Service</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service</p>
          </div>
        </div>
      </body>
      </html>
    `;
    this.sendEmail({ to: user.email, subject: 'Welcome to Spedy Service!', html }).catch(err => console.error('Email error (welcome):', err.message));
  }

  async sendPasswordResetEmail(user, resetCode) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; text-align: center; margin: 20px 0; background: white; padding: 10px; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spedy Service</h1>
            <p>Password Reset Code</p>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password. Use the code below:</p>
            <div class="code">${resetCode}</div>
            <p>This code will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service</p>
          </div>
        </div>
      </body>
      </html>
    `;
    this.sendEmail({ to: user.email, subject: 'Your Password Reset Code', html }).catch(err => console.error('Email error (password reset):', err.message));
  }

  async sendVerificationEmail(user, verificationToken) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Verify Your Email Address</h1></div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Please verify your email to complete registration:</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </p>
            <p>This link expires in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spedy Service</p>
          </div>
        </div>
      </body>
      </html>
    `;
    this.sendEmail({ to: user.email, subject: 'Verify Your Email Address', html }).catch(err => console.error('Email error (verification):', err.message));
  }
}

const emailService = new EmailService();
module.exports = emailService;