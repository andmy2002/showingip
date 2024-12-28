import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ErrorMessage from '@/components/ErrorMessage';
import prisma from '@/lib/prisma';
import styles from '@/styles/IPDetail.module.css';

interface IPDetailProps {
  ip: {
    id: string;
    title: string;
    description: string;
    price: number;
    status: string;
    images: string[];
    category: {
      name: string;
    };
    creator: {
      id: string;
      name: string;
    };
    tags: {
      name: string;
    }[];
  } | null;
  error?: string;
}

export default function IPDetail({ ip, error }: IPDetailProps) {
  const router = useRouter();
  const { locale } = router;
  const { data: session } = useSession();

  const translations = {
    zh: {
      title: 'IP详情',
      price: '价格',
      category: '分类',
      creator: '创建者',
      status: '状态',
      tags: '标签',
      back: '返回列表',
      notFound: 'IP不存在',
      error: '加载失败',
      edit: '编辑',
    },
    en: {
      title: 'IP Details',
      price: 'Price',
      category: 'Category',
      creator: 'Creator',
      status: 'Status',
      tags: 'Tags',
      back: 'Back to List',
      notFound: 'IP not found',
      error: 'Failed to load',
      edit: 'Edit',
    },
  };

  const t = translations[locale as keyof typeof translations];

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!ip) {
    return <ErrorMessage message={t.notFound} />;
  }

  const isCreator = session?.user?.id === ip.creator.id;

  return (
    <>
      <Head>
        <title>{`${t.title} - ${ip.title}`}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            onClick={() => router.push('/ips')}
            className={styles.backButton}
          >
            {t.back}
          </button>
          {isCreator && (
            <Link href={`/ips/${ip.id}/edit`} className={styles.editButton}>
              {t.edit}
            </Link>
          )}
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>{ip.title}</h1>
          <div className={styles.imageGallery}>
            {ip.images.map((image, index) => (
              <img
                key={index}
                src={image || '/images/placeholder.svg'}
                alt={`${ip.title} - 图片 ${index + 1}`}
                className={styles.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.svg';
                }}
              />
            ))}
          </div>
          <div className={styles.details}>
            <p className={styles.description}>{ip.description}</p>
            <div className={styles.info}>
              <span className={styles.price}>
                {t.price}: ¥{ip.price.toLocaleString()}
              </span>
              <span className={styles.category}>
                {t.category}: {ip.category.name}
              </span>
              <span className={styles.creator}>
                {t.creator}: {ip.creator.name}
              </span>
              <span className={styles.status}>
                {t.status}: {ip.status}
              </span>
              {ip.tags.length > 0 && (
                <span className={styles.tags}>
                  {t.tags}: {ip.tags.map(tag => tag.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const ip = await prisma.ip.findUnique({
      where: {
        id: params?.id as string,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!ip) {
      return {
        props: {
          ip: null,
        },
      };
    }

    return {
      props: {
        ip: JSON.parse(JSON.stringify(ip)), // 序列化日期等特殊类型
      },
    };
  } catch (error) {
    console.error('获取IP详情错误:', error);
    return {
      props: {
        ip: null,
        error: '获取IP详情失败',
      },
    };
  }
}; 