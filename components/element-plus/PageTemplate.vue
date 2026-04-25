<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px; font-weight: 600;">{{ title }}</span>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
            <div v-if="checkedRows.length > 0" style="display: flex; align-items: center; gap: 8px;">
              <el-tag type="info" effect="plain">宸查€?{{ checkedRows.length }} 椤?/el-tag>
              <el-button v-if="showBatchEdit" type="primary" size="small" @click="handleBatchEdit">
                鎵归噺缂栬緫
              </el-button>
              <el-button v-if="showBatchDelete" type="danger" size="small" @click="handleBatchDelete">
                鎵归噺鍒犻櫎
              </el-button>
              <el-button size="small" link @click="clearChecked">鍙栨秷閫夋嫨</el-button>
            </div>
            <slot name="header-extra" />
          </div>
        </div>
      </template>

      <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <slot name="filters" />
        <!--
        <el-input
          v-model="keyword"
          :placeholder="searchPlaceholder"
          clearable
          style="width: 240px;"
          @keyup.enter="fetchData"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button @click="fetchData">鏌ヨ</el-button>
        -->
      </div>

      <!-- 鍘熶唬鐮佸凡杩佺Щ鍒?婧愪唬鐮?md锛氭壒閲忔搷浣滀綅浜庣瓫閫夊尯鍩熶笅鏂?-->

      <el-table
        v-loading="loading"
        :data="tableData"
        :row-key="rowKey"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column
          v-if="showIndexColumn"
          label="搴忓彿"
          width="60"
          align="center"
        >
          <template #default="{ $index }">{{ (currentPage - 1) * pageSize + $index + 1 }}</template>
        </el-table-column>
        <el-table-column
          v-for="col in resolvedColumns"
          :key="col.prop ?? col.type"
          v-bind="col"
        >
          <template v-if="col.slots" #default="scope">
            <component :is="col.slots.default" v-bind="scope" />
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <slot name="modals" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { EpTableColumn } from './types'

const props = withDefaults(defineProps<{
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
}>(), {
  rowKey: 'id',
  searchPlaceholder: '鎼滅储',
  showBatchEdit: false,
  showBatchDelete: false,
  hideIdColumn: false,
  showIndexColumn: false,
})

const resolvedColumns = computed<EpTableColumn[]>(() => {
  let cols = props.columns
  if (props.hideIdColumn) {
    cols = cols.filter(col => col.prop !== 'id')
  }
  return cols
})

const emit = defineEmits<{
  batchEdit: [rows: any[]]
  batchDelete: [rows: any[]]
}>()

const checkedRows = ref<any[]>([])

function handleSelectionChange(rows: any[]) {
  checkedRows.value = rows
}

function clearChecked() {
  checkedRows.value = []
}

function handleBatchEdit() {
  emit('batchEdit', checkedRows.value)
}

function handleBatchDelete() {
  emit('batchDelete', checkedRows.value)
}

const loading = ref(false)
const keyword = ref('')
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      page_size: pageSize.value,
      keyword: keyword.value || undefined,
      ...(props.extraParams?.() || {}),
    }
    const data = await props.fetchDataFn(params)
    tableData.value = data.items ?? []
    total.value = data.total ?? 0
    checkedRows.value = []
  } catch (err: unknown) {
    ElMessage.error((err as Error).message || '鑾峰彇鏁版嵁澶辫触')
  } finally {
    loading.value = false
  }
}

function handlePageChange() {
  fetchData()
}

function handleSizeChange() {
  currentPage.value = 1
  fetchData()
}

function resetPage() {
  currentPage.value = 1
  fetchData()
}

onMounted(fetchData)

defineExpose({ fetchData, resetPage, keyword, tableData, currentPage, pageSize, total, checkedRows, clearChecked })
</script>
