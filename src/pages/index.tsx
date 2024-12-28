import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import Banner from '@/components/Banner';

interface IP {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

interface Theme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ipCount: number;
}

interface News {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishDate: string;
}

// 模拟数据
const mockHotIPs: IP[] = [
  {
    id: '1',
    title: '故宫文创',
    description: '传统文化与现代设计的完美融合',
    imageUrl: '/images/ip1.jpg',
    tags: ['文化', '艺术', '创新'],
  },
  {
    id: '2',
    title: '敦煌印象',
    description: '丝路文化的当代演绎',
    imageUrl: '/images/ip2.jpg',
    tags: ['文化', '历史', '艺术'],
  },
  {
    id: '3',
    title: '国潮品牌',
    description: '中国传统元素的现代表达',
    imageUrl: '/images/ip3.jpg',
    tags: ['时尚', '潮流', '创新'],
  },
];

const mockThemes: Theme[] = [
  {
    id: '1',
    title: '丝绸之路',
    description: '探索东西方文化交融的魅力',
    imageUrl: '/images/theme1.jpg',
    ipCount: 8,
  },
  {
    id: '2',
    title: '非遗传承',
    description: '守护传统文化的精髓',
    imageUrl: '/images/theme2.jpg',
    ipCount: 12,
  },
  {
    id: '3',
    title: '现代国潮',
    description: '传统文化的现代演绎',
    imageUrl: '/images/theme3.jpg',
    ipCount: 15,
  },
];

const mockNews: News[] = [
  {
    id: '1',
    title: '2024年IP行业发展趋势报告',
    summary: '深度解析IP行业未来发展方向',
    imageUrl: '/images/news1.jpg',
    publishDate: '2024-03-15',
  },
  {
    id: '2',
    title: '传统文化IP的创新与发展',
    summary: '探讨传统文化在现代社会的创新表达',
    imageUrl: '/images/news2.jpg',
    publishDate: '2024-03-14',
  },
  {
    id: '3',
    title: 'IP授权市场最新动态',
    summary: '解读IP授权市场的新趋势',
    imageUrl: '/images/news3.jpg',
    publishDate: '2024-03-13',
  },
];

export default function Home() {
  const [hotIPs, setHotIPs] = useState<IP[]>(mockHotIPs);
  const [themes, setThemes] = useState<Theme[]>(mockThemes);
  const [news, setNews] = useState<News[]>(mockNews);

  useEffect(() => {
    // 暂时注释掉 API 调用，使用模拟数据
    /*
    // 获取热门IP数据
    fetch('/api/ips/hot')
      .then(res => res.json())
      .then(data => setHotIPs(data))
      .catch(error => console.error('Failed to fetch hot IPs:', error));

    // 获取精选主题
    fetch('/api/themes/featured')
      .then(res => res.json())
      .then(data => setThemes(data))
      .catch(error => console.error('Failed to fetch themes:', error));

    // 获取最新动态
    fetch('/api/news/latest')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(error => console.error('Failed to fetch news:', error));
    */
  }, []);

  return (
    <>
      <Head>
        <title>IP展示与交易平台 - 发现优质IP</title>
        <meta name="description" content="专业的IP展示与交易平台，连接创作者与市场" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <Banner />

        {/* 热门IP展示 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>精品IP推荐</h2>
            <p className={styles.sectionSubtitle}>发现优质IP，激发无限可能</p>
          </div>
          <div className={styles.ipGrid}>
            {hotIPs.map(ip => (
              <Link href={`/ips/${ip.id}`} key={ip.id} className={styles.ipCard}>
                <div className={styles.ipImageWrapper}>
                  <Image
                    src={ip.imageUrl}
                    alt={ip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.ipImage}
                  />
                </div>
                <div className={styles.ipInfo}>
                  <h3>{ip.title}</h3>
                  <p>{ip.description}</p>
                  <div className={styles.tags}>
                    {ip.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 精选主题 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>主题专区</h2>
            <p className={styles.sectionSubtitle}>探索IP的无限可能</p>
          </div>
          <div className={styles.themeGrid}>
            {themes.map(theme => (
              <Link href={`/themes/${theme.id}`} key={theme.id} className={styles.themeCard}>
                <div className={styles.themeImageWrapper}>
                  <Image
                    src={theme.imageUrl}
                    alt={theme.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.themeImage}
                  />
                </div>
                <div className={styles.themeInfo}>
                  <h3>{theme.title}</h3>
                  <p>{theme.description}</p>
                  <span className={styles.ipCount}>{theme.ipCount} 个IP</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 最新动态 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>行业动态</h2>
            <p className={styles.sectionSubtitle}>把握IP市场最新趋势</p>
          </div>
          <div className={styles.newsList}>
            {news.map(item => (
              <Link href={`/news/${item.id}`} key={item.id} className={styles.newsCard}>
                <div className={styles.newsImageWrapper}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.newsImage}
                  />
                </div>
                <div className={styles.newsInfo}>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <time>{item.publishDate}</time>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 合作伙伴 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>合作伙伴</h2>
            <p className={styles.sectionSubtitle}>携手共创IP价值</p>
          </div>
          <div className={styles.partners}>
            {/* TODO: 添加合作伙伴logo */}
          </div>
        </section>
      </main>
    </>
  );
} 