import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUpload } from 'src/common/decorator/image-upload.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create-blog")
  @ImageUpload('thumbnail')
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.blogService.create(user.id, createBlogDto, file);
  }
}
