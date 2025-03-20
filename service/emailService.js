const nodemailer = require('nodemailer');
require('dotenv').config();

const sendAcknowledgeEmail = async (tokenNo, name, email, contact, batch, location, skillset, company, experience, ctc, message, filename, path) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "sankaranarayanant689@gmail.com",
      pass: "cwodvgdrcqbgluai"
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: "2212085@nec.edu.in",
    subject: "Acknowledgment of Job Requisition Form Submission",
    html: `
      <h1>Hello, ${name}!</h1>
      <p>Thank you for submitting your job requisition form to the NEC Alumni Job Request Forum.</p>
      <p>Here is a summary of the information you provided:</p>
      
      <ul>
        <li><strong>Token Number:</strong> ${tokenNo}</li>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Contact:</strong> ${contact}</li>
        <li><strong>Batch:</strong> ${batch}</li>
        <li><strong>Preferred Location:</strong> ${location}</li>
        <li><strong>Skill Set:</strong> ${skillset}</li>
        <li><strong>Company:</strong> ${company}</li>
        <li><strong>Experience:</strong> ${experience}</li>
        <li><strong>Current CTC:</strong> ${ctc}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>

      <p><strong>Best regards,</strong></p>
      <p>The NEC Alumni Job Request Forum Team</p>
    `
  };
  //console.log(filename,path);
  if (filename) {
    mailOptions.attachments = [
      {
        filename: filename,
        path: path
      }
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Acknowledgment email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendAcknowledgeEmail
};

