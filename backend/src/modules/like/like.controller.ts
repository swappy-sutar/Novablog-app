import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { LikesService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('toggle/:blogId')
  async toggleLike(@Param('blogId') blogId: string, @CurrentUser() user: any) {
    return this.likesService.toggleLike(blogId, user.id);
  }

  @Get('get-count/:blogId')
  async getLikesCount(@Param('blogId') blogId: string) {
    return this.likesService.getLikesCount(blogId);
  }
}
