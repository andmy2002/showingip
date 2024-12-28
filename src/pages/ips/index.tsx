import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from '@/styles/IPs.module.css';

interface Category {
  id: string;
  name: string;
}

interface Creator {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface IP {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  images: string[];
  category: Category;
  creator: Creator;
  tags: Tag[];
  createdAt: string;
}

interface IPListResponse {
  ips: IP[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function IPList() {
  const [ips, setIPs] = useState<IP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        console.log('开始获取 IP 列表...');
        const response = await fetch(`/api/ips?page=${page}&limit=12`);
        if (!response.ok) {
          throw new Error('获取 IP 列表失败');
        }
        const data: IPListResponse = await response.json();
        console.log('成功获取 IP 列表:', data);
        setIPs(data.ips);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('获取 IP 列表失败:', error);
        setError('获取 IP 列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchIPs();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>IP 列表</h1>
        {session && (
          <Link href="/ips/create" className={styles.createButton}>
            创建 IP
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {ips.map((ip) => (
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
              <p className={styles.description}>{ip.description}</p>
              <div className={styles.meta}>
                <div className={styles.category}>{ip.category.name}</div>
                <div className={styles.price}>¥{ip.price}</div>
              </div>
              <div className={styles.footer}>
                <div className={styles.creator}>{ip.creator.name}</div>
                <div className={styles.tags}>
                  {ip.tags.map((tag) => (
                    <span key={tag.id} className={styles.tag}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`${styles.pageButton} ${pageNum === page ? styles.active : ''}`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 