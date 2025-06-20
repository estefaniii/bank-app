import nodemailer from 'nodemailer';
import { envs } from '../config/envs';

class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (envs.MAILER_SERVICE && envs.MAILER_EMAIL && envs.MAILER_SECRET_KEY) {
      this.transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
          user: envs.MAILER_EMAIL,
          pass: envs.MAILER_SECRET_KEY,
        },
      });
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.transporter) {
      console.warn('Mail service not configured. Email not sent to:', to);
      return;
    }

    await this.transporter.sendMail({
      from: envs.MAILER_EMAIL,
      to,
      subject,
      html,
    });
  }
}

export const mailService = new MailService();
