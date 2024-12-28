import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from '@/styles/Navbar.module.css';

const translations = {
  zh: {
    home: '首页',
    ips: 'IP展示',
    createIP: 'IP上传',
    themes: '主题集合',
    categories: '分类',
    news: '新闻中心',
    login: '登录',
    logout: '退出',
    switchToEn: 'English',
    search: '搜索IP...',
  },
  en: {
    home: 'Home',
    ips: 'IP Showcase',
    createIP: 'Upload IP',
    themes: 'Themes',
    categories: 'Categories',
    news: 'News',
    login: 'Login',
    logout: 'Logout',
    switchToZh: '中文',
    search: 'Search IP...',
  },
};

export default function Navigation() {
  const router = useRouter();
  const { data: session } = useSession();
  const { locale = 'zh' } = router;
  const t = translations[locale as keyof typeof translations];
  const isLoggedIn = !!session;
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ips?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            ShowingIP
          </Link>
        </div>

        <div className={styles.menu}>
          <Link href="/" className={styles.menuItem}>
            {t.home}
          </Link>
          <Link href="/ips" className={styles.menuItem}>
            {t.ips}
          </Link>
          {isLoggedIn && (
            <Link href="/ips/create" className={styles.menuItem}>
              {t.createIP}
            </Link>
          )}
          <Link href="/themes" className={styles.menuItem}>
            {t.themes}
          </Link>
          <Link href="/categories" className={styles.menuItem}>
            {t.categories}
          </Link>
          <Link href="/news" className={styles.menuItem}>
            {t.news}
          </Link>
        </div>

        <form onSubmit={handleSearch} className={styles.search}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <div className={styles.auth}>
          <button onClick={toggleLanguage} className={styles.langButton}>
            {locale === 'zh' ? t.switchToEn : t.switchToZh}
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogout} className={styles.authButton}>
              {t.logout}
            </button>
          ) : (
            <Link href="/auth/login" className={styles.authButton}>
              {t.login}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 