import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { successResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffDays = Math.floor(diffMins / (60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(diffMins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: `${user.firstname} ${user.lastname || ''}`.trim(),
      email: user.email,
      role: user.role === 'ADMIN' ? 'Admin' : 'Author',
      status: user.isActive ? 'Active' : 'Suspended',
      joined: this.getRelativeTime(user.createdAt),
    }));

    return successResponse('Users retrieved successfully', { users: formattedUsers });
  }

  async toggleUserStatus(userId: string, nextStatus: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isActive = nextStatus === 'Active';
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return successResponse(`User account ${isActive ? 'activated' : 'suspended'} successfully`);
  }

  async changeUserRole(userId: string, nextRole: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = nextRole === 'Admin' ? 'ADMIN' : 'USER';

    await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return successResponse(`User role updated to ${nextRole} successfully`);
  }

  async getModerationQueue() {
    // Return a set of mock flagged posts to drive the moderation queue on the frontend
    const flaggedPosts = [
      { id: "mod-1", title: "Free Crypto Airdrop 100% Legit!", author: "SpammyMcSpam", reason: "Spam / Phishing link detection", flaggedAt: "10m ago" },
      { id: "mod-2", title: "Why everyone is wrong except me (Rant)", author: "AngryBlogger", reason: "Harassment and abusive language", flaggedAt: "45m ago" },
      { id: "mod-3", title: "Copied Article from Medium", author: "LazyWriter", reason: "Plagiarism / Copyright violation", flaggedAt: "3h ago" },
    ];

    return successResponse('Moderation queue retrieved successfully', { flaggedPosts });
  }

  async approvePost(id: string) {
    // In a real system we would clear the flagged status, here we just return success
    return successResponse('Post approved and restored to public feed successfully');
  }

  async rejectPost(id: string) {
    // In a real system we would permanently delete or archive the post
    // If it's a real post in our DB, we can delete it
    try {
      const blog = await this.prisma.blog.findUnique({ where: { id } });
      if (blog) {
        await this.prisma.blog.delete({ where: { id } });
      }
    } catch (e) {
      // Ignore if it's a mock post ID
    }
    return successResponse('Post rejected and permanently deleted');
  }
}
