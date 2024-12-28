const https = require('https');
const fs = require('fs');
const path = require('path');

// 更新图片URL为更合适的主题图片
const images = {
  // Banner图片 - 使用文化创意相关的图片
  banner1: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4',  // 中国传统建筑
  banner2: 'https://images.unsplash.com/photo-1533856493584-0c6ca8ca9ce3',  // 现代艺术展览
  banner3: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',  // 创意设计

  // IP展示图片 - 使用文创产品相关的图片
  ip1: 'https://images.unsplash.com/photo-1582657233895-0f37a3f150c0',      // 传统工艺
  ip2: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062',      // 文创设计
  ip3: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',      // 现代艺术

  // 主题图片 - 使用文化主题相关的图片
  theme1: 'https://images.unsplash.com/photo-1461696114087-397271a7aedc',   // 丝绸之路
  theme2: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04',   // 非遗传承
  theme3: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4',   // 现代国潮

  // 新闻图片 - 使用商务和展览相关的图片
  news1: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',    // 商务会议
  news2: 'https://images.unsplash.com/photo-1492551557933-34265f7af79e',    // 艺术展览
  news3: 'https://images.unsplash.com/photo-1559223607-a43c990c692c',       // 创意市集
};

// 确保目录存在
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 下载图片
Object.entries(images).forEach(([name, url]) => {
  const filePath = path.join(imagesDir, `${name}.jpg`);
  
  // 添加参数以获取合适尺寸的图片
  const imageUrl = new URL(url);
  if (name.startsWith('banner')) {
    imageUrl.searchParams.set('w', '1920');
    imageUrl.searchParams.set('h', '600');
  } else if (name.startsWith('ip') || name.startsWith('theme')) {
    imageUrl.searchParams.set('w', '800');
    imageUrl.searchParams.set('h', '450');
  } else if (name.startsWith('news')) {
    imageUrl.searchParams.set('w', '600');
    imageUrl.searchParams.set('h', '400');
  }
  imageUrl.searchParams.set('fit', 'crop');
  imageUrl.searchParams.set('q', '85');
  // 添加更多参数以优化图片质量
  imageUrl.searchParams.set('auto', 'format');
  imageUrl.searchParams.set('crop', 'entropy');
  imageUrl.searchParams.set('cs', 'tinysrgb');

  https.get(imageUrl.toString(), (response) => {
    if (response.statusCode === 404) {
      console.error(`Error: Image not found for ${name}`);
      return;
    }
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`Downloaded: ${name}.jpg`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${name}.jpg:`, err.message);
  });
}); 