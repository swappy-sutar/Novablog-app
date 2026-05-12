import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ResendService } from 'src/config/resend/resend.service';

@Injectable()
export class MailProvider {
  constructor(private readonly resendService: ResendService) {}

  private loadTemplate(
    templateName: string,
    replacements: Record<string, string>,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'emails',
      `${templateName}.html`,
    );

    let html = fs.readFileSync(templatePath, 'utf-8');

    Object.entries(replacements).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return html;
  }

  async sendWelcomeEmail(email: string, firstname: string) {
    const html = this.loadTemplate('welcome-email', {
      firstname,
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,

      to: email,

      subject: 'Welcome to Blog App 🚀',

      html,
    });
  }

  async sendVerifyEmail(email: string, firstname: string, verifyLink: string) {
    const html = this.loadTemplate('verify-email', {
      firstname,
      verifyLink,
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,

      to: email,

      subject: 'Verify Your Email',

      html,
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    firstname: string,
    resetLink: string,
  ) {
    const html = this.loadTemplate('forgot-password', {
      firstname,
      resetLink,
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,

      to: email,

      subject: 'Reset Your Password',

      html,
    });
  }
}
