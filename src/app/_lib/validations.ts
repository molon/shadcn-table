// 导入数据库schema定义和Task类型
import { tasks, type Task } from "@/db/schema"
// 导入nuqs/server的搜索参数处理工具
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
// 导入zod用于数据验证
import * as z from "zod"

// 导入自定义的过滤器和排序解析器
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers"

// 创建搜索参数缓存配置
export const searchParamsCache = createSearchParamsCache({
  // 功能标志，支持"advancedTable"和"floatingBar"两种值
  flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
    []
  ),
  // 当前页码，默认为1
  page: parseAsInteger.withDefault(1),
  // 每页显示数量，默认为10
  perPage: parseAsInteger.withDefault(10),
  // 排序配置，使用Task类型的排序解析器
  sort: getSortingStateParser<Task>().withDefault([
    { id: "createdAt", desc: true }, // 默认按创建时间降序
  ]),
  // 任务标题搜索，默认为空字符串
  title: parseAsString.withDefault(""),
  // 任务状态过滤，支持多选
  status: parseAsArrayOf(z.enum(tasks.status.enumValues)).withDefault([]),
  // 任务优先级过滤，支持多选
  priority: parseAsArrayOf(z.enum(tasks.priority.enumValues)).withDefault([]),
  // 开始时间过滤
  from: parseAsString.withDefault(""),
  // 结束时间过滤
  to: parseAsString.withDefault(""),
  // 高级过滤器配置
  filters: getFiltersStateParser().withDefault([]),
  // 过滤条件连接符，支持"and"和"or"
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
})

// 创建任务时的数据验证schema
export const createTaskSchema = z.object({
  // 任务标题，必填
  title: z.string(),
  // 任务标签，从数据库枚举值中选择
  label: z.enum(tasks.label.enumValues),
  // 任务状态，从数据库枚举值中选择
  status: z.enum(tasks.status.enumValues),
  // 任务优先级，从数据库枚举值中选择
  priority: z.enum(tasks.priority.enumValues),
})

// 更新任务时的数据验证schema
export const updateTaskSchema = z.object({
  // 任务标题，可选
  title: z.string().optional(),
  // 任务标签，可选
  label: z.enum(tasks.label.enumValues).optional(),
  // 任务状态，可选
  status: z.enum(tasks.status.enumValues).optional(),
  // 任务优先级，可选
  priority: z.enum(tasks.priority.enumValues).optional(),
})

// 导出类型定义
export type GetTasksSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
export type CreateTaskSchema = z.infer<typeof createTaskSchema>
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>
