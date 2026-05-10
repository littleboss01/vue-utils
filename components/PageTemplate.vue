<template>
  <div>
    <n-card>
      <template #header>
        <div class="page-template-card-head">
          <div class="page-template-card-head__title">
            {{ title }}
          </div>
          <div v-if="$slots['header-extra']" class="page-template-card-head__extra">
            <slot name="header-extra" />
          </div>
        </div>
      </template>

      <n-space wrap style="margin-bottom: 16px;">
        <slot name="filters" />
        <n-input v-model:value="keyword" :placeholder="searchPlaceholder" clearable class="page-template-keyword" @keyup.enter="fetchData">
          <template #prefix><n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg></n-icon></template>
        </n-input>
        <n-button @click="fetchData">查询</n-button>
      </n-space>

      <n-space v-if="checkedRowKeys.length > 0" wrap style="margin-bottom: 12px;" align="center">
        <n-tag type="info" :bordered="false">已选 {{ checkedRowKeys.length }} 项</n-tag>
        <n-button v-if="showBatchEdit" type="primary" size="small" @click="handleBatchEdit">
          批量编辑
        </n-button>
        <n-button v-if="showBatchDelete" type="error" size="small" @click="handleBatchDelete">
          批量删除
        </n-button>
        <n-button size="small" quaternary @click="clearChecked">取消选择</n-button>
      </n-space>

      <div style="width: 100%; overflow-x: auto;">
        <n-data-table
          :columns="resolvedColumns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          :bordered="true"
          :row-key="rowKey"
          :striped="true"
          :checked-row-keys="checkedRowKeys"
          :scroll-x="scrollX"
          @update:checked-row-keys="handleCheck"
          @update:page="handlePageChange"
        />
      </div>
    </n-card>

    <slot name="modals" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableColumn } from 'naive-ui'

const props = withDefaults(defineProps<{
  title: string
  columns: DataTableColumns<any>
  rowKey?: (row: any) => string | number
  fetchDataFn: (params: { page: number; page_size: number; keyword?: string; [key: string]: any }) => Promise<{ items: any[]; total: number }>
  searchPlaceholder?: string
  scrollX?: number | string
  extraParams?: () => Record<string, any>
  showBatchEdit?: boolean
  showBatchDelete?: boolean
  hideIdColumn?: boolean
  showIndexColumn?: boolean
}>(), {
  rowKey: (row: any) => row.id,
  searchPlaceholder: '搜索',
  showBatchEdit: false,
  showBatchDelete: false,
  hideIdColumn: false,
  showIndexColumn: false,
})

const scrollX = props.scrollX

const resolvedColumns = computed<DataTableColumns<any>>(() => {
  let cols = props.columns
  if (props.hideIdColumn) {
    cols = cols.filter((col: DataTableColumn<any>) => !(col && 'key' in col && col.key === 'id'))
  }
  if (props.showIndexColumn) {
    const indexCol: DataTableColumn<any> = {
      title: '序号',
      key: '__index',
      width: 60,
      align: 'center',
      render: (_row: any, index: number) => (pagination.page - 1) * pagination.pageSize + index + 1,
    }
    cols = [indexCol, ...cols]
  }
  return cols
})

const emit = defineEmits<{
  batchEdit: [keys: Array<string | number>]
  batchDelete: [keys: Array<string | number>]
}>()

const checkedRowKeys = ref<Array<string | number>>([])

function handleCheck(keys: Array<string | number>) {
  checkedRowKeys.value = keys
}

function clearChecked() {
  checkedRowKeys.value = []
}

function handleBatchEdit() {
  emit('batchEdit', checkedRowKeys.value)
}

function handleBatchDelete() {
  emit('batchDelete', checkedRowKeys.value)
}

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
    checkedRowKeys.value = []
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

defineExpose({ fetchData, resetPage, keyword, tableData, pagination, checkedRowKeys, clearChecked })
</script>

<style scoped>
.page-template-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 12px;
  row-gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.page-template-card-head__title {
  font-size: var(--n-title-font-size, 18px);
  font-weight: var(--n-title-font-weight, 500);
  color: var(--n-title-text-color);
  flex: 1 1 120px;
  min-width: 0;
  word-break: break-word;
}

.page-template-card-head__extra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-left: auto;
  flex: 0 0 auto;
  max-width: 100%;
}

.page-template-keyword {
  width: 240px;
  max-width: 100%;
}
</style>
