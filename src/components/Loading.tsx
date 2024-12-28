import React from 'react';
import styles from '@/styles/Loading.module.css';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '加载中...' }: LoadingProps) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className={styles.message}>{message}</span>
    </div>
  );
} 