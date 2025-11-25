import nodemailer from 'nodemailer';

// Mock email service for development
// In production, configure with real SMTP credentials

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    } : undefined,
});

// For development: log emails to console instead of sending
const isDevelopment = process.env.NODE_ENV !== 'production' || !process.env.SMTP_USER;

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions) {
    if (isDevelopment) {
        console.log('📧 Email (Development Mode - Not Actually Sent):');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Body:', options.html);
        console.log('-----------------------------------');
        return true;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@ecommerce-store.com',
            ...options,
        });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

export function getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Our Store!</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderConfirmationEmailTemplate(orderDetails: any): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-item { padding: 15px; background: white; margin: 10px 0; border-radius: 5px; }
          .total { font-size: 20px; font-weight: bold; color: #43e97b; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for your order!</p>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <h3>Order Summary:</h3>
            ${orderDetails.items.map((item: any) => `
              <div class="order-item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × $${item.price.toFixed(2)}<br>
                Subtotal: $${(item.quantity * item.price).toFixed(2)}
              </div>
            `).join('')}
            <p class="total">Total: $${orderDetails.total.toFixed(2)}</p>
            <p>We'll send you a shipping confirmation when your order ships.</p>
          </div>
          <div class="footer">
            <p>© 2024 E-commerce Store. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
