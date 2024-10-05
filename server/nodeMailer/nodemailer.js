const nodemailer = require('nodemailer');
const email = process.env.EMAIL
const EMAIL_PASS = process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email || 'patelvinit135@gmail.com',
        pass: EMAIL_PASS || 'ahak wfar lzol dqaq',
    },
});

async function sendMail(to, data) {
    try {
        const info = await transporter.sendMail({
            from: `"Your Name" <${process.env.EMAIL}>`,
            to: to,
            subject: 'Enent Enrollment Confirmation - EventCrew',
            text: `
      Dear Participant,
      
      Congratulations! Your enrollment for the upcoming event has been successfully confirmed.
      
      We are thrilled to have you join us for this exciting event, and we look forward to your participation. Below are the event details:
      
      - Event Name: ${data.title}
      - Date: ${data.date}
      - Time: ${data.time}
      - Location: ${data.location}
      
      Please make sure to arrive on time, and feel free to reach out to us if you have any questions.
      
      We are excited to make this event memorable for you!
      
      Best regards,
      EventCrew Team
            `
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = sendMail;
