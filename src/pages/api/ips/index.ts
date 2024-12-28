import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { page = '1', limit = '12', category, search } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    try {
      console.log('开始获取 IP 列表...');

      const where: Prisma.IpWhereInput = {};

      if (category) {
        where.categoryId = category as string;
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [ips, total] = await prisma.$transaction([
        prisma.ip.findMany({
          where,
          skip,
          take: limitNumber,
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.ip.count({ where }),
      ]);

      console.log('成功获取 IP 列表:', {
        ips,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      });

      res.json({
        ips,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      });
    } catch (error) {
      console.error('获取 IP 列表失败:', error);
      res.status(500).json({ error: '获取 IP 列表失败' });
    }
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: '请先登录' });
    }

    try {
      const { title, description, price, status, images, categoryId, tagIds } = req.body;

      if (!title || !description || !price || !categoryId) {
        return res.status(400).json({ error: '请填写所有必填字段' });
      }

      const ip = await prisma.ip.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          status: status || 'AVAILABLE',
          images: images || [],
          category: {
            connect: {
              id: categoryId,
            },
          },
          creator: {
            connect: {
              id: session.user.id,
            },
          },
          tags: {
            connect: tagIds?.map((id: string) => ({ id })) || [],
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json(ip);
    } catch (error) {
      console.error('创建 IP 失败:', error);
      res.status(500).json({ error: '创建 IP 失败' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `不支持 ${req.method} 方法` });
  }
} 