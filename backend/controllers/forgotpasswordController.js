import nodemailer from 'nodemailer';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Received email:', email); // Log email nhận được

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    // Cấu hình transporter và gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Hi,\n\nPlease click the link below to reset your password:\n\nhttp://localhost:3000/reset-password?email=${email}\n\nIf you did not request this, please ignore this email.\n\nThank you!`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully'); // Log khi email được gửi thành công
    res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error); // Log lỗi nếu gửi email thất bại
    res.status(500).json({ success: false, message: 'Failed to send password reset email. Please try again.' });
  }
};
