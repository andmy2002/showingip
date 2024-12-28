import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Footer.module.css';

const translations = {
  zh: {
    about: '关于我们',
    contact: '联系我们',
    terms: '服务条款',
    privacy: '隐私政策',
    copyright: '© 2024 ShowingIP. 保留所有权利.',
    help: '帮助中心',
    feedback: '意见反馈',
  },
  en: {
    about: 'About Us',
    contact: 'Contact',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    copyright: '© 2024 ShowingIP. All rights reserved.',
    help: 'Help Center',
    feedback: 'Feedback',
  },
};

export default function Footer() {
  const router = useRouter();
  const { locale = 'zh' } = router;
  const t = translations[locale as keyof typeof translations];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>ShowingIP</h3>
            <p className={styles.description}>
              {locale === 'zh'
                ? '专业的IP展示与交易平台，连接创作者与市场。'
                : 'Professional IP showcase and trading platform, connecting creators with the market.'}
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{locale === 'zh' ? '快速链接' : 'Quick Links'}</h3>
            <ul className={styles.links}>
              <li>
                <Link href="/about">{t.about}</Link>
              </li>
              <li>
                <Link href="/contact">{t.contact}</Link>
              </li>
              <li>
                <Link href="/help">{t.help}</Link>
              </li>
              <li>
                <Link href="/feedback">{t.feedback}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{locale === 'zh' ? '法律' : 'Legal'}</h3>
            <ul className={styles.links}>
              <li>
                <Link href="/terms">{t.terms}</Link>
              </li>
              <li>
                <Link href="/privacy">{t.privacy}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
} 