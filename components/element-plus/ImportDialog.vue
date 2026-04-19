<template>
  <div>
    <el-dialog v-model="visible" :title="title" width="560px" destroy-on-close>
      <el-tabs v-model="inputMode" style="margin-bottom: 12px;">
        <el-tab-pane label="粘贴文本" name="paste" />
        <el-tab-pane label="选择文件" name="file" />
      </el-tabs>

      <div v-if="inputMode === 'paste'">
        <el-input
          v-model="textContent"
          type="textarea"
          :placeholder="pastePlaceholder"
          :rows="8"
        />
      </div>

      <div v-if="inputMode === 'file'">
        <el-upload
          :limit="1"
          :auto-upload="false"
          accept=".txt,.csv"
          :on-change="handleFileChange"
          drag
        >
          <el-icon style="font-size: 40px; color: #c0c4cc;"><UploadFilled /></el-icon>
          <div style="font-size: 16px; margin-top: 8px;">点击或拖拽文件到此区域</div>
          <div style="font-size: 12px; color: #909399;">支持 .txt / .csv 文件</div>
        </el-upload>
      </div>

      <el-alert type="info" :closable="false" style="margin-top: 12px;">
        <template #title>
          <div style="font-size: 13px; line-height: 1.6;">
            <div>每行一条数据，或用 <el-tag size="small" type="info">{{ separator }}</el-tag> 分隔</div>
            <div style="margin-top: 4px;">{{ formatHint }}</div>
          </div>
        </template>
      </el-alert>

      <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
        <el-button link type="primary" @click="downloadTemplate">
          <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg></el-icon>
          下载模板
        </el-button>
        <span style="font-size: 13px; color: #909399;">
          已识别 <strong style="color: #303133;">{{ parsedItems.length }}</strong> 条数据
        </span>
      </div>

      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" :disabled="parsedItems.length === 0" @click="handleImport">
          导入 ({{ parsedItems.length }})
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { UploadFilled, Download, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = withDefaults(defineProps<{
  title?: string
  separator?: string
  formatHint?: string
  pastePlaceholder?: string
  templateContent?: string
  templateFileName?: string
}>(), {
  title: '导入数据',
  separator: '----',
  formatHint: '例如：example.com',
  pastePlaceholder: '每行一条，或用 ---- 分隔',
  templateContent: 'example.com\nexample2.com',
  templateFileName: 'template.txt',
})

const emit = defineEmits<{
  (e: 'import', items: string[]): Promise<void>
}>()

const visible = defineModel<boolean>('show', { default: false })
const loading = ref(false)
const inputMode = ref<'paste' | 'file'>('paste')
const textContent = ref('')
const fileContent = ref('')

function handleFileChange(uploadFile: any) {
  const file = uploadFile.raw ?? uploadFile
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = (e.target?.result as string) || ''
  }
  reader.readAsText(file)
}

const rawContent = computed(() => inputMode.value === 'paste' ? textContent.value : fileContent.value)

const parsedItems = computed(() => {
  if (!rawContent.value.trim()) return []
  const lines = rawContent.value.split(/[\r\n]+/).map(s => s.trim()).filter(Boolean)
  const items: string[] = []
  for (const line of lines) {
    if (line.includes(props.separator)) {
      items.push(...line.split(props.separator).map(s => s.trim()).filter(Boolean))
    } else {
      items.push(line)
    }
  }
  return items
})

function downloadTemplate() {
  const blob = new Blob([props.templateContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.templateFileName
  a.click()
  URL.revokeObjectURL(url)
}

async function handleImport() {
  if (parsedItems.value.length === 0) return
  loading.value = true
  try {
    await emit('import', parsedItems.value)
    visible.value = false
    textContent.value = ''
    fileContent.value = ''
  } finally {
    loading.value = false
  }
}

watch(visible, (v) => {
  if (!v) {
    textContent.value = ''
    fileContent.value = ''
    inputMode.value = 'paste'
  }
})
</script>
