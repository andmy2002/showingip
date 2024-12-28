import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from '@/styles/Themes.module.css';

interface Theme {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  createdAt: string;
  creator: {
    id: string;
    name: string;
  };
  ips: {
    id: string;
    title: string;
    description: string;
    images: string[];
    category: {
      name: string;
    };
  }[];
}

export default function ThemeList() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        console.log('开始获取主题列表...');
        const response = await fetch('/api/themes');
        if (!response.ok) {
          throw new Error('获取主题列表失败');
        }
        const data = await response.json();
        console.log('成功获取主题列表:', data);
        setThemes(data);
      } catch (error) {
        console.error('获取主题列表失败:', error);
        setError('获取主题列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>主题集合</h1>
        {session && (
          <Link href="/themes/create" className={styles.createButton}>
            创建主题
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {themes.map((theme) => (
          <Link href={`/themes/${theme.id}`} key={theme.id} className={styles.card}>
            {theme.coverImage && (
              <div className={styles.imageContainer}>
                <Image
                  src={theme.coverImage}
                  alt={theme.title}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.content}>
              <h2 className={styles.themeTitle}>{theme.title}</h2>
              <p className={styles.description}>{theme.description}</p>
              <div className={styles.meta}>
                <div className={styles.creator}>
                  <span>{theme.creator.name}</span>
                </div>
                <span>{new Date(theme.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.ips}>
                {theme.ips.map((ip) => (
                  <div key={ip.id} className={styles.ipTag}>
                    {ip.title}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 