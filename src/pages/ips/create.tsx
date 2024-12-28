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

export default function CreateIP() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [images, setImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('获取分类列表失败');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('获取分类列表失败:', error);
        alert('获取分类列表失败');
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error('获取标签列表失败');
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('获取标签列表失败:', error);
        alert('获取标签列表失败');
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !price || !categoryId) {
      alert('请填写所有必填字段');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/ips', {
        method: 'POST',
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
        throw new Error('创建 IP 失败');
      }

      const data = await response.json();
      router.push(`/ips/${data.id}`);
    } catch (error) {
      console.error('创建 IP 失败:', error);
      alert('创建 IP 失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>创建 IP</h1>
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
          {loading ? '创建中...' : '创建 IP'}
        </button>
      </form>
    </div>
  );
} 