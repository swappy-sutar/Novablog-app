export const REDIS_KEYS = {
  USERS: (page: number, limit: number, search?: string) =>
    `users:${page}:${limit}:${search || 'all'}`,

  USER: (id: string) => `user:${id}`,

  BLOGS: (page: number, limit: number, search?: string) =>
    `blogs:${page}:${limit}:${search || 'all'}`,

  BLOG: (id: string) => `blog:${id}`,

  BLOG_BY_SLUG: (slug: string) => `blog:slug:${slug}`,

  FEATURED_BLOGS: 'featured-blogs',

  RECENT_BLOGS: 'recent-blogs',
};
