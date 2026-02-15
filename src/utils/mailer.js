import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); 

// GoDaddy / SecureServer Configuration
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Ensure this matches your .env
    pass: process.env.EMAIL_PASS, // Ensure this matches your .env
  },
});

export const sendInviteMail = async (to, meetingCode, date) => {
  const meetingUrl = `http://localhost:3000/${meetingCode}`;
  const formattedDate = new Date(date).toLocaleString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background-color: #121212; padding: 30px; text-align: center; }
        .header h1 { color: #FFD600; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 800; }
        .content { padding: 40px 30px; text-align: center; color: #333333; }
        .invite-text { font-size: 18px; margin-bottom: 30px; color: #555; }
        .code-box { background-color: #f8f9fa; border: 2px dashed #ddd; padding: 15px; display: inline-block; border-radius: 8px; margin-bottom: 30px; }
        .meeting-code { font-size: 32px; font-weight: bold; color: #121212; letter-spacing: 2px; margin: 0; }
        .details { margin-bottom: 30px; text-align: left; background: #fffbf0; padding: 15px; border-radius: 8px; border-left: 4px solid #FFD600; }
        .details p { margin: 5px 0; font-size: 14px; color: #444; }
        .btn-container { margin-top: 10px; }
        .btn { background-color: #121212; color: #FFD600 !important; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; transition: background 0.3s; }
        .btn:hover { background-color: #333; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>BEEBARK VIDEO</h1>
        </div>

        <div class="content">
          <p class="invite-text">You have been invited to a video meeting.</p>

          <div class="details">
            <p><strong>📅 Date:</strong> ${formattedDate}</p>
            <p><strong>📍 Platform:</strong> BeeBark Video Secure</p>
          </div>

          <p style="font-size: 14px; color: #777; margin-bottom: 10px;">Use this meeting code:</p>
          <div class="code-box">
            <p class="meeting-code">${meetingCode}</p>
          </div>

          <div class="btn-container">
            <a href="${meetingUrl}" class="btn">Join Meeting Now</a>
          </div>
        </div>

        <div class="footer">
          <p>You received this email because you were invited to a BeeBark Video call.</p>
          <p>&copy; ${new Date().getFullYear()} BeeBark Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: '"BeeBark Video" <info@thebeebark.com>', // Sender address
    to: to,
    subject: "📹 Video Meeting Invitation - BeeBark",
    html: htmlContent,
    replyTo: 'info@thebeebark.com',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};