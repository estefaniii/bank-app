import nodemailer, { Transporter } from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import pug from 'pug';
import path from 'path';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody?: string;
  templateName?: string;
  templateData?: Record<string, any>;
  attachments?: Attachment[];
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailEmail: string,
    senderEmailPassword: string,
    private readonly postToProvider: boolean,
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailEmail,
        pass: senderEmailPassword,
      },
    });
  }

  async sendEmail(options: SendEmailOptions) {
    const {
      to,
      subject,
      htmlBody,
      templateName,
      templateData = {},
      attachments = [],
    } = options;

    let html = htmlBody;
    if (templateName) {
      const templatePath = path.join(
        __dirname,
        '../../templates',
        `${templateName}.pug`,
      );
      html = pug.renderFile(templatePath, templateData);
    }

    try {
      await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: html,
        //attachments: attachments
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
