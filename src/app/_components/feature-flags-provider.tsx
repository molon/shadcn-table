"use client";

import { useQueryState } from "nuqs";
import * as React from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type DataTableConfig, dataTableConfig } from "@/config/data-table";
import { cn } from "@/lib/utils";

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"];

// 定义特性标志上下文接口
interface FeatureFlagsContextProps {
  featureFlags: FeatureFlagValue[];
  setFeatureFlags: (value: FeatureFlagValue[]) => void;
}

// 创建特性标志上下文
const FeatureFlagsContext = React.createContext<FeatureFlagsContextProps>({
  featureFlags: [],
  setFeatureFlags: () => {},
});

// 定义useFeatureFlags hook
export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }
  return context;
}

// 定义特性标志提供者组件的props接口
interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

// 特性标志提供者组件
export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  // 使用useQueryState管理URL中的特性标志状态
  const [featureFlags, setFeatureFlags] = useQueryState<FeatureFlagValue[]>(
    "flags", // 查询参数名称
    {
      defaultValue: [], // 默认值
      parse: (value) => value.split(",") as FeatureFlagValue[], // 解析URL参数
      serialize: (value) => value.join(","), // 序列化参数值
      eq: (
        a,
        b // 比较函数
      ) =>
        a.length === b.length && a.every((value, index) => value === b[index]),
      clearOnDefault: true,
      shallow: false,
    }
  );

  return (
    // 提供特性标志上下文
    <FeatureFlagsContext.Provider
      value={{
        featureFlags, // 当前特性标志
        setFeatureFlags: (value) => void setFeatureFlags(value), // 设置特性标志的方法
      }}
    >
      {/* 特性标志切换器容器 */}
      <div className="w-full overflow-x-auto">
        {/* 多选切换组 */}
        <ToggleGroup
          type="multiple" // 多选模式
          variant="outline" // 轮廓样式
          size="sm" // 小尺寸
          value={featureFlags} // 当前选中的值
          onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)} // 值改变回调
          className="w-fit gap-0" // 自定义样式
        >
          {/* 遍历所有特性标志 */}
          {dataTableConfig.featureFlags.map((flag, index) => (
            <Tooltip key={flag.value}>
              {" "}
              {/* 工具提示 */}
              {/* 切换项 */}
              <ToggleGroupItem
                value={flag.value} // 当前项的值
                className={cn(
                  "gap-2 whitespace-nowrap rounded-none px-3 text-xs data-[state=on]:bg-accent/70 data-[state=on]:hover:bg-accent/90",
                  {
                    "rounded-l-sm border-r-0": index === 0, // 第一个项的特殊样式
                    "rounded-r-sm":
                      index === dataTableConfig.featureFlags.length - 1,
                  }
                )}
                asChild
              >
                {/* 工具提示触发器 */}
                <TooltipTrigger>
                  {/* 图标 */}
                  <flag.icon className="size-3.5 shrink-0" aria-hidden="true" />
                  {/* 标签 */}
                  {flag.label}
                </TooltipTrigger>
              </ToggleGroupItem>
              {/* 工具提示内容 */}
              <TooltipContent
                align="start" // 对齐方式
                side="bottom" // 显示位置
                sideOffset={6} // 偏移量
                className="flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground"
              >
                {/* 工具提示标题 */}
                <div>{flag.tooltipTitle}</div>
                <div className="text-muted-foreground text-xs">
                  {flag.tooltipDescription}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
      {/* 渲染子组件 */}
      {children}
    </FeatureFlagsContext.Provider>
  );
}
