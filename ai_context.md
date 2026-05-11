# AI Context

## 2026-04-25
- Request: move Element Plus batch edit/delete actions to the top-right area.
- Change: moved the selected-row action group into the card header right side.
- Traceability: original block has been copied into the source snapshot markdown file.

- Request update: comment out the search controls in template.

## 2026-05-11
- Request: fix Naive UI `PageTemplate` page size switching not taking effect.
- Change: added `@update:page-size` handling in `components/PageTemplate.vue`; when page size changes, it now resets to page 1 and refetches data immediately.
