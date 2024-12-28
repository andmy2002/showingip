import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      console.log('开始获取主题列表...');
      
      const themes = await prisma.theme.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          coverImage: true,
          images: true,
          createdAt: true,
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          ips: {
            select: {
              id: true,
              title: true,
              description: true,
              images: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log('成功获取主题列表:', themes);
      return res.json(themes);
    } catch (error) {
      console.error('获取主题列表失败:', error);
      return res.status(500).json({ error: '获取主题列表失败', details: error instanceof Error ? error.message : '未知错误' });
    }
  } else if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: '请先登录' });
      }

      const { title, description, content, coverImage, images, ipIds } = req.body;

      if (!title || !description || !content || !ipIds || ipIds.length === 0) {
        return res.status(400).json({ error: '请填写所有必填字段' });
      }

      console.log('开始创建主题...', {
        title,
        description,
        content,
        coverImage,
        images,
        ipIds,
        userId: session.user.id,
      });

      const theme = await prisma.theme.create({
        data: {
          title,
          description,
          content,
          coverImage,
          images,
          creator: {
            connect: {
              id: session.user.id,
            },
          },
          ips: {
            connect: ipIds.map((id: string) => ({ id })),
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          coverImage: true,
          images: true,
          createdAt: true,
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          ips: {
            select: {
              id: true,
              title: true,
              description: true,
              images: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      console.log('成功创建主题:', theme);
      return res.json(theme);
    } catch (error) {
      console.error('创建主题失败:', error);
      return res.status(500).json({ error: '创建主题失败', details: error instanceof Error ? error.message : '未知错误' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `不支持 ${req.method} 方法` });
  }
} 