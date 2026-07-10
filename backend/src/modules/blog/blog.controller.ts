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
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { ImageUpload } from 'src/common/decorator/image-upload.decorator';
import { QueryBlogDto } from './dto/query-blog.dto';
import { QueryFeedDto } from './dto/query-feed.dto';
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

  @Get('explore')
  async getExplorePageData() {
    return this.blogService.getExplorePageData();
  }

  @Get('top-contributors')
  async getTopContributors() {
    return this.blogService.getTopContributors();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  async getFeed(@Query() query: QueryFeedDto, @CurrentUser() user: any) {
    return this.blogService.getFeed(query, user);
  }

  @Get('tags')
  async getTags() {
    return this.blogService.getAllTags();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-blogs')
  async getMyBlogs(@Query() query: QueryBlogDto, @CurrentUser() user: any) {
    return this.blogService.getMyBlogs(user.id, query);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('get-blog/:id')
  async getBlogById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blogService.getBlogById(id, user?.id);
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

  @UseGuards(JwtAuthGuard)
  @Post('report/:id')
  async reportBlog(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.blogService.reportBlog(id, reason);
  }
}
