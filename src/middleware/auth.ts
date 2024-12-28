import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // 从请求头中获取token
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: '未授权' });
      }

      const token = authHeader.substring(7);
      if (!token) {
        return res.status(401).json({ message: '未授权' });
      }

      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
      };

      // 从数据库获取用户信息
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: '用户不存在' });
      }

      // 将用户信息添加到请求对象
      (req as AuthenticatedRequest).user = user;

      // 调用处理函数
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'token无效' });
      }
      console.error('认证错误:', error);
      return res.status(500).json({ message: '服务器错误' });
    }
  };
} 