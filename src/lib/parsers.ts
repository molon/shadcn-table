// 导入类型定义
import type { ExtendedSortingState, Filter } from "@/types"
// 导入TanStack Table的Row类型
import { type Row } from "@tanstack/react-table"
// 导入nuqs的createParser方法用于创建参数解析器
import { createParser } from "nuqs/server"
// 导入zod用于数据验证
import { z } from "zod"

// 导入数据表配置
import { dataTableConfig } from "@/config/data-table"

// 定义排序项schema
export const sortingItemSchema = z.object({
  id: z.string(), // 排序字段ID
  desc: z.boolean(), // 是否降序
})

/**
 * 创建TanStack Table排序状态解析器
 * @param originalRow 原始行数据，用于验证排序键
 * @returns 返回排序状态解析器
 */
export const getSortingStateParser = <TData>(
  originalRow?: Row<TData>["original"],
) => {
  // 获取有效键集合
  const validKeys = originalRow ? new Set(Object.keys(originalRow)) : null

  // 创建并返回解析器
  return createParser<ExtendedSortingState<TData>>({
    // 解析方法
    parse: (value) => {
      try {
        // 解析JSON字符串
        const parsed = JSON.parse(value)
        // 使用zod验证数据格式
        const result = z.array(sortingItemSchema).safeParse(parsed)

        // 验证失败返回null
        if (!result.success) return null

        // 检查排序字段是否有效
        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        // 返回验证后的数据
        return result.data as ExtendedSortingState<TData>
      } catch {
        // 异常情况返回null
        return null
      }
    },
    // 序列化方法
    serialize: (value) => JSON.stringify(value),
    // 比较方法
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc,
      ),
  });
};

// 定义过滤器schema
export const filterSchema = z.object({
  id: z.string(), // 过滤字段ID
  value: z.union([z.string(), z.array(z.string())]), // 过滤值，支持字符串或字符串数组
  type: z.enum(dataTableConfig.columnTypes), // 字段类型
  operator: z.enum(dataTableConfig.globalOperators), // 操作符
  rowId: z.string(), // 行ID
})

/**
 * 创建数据表过滤器状态解析器
 * @param originalRow 原始行数据，用于创建解析器
 * @returns 返回过滤器状态解析器
 */
export const getFiltersStateParser = <T>(originalRow?: Row<T>["original"]) => {
  // 获取有效键集合
  const validKeys = originalRow ? new Set(Object.keys(originalRow)) : null

  // 创建并返回解析器
  return createParser<Filter<T>[]>({
    // 解析方法
    parse: (value) => {
      try {
        // 解析JSON字符串
        const parsed = JSON.parse(value)
        // 使用zod验证数据格式
        const result = z.array(filterSchema).safeParse(parsed)

        // 验证失败返回null
        if (!result.success) return null

        // 检查过滤字段是否有效
        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        // 返回验证后的数据
        return result.data as Filter<T>[]
      } catch {
        // 异常情况返回null
        return null
      }
    },
    // 序列化方法
    serialize: (value) => JSON.stringify(value),
    // 比较方法
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.type === b[index]?.type &&
          filter.operator === b[index]?.operator,
      ),
  });
};
