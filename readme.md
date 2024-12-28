# ShowingIP - IP 展示平台

ShowingIP 是一个现代化的 IP（知识产权）展示和管理平台，基于 Next.js 构建，提供了丰富的功能和友好的用户界面。

## 功能特点

- 🌐 多语言支持（中文/英文）
- 🎨 现代化的响应式设计
- 📱 移动端适配
- 🔐 用户认证和权限管理
- 📝 富文本编辑器支持
- 🖼️ 图片上传功能
- 📰 新闻管理系统
- 🎯 IP 分类管理
- 🔍 搜索功能

## 技术栈

- **前端框架**: Next.js 13
- **样式方案**: CSS Modules
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **富文本编辑**: TinyMCE
- **类型检查**: TypeScript
- **部署**: Vercel (推荐)

## 开始使用

### 环境要求

- Node.js 16+
- PostgreSQL 12+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd showingip
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 环境配置

创建 `.env.local` 文件并添加以下配置：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/showingip"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_TINYMCE_API_KEY="your-tinymce-api-key"
```

4. 数据库迁移
```bash
npx prisma migrate dev
```

5. 运行开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 初始管理员账户

- 邮箱: admin@example.com
- 密码: password123

## 项目结构

```
showingip/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面组件和 API 路由
│   ├── styles/        # CSS 样式文件
│   ├── lib/          # 工具函数和配置
│   └── prisma/       # 数据库模型和迁移
├── public/           # 静态资源
└── ...配置文件
```

## 主要功能模块

### IP 展示
- IP 列表展示
- IP 详情页面
- IP 分类浏览
- IP 搜索功能

### 新闻中心
- 新闻列表
- 新闻详情
- 新闻发布（管理员）
- 新闻编辑（管理员）

### 用户系统
- 用户登录/注册
- 管理员权限控制
- 个人信息管理

### 管理功能
- IP 管理
- 新闻管理
- 分类管理
- 用户管理

## API 接口

### 新闻相关
- `GET /api/news` - 获取新闻列表
- `POST /api/news` - 创建新闻（需管理员权限）
- `PUT /api/news/[id]` - 更新新闻（需管理员权限）

### IP 相关
- `GET /api/ips` - 获取 IP 列表
- `POST /api/ips` - 创建 IP（需管理员权限）
- `PUT /api/ips/[id]` - 更新 IP（需管理员权限）

## 部署

推荐使用 Vercel 进行部署：

1. 在 Vercel 上导入项目
2. 配置环境变量
3. 部署完成后即可访问

## 开发指南

### 添加新页面
1. 在 `src/pages` 目录下创建新文件
2. 添加相应的路由和组件
3. 创建对应的样式文件

### 样式开发
- 使用 CSS Modules 进行样式隔离
- 遵循响应式设计原则
- 保持一致的命名规范

### API 开发
- 在 `src/pages/api` 目录下创建新的 API 路由
- 确保添加适当的权限验证
- 使用 Prisma 进行数据库操作

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 许可证

MIT License


npm run dev