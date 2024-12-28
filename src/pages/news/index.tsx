import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import styles from '@/styles/News.module.css';

const translations = {
  zh: {
    title: '新闻中心',
    createNews: '发布新闻',
    noNews: '暂无新闻',
    loading: '加载中...',
  },
  en: {
    title: 'News Center',
    createNews: 'Create News',
    noNews: 'No news available',
    loading: 'Loading...',
  },
};

interface News {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

interface Props {
  news: News[];
}

export default function NewsList({ news }: Props) {
  const router = useRouter();
  const { locale = 'zh' } = router;
  const t = translations[locale as keyof typeof translations];
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.email === 'admin@example.com';

  console.log('Session:', session);
  console.log('Is Admin:', isAdmin);

  return (
    <>
      <Head>
        <title>{t.title}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t.title}</h1>
          {isAdmin && (
            <Link href="/news/create" className={styles.createButton}>
              {t.createNews}
            </Link>
          )}
        </div>
        <div className={styles.grid}>
          {news.length > 0 ? (
            news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className={styles.card}
              >
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <div className={styles.cardMeta}>
                  <span className={styles.author}>{item.author.name}</span>
                  <time className={styles.time}>
                    {new Date(item.createdAt).toLocaleDateString(locale)}
                  </time>
                </div>
                <div
                  className={styles.cardContent}
                  dangerouslySetInnerHTML={{
                    __html: item.content.substring(0, 200) + '...',
                  }}
                />
              </Link>
            ))
          ) : (
            <div className={styles.noNews}>{t.noNews}</div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      props: {
        news: JSON.parse(JSON.stringify(news)),
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      props: {
        news: [],
      },
    };
  }
};
