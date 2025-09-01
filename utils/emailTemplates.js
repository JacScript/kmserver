// utils/emailTemplates.js

const getPasswordResetTemplate = (resetURL, username) => {
  return {
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #3B82F6, #1E40AF);
            color: white;
            text-align: center;
            padding: 40px 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #374151;
          }
          .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4B5563;
          }
          .reset-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #3B82F6, #1E40AF);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: all 0.3s ease;
            text-align: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .warning {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .warning-title {
            font-weight: 600;
            color: #92400E;
            margin-bottom: 5px;
          }
          .warning-text {
            color: #B45309;
            font-size: 14px;
          }
          .footer {
            background-color: #F9FAFB;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #6B7280;
          }
          .url-fallback {
            background-color: #F3F4F6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #374151;
          }
          .security-tips {
            background-color: #EFF6FF;
            border: 1px solid #DBEAFE;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
          }
          .security-tips h3 {
            color: #1E40AF;
            margin-top: 0;
            font-size: 16px;
          }
          .security-tips ul {
            color: #374151;
            font-size: 14px;
            margin: 0;
            padding-left: 20px;
          }
          .security-tips li {
            margin-bottom: 5px;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 5px;
            }
            .content {
              padding: 30px 20px;
            }
            .header {
              padding: 30px 20px;
            }
            .header h1 {
              font-size: 24px;
            }
            .reset-button {
              padding: 12px 24px;
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          
          <div class="content">
            <div class="greeting">
              Hello ${username || 'there'},
            </div>
            
            <div class="message">
              We received a request to reset the password for your account. If you made this request, click the button below to reset your password.
            </div>
            
            <div class="button-container">
              <a href="${resetURL}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="warning">
              <div class="warning-title">⚠️ Important Security Information</div>
              <div class="warning-text">
                This link will expire in 10 minutes for your security. If you don't reset your password within this time, you'll need to request a new reset link.
              </div>
            </div>
            
            <div class="security-tips">
              <h3>🛡️ Security Tips</h3>
              <ul>
                <li>Never share this link with anyone</li>
                <li>We will never ask for your password via email</li>
                <li>If you didn't request this reset, you can safely ignore this email</li>
                <li>Consider using a strong, unique password</li>
              </ul>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, you can copy and paste this URL into your browser:
            </p>
            
            <div class="url-fallback">
              ${resetURL}
            </div>
          </div>
          
          <div class="footer">
            <p><strong>${process.env.EMAIL_FROM_NAME || 'Your Company'}</strong></p>
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || 'Your Company'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello ${username || 'there'},
      
      We received a request to reset the password for your account. If you made this request, click the link below to reset your password:
      
      ${resetURL}
      
      IMPORTANT: This link will expire in 10 minutes for your security.
      
      Security Tips:
      - Never share this link with anyone
      - We will never ask for your password via email  
      - If you didn't request this reset, you can safely ignore this email
      
      If you have any questions, please contact our support team.
      
      Best regards,
      ${process.env.EMAIL_FROM_NAME || 'Your Company'} Team
      
      This is an automated message, please do not reply to this email.
    `
  };
};

const getPasswordChangedTemplate = (username) => {
  return {
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Successfully</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            text-align: center;
            padding: 40px 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .message {
            font-size: 18px;
            margin-bottom: 20px;
            color: #374151;
          }
          .sub-message {
            font-size: 16px;
            color: #6B7280;
            margin-bottom: 30px;
          }
          .info-box {
            background-color: #F0F9FF;
            border: 1px solid #BAE6FD;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: left;
          }
          .footer {
            background-color: #F9FAFB;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #6B7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Password Updated</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">🎉</div>
            
            <div class="message">
              Hello ${username || 'there'},
            </div>
            
            <div class="sub-message">
              Your password has been successfully updated. Your account is now secured with your new password.
            </div>
            
            <div class="info-box">
              <p><strong>What happened:</strong></p>
              <p>• Your password was changed on ${new Date().toLocaleString()}</p>
              <p>• You can now use your new password to sign in</p>
              <p>• All active sessions have been maintained</p>
            </div>
            
            <p style="color: #6B7280; font-size: 14px;">
              If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>${process.env.EMAIL_FROM_NAME || 'Your Company'}</strong></p>
            <p>This is an automated security notification.</p>
            <p>© ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || 'Your Company'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Changed Successfully
      
      Hello ${username || 'there'},
      
      Your password has been successfully updated on ${new Date().toLocaleString()}.
      
      What happened:
      - Your password was changed
      - You can now use your new password to sign in
      - All active sessions have been maintained
      
      If you didn't make this change, please contact our support team immediately.
      
      Best regards,
      ${process.env.EMAIL_FROM_NAME || 'Your Company'} Team
    `
  };
};

module.exports = {
  getPasswordResetTemplate,
  getPasswordChangedTemplate
};