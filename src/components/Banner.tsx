import { useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import styles from '@/styles/Banner.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export default function Banner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    // 这里先使用模拟数据，后续可以从API获取
    const mockBanners: BannerItem[] = [
      {
        id: '1',
        title: 'ShowingIP',
        subtitle: '连接创作者与市场的专业平台',
        imageUrl: '/images/banner1.jpg',
        link: '/ips',
      },
      {
        id: '2',
        title: '探索IP的无限可能',
        subtitle: '发现独特的IP价值',
        imageUrl: '/images/banner2.jpg',
        link: '/themes',
      },
      {
        id: '3',
        title: '把握IP市场趋势',
        subtitle: '了解最新行业动态',
        imageUrl: '/images/banner3.jpg',
        link: '/news',
      },
    ];

    setBanners(mockBanners);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className={styles.bannerWrapper}>
      <Slider {...settings} className={styles.slider}>
        {banners.map((banner) => (
          <div key={banner.id} className={styles.slide}>
            <div className={styles.imageWrapper}>
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority
                sizes="100vw"
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <div className={styles.textContent}>
                <h1>{banner.title}</h1>
                <p>{banner.subtitle}</p>
                <a href={banner.link} className={styles.button}>
                  了解更多
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
} 