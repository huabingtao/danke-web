This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 本地端口约定

Core 6101，Web 6102，Admin 6103，Rank 6104，Market 开发 6105、独立服务 6106、预览 6112，潮汐开发 6107、API 6108、预览 6113，工具门户 6109，提醒服务 6110，Windows 桥接 6111。显式环境配置优先；线上端口保持部署配置。MCP 使用 stdio，连接 http://localhost:6101。修改 MCP 配置后需重新连接客户端。

## Creator 静态攻略接入

Web现在从显式的`CREATOR_CONTENT_DIR`读取完整v2内容包，`npm run build:content`准备哈希图片并生成`/guides/<slug>/`静态文章。生产必须配置真实`SITE_URL`；候选包只允许显式`CREATOR_PREVIEW=1`的本机预览，整站noindex。

`LEGACY_CONTENT_SNAPSHOT`可指定已确认旧内容快照，使旧详情路由离线构建；没有快照时继续使用Core。新文章不依赖Creator源码路径。`?slug=`兼容入口是客户端跳转，不能报告为HTTP301。

本轮使用Creator的`preview_integrated_web.py`在独立目录构建，现有out保留。发布手册位于相邻Creator的`docs/deployment/content-release-runbook.md`；生产前需完成真实内容审核、旧图片依赖和目标环境确认。

## 独立静态预览的实时数据

/yields与/gem-values在浏览器中读取Core实时数据；静态文章包不包含这两页的数据。localhost预览默认访问6101。Core默认CORS明确允许Web6102、Admin6103及预览6105/6109的localhost和127.0.0.1来源；显式CORS_ORIGINS配置覆盖默认值，使用其他预览端口时应显式补充该来源并重启Core，不能改成任意来源。
