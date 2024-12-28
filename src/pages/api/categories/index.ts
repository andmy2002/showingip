import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      console.log('开始获取分类列表...');
      
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          ips: {
            select: {
              id: true,
              title: true,
              description: true,
              images: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      console.log('成功获取分类列表:', categories);
      return res.json(categories);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      return res.status(500).json({ error: '获取分类列表失败', details: error instanceof Error ? error.message : '未知错误' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `不支持 ${req.method} 方法` });
  }
} 