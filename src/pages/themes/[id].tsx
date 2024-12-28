import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from '@/styles/ThemeDetail.module.css';

interface IP {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
  creator: {
    name: string;
  };
}

interface Theme {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string | null;
  images: string[];
  createdAt: string;
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
  ips: IP[];
}

export default function ThemeDetail() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTheme = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/themes/${id}`);
        if (!response.ok) {
          throw new Error('获取主题详情失败');
        }
        const data = await response.json();
        setTheme(data);
      } catch (error) {
        console.error('获取主题详情失败:', error);
        setError('获取主题详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [id]);

  const handleDelete = async () => {
    if (!theme || !confirm('确定要删除这个主题吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/themes/${theme.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除主题失败');
      }

      router.push('/themes');
    } catch (error) {
      console.error('删除主题失败:', error);
      alert('删除主题失败');
    }
  };

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!theme) {
    return <div className={styles.error}>主题不存在</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {theme.coverImage && (
          <div className={styles.coverImage}>
            <Image
              src={theme.coverImage}
              alt={theme.title}
              width={1200}
              height={400}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{theme.title}</h1>
          <div className={styles.meta}>
            <div className={styles.creator}>
              {theme.creator.image && (
                <Image
                  src={theme.creator.image}
                  alt={theme.creator.name}
                  width={32}
                  height={32}
                  className={styles.avatar}
                />
              )}
              <span>{theme.creator.name}</span>
            </div>
            {session?.user?.id === theme.creator.id && (
              <div className={styles.actions}>
                <Link href={`/themes/${theme.id}/edit`} className={styles.editButton}>
                  编辑
                </Link>
                <button onClick={handleDelete} className={styles.deleteButton}>
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.description}>{theme.description}</div>
        <div className={styles.article} dangerouslySetInnerHTML={{ __html: theme.content }} />

        {theme.images && theme.images.length > 0 && (
          <div className={styles.gallery}>
            {theme.images.map((image, index) => (
              <div key={index} className={styles.galleryItem}>
                <Image src={image} alt={`${theme.title} - 图片 ${index + 1}`} width={800} height={600} className={styles.galleryImage} />
              </div>
            ))}
          </div>
        )}

        <div className={styles.ips}>
          <h2 className={styles.sectionTitle}>相关 IP</h2>
          <div className={styles.ipGrid}>
            {theme.ips.map((ip) => (
              <Link href={`/ips/${ip.id}`} key={ip.id} className={styles.ipCard}>
                {ip.images && ip.images[0] && (
                  <div className={styles.ipImageContainer}>
                    <Image
                      src={ip.images[0]}
                      alt={ip.title}
                      width={200}
                      height={150}
                      className={styles.ipImage}
                    />
                  </div>
                )}
                <div className={styles.ipContent}>
                  <h3 className={styles.ipTitle}>{ip.title}</h3>
                  <p className={styles.ipDescription}>{ip.description}</p>
                  <div className={styles.ipMeta}>
                    <span className={styles.ipCategory}>{ip.category.name}</span>
                    <span className={styles.ipPrice}>¥{ip.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 