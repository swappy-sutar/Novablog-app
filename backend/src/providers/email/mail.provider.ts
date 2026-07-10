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

  async sendNewFollowerEmail(
    email: string,
    firstname: string,
    followerName: string,
    followerUsername: string,
    followerBio: string,
    followerInitial: string,
    profileLink: string,
  ) {
    const html = this.loadTemplate('new-follower', {
      firstname,
      followerName,
      followerUsername,
      followerBio: followerBio || 'No bio provided.',
      followerInitial: followerInitial || followerName[0].toUpperCase(),
      profileLink,
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `${followerName} started following you on NovaBlog!`,
      html,
    });
  }

  async sendNewCommentEmail(
    email: string,
    firstname: string,
    commenterName: string,
    blogTitle: string,
    commentContent: string,
    blogLink: string,
  ) {
    const html = this.loadTemplate('new-comment', {
      firstname,
      commenterName,
      blogTitle,
      commentContent,
      blogLink,
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `New comment on "${blogTitle}"`,
      html,
    });
  }

  async sendWeeklyNewsletterEmail(
    email: string,
    firstname: string,
    articles: {
      title: string;
      excerpt: string;
      link: string;
      category: string;
    }[],
  ) {
    const html = this.loadTemplate('weekly-newsletter', {
      firstname,
      article1_title: articles[0]?.title || 'Trending Engineering Insights',
      article1_excerpt: articles[0]?.excerpt || 'Explore the latest blogs written by our expert community.',
      article1_link: articles[0]?.link || 'https://novablog.space/feed',
      article1_category: articles[0]?.category || 'TECH',
      article2_title: articles[1]?.title || 'Scaling Modern Distributed Systems',
      article2_excerpt: articles[1]?.excerpt || 'Learn strategies and patterns for building fault-tolerant infrastructure.',
      article2_link: articles[1]?.link || 'https://novablog.space/feed',
      article2_category: articles[1]?.category || 'SYSTEMS',
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `Your NovaBlog Weekly Digest 📰`,
      html,
    });
  }

  async sendCustomNewsletterEmail(
    email: string,
    subject: string,
    content: string,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'https://novablog.space';
    const unsubscribeLink = `${frontendUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    const html = this.loadTemplate('custom-newsletter', {
      subject,
      content,
      unsubscribeLink,
    });

    return this.resendService.client.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: subject,
      html,
    });
  }
}
