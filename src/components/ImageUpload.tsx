import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@/styles/ImageUpload.module.css';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ onUpload, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!session) {
      alert('请先登录');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '上传失败');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      console.error('上传图片失败:', error);
      alert(error instanceof Error ? error.message : '上传图片失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className={styles.input}
      />
      <button
        type="button"
        onClick={handleClick}
        className={styles.button}
        disabled={uploading}
      >
        {uploading ? '上传中...' : '上传图片'}
      </button>
    </div>
  );
} 