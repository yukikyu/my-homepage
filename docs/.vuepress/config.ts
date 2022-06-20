import description from '../../package.json'
import sidebar from './sidebar'
import navbar from './navbar'

// 默认主题
import defaultTheme from '@vuepress/theme-default'

// 搜索
import search from '@vuepress/plugin-search'

import mermaidPlugin from '@renovamen/vuepress-plugin-mermaid'

module.exports = {
  port: 8087,
  title: '雪球的大书库',
  description: description,
  theme: defaultTheme({
    repo: '',
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    navbar: navbar,
    sidebar: sidebar
  }),
  plugins: [
    search({}),
    mermaidPlugin({ token: "mermaid" })
  ],
}