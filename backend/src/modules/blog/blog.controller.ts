import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUpload } from 'src/common/decorator/image-upload.decorator';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-blog')
  @ImageUpload('thumbnail')
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.blogService.createBlog(user.id, createBlogDto, file);
  }

  @Get('get-all-blogs')
  async getAllBlogs(@Query() query: QueryBlogDto) {
    return this.blogService.getAllBlogs(query);
  }

  @Get('get-blog/:id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-blog/:id')
  @ImageUpload('thumbnail')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.blogService.updateBlog(id, user.id, updateBlogDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-blog/:id')
  async deleteBlog(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogService.deleteBlog(id, user.id);
  }
}
