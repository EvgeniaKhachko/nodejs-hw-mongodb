import nodemailer from 'nodemailer';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/env.js'
import createHttpError from 'http-errors';


const transporter = nodemailer.createTransport({
  host: getEnvVar(ENV_VARS.SMTP_HOST),
  port: Number(getEnvVar(ENV_VARS.SMTP_PORT)),
  auth: {
    user: getEnvVar(ENV_VARS.SMTP_USER),
    pass: getEnvVar(ENV_VARS.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
    try {
        return await transporter.sendMail({
            to: options.to,
            subject: options.subject,
            from: options.from,
            html: options.html,
            text: options.text,
        });
    }catch (err) {
        console.error(err);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
  
};
