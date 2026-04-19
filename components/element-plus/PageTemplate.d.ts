import type { EpTableColumn } from './types'

export declare interface PageTemplateProps {
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

export declare const PageTemplate: import('vue').DefineComponent<
  PageTemplateProps,
  {
    batchEdit: [rows: any[]]
    batchDelete: [rows: any[]]
  }
>
