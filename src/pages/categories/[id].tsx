import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/CategoryDetail.module.css';

interface IP {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  creator: {
    id: string;
    name: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  ips: IP[];
}

// 模拟数据
const mockCategory: Category = {
  id: '1',
  name: '文化创意',
  description: '传统文化与现代创意的完美融合',
  ips: [
    {
      id: '1',
      title: '故宫文创',
      description: '传统文化与现代设计的完美融合',
      images: ['/images/ip1.jpg'],
      price: 999,
      creator: {
        id: '1',
        name: '故宫博物院',
      },
      tags: [
        { id: '1', name: '文化' },
        { id: '2', name: '艺术' },
        { id: '3', name: '创新' },
      ],
    },
    {
      id: '2',
      title: '敦煌印象',
      description: '丝路文化的当代演绎',
      images: ['/images/ip2.jpg'],
      price: 888,
      creator: {
        id: '2',
        name: '敦煌研究院',
      },
      tags: [
        { id: '1', name: '文化' },
        { id: '4', name: '历史' },
        { id: '2', name: '艺术' },
      ],
    },
  ],
};

export default function CategoryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 这里应该从API获取数据，现在使用模拟数据
    setCategory(mockCategory);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (!category) {
    return <div className={styles.error}>分类不存在</div>;
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => router.back()}
        className={styles.backButton}
      >
        返回
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.description}>{category.description}</p>
      </div>

      <div className={styles.grid}>
        {category.ips.map((ip) => (
          <Link href={`/ips/${ip.id}`} key={ip.id} className={styles.card}>
            {ip.images && ip.images[0] && (
              <div className={styles.imageContainer}>
                <Image
                  src={ip.images[0]}
                  alt={ip.title}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.content}>
              <h2 className={styles.ipTitle}>{ip.title}</h2>
              <p className={styles.ipDescription}>{ip.description}</p>
              <div className={styles.meta}>
                <div className={styles.creator}>{ip.creator.name}</div>
                <div className={styles.price}>¥{ip.price}</div>
              </div>
              <div className={styles.tags}>
                {ip.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 