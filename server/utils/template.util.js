const emailTemplate = (forgotPasswordURL, username) => {
  const subject = "PW Password Recovery";

  // create content of the reset password email as an HTML Link

  const emailStyles = `
<div style="background-color: #000; font-family: Arial, sans-serif;">
  <div style="background-color: #ed0010; text-align: center; padding: 20px;">
    <h1 style="font-size: 36px; font-weight: bold; color: #fff;">SpeakWave</h1>
  </div>
  <div style="background-color: #222; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.2); max-width: 600px; margin: 0 auto; color: #fff;">
    <h1 style="font-size: 24px; margin-bottom: 20px; color: #fff;">Dear ${username},</h1>
    <p style="font-size: 16px; color: #ccc; margin-bottom: 10px;">You have requested to reset your password. Please click on the following link to reset your password:</p>
    <a href="${forgotPasswordURL}" style="color: #ed0010; text-decoration: none; font-weight: bold;">${forgotPasswordURL}</a>
    <p style="font-size: 16px; color: #ccc; margin-bottom: 10px;">If you did not request this password reset, you can ignore this email.</p>
    <p style="font-size: 18px; margin-top: 20px;">Best regards,</p>
    <p style="font-size: 18px;">SpeakWave</p>
  </div>
</div>

`;

  const message = `
  <html>
    <body>
      ${emailStyles}
    </body>
  </html>
`;

  return {
    subject: subject,
    message: message,
  };
};

export default emailTemplate;
