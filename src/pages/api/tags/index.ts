import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '不允许的请求方法' });
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json(tags);
  } catch (error: any) {
    console.error('获取标签列表错误:', error);
    return res.status(500).json({ 
      message: '服务器错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 