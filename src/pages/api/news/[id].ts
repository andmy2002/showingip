import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.email !== 'admin@example.com') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { title, content } = req.body;

        const news = await prisma.news.update({
          where: { id: String(id) },
          data: {
            title,
            content,
          },
        });

        res.status(200).json(news);
      } catch (error) {
        console.error('更新新闻失败:', error);
        res.status(500).json({ message: 'Failed to update news' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 