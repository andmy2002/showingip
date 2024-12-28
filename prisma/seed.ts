const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  await prisma.news.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.ip.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员用户
  const adminHashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '管理员',
      password: adminHashedPassword,
    },
  });

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: '测试用户',
      password: hashedPassword,
    },
  });

  // 创建分类
  const category = await prisma.category.create({
    data: {
      name: '文化艺术',
    },
  });

  // 创建标签
  const tag = await prisma.tag.create({
    data: {
      name: '传统文化',
    },
  });

  // 创建 IP
  const ip = await prisma.ip.create({
    data: {
      title: '敦煌飞天',
      description: '以敦煌壁画为灵感的文创IP',
      price: 999.99,
      status: 'AVAILABLE',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      category: {
        connect: { id: category.id },
      },
      creator: {
        connect: { id: admin.id },
      },
      tags: {
        connect: { id: tag.id },
      },
    },
  });

  // 创建主题
  await prisma.theme.create({
    data: {
      title: '丝绸之路文化',
      description: '探索丝绸之路上的文化瑰宝',
      content: '丝绸之路是东西方文化交流的重要通道...',
      coverImage: 'https://example.com/cover.jpg',
      images: ['https://example.com/theme1.jpg', 'https://example.com/theme2.jpg'],
      creator: {
        connect: { id: admin.id },
      },
      ips: {
        connect: { id: ip.id },
      },
    },
  });

  // 创建新闻
  await prisma.news.create({
    data: {
      title: '敦煌文创IP展览开幕',
      summary: '展现敦煌文化的创新发展与传承',
      content: '敦煌文创IP展览于今日盛大开幕，展览以敦煌壁画和飞天为主题...',
      coverImage: 'https://example.com/news1.jpg',
      author: {
        connect: { id: admin.id },
      },
    },
  });

  await prisma.news.create({
    data: {
      title: '丝路文化节即将举办',
      summary: '多国艺术家共同探讨文化传承与创新',
      content: '第五届丝路文化节将于下月在西安举办，来自世界各地的艺术家将齐聚一堂...',
      coverImage: 'https://example.com/news2.jpg',
      author: {
        connect: { id: admin.id },
      },
    },
  });

  console.log('数据库种子数据创建成功');
}

main()
  .catch((e) => {
    console.error('数据库种子数据创建失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 