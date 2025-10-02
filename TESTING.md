# Testing Guide

本指南汇总了快速验证导航可访问性与链接安全的书签脚本（Bookmarklets），以及推荐的本地验证步骤。

## Quick Checks (Bookmarklets)

将以下代码片段分别拖拽到浏览器书签栏，进入站点后点击书签运行。

### 1) A11y Scanner — 交互元素可访问名与焦点

```
javascript:(function(){function g(el){return (el.getAttribute('aria-label')||el.title||el.textContent||'').trim()} const items=[...document.querySelectorAll('header button,[role=\"button\"],a,header a')]; const rows=items.map(el=>({tag:el.tagName.toLowerCase(), role:el.getAttribute('role')||'', name:g(el), ariaControls:el.getAttribute('aria-controls')||'', tabIndex:el.tabIndex, hasTitle:!!el.title, hasAriaLabel:!!el.getAttribute('aria-label')})); console.table(rows); alert('A11y quick scan done: ' + rows.length + ' interactive items'); })();
```

### 2) External Link Security — 外链安全属性

```
javascript:(function(){const bad=[...document.querySelectorAll('a[target=\"_blank\"]')].filter(a=>!/noopener/.test(a.rel)||!/noreferrer/.test(a.rel)||!/nofollow/.test(a.rel)); if(bad.length){console.warn('External links missing rel security:',bad); alert('Found '+bad.length+' external links missing rel. See console.');} else {alert('All external links have rel security + nofollow.');}})();
```

### 3) Hash Anchor Counter — 页面锚点链接统计

```
javascript:(function(){const anchors=[...document.querySelectorAll('a[href^=\"#\"]')]; alert('Hash anchors found: '+anchors.length); console.log(anchors);})();
```

## Local Verification

- 一键链路：`npm run verify:nav`
  - 执行顺序：Typecheck → Build → Playwright E2E → i18n 校验
  - Lighthouse 建议在预览起服务后单独执行（见下）

- 手动执行：
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:e2e`
  - `npm run i18n:validate`

- Lighthouse（可访问性分数）：
  1. `npm run preview &` （默认端口 4173）
  2. `lighthouse --only-categories=accessibility http://localhost:4173/ --output=json --output-path=lh-report.json`
  3. `cat lh-report.json | jq '.categories.accessibility.score'`

## CI 集成（Lighthouse CI）

- 工作流：`.github/workflows/lighthouse.yml`
- 配置：`lighthouserc.json`（仅对 Accessibility 设置硬性断言 >= 0.94）
- 产物：`.lighthouseci/` 报告作为 GitHub Actions Artifact 保存 30 天；可选配置 `LHCI_GITHUB_APP_TOKEN` 以开启 PR 评论。

