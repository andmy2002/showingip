import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import styles from '@/styles/ThemeCreate.module.css';
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
}

export default function ThemeCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedIPs, setSelectedIPs] = useState<string[]>([]);
  const [availableIPs, setAvailableIPs] = useState<IP[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchIPs = async () => {
      try {
        const response = await fetch('/api/ips');
        if (!response.ok) {
          throw new Error('获取 IP 列表失败');
        }
        const data = await response.json();
        setAvailableIPs(data.ips);
      } catch (error) {
        console.error('获取 IP 列表失败:', error);
        setError('获取 IP 列表失败');
      }
    };

    fetchIPs();
  }, [session, router]);

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
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          coverImage,
          images,
          ipIds: selectedIPs,
        }),
      });

      if (!response.ok) {
        throw new Error('创建主题失败');
      }

      const data = await response.json();
      router.push(`/themes/${data.id}`);
    } catch (error) {
      console.error('创建主题失败:', error);
      setError('创建主题失败');
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

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>创建主题</h1>
      {error && <div className={styles.error}>{error}</div>}
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
              {images.map((url, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={url} alt={`图片 ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
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
          <Editor value={content} onChange={setContent} />
        </div>

        <div className={styles.field}>
          <label>选择相关 IP</label>
          <div className={styles.ipGrid}>
            {availableIPs.map((ip) => (
              <div
                key={ip.id}
                className={`${styles.ipCard} ${
                  selectedIPs.includes(ip.id) ? styles.selected : ''
                }`}
                onClick={() => handleIPToggle(ip.id)}
              >
                {ip.images && ip.images[0] && (
                  <div className={styles.ipImageContainer}>
                    <img src={ip.images[0]} alt={ip.title} className={styles.ipImage} />
                  </div>
                )}
                <div className={styles.ipContent}>
                  <h3 className={styles.ipTitle}>{ip.title}</h3>
                  <p className={styles.ipDescription}>{ip.description}</p>
                  <div className={styles.ipMeta}>
                    <span className={styles.ipCategory}>{ip.category.name}</span>
                  </div>
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
            {loading ? '创建中...' : '创建主题'}
          </button>
        </div>
      </form>
    </div>
  );
} 