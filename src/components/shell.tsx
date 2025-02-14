import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

// 使用cva（class-variance-authority）定义Shell组件的样式变体
// cva是一个用于管理CSS类变体的工具，主要功能：
// 1. 定义基础样式
// 2. 支持多种变体（variants）
// 3. 支持默认变体
// 4. 提供类型安全
// 5. 简化复杂组件的样式管理
const shellVariants = cva(
  // 基础样式：网格布局，内容居中，间距和padding
  "grid items-center gap-8 pb-8 pt-6 md:py-8",
  {
    variants: {
      variant: {
        default: "container", // 默认样式：容器布局
        // container类说明：
        // 1. 设置固定宽度，随屏幕尺寸变化
        // 2. 自动添加水平padding
        // 3. 在断点处自动调整最大宽度
        sidebar: "", // 侧边栏样式：无额外样式
        centered:
          "container flex h-dvh max-w-2xl flex-col justify-center py-16", // 居中样式：垂直居中布局
        // h-dvh类说明：
        // 1. 设置高度为100vh（视口高度）
        // 2. 兼容移动设备，考虑浏览器UI影响
        // max-w-2xl类说明：
        // 1. 设置最大宽度为42rem（672px）
        // 2. 42rem = 42 * 16px = 672px
        // 3. 用于限制内容宽度，提升可读性
        markdown: "container max-w-3xl py-8 md:py-10 lg:py-10", // Markdown样式：适合文档展示
        // max-w-3xl类说明：
        // 1. 设置最大宽度为48rem（768px）
        // 2. 48rem = 48 * 16px = 768px
        // 3. 比max-w-2xl稍宽，适合文档展示
        // 4. 这些尺寸来自Tailwind默认配置：
        //    - xl: 36rem (576px)
        //    - 2xl: 42rem (672px)
        //    - 3xl: 48rem (768px)
        //    - 1rem = 16px
      },
    },
    defaultVariants: {
      variant: "default", // 默认使用default变体
    },
  }
);

// Shell组件属性接口
interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>, // 继承div元素属性
    VariantProps<typeof shellVariants> {
  // 继承样式变体属性

  // as属性说明：
  // 1. 这是ShellProps自定义的属性，不是来自VariantProps
  // 2. 类型为React.ElementType，表示可以是：
  //    - HTML标签名（如"div"、"section"）
  //    - React组件
  //    - 自定义组件
  // 3. 可选属性，未指定时默认使用"section"
  // 4. 用于动态改变组件的根元素类型
  // 5. 示例用法：
  //    - <Shell as="main"> 渲染为main元素
  //    - <Shell as={CustomComponent}> 渲染为自定义组件
  as?: React.ElementType;
}

// Shell组件实现
// 该组件的主要用途：
// 1. 提供页面布局的基础框架
// 2. 支持多种布局变体（默认、侧边栏、居中、Markdown）
// 3. 允许动态切换渲染元素类型
// 4. 统一管理页面布局样式
// 实现机制：
// 1. 使用cva管理样式变体，包括：
//    - 定义基础样式（网格布局、间距等）
//    - 支持多种布局变体
//    - 提供默认变体
// 2. 通过as属性支持动态元素类型，可以渲染为：
//    - 任意HTML元素
//    - React组件
//    - 自定义组件
// 3. 使用cn工具合并样式，支持：
//    - 变体样式
//    - 自定义className
//    - 其他样式类
// 4. 支持所有div元素的HTML属性
// 5. 提供统一的布局解决方案
function Shell({
  className,
  // Comp是局部变量别名，用于接收as属性
  // 不是React预设关键词，而是解构重命名模式
  // 默认值为"section"，表示默认渲染为section元素
  // 可通过as属性指定其他HTML元素或React组件
  as: Comp = "section",
  variant,
  ...props
}: ShellProps) {
  return (
    // 动态渲染组件，合并样式变体和自定义className
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  );
}

// 导出Shell组件和样式变体
export { Shell, shellVariants };
