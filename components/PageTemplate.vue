<template>
  <div>
    <n-card :title="title">
      <template v-if="$slots['header-extra']" #header-extra>
        <slot name="header-extra" />
      </template>

      <n-space style="margin-bottom: 16px;">
        <slot name="filters" />
        <n-input v-model:value="keyword" :placeholder="searchPlaceholder" clearable style="width: 240px;" @keyup.enter="fetchData">
          <template #prefix><n-icon><SearchOutline /></n-icon></template>
        </n-input>
        <n-button @click="fetchData">查询</n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :bordered="true"
        :row-key="rowKey"
        :striped="true"
        @update:page="handlePageChange"
      />
    </n-card>

    <slot name="modals" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const props = withDefaults(defineProps<{
  title: string
  columns: DataTableColumns<any>
  rowKey?: (row: any) => string | number
  fetchDataFn: (params: { page: number; page_size: number; keyword?: string; [key: string]: any }) => Promise<{ items: any[]; total: number }>
  searchPlaceholder?: string
  extraParams?: () => Record<string, any>
}>(), {
  rowKey: (row: any) => row.id,
  searchPlaceholder: '搜索',
})

const message = useMessage()
const loading = ref(false)
const keyword = ref('')
const tableData = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 20,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
})

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: pagination.page,
      page_size: pagination.pageSize,
      keyword: keyword.value || undefined,
      ...(props.extraParams?.() || {}),
    }
    const data = await props.fetchDataFn(params)
    tableData.value = data.items ?? []
    pagination.itemCount = data.total ?? 0
  } catch (err: unknown) {
    message.error((err as Error).message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  pagination.page = page
  fetchData()
}

function resetPage() {
  pagination.page = 1
  fetchData()
}

onMounted(fetchData)

defineExpose({ fetchData, resetPage, keyword, tableData, pagination })
</script>
