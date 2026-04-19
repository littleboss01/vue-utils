<template>
  <n-modal v-model:show="visible" :title="title" preset="dialog" style="width: 560px;" :show-icon="false">
    <n-tabs type="segment" v-model:value="inputMode" style="margin-bottom: 12px;">
      <n-tab name="paste">粘贴文本</n-tab>
      <n-tab name="file">选择文件</n-tab>
    </n-tabs>

    <div v-if="inputMode === 'paste'">
      <n-input
        v-model:value="textContent"
        type="textarea"
        :placeholder="pastePlaceholder"
        :rows="8"
      />
    </div>

    <div v-if="inputMode === 'file'">
      <n-upload
        :max="1"
        :default-upload="false"
        accept=".txt,.csv"
        @change="handleFileChange"
      >
        <n-upload-dragger>
          <div style="padding: 20px 0;">
            <n-icon size="40" :depth="3"><CloudUploadOutline /></n-icon>
            <n-text style="font-size: 16px; display: block; margin-top: 8px;">点击或拖拽文件到此区域</n-text>
            <n-text depth="3" style="font-size: 12px;">支持 .txt / .csv 文件</n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
    </div>

    <n-alert type="info" style="margin-top: 12px;" :bordered="false">
      <template #header>格式说明</template>
      <div style="font-size: 13px; line-height: 1.6;">
        <div>每行一条数据，或用 <n-tag size="tiny" type="info">{{ separator }}</n-tag> 分隔</div>
        <div style="margin-top: 4px;">{{ formatHint }}</div>
      </div>
    </n-alert>

    <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
      <n-button text type="info" @click="downloadTemplate">
        <template #icon><n-icon><DownloadOutline /></n-icon></template>
        下载模板
      </n-button>
      <n-text depth="3" style="font-size: 13px;">
        已识别 <n-text strong>{{ parsedItems.length }}</n-text> 条数据
      </n-text>
    </div>

    <template #action>
      <n-button @click="visible = false">取消</n-button>
      <n-button type="primary" :loading="loading" :disabled="parsedItems.length === 0" @click="handleImport">
        导入 ({{ parsedItems.length }})
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NModal, NTabs, NTab, NInput, NUpload, NUploadDragger, NButton, NIcon, NAlert, NTag, NText, useMessage } from 'naive-ui'

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
const message = useMessage()
const loading = ref(false)
const inputMode = ref<'paste' | 'file'>('paste')
const textContent = ref('')
const fileContent = ref('')

function handleFileChange({ file }: { file: { file: File } }) {
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = (e.target?.result as string) || ''
  }
  reader.readAsText(file.file)
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
