import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '@/styles/NewsEdit.module.css';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const translations = {
  zh: {
    title: '发布新闻',
    back: '返回',
    newsTitle: '标题',
    content: '内容',
    save: '发布',
    cancel: '取消',
    loading: '发布中...',
    unauthorized: '未授权访问',
    saveSuccess: '发布成功',
    saveError: '发布失败',
  },
  en: {
    title: 'Create News',
    back: 'Back',
    newsTitle: 'Title',
    content: 'Content',
    save: 'Publish',
    cancel: 'Cancel',
    loading: 'Publishing...',
    unauthorized: 'Unauthorized',
    saveSuccess: 'Published successfully',
    saveError: 'Failed to publish',
  },
};

export default function NewsCreate() {
  const router = useRouter();
  const { locale = 'zh' } = router;
  const t = translations[locale as keyof typeof translations];
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'admin@example.com';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return <div className={styles.unauthorized}>{t.unauthorized}</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
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

      const data = await response.json();
      router.push(`/news/${data.id}`);
    } catch (error) {
      console.error('发布新闻失败:', error);
      alert(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t.title}</title>
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