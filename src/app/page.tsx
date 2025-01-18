import * as React from "react"
import { type SearchParams } from "@/types"

import { getValidFilters } from "@/lib/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { Shell } from "@/components/shell"

import { FeatureFlagsProvider } from "./_components/feature-flags-provider"
import { TasksTable } from "./_components/tasks-table"
import {
  getTaskPriorityCounts,
  getTasks,
  getTaskStatusCounts,
} from "./_lib/queries"
import { searchParamsCache } from "./_lib/validations"

interface IndexPageProps {
  searchParams: Promise<SearchParams>
}

export default async function IndexPage(props: IndexPageProps) {
  // 解析传入的搜索参数
  const searchParams = await props.searchParams
  // 使用验证器解析并验证搜索参数
  const search = searchParamsCache.parse(searchParams)

  // 获取有效的过滤器参数
  const validFilters = getValidFilters(search.filters)

  // 并行获取任务数据、任务状态统计和任务优先级统计
  const promises = Promise.all([
    getTasks({
      ...search, // 展开搜索参数
      filters: validFilters, // 使用验证后的过滤器
    }),
    getTaskStatusCounts(), // 获取任务状态统计
    getTaskPriorityCounts(), // 获取任务优先级统计
  ])

  // 返回页面布局
  return (
    <Shell className="gap-2">
      {/* 功能标志提供者，用于管理功能开关 */}
      <FeatureFlagsProvider>
        {/* 日期选择器组件，使用Suspense实现懒加载 */}
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm" // 小尺寸触发器
            triggerClassName="ml-auto w-56 sm:w-60" // 触发器样式
            align="end" // 右对齐
            shallow={false} // 不使用浅层路由
          />
        </React.Suspense>
        {/* 任务表格组件，使用Suspense实现懒加载 */}
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6} // 列数
              searchableColumnCount={1} // 可搜索列数
              filterableColumnCount={2} // 可过滤列数
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]} // 单元格宽度
              shrinkZero // 允许缩小到0
            />
          }
        >
          {/* 渲染任务表格，传入数据promises */}
          <TasksTable promises={promises} />
        </React.Suspense>
      </FeatureFlagsProvider>
    </Shell>
  )
}
