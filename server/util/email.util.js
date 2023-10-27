import nodemailer from "nodemailer";

// Function to send an email using nodemailer.
const sendEmail = async function (email, subject, message) {
  try {
    // Create a reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send the email with the defined transport object
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL, // Sender address
      to: email, // Recipient's email address
      subject: subject, // Subject line
      html: message, // HTML body of the email
    });
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
