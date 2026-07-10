import { Controller, Post, Body, Get, Query, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    return this.newsletterService.subscribe(subscribeDto.email);
  }

  @Get('unsubscribe')
  async unsubscribe(@Query('email') email: string) {
    try {
      await this.newsletterService.unsubscribe(email);
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribed Successfully</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              background-color: #05050f;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              background-color: #0b0c1e;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              padding: 40px;
              text-align: center;
              max-width: 400px;
              width: 100%;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 12px;
            }
            p {
              color: #cbd5e1;
              font-size: 14px;
              line-height: 20px;
              margin-bottom: 24px;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #8b5cf6, #5b2a9e);
              color: #ffffff;
              text-decoration: none;
              font-size: 13px;
              font-weight: 600;
              padding: 12px 24px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 style="color: #ef4444;">Unsubscribed</h1>
            <p>You have been successfully unsubscribed from the NovaBlog newsletter. We're sorry to see you go!</p>
            <a href="https://novablog.space" class="btn">Return to NovaBlog</a>
          </div>
        </body>
        </html>
      `;
    } catch (e) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              background-color: #05050f;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              background-color: #0b0c1e;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              padding: 40px;
              text-align: center;
              max-width: 400px;
              width: 100%;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 12px;
            }
            p {
              color: #cbd5e1;
              font-size: 14px;
              line-height: 20px;
              margin-bottom: 24px;
            }
            .btn {
              display: inline-block;
              background-color: #374151;
              color: #ffffff;
              text-decoration: none;
              font-size: 13px;
              font-weight: 600;
              padding: 12px 24px;
              border-radius: 12px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Error</h1>
            <p>${e.message || 'Unable to complete the unsubscribe request. The link might be invalid or expired.'}</p>
            <a href="https://novablog.space" class="btn">Go to NovaBlog</a>
          </div>
        </body>
        </html>
      `;
    }
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getSubscribers() {
    return this.newsletterService.getSubscribers();
  }

  @Patch('subscribers/:id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async toggleSubscriberStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.newsletterService.toggleSubscriberStatus(id, isActive);
  }

  @Delete('subscribers/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteSubscriber(@Param('id') id: string) {
    return this.newsletterService.deleteSubscriber(id);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async sendNewsletter(@Body() body: { subject: string; content: string }) {
    return this.newsletterService.sendNewsletter(body.subject, body.content);
  }

  @Post('send-test')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async sendTestEmail(@Body() body: { email: string; subject: string; content: string }) {
    return this.newsletterService.sendTestEmail(body.email, body.subject, body.content);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getHistory() {
    return this.newsletterService.getHistory();
  }
}
