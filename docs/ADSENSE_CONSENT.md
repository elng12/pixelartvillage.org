# AdSense 与 Consent Mode 集成说明（脚本加载顺序）

为确保合规与数据准确性，加载顺序建议如下：

1. 先加载 Consent 初始脚本（默认拒绝）
   - `index.html`（以及 `privacy.html`、`terms.html`、`about.html`、`contact.html`）里：
     - `<script type="module" src="/src/consent-init.js"></script>`
   - 作用：在任何 Google 脚本之前设置 `ad_storage/analytics_storage/ad_user_data/ad_personalization = denied`，并应用用户历史选择。

2. 再加载 Google 脚本（如果启用）
   - 例如：AdSense、gtag.js、GTM 等。
   - 注意：这些脚本必须位于 `consent-init.js` 之后、业务脚本之前。

3. 最后加载你的业务脚本
   - 例如：`<script type="module" src="/src/main.jsx"></script>`

同意与拒绝
- 用户首次访问会看到同意弹窗（`ConsentBanner`），选择会写入 `localStorage` 并通过 `gtag('consent','update', ...)` 同步。
- 未同意前保持默认拒绝；同意后可根据需要加载/使用相应功能。

多页面（MPA）入口
- 我们已在所有入口（`index.html`、`privacy.html` 等）中确保 `consent-init.js` 在 `main.jsx` 之前加载。
- 如需接入 Google 脚本，请在 `consent-init.js` 与 `main.jsx` 之间插入相应标签。

调试建议
- 在控制台查看 `window.dataLayer` 是否包含 `consent default` 与 `consent update` 事件。
- 使用网络面板确认 AdSense/gtag 等脚本的加载与请求是否符合预期。

