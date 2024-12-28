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

  switch (req.method) {
    case 'POST':
      try {
        const { title, content } = req.body;

        const news = await prisma.news.create({
          data: {
            title,
            content,
            author: {
              connect: {
                email: session.user.email,
              },
            },
          },
        });

        res.status(201).json(news);
      } catch (error) {
        console.error('创建新闻失败:', error);
        res.status(500).json({ message: 'Failed to create news' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 