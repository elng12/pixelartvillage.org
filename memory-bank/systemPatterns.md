# 系统架构与模式

## 技术架构
- **前端框架**: React + Vite
- **路由系统**: React Router v6，多语言路径结构 `/:lang/`
- **国际化**: i18next + react-i18next + i18next-http-backend
- **状态管理**: Hooks + Context
- **样式系统**: Tailwind CSS
- **构建部署**: Vite + Netlify (推测)

## 关键模式
- **语言切换**: 使用 `LanguageSwitcherFixed` + URL 结构 + `setStoredLang`
- **翻译资源加载**: i18next 异步加载（使用 HttpBackend）
- **SEO**: 自定义 `Seo` 组件 + hreflang + canonical
- **动态模块**: 统一使用 React.lazy + Suspense
- **资源预加载**: `ResourcePreloader` + 新增 `TranslationPreloader`

## 多语言模式
1. **默认语言**: `en`
2. **路由策略**:
   - `/` -> 默认语言
   - `/:lang/` -> 其他语言
   - 内页同步（如 `/privacy` 和 `/:lang/privacy`）
3. **语言检测**:
   - localStorage (`pv_lang`)
   - 浏览器语言
4. **翻译文件结构**: `public/locales/{lang}/translation.json`

## 组件协作
- `App.jsx`: 路由定义 + 布局
- `LocaleProvider`: 提供 `buildPath` 等上下文
- `LanguageSwitcherFixed`: 切换语言并更新 URL
- `TranslationPreloader`: 监控路由并预加载翻译资源
- 各组件通过 `useTranslation` 获取文案

## 错误处理
- 语言加载失败 -> fallback 到默认语言
- 加强错误日志（console.warn/error）

## 性能优化要点
- 动态加载组件减少首屏体积
- 预加载常用翻译资源
- 使用 requestIdleCallback 等机制