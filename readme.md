# ShowingIP - IP 展示平台
鸣谢  
@杭州疏影文化科技有限公司  
@中国丝绸博物馆

ShowingIP 是一个现代化的 IP（知识产权）展示和管理平台，基于 Next.js 构建，提供了丰富的功能和友好的用户界面。专注于展示和管理各类 IP 资源，包括动漫、游戏、文学和音乐等领域的知识产权。

## 🌟 功能特点

- 🌐 多语言支持（中文/英文）
- 🎨 现代化的响应式设计
- 📱 移动端完美适配
- 🔐 完善的用户认证和权限管理
- 📝 富文本编辑器支持
- 🖼️ 图片上传和管理功能
- 📰 新闻管理系统
- 🎯 IP 分类和标签管理
- 🔍 强大的搜索功能

## 💻 技术栈

- **前端框架**: Next.js 13
- **样式方案**: CSS Modules
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **富文本编辑**: TinyMCE
- **类型检查**: TypeScript
- **部署**: Vercel (推荐)

## 🚀 开始使用

### 环境要求

- Node.js 16+
- PostgreSQL 12+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/andmy2002/showingip.git
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

4. 数据库配置
```bash
# 创建数据库
createdb showingip

# 运行数据库迁移
npx prisma migrate dev

# 初始化测试数据
npx prisma db seed
```

5. 运行开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 默认账户

#### 管理员账户
- 邮箱: admin@example.com
- 密码: password123

#### 测试用户账户
- 邮箱: test@example.com
- 密码: password123

## 📁 项目结构

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

## 📋 主要功能模块

### IP 展示系统
- IP 列表展示
- IP 详情页面
- IP 分类浏览（动漫、游戏、文学、音乐）
- IP 搜索和筛选

### IP 分类
- 动漫IP
- 游戏IP
- 文学IP
- 音乐IP

### IP 标签
- 热门
- 新品
- 推荐
- 限时
- 独家
- 二次元
- 潮流
- 经典

### 新闻中心
- 新闻列表
- 新闻详情
- 新闻发布（管理员）
- 新闻编辑（管理员）

### 用户系统
- 用户注册/登录
- 管理员权限控制
- 个人信息管理

## 🔧 开发指南

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

## 📝 API 接口

### 新闻相关
- `GET /api/news` - 获取新闻列表
- `POST /api/news` - 创建新闻（需管理员权限）
- `PUT /api/news/[id]` - 更新新闻（需管理员权限）

### IP 相关
- `GET /api/ips` - 获取 IP 列表
- `POST /api/ips` - 创建 IP（需管理员权限）
- `PUT /api/ips/[id]` - 更新 IP（需管理员权限）

## 🚀 部署

### Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，提供了最佳的部署体验。以下是详细的部署步骤：

1. **准备工作**
   - 确保你的项目已经推送到 GitHub 仓库
   - 注册 [Vercel](https://vercel.com) 账号
   - 使用 GitHub 账号登录 Vercel

2. **导入项目**
   - 在 Vercel 控制台点击 "Import Project"
   - 选择 "Import Git Repository"
   - 选择你的 ShowingIP 项目仓库

3. **配置项目**
   - 项目名称：可以自定义或使用默认的
   - 构建设置：Vercel 会自动检测 Next.js 项目，通常无需修改
   - 环境变量：点击 "Environment Variables" 添加以下必要的环境变量
     ```
     DATABASE_URL="你的数据库连接URL"
     NEXTAUTH_URL="https://你的域名"
     NEXTAUTH_SECRET="你的密钥"
     NEXT_PUBLIC_TINYMCE_API_KEY="你的TinyMCE API密钥"
     ```

4. **数据库配置**
   - 推荐使用 [Supabase](https://supabase.com) 或 [Railway](https://railway.app) 托管 PostgreSQL 数据库
   - 获取数据库连接 URL 并配置到环境变量
   - 运行数据库迁移：
     ```bash
     npx prisma migrate deploy
     ```

5. **部署设置**
   - Build Command: `npm run build` (默认)
   - Output Directory: `.next` (默认)
   - Install Command: `npm install` (默认)

6. **完成部署**
   - 点击 "Deploy" 开始部署
   - Vercel 会自动构建和部署你的项目
   - 部署完成后，你会得到一个 `.vercel.app` 域名

7. **自定义域名（可选）**
   - 在项目设置中点击 "Domains"
   - 添加你的自定义域名
   - 按照说明配置 DNS 记录
   - 等待 DNS 生效（通常需要几分钟到几小时）

8. **持续部署**
   - Vercel 会自动监听你的 GitHub 仓库
   - 当你推送新的代码时，Vercel 会自动重新部署
   - 每个 PR 都会生成预览部署

### 其他部署选项

也可以选择其他部署平台：

1. **Docker 部署**
   - 项目根目录包含 Dockerfile
   - 构建镜像：`docker build -t showingip .`
   - 运行容器：`docker run -p 3000:3000 showingip`

2. **传统服务器部署**
   - 安装 Node.js 和 PostgreSQL
   - 克隆代码并安装依赖
   - 使用 PM2 或 Systemd 管理进程
   - 配置 Nginx 反向代理

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 发起 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- [@andmy2002](https://github.com/andmy2002) 疏影文化科技@chenkai

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！