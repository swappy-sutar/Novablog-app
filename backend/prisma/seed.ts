import { PrismaClient, Role, BlogStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with high-fidelity developer articles...');

  // 1. Create or Find Category 'INSIGHT'
  const categoryInsight = await prisma.category.upsert({
    where: { name: 'INSIGHT' },
    update: {},
    create: {
      name: 'INSIGHT',
      slug: 'insight',
      description: 'Engineering articles, deep-dives, and tutorials.',
    },
  });

  // 2. Hash default passwords
  const hashedPassword = await bcrypt.hash('NovaBlog@2026', 10);

  // 3. Create or Find Authors
  const swapnil = await prisma.user.upsert({
    where: { username: 'swapnil' },
    update: {},
    create: {
      firstname: 'Swapnil',
      lastname: 'Sutar',
      username: 'swapnil',
      email: 'swapnil@novablog.com',
      password: hashedPassword,
      bio: 'Principal Systems Architect. Building next-gen technical content engines.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop',
      role: Role.ADMIN,
      isVerified: true,
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
    },
  });

  const testuser = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      firstname: 'Test',
      lastname: 'User',
      username: 'testuser',
      email: 'test@novablog.com',
      password: hashedPassword,
      bio: 'Quality Assurance and developer relations engineer at NovaBlog.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2560&auto=format&fit=crop',
      role: Role.USER,
      isVerified: true,
      techStack: ['QA', 'Vite', 'Jest', 'Playwright'],
    },
  });

  const vaishnavi = await prisma.user.upsert({
    where: { username: 'vaishnavi' },
    update: {},
    create: {
      firstname: 'Vaishnavi',
      lastname: 'Savadi',
      username: 'vaishnavi',
      email: 'vaishnavi@novablog.com',
      password: hashedPassword,
      bio: 'Senior Cloud Engineer & Database Specialist.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2564&auto=format&fit=crop',
      role: Role.USER,
      isVerified: true,
      techStack: ['Redis', 'AWS', 'Kubernetes', 'PostgreSQL'],
    },
  });

  // 4. Seeding the 6 perspectives articles
  const articles = [
    {
      title: 'Smarter Debugging in 2024',
      slug: 'smarter-debugging-in-2024',
      excerpt: 'How telemetry-driven tooling, source maps, and advanced runtimes are redefining debugging workflows.',
      content: `### Smarter Debugging in 2024

Debugging is no longer just about console.log and breakpoints. Telemetry-driven tooling, source maps, and advanced runtimes are redefining debugging workflows. Modern developers utilize real-time profiling inside development environments to detect memory leaks and trace call stacks.

#### Key Advancements
- **Source Map Integration:** Map compiled JS errors back to raw TypeScript source lines in real-time.
- **Diagnostics Tools:** View variable heaps directly in browser diagnostics.
- **Runtimes Telemetry:** Receive visual feedback on call cycles during scroll repaints.`,
      views: 1240,
      readTime: 2,
      thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2670&auto=format&fit=crop',
      authorId: swapnil.id,
      categoryId: categoryInsight.id,
    },
    {
      title: 'How AI Changed My Software Development Workflow',
      slug: 'how-ai-changed-my-software-development-workflow',
      excerpt: 'A deep dive into how generative models, code pilots, and automated reviews speed up delivery times.',
      content: `### How AI Changed My Software Development Workflow

Generative models and code pilots are shifting developers from writers of code to editors of code. In this deep dive, we explore this paradigm shift.

By automating repetitive boilerplate setup, writing test matrices, and running background syntax audits, AI models allow engineers to spend more time planning system topology.`,
      views: 4120,
      readTime: 1,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      authorId: swapnil.id,
      categoryId: categoryInsight.id,
    },
    {
      title: 'Vite Dev Tools in 2026',
      slug: 'vite-dev-tools-in-2026',
      excerpt: 'Analyzing next-generation module bundler integration diagnostics and state monitoring overlays.',
      content: `### Vite Dev Tools in 2026

Vite remains the standard for dev speeds. Dev tooling inside the browser has evolved to display real-time dependencies and state snapshots.

We investigate Rolldown integrations, Hot Module Replacement latency reductions, and browser inspector state monitors that keep hot reloading under 50ms on large-scale modular monorepos.`,
      views: 2150,
      readTime: 1,
      thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop',
      authorId: testuser.id,
      categoryId: categoryInsight.id,
    },
    {
      title: 'The Day Quantum Computing Went Mainstream',
      slug: 'the-day-quantum-computing-went-mainstream',
      excerpt: 'A look at the breakthrough quantum gates and cryogenic architectures that brought QPU computation to the cloud.',
      content: `### The Day Quantum Computing Went Mainstream

Quantum algorithms are now executing side-by-side with CPU/GPU threads in cloud environments. This breakthrough cryogenic architecture changes cryptography forever.

We discuss qubits, physical error correction thresholds, and standard libraries that compile quantum operations into cloud server matrices.`,
      views: 3200,
      readTime: 1,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop',
      authorId: swapnil.id,
      categoryId: categoryInsight.id,
    },
    {
      title: 'Why Redis Is a Game-Changer for Modern Applications',
      slug: 'why-redis-is-a-game-changer-for-modern-applications',
      excerpt: 'Analyzing why memory caching, sub-millisecond keyspace response, and Pub/Sub mesh are critical.',
      content: `### Why Redis Is a Game-Changer

Sub-millisecond data fetching is standard in microservice design. Redis provides in-memory datastores that handle high-velocity reads effortlessly.

We study key cache-invalidation techniques, cache aside pattern implementations, and key eviction settings (LRU/LFU) to optimize systems.`,
      views: 5400,
      readTime: 4,
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2670&auto=format&fit=crop',
      authorId: vaishnavi.id,
      categoryId: categoryInsight.id,
    },
    {
      title: 'Optimizing Data Persistency in Redis',
      slug: 'optimizing-data-persistency-in-redis',
      excerpt: 'Comparing AOF, RDB snapshotting, and hybrid cache backups under heavy database transaction throughput.',
      content: `### Optimizing Data Persistency in Redis

Redis is an in-memory store, but keeping data intact requires AOF (Append Only File) and RDB snapshots. Let's compare transaction backup strategies under high transaction workloads.

We measure performance overhead during fork operations and RDB sync rates to find the optimal trade-off.`,
      views: 3100,
      readTime: 4,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2668&auto=format&fit=crop',
      authorId: vaishnavi.id,
      categoryId: categoryInsight.id,
    },
  ];

  for (const article of articles) {
    const blog = await prisma.blog.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        thumbnail: article.thumbnail,
        views: article.views,
        readTime: article.readTime,
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        thumbnail: article.thumbnail,
        views: article.views,
        readTime: article.readTime,
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: article.authorId,
        categoryId: article.categoryId,
      },
    });
    console.log(`- Upserted article: "${blog.title}"`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
