import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendEmail(to, subject, htmlContent, attachments = []) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
        attachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Mensaje enviado: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar email: ', error);
        throw error;
    }
}