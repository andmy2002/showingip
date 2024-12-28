import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import styles from '@/styles/NewsDetail.module.css';
import { useSession } from 'next-auth/react';

const translations = {
  zh: {
    title: '新闻详情',
    back: '返回',
    notFound: '新闻不存在',
    loading: '加载中...',
    edit: '编辑',
  },
  en: {
    title: 'News Detail',
    back: 'Back',
    notFound: 'News not found',
    loading: 'Loading...',
    edit: 'Edit',
  },
};

interface News {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
}

interface Props {
  news: News;
}

export default function NewsDetail({ news }: Props) {
  const router = useRouter();
  const { locale = 'zh' } = router;
  const t = translations[locale as keyof typeof translations];
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.email === 'admin@example.com';

  console.log('Session:', session);
  console.log('Is Admin:', isAdmin);

  if (router.isFallback) {
    return <div className={styles.loading}>{t.loading}</div>;
  }

  if (!news) {
    return <div className={styles.error}>{t.notFound}</div>;
  }

  return (
    <>
      <Head>
        <title>{`${t.title} - ${news.title}`}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            onClick={() => router.push('/news')}
            className={styles.backButton}
          >
            {t.back}
          </button>
          {isAdmin && (
            <Link href={`/news/${news.id}/edit`} className={styles.editButton}>
              {t.edit}
            </Link>
          )}
        </div>
        <article className={styles.article}>
          <h1 className={styles.title}>{news.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>{news.author.name}</span>
            <time className={styles.time}>
              {new Date(news.createdAt).toLocaleDateString(locale)}
            </time>
          </div>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </article>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const id = params?.id as string;

  try {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!news) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        news: JSON.parse(JSON.stringify(news)),
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      notFound: true,
    };
  }
}; 