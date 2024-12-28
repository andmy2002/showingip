import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ message: '请先登录' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const ip = await prisma.ip.findUnique({
          where: { id: id as string },
          include: {
            category: true,
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
            tags: true,
          },
        });

        if (!ip) {
          return res.status(404).json({ message: 'IP不存在' });
        }

        return res.status(200).json(ip);
      } catch (error) {
        console.error('获取IP详情失败:', error);
        return res.status(500).json({ message: '获取IP详情失败' });
      }

    case 'PUT':
      try {
        const ip = await prisma.ip.findUnique({
          where: { id: id as string },
          select: { creatorId: true },
        });

        if (!ip) {
          return res.status(404).json({ message: 'IP不存在' });
        }

        if (ip.creatorId !== session.user.id) {
          return res.status(403).json({ message: '没有权限修改此IP' });
        }

        const { title, description, price, status, images, categoryId, tagIds } = req.body;

        const updatedIp = await prisma.ip.update({
          where: { id: id as string },
          data: {
            title,
            description,
            price,
            status,
            images,
            categoryId,
            tags: {
              set: tagIds.map((id: string) => ({ id })),
            },
          },
          include: {
            category: true,
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
            tags: true,
          },
        });

        return res.status(200).json(updatedIp);
      } catch (error) {
        console.error('更新IP失败:', error);
        return res.status(500).json({ message: '更新IP失败' });
      }

    case 'DELETE':
      try {
        const ip = await prisma.ip.findUnique({
          where: { id: id as string },
          select: { creatorId: true },
        });

        if (!ip) {
          return res.status(404).json({ message: 'IP不存在' });
        }

        if (ip.creatorId !== session.user.id) {
          return res.status(403).json({ message: '没有权限删除此IP' });
        }

        await prisma.ip.delete({
          where: { id: id as string },
        });

        return res.status(200).json({ message: '删除成功' });
      } catch (error) {
        console.error('删除IP失败:', error);
        return res.status(500).json({ message: '删除IP失败' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `不支持 ${req.method} 方法` });
  }
} 