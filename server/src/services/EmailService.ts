import nodemailer from 'nodemailer';
import { EMAIL_REG_SUBJECT } from '../constants/email.contants';
import { EmailType } from '../types';
import { logger } from '../config/logger.config';

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  ignoreTLS: true,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendRegConfirmationMail = (email: string, additionalProp: { token: string }) => {
  const mailDetails = {
    from: process.env.EMAIL_LOGIN,
    to: email,
    subject: EMAIL_REG_SUBJECT,
    text: additionalProp.token
  };

  transporter.sendMail(mailDetails, (error, info) => {
    if (error) {
      logger.error(error);
      return;
    }
    logger.info('Email sent: ' + info.response);
  });
};

const sendEmail = (email: string, emailType: EmailType, additionalProp: any = {}) => {
  switch (emailType) {
    case 'REGISTRATION':
      sendRegConfirmationMail(email, additionalProp);
      break;
    default:
      return null;
  }
  return null;
};

export default {
  sendEmail
};
