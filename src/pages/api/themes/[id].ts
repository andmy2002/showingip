import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: '无效的主题 ID' });
  }

  if (req.method === 'GET') {
    try {
      const theme = await prisma.theme.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          ips: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
              creator: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!theme) {
        return res.status(404).json({ error: '主题不存在' });
      }

      res.json(theme);
    } catch (error) {
      console.error('获取主题详情失败:', error);
      res.status(500).json({ error: '获取主题详情失败' });
    }
  } else if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: '请先登录' });
    }

    try {
      const theme = await prisma.theme.findUnique({
        where: { id },
        select: { creatorId: true },
      });

      if (!theme) {
        return res.status(404).json({ error: '主题不存在' });
      }

      if (theme.creatorId !== session.user.id) {
        return res.status(403).json({ error: '无权修改此主题' });
      }

      const { title, description, content, coverImage, images, ipIds } = req.body;

      const updatedTheme = await prisma.theme.update({
        where: { id },
        data: {
          title,
          description,
          content,
          coverImage,
          images,
          ips: {
            set: ipIds.map((ipId: string) => ({ id: ipId })),
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          ips: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
              creator: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      res.json(updatedTheme);
    } catch (error) {
      console.error('更新主题失败:', error);
      res.status(500).json({ error: '更新主题失败' });
    }
  } else if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: '请先登录' });
    }

    try {
      const theme = await prisma.theme.findUnique({
        where: { id },
        select: { creatorId: true },
      });

      if (!theme) {
        return res.status(404).json({ error: '主题不存在' });
      }

      if (theme.creatorId !== session.user.id) {
        return res.status(403).json({ error: '无权删除此主题' });
      }

      await prisma.theme.delete({
        where: { id },
      });

      res.status(204).end();
    } catch (error) {
      console.error('删除主题失败:', error);
      res.status(500).json({ error: '删除主题失败' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: `不支持 ${req.method} 方法` });
  }
} 