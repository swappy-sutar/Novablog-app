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
    return this.newsletterService.unsubscribe(email);
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
