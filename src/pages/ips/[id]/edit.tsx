import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ImageUpload from '@/components/ImageUpload';
import styles from '@/styles/IPCreate.module.css';

interface Category {
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
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    name: string;
  };
  tags: {
    id: string;
    name: string;
  }[];
}

export default function EditIP() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [images, setImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
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
      if (!id) return;

      try {
        const [ipResponse, categoriesResponse, tagsResponse] = await Promise.all([
          fetch(`/api/ips/${id}`),
          fetch('/api/categories'),
          fetch('/api/tags'),
        ]);

        if (!ipResponse.ok || !categoriesResponse.ok || !tagsResponse.ok) {
          throw new Error('加载数据失败');
        }

        const ipData = await ipResponse.json();
        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        // 检查是否是创建者
        if (ipData.creator.id !== session.user.id) {
          router.push('/ips');
          return;
        }

        setTitle(ipData.title);
        setDescription(ipData.description);
        setPrice(ipData.price.toString());
        setStatus(ipData.status);
        setImages(ipData.images);
        setCategoryId(ipData.categoryId);
        setTagIds(ipData.tags.map((tag: any) => tag.id));
        setCategories(categoriesData);
        setTags(tagsData);
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

    if (!title || !description || !price || !categoryId) {
      setError('请填写所有必填字段');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/ips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          status,
          images,
          categoryId,
          tagIds,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '更新 IP 失败');
      }

      router.push(`/ips/${id}`);
    } catch (error) {
      console.error('更新 IP 失败:', error);
      setError(error instanceof Error ? error.message : '更新 IP 失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImages((prev) => [...prev, url]);
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
      <h1 className={styles.title}>编辑 IP</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            标题 *
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
          <label htmlFor="description" className={styles.label}>
            描述 *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            价格 *
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>
            状态
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.select}
          >
            <option value="AVAILABLE">可用</option>
            <option value="UNAVAILABLE">不可用</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            分类 *
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">请选择分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>标签</label>
          <div className={styles.tags}>
            {tags.map((tag) => (
              <label key={tag.id} className={styles.tag}>
                <input
                  type="checkbox"
                  checked={tagIds.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTagIds((prev) => [...prev, tag.id]);
                    } else {
                      setTagIds((prev) => prev.filter((id) => id !== tag.id));
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>图片</label>
          <div className={styles.images}>
            {images.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={image} alt={`预览图 ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  className={styles.removeButton}
                >
                  删除
                </button>
              </div>
            ))}
            <div className={styles.uploadContainer}>
              <ImageUpload onUpload={handleImageUpload} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? '保存中...' : '保存修改'}
        </button>
      </form>
    </div>
  );
} 