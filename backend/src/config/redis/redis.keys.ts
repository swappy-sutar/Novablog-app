export const REDIS_KEYS = {
  USERS: (page: number, limit: number, search?: string) =>
    `users:${page}:${limit}:${search || 'all'}`,

  USER: (id: string) => `user:${id}`,

  USER_PROFILE: (userId: string) => `user:profile:${userId}`,

  BLOGS: (page: number, limit: number, search?: string) =>
    `blogs:${page}:${limit}:${search || 'all'}`,

  BLOG: (id: string) => `blog:${id}`,

  BLOG_BY_SLUG: (slug: string) => `blog:slug:${slug}`,

  FEATURED_BLOGS: (page: number = 1, limit: number = 10) =>
    `featured-blogs:${page}:${limit}`,

  RECENT_BLOGS: (page: number = 1, limit: number = 10) =>
    `recent-blogs:${page}:${limit}`,

  TRENDING_BLOGS: (page: number = 1, limit: number = 10) =>
    `trending-blogs:${page}:${limit}`,

  COMMENTS: (blogId: string, page: number, limit: number) =>
    `comments:${blogId}:${page}:${limit}`,

  COMMENT: (commentId: string) => `comment:${commentId}`,

  ALL_COMMENTS: (blogId: string) => `comments:${blogId}:*`,

  BLOG_LIKES_COUNT: (blogId: string) => `blog-likes-count:${blogId}`,

  BLOG_LIKES_USERS: (blogId: string, page: number, limit: number) =>
    `blog-likes-users:${blogId}:${page}:${limit}`,

  USER_BOOKMARKS: (
    userId: string,
    page: number | string,
    limit: number | string,
  ) => `user-bookmarks:${userId}:${page}:${limit}`,

  BLOG_VIEWS: (blogId: string) => `blog-views:${blogId}`,

  ALL_BLOGS: 'blogs:*',
};
