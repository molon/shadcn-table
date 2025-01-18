// 导入类型定义
import type { ColumnType, Filter, FilterOperator } from "@/types"
// 导入TanStack Table的Column类型
import { type Column } from "@tanstack/react-table"

// 导入数据表配置
import { dataTableConfig } from "@/config/data-table"

/**
 * 生成表格列的固定样式
 *
 * 该函数计算并返回数据表中固定列的CSS属性。
 * 它处理左右固定列，应用适当的定位、阴影和z-index样式。
 * 该函数还会考虑列是否是最后一个左固定列或第一个右固定列，
 * 以应用特定的阴影效果。
 *
 * @param options - 生成固定样式的选项
 * @param options.column - 要生成样式的列对象
 * @param options.withBorder - 是否在固定列和可滚动列之间显示阴影
 * @returns 包含计算样式的React.CSSProperties对象
 */
export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  /**
   * 是否在固定列和可滚动列之间显示阴影
   * @default false
   */
  withBorder?: boolean
}): React.CSSProperties {
  // 判断列是否固定
  const isPinned = column.getIsPinned()
  // 判断是否是最后一个左固定列
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left")
  // 判断是否是第一个右固定列
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right")

  // 返回样式对象
  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? "-4px 0 4px -4px hsl(var(--border)) inset" // 最后一个左固定列的阴影
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px hsl(var(--border)) inset" // 第一个右固定列的阴影
          : undefined
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined, // 左固定位置
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined, // 右固定位置
    opacity: isPinned ? 0.97 : 1, // 固定列透明度
    position: isPinned ? "sticky" : "relative", // 定位方式
    background: isPinned ? "hsl(var(--background))" : "hsl(var(--background))", // 背景色
    width: column.getSize(), // 列宽
    zIndex: isPinned ? 1 : 0, // 层级
  }
}

/**
 * 根据列类型获取默认的过滤操作符
 *
 * 该函数根据列的数据类型返回最合适的默认过滤操作符。
 * 对于文本列，返回'iLike'（不区分大小写的like），
 * 对于其他类型，返回'eq'（等于）。
 *
 * @param columnType - 列的类型（如'text'、'number'、'date'等）
 * @returns 给定列类型的默认FilterOperator
 */
export function getDefaultFilterOperator(
  columnType: ColumnType
): FilterOperator {
  // 文本列使用iLike操作符
  if (columnType === "text") {
    return "iLike"
  }

  // 其他列使用eq操作符
  return "eq"
}

/**
 * 获取给定列类型的适用过滤操作符列表
 *
 * 该函数返回与指定列类型相关且适用的过滤操作符数组。
 * 它使用预定义的列类型到操作符列表的映射，
 * 如果提供了未知的列类型，则回退到文本操作符。
 *
 * @param columnType - 要获取过滤操作符的列类型
 * @returns 包含过滤操作符标签和值的对象数组
 */
export function getFilterOperators(columnType: ColumnType) {
  // 操作符映射表
  const operatorMap: Record<
    ColumnType,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators, // 文本操作符
    number: dataTableConfig.numericOperators, // 数字操作符
    select: dataTableConfig.selectOperators, // 选择操作符
    "multi-select": dataTableConfig.selectOperators, // 多选操作符
    boolean: dataTableConfig.booleanOperators, // 布尔操作符
    date: dataTableConfig.dateOperators, // 日期操作符
  }

  // 返回对应列类型的操作符，默认返回文本操作符
  return operatorMap[columnType] ?? dataTableConfig.textOperators
}

/**
 * 过滤掉无效或空的过滤器
 *
 * 该函数处理过滤器数组并返回一个新数组，
 * 仅包含有效的过滤器。一个过滤器被认为是有效的条件是：
 * - 它有'isEmpty'或'isNotEmpty'操作符，或
 * - 它的值不为空（对于数组值，至少有一个元素；
 *   对于其他类型，值不能是空字符串、null或undefined）
 *
 * @param filters - 要验证的Filter对象数组
 * @returns 仅包含有效过滤器的新数组
 */
export function getValidFilters<TData>(
  filters: Filter<TData>[]
): Filter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" || // 空值操作符
      filter.operator === "isNotEmpty" || // 非空值操作符
      (Array.isArray(filter.value)
        ? filter.value.length > 0 // 数组值至少有一个元素
        : filter.value !== "" && // 非空字符串
          filter.value !== null && // 非null
          filter.value !== undefined) // 非undefined
  )
}
