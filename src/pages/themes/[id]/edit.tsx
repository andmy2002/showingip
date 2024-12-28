import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import styles from '@/styles/ThemeEdit.module.css';
import ImageUpload from '@/components/ImageUpload';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface IP {
  id: string;
  title: string;
  description: string;
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

export default function ThemeEdit() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedIPs, setSelectedIPs] = useState<string[]>([]);
  const [availableIPs, setAvailableIPs] = useState<IP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      if (!id || !session) return;

      try {
        const [themeResponse, ipsResponse] = await Promise.all([
          fetch(`/api/themes/${id}`),
          fetch('/api/ips'),
        ]);

        if (!themeResponse.ok || !ipsResponse.ok) {
          throw new Error('加载数据失败');
        }

        const themeData = await themeResponse.json();
        const ipsData = await ipsResponse.json();

        if (themeData.creator.id !== session.user.id) {
          router.push('/themes');
          return;
        }

        setTheme(themeData);
        setTitle(themeData.title);
        setDescription(themeData.description);
        setContent(themeData.content);
        setCoverImage(themeData.coverImage || '');
        setImages(themeData.images || []);
        setSelectedIPs(themeData.ips?.map((ip: any) => ip.id) || []);
        setAvailableIPs(ipsData.ips || []);
      } catch (error) {
        console.error('加载数据失败:', error);
        setError('加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !content) {
      setError('请填写所有必填字段');
      return;
    }

    if (selectedIPs.length === 0) {
      setError('请至少选择一个 IP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/themes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          coverImage: coverImage || null,
          images: images || [],
          ipIds: selectedIPs,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '更新主题失败');
      }

      router.push(`/themes/${id}`);
    } catch (error) {
      console.error('更新主题失败:', error);
      setError(error instanceof Error ? error.message : '更新主题失败');
    } finally {
      setLoading(false);
    }
  };

  const handleIPToggle = (ipId: string) => {
    setSelectedIPs((prev) =>
      prev.includes(ipId)
        ? prev.filter((id) => id !== ipId)
        : [...prev, ipId]
    );
  };

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>编辑主题</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">标题</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">描述</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>封面图片</label>
          <ImageUpload
            onUpload={(url) => setCoverImage(url)}
            className={styles.imageUpload}
          />
          {coverImage && (
            <div className={styles.preview}>
              <img src={coverImage} alt="封面预览" />
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label>内容图片</label>
          <ImageUpload
            onUpload={(url) => setImages((prev) => [...prev, url])}
            className={styles.imageUpload}
          />
          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((image, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={image} alt={`图片 ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className={styles.removeButton}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label>内容</label>
          <Editor
            value={content}
            onEditorChange={(value) => setContent(value)}
          />
        </div>

        <div className={styles.field}>
          <label>选择 IP</label>
          <div className={styles.ipList}>
            {availableIPs.map((ip) => (
              <div
                key={ip.id}
                className={`${styles.ipCard} ${
                  selectedIPs.includes(ip.id) ? styles.selected : ''
                }`}
                onClick={() => handleIPToggle(ip.id)}
              >
                <div className={styles.ipTitle}>{ip.title}</div>
                <div className={styles.ipDescription}>{ip.description}</div>
                <div className={styles.ipCategory}>
                  分类：{ip.category.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? '保存中...' : '保存修改'}
          </button>
        </div>
      </form>
    </div>
  );
} 