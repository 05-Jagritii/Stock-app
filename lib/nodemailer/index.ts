import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE } from './templates';


export const transporter = nodemailer.createTransport({ 
    service:'gmail',
    auth:{
        user: process.env.NODEMAILER_EMAIL?.trim(),
        pass: process.env.NODEMAILER_PASSWORD?.trim(),
    }
})

export const sendWelcomeEmail = async ({email,name,intro}: WelcomeEmailData)=>{
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
    .replace('{{name}}',name)
    .replace('{{intro}}',intro);

    const mailOptions = {
        from: `"Signalist" <signalist@gmail.com>`,
        to: email,
        subject: `Welcome to Signalist - your stock market tookit is ready!`,
        text: 'Thanks for joining Signalist',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}