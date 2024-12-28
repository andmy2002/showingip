import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Categories.module.css';

interface Category {
  id: string;
  name: string;
  ips: {
    id: string;
    title: string;
    description: string;
    images: string[];
  }[];
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = router;

  const translations = {
    zh: {
      title: '分类列表',
      loading: '加载中...',
      error: '获取分类列表失败',
      ipCount: '个IP',
    },
    en: {
      title: 'Categories',
      loading: 'Loading...',
      error: 'Failed to load categories',
      ipCount: ' IPs',
    },
  };

  const t = translations[locale as keyof typeof translations];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(t.error);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('获取分类列表失败:', error);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t.error]);

  if (loading) {
    return <div className={styles.loading}>{t.loading}</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.title}</h1>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link
            href={`/categories/${category.id}`}
            key={category.id}
            className={styles.card}
          >
            <div className={styles.content}>
              <h2 className={styles.categoryName}>{category.name}</h2>
              <p className={styles.ipCount}>
                {category.ips.length}
                {t.ipCount}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 