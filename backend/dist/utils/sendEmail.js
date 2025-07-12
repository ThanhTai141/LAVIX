// src/utils/sendEmail.ts
import nodemailer from 'nodemailer';
export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: '"EduVerse" <no-reply@eduverse.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
    };
    await transporter.sendMail(mailOptions);
};
