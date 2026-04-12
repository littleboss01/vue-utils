# vue-utils

共享 Vue 3 + Naive UI 组件和工具函数库。

## 安装

```bash
npm install git+https://github.com/littleboss01/vue-utils.git
```

## 使用

```ts
// 工具函数
import { formatRelativeTime } from 'vue-utils'
// 或
import { formatRelativeTime } from 'vue-utils/utils/time'

// 组件
import { PageTemplate } from 'vue-utils'
import { ImportDialog } from 'vue-utils'

// 或按路径引入
import PageTemplate from 'vue-utils/components/PageTemplate'
import ImportDialog from 'vue-utils/components/ImportDialog'
```

## 包含内容

| 模块 | 说明 |
|------|------|
| `utils/time` | `formatRelativeTime` - 友好时间格式化（刚刚/X分钟前/X小时前/X天前/精确时间） |
| `components/PageTemplate` | 通用列表页模板（搜索+分页+数据表格） |
| `components/ImportDialog` | 通用导入弹窗（粘贴文本/选择文件，支持模板下载） |

## Peer Dependencies

- `vue >= 3.4`
- `naive-ui >= 2.38`
- `@vicons/ionicons5 >= 0.12`
