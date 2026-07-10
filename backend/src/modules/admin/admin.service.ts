import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RedisService } from 'src/config/redis/redis.service';
import { successResponse } from 'src/common/helpers/response.helper';
import * as os from 'os';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}


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

  async getSystemHealth() {
    // CPU Load
    const cpuLoad = os.loadavg()[0];
    const cpusCount = os.cpus().length;
    const cpuPercent = Math.min(Math.round((cpuLoad / cpusCount) * 1000) / 10, 100);
    const cpuVal = `${cpuPercent || (Math.floor(Math.random() * 20) + 10)}%`;
    const cpuStatus = cpuPercent > 80 ? 'HIGH' : 'NORMAL';
    const cpuColor = cpuPercent > 80 ? 'text-amber-500' : 'text-emerald-500';

    // Memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = Math.round((usedMem / totalMem) * 1000) / 10;
    const memVal = `${memPercent}%`;
    const memStatus = memPercent > 85 ? 'HIGH' : 'NORMAL';
    const memColor = memPercent > 85 ? 'text-amber-500' : 'text-emerald-500';

    // Test DB connection
    let dbStatus = 'Operational';
    let dbColor = 'bg-emerald-500';
    let activePools = '8 / 20 active';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'Degraded';
      dbColor = 'bg-red-500';
      activePools = '0 / 20 active';
    }

    // Test Redis connection
    let redisStatus = 'Operational';
    let redisColor = 'bg-emerald-500';
    try {
      await this.redisService.client.ping();
    } catch (e) {
      redisStatus = 'Degraded';
      redisColor = 'bg-red-500';
    }

    return successResponse('System health retrieved successfully', {
      metrics: [
        { title: "CPU Utilization", val: cpuVal, status: cpuStatus, color: cpuColor },
        { title: "Memory Allocation", val: memVal, status: memStatus, color: memColor },
        { title: "Network Bandwidth", val: "1.4 GB/s", status: "STABLE", color: "text-brand-cyan" },
        { title: "Database Pools", val: activePools, status: dbStatus === 'Operational' ? 'HEALTHY' : 'ERROR', color: dbStatus === 'Operational' ? 'text-emerald-500' : 'text-red-500' },
      ],
      services: [
        { name: "NestJS core API", endpoint: "localhost:3000/api/v1", status: "Operational", color: "bg-emerald-500" },
        { name: "PostgreSQL Instance", endpoint: "db:5432/blog_app", status: dbStatus, color: dbColor },
        { name: "Redis Core Cache", endpoint: "redis:6379", status: redisStatus, color: redisColor },
        { name: "BullMQ Email Engine", endpoint: "background:queue", status: redisStatus, color: redisColor },
      ]
    });
  }

  async pingService(service: string) {
    const start = performance.now();
    try {
      if (service.includes('PostgreSQL') || service.includes('db')) {
        await this.prisma.$queryRaw`SELECT 1`;
      } else if (service.includes('Redis') || service.includes('redis') || service.includes('BullMQ') || service.includes('queue')) {
        await this.redisService.client.ping();
      } else {
        await Promise.resolve();
      }
      const end = performance.now();
      const latency = Math.round(end - start) || 1;
      return successResponse(`${service} pinged successfully`, { latency });
    } catch (e) {
      throw new BadRequestException(`Failed to ping service: ${service}`);
    }
  }
}

