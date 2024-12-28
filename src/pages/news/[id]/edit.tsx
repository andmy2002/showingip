import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import styles from '@/styles/NewsEdit.module.css';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const translations = {
  zh: {
    title: '编辑新闻',
    back: '返回',
    newsTitle: '标题',
    content: '内容',
    save: '保存',
    cancel: '取消',
    loading: '加载中...',
    unauthorized: '未授权访问',
    saveSuccess: '保存成功',
    saveError: '保存失败',
  },
  en: {
    title: 'Edit News',
    back: 'Back',
    newsTitle: 'Title',
    content: 'Content',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    unauthorized: 'Unauthorized',
    saveSuccess: 'Saved successfully',
    saveError: 'Failed to save',
  },
};

interface News {
  id: string;
  title: string;
  content: string;
}

interface Props {
  news: News;
}

export default function NewsEdit({ news }: Props) {
  const router = useRouter();
  const { locale = 'zh' } = router;
  const t = translations[locale as keyof typeof translations];
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'admin@example.com';

  const [title, setTitle] = useState(news.title);
  const [content, setContent] = useState(news.content);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return <div className={styles.unauthorized}>{t.unauthorized}</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(t.saveError);
      }

      router.push(`/news/${news.id}`);
    } catch (error) {
      console.error('保存新闻失败:', error);
      alert(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`${t.title} - ${title}`}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            onClick={() => router.back()}
            className={styles.backButton}
          >
            {t.back}
          </button>
          <h1 className={styles.title}>{t.title}</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              {t.newsTitle}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              {t.content}
            </label>
            <Editor
              value={content}
              onChange={setContent}
              className={styles.editor}
            />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
              disabled={saving}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? t.loading : t.save}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const id = params?.id as string;

  try {
    const news = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    if (!news) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        news,
      },
    };
  } catch (error) {
    console.error('获取新闻失败:', error);
    return {
      notFound: true,
    };
  }
}; 