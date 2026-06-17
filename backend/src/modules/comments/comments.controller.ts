import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-comment/:blogId')
  async createComment(
    @Param('blogId') blogId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentService.createComment(blogId, user.id, createCommentDto);
  }

  @Get('get-comment/:blogId')
  async getCommentsByBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryCommentDto,
  ) {
    return this.commentService.getCommentsByBlog(blogId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-comment/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentService.updateComment(
      commentId,
      user.id,
      updateCommentDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-comment/:commentId')
  async deleteComment(
    @Param('commentId')
    commentId: string,
    @CurrentUser() user: any,
  ) {
    return this.commentService.deleteComment(commentId, user.id);
  }
}
