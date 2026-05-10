# PageTemplate.vue（Naive UI）

- 卡片头部已改为 `#header` 自定义布局：标题与 `header-extra` 使用可换行 flex，窄屏时操作区换行展示，避免被默认单行头部挤没。
- 筛选区、批量操作区 `n-space` 已开启 `wrap`；搜索框使用 `max-width: 100%` 适配窄屏。
- 表格已移除外层 `overflow-x: auto` 包裹，改为使用 `n-data-table` 自身 `scroll-x` 处理横向滚动；并在 `scrollX` 存在时，自动识别“操作”列（`key` 为 `actions/action` 或 `title` 为“操作”）并设置 `fixed: 'right'`（不覆盖调用方已设置的 fixed）。
