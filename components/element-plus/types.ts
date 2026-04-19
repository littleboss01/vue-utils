/**
 * Element Plus 表格列配置
 * 兼容 el-table-column 的常用属性，无需直接依赖 element-plus 内部类型
 */
export interface EpTableColumn {
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  type?: string
  formatter?: (row: any, column: any, cellValue: any, index: number) => any
  slots?: { default?: any; header?: any }
  [key: string]: any
}

export interface PageTemplateProps {
  title: string
  columns: EpTableColumn[]
  rowKey?: string
  fetchDataFn: (params: { page: number; page_size: number; keyword?: string; [key: string]: any }) => Promise<{ items: any[]; total: number }>
  searchPlaceholder?: string
  extraParams?: () => Record<string, any>
  showBatchEdit?: boolean
  showBatchDelete?: boolean
  hideIdColumn?: boolean
  showIndexColumn?: boolean
}

export interface ImportDialogProps {
  title?: string
  separator?: string
  formatHint?: string
  pastePlaceholder?: string
  templateContent?: string
  templateFileName?: string
}
