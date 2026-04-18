import type { DataTableColumns } from 'naive-ui'

export declare interface PageTemplateProps {
  title: string
  columns: DataTableColumns<any>
  rowKey?: (row: any) => string | number
  fetchDataFn: (params: { page: number; page_size: number; keyword?: string; [key: string]: any }) => Promise<{ items: any[]; total: number }>
  searchPlaceholder?: string
  extraParams?: () => Record<string, any>
  showBatchEdit?: boolean
  showBatchDelete?: boolean
  hideIdColumn?: boolean
  showIndexColumn?: boolean
}

export declare const PageTemplate: import('vue').DefineComponent<
  PageTemplateProps,
  {
    batchEdit: [keys: Array<string | number>]
    batchDelete: [keys: Array<string | number>]
  }
>
