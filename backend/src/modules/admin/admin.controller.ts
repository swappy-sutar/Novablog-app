import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/status')
  async toggleUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.toggleUserStatus(id, status);
  }

  @Patch('users/:id/role')
  async changeUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.changeUserRole(id, role);
  }

  @Get('moderation')
  async getModerationQueue() {
    return this.adminService.getModerationQueue();
  }

  @Patch('moderation/:id/approve')
  async approvePost(@Param('id') id: string) {
    return this.adminService.approvePost(id);
  }

  @Delete('moderation/:id/reject')
  async rejectPost(@Param('id') id: string) {
    return this.adminService.rejectPost(id);
  }
}
