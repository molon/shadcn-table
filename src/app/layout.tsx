// 导入站点配置
import { siteConfig } from "@/config/site"
// 导入工具函数cn用于合并class名称
import { cn } from "@/lib/utils"
// 导入站点头部组件
import { SiteHeader } from "@/components/layouts/site-header"
// 导入主题提供者组件
import { ThemeProvider } from "@/components/providers"
// 导入Tailwind调试指示器组件
import { TailwindIndicator } from "@/components/tailwind-indicator"

// 导入全局样式
import "@/styles/globals.css"

// 导入Next.js的Metadata和Viewport类型
import type { Metadata, Viewport } from "next"

// 导入字体配置
import { fontMono, fontSans } from "@/lib/fonts"
// 导入Toast通知组件
import { Toaster } from "@/components/ui/toaster"

// 定义页面元数据
export const metadata: Metadata = {
  // 设置元数据基础URL
  metadataBase: new URL(siteConfig.url),
  // 配置页面标题
  title: {
    // 默认标题
    default: siteConfig.name,
    // 标题模板
    template: `%s - ${siteConfig.name}`,
  },
  // 页面描述
  description: siteConfig.description,
  // SEO关键词
  keywords: [
    // 技术栈关键词
    "nextjs",
    "react",
    "react server components",
    "table",
    "react-table",
    "tanstack-table",
    "shadcn-table",
  ],
  // 作者信息
  authors: [
    {
      // 作者名称和个人网站
      name: "sadmann7",
      url: "https://www.sadmn.com",
    },
  ],
  // 创建者信息
  creator: "sadmann7",
  // OpenGraph社交分享配置
  openGraph: {
    // 页面类型
    type: "website",
    // 语言设置
    locale: "en_US",
    // 页面URL
    url: siteConfig.url,
    // 分享标题
    title: siteConfig.name,
    // 分享描述
    description: siteConfig.description,
    // 网站名称
    siteName: siteConfig.name,
  },
  // Twitter卡片配置
  twitter: {
    // 卡片类型
    card: "summary_large_image",
    // 分享标题
    title: siteConfig.name,
    // 分享描述
    description: siteConfig.description,
    // 分享图片
    images: [`${siteConfig.url}/og.jpg`],
    // 创建者Twitter账号
    creator: "@sadmann17",
  },
  // 网站图标配置
  icons: {
    // 主图标路径
    icon: "/icon.png",
  },
  // PWA manifest文件路径
  manifest: `${siteConfig.url}/site.webmanifest`,
}

// 定义页面视口配置
export const viewport: Viewport = {
  // 颜色方案配置
  colorScheme: "dark light",
  // 主题颜色配置
  themeColor: [
    // 浅色模式主题色
    { media: "(prefers-color-scheme: light)", color: "white" },
    // 深色模式主题色
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

// 根布局组件
export default function RootLayout({ children }: React.PropsWithChildren) {
  // 返回布局结构
  return (
    // HTML根元素，设置语言和hydration警告抑制
    <html lang="en" suppressHydrationWarning>
      {/* 页面头部 */}
      <head />
      {/* 页面主体 */}
      <body
        // 动态class名称
        className={cn(
          // 基础样式：最小高度、背景、字体、抗锯齿
          "min-h-screen overscroll-none bg-background font-sans antialiased",
          // 导入字体变量
          fontSans.variable,
          // 导入等宽字体变量
          fontMono.variable
        )}
      >
        {/* 主题提供者组件 */}
        <ThemeProvider
          // 使用class属性切换主题
          attribute="class"
          // 默认跟随系统主题
          defaultTheme="system"
          // 启用系统主题检测
          enableSystem
          // 主题切换时禁用过渡动画
          disableTransitionOnChange
        >
          {/* 主容器：相对定位，最小高度，flex布局 */}
          <div className="relative flex min-h-screen flex-col">
            {/* 渲染站点头部 */}
            <SiteHeader />
            {/* 主内容区域，flex-grow为1 */}
            <main className="flex-1">{children}</main>
          </div>
          {/* 渲染Tailwind调试指示器 */}
          <TailwindIndicator />
        </ThemeProvider>
        {/* 渲染Toast通知组件 */}
        <Toaster />
      </body>
    </html>
  )
}
