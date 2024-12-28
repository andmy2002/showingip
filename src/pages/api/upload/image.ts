import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允许POST请求' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: '请先登录' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // 确保上传目录存在
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('文件上传错误:', err);
          res.status(500).json({ message: '文件上传失败' });
          return resolve(undefined);
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
          res.status(400).json({ message: '没有找到文件' });
          return resolve(undefined);
        }

        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype || '')) {
          res.status(400).json({ message: '不支持的文件类型' });
          return resolve(undefined);
        }

        try {
          // 生成文件名
          const fileName = `${Date.now()}-${file.originalFilename}`;
          const newPath = path.join(uploadDir, fileName);

          // 移动文件到最终位置
          await fs.rename(file.filepath, newPath);
          
          // 返回文件URL
          const fileUrl = `/uploads/${fileName}`;
          res.status(200).json({ url: fileUrl });
          return resolve(undefined);
        } catch (error) {
          console.error('文件处理错误:', error);
          res.status(500).json({ message: '文件处理失败' });
          return resolve(undefined);
        }
      });
    });
  } catch (error) {
    console.error('上传处理错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}