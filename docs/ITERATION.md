# Pixel Art Village 迭代记录

## 2026-10-14 GA4 Cookie 选择拆分（本地完成，未发布）

用户同意本轮三项修改：统计与广告独立选择、说明各自用途、增加长期可重新打开的 Cookie 设置入口。本轮只处理同意模块、必要的多语言文案与相关测试；没有修改 GA4/GSC 后台、测量 ID、SEO 搜索标题/描述、默认拒绝策略或正式部署。

- 前置只读核对同一个完整太平洋时间窗口 `2026-10-05` 至 `2026-10-11`：GSC 网页点击 `3156`，GA4 `google / organic` 会话 `720`，全部会话 `952`。测量 ID `G-L5N8DGXP7F` 匹配，内部流量过滤器是 Testing，并非正式排除。线上拒绝状态发送无 Cookie 请求，接受后正常发送授权状态请求；不能把整段差距归因于标签漏装。原来的全部接受/全部拒绝不是天然错误，历史缺少同意率证据，未证明全部差距由此造成。
- 新设置分别保存 `analytics`、`advertising`；前者控制 `analytics_storage`，后者控制三项广告权限。仍使用 `consent.choice.v1` 存储键，写入 `version: 2`，保留保守的旧 `granted` 字段；旧版接受/拒绝记录读取时原样保留，不自动重置、不静默升级。损坏、缺字段、非布尔值和未知版本保持拒绝，并显示选择入口。复用既有 localStorage/sessionStorage/内存降级机制；无法持久化时明确提示。
- 弹窗保留全部接受/拒绝，增加自定义复选框；页脚的 Cookie 设置可再次修改或撤回。18 种实际语言及 pseudo 补齐设置文案，统计说明包含现有 Google Analytics 与 Microsoft Clarity，不新增统计服务。同步英语打包资源及西语首页的既有独立弹窗描述。
- 已存在同意管理器时，不用本站记录覆盖它；Google Funding Choices 沿用官方 `googlefc.showRevocationMessage()` 入口，其他未提供兼容入口的管理器给出提示，不虚构 API。另修正 Google 同意更新先入队、再通知本站统计监听器的顺序；撤回广告许可时取消尚未执行的广告加载定时器和交互监听器，不声称能卸载已经运行的第三方脚本。
- Node `20.19.0` 最终隔离构建通过，构建链 SEO/dist/缓存和 64 条重定向验证通过；全项目 lint、typecheck、diff 空白检查通过。根目录已有 dist、站图和其他未提交工作保留。候选为 `/tmp/pixelart-consent-vkZ35Z/`，最终 27 个相关源码/测试/语言文件与受验构建输入逐一相同。
- 新增 10 项同意模块单元测试全部通过，覆盖四种组合、旧记录、异常记录、存储降级、管理器保护、广告延迟加载取消和全部语言资源。完整现有单元测试为 37/38：既有 BMP 重定向断言要求西语直达目标规则，当前配置使用分段跳转，断言与配置不一致；本轮未改该断言或重定向，不称完整套件通过。
- Chromium 真实页面操作确认四种许可组合、刷新恢复、英语切换日语后恢复、页脚重新打开、取消/Escape 不写选择与返回焦点、原生弹窗键盘顺序。桌面 `1440`、手机 `390`、长文案及阿拉伯语 RTL `320` 实际截图已查看，设置文案和按钮未溢出。最终构建另复核英语只同意统计的刷新恢复、挪威语/阿拉伯语长文案布局及 18 种实际语言资源。存储不可用、同意更新报错、已有管理器和无法打开管理器采用明确的隔离故障模拟，错误均有可见反馈，没有把模拟当真实账号接口验收。

本地页面检查使用 `VITE_E2E=0` 的生产式构建；为避免测试访问污染正式 GA4，在隔离浏览器中设置 GA 停止发送标志，并阻止广告脚本的测试加载。受验的是实际 UI、保存/恢复和同意队列，不是修改后的正式 GA4 接收效果；管理器重新打开也是接口模拟，正式地区弹窗未验收。截图由浏览器工具直接返回，工具拒绝写入候选临时目录，没有声称该目录保存了截图。

状态：本地修改与相关验收完成，预览 `http://127.0.0.1:4416/`；没有提交、推送、发布、请求收录或创建自动化。本次改善选择方式，不强迫同意，也不承诺 GA4 与 GSC 完全相等、不回填历史遗漏。发布后的实际收数及完整日期窗口对照仍待正式发布授权后核对。

## 2026-10-14 已完成文章与共享功能发布准备（本地通过，待部署）

用户对本轮上线清单回复“执行”。本次拟合并发布12个已完成本地批次：波兰语5篇、荷兰语5篇、意大利语3篇增量、西班牙语比较篇、日语比较/动画/入门篇纠错，以及共享2×/4×最近邻下载、文章语言菜单、缺失文章404和测试变量修复。对应17个文章网址、12张新分享PNG；Aseprite条目只是第三方软件售价说明，不新增本站收费或支付。葡萄牙语/越南语/俄语/韩语/日语首页再次SEO优化、日语步骤编号和旧描述扩写仍暂缓。

- 沿用`origin/main`触发Cloudflare Pages项目`pixelartvillage1`，不直接上传本地dist、不改云端环境变量。发布前父提交与远端均为`007c27e24302dda78a00ad2bc0195ebf6ce9d0a1`。
- Node20.19.0、`NODE_ENV=production VITE_E2E=0 npm run build`生成正常生产构建，9.76秒通过；未显式设置analytics，不将本地取值推断成云端配置。构建链SEO/dist/缓存及64条重定向、全项目lint、typecheck、sitemap:verify均通过。站图仍205网址，hreflang参考177网址，网址集合未变。
- 17篇实际HTTP200；5种缺失路径均404/noindex，HEAD404且0字节正文。根及上述五种暂缓语言首页共6页，搜索元信息和去script静态正文与发布前正式站逐项一致。
- 正常生产构建的8项既有下载/网格/Zoom、PL语言往返、文章菜单和404回归通过，零重试。完整Chromium首轮553项中513通过、33跳过、7失败；误设`EXPECT_CONSENT_BANNER=0`，实际本地生产页有Cookie弹窗，其中西语导航日志明确记录弹窗拦截，意语下载trace记录点击超时。保留所有失败截图、视频、trace及原报告。
- 只改临时验收配置为真实弹窗`EXPECT_CONSENT_BANNER=1`，用2 workers精确复核7失败及33跳过项；40/40通过、零跳过、零重试，31.2秒。未改业务代码、断言或超时；两轮合计553个不同项目均取得通过证据，不称首轮553/553或单次全绿。正式站发布前实际DOM没有弹窗，线上专项仍须按部署后实际表面选配置。
- 17篇最终标题55–60字符，除仅正文纠错的日语入门旧描述70字符外，其余16篇描述151–155字符。逐页完整计数保留`article-final-character-counts.json`，不把70字符描述称为达标。
- 提交仅选本轮源码/测试/12图/6份GSC基线及相关记录。AGENTS只提交五条SEO规则，ITERATION从父提交加入本轮12个章节、规则章节和本条，不混入旧批次记录；其他历史GSC、PRD/inventory、旧批次A说明及工作区站图改动保留。不执行收录申请。

证据目录`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-production-release-tPEKiG/`保存发布清单、正式站前快照、生产构建保护对照、8项专项、首轮完整报告、40项纠正配置复核、合并覆盖证明和手机截图。此时尚未提交、推送或部署；最终结果另补发布回执。

## 2026-10-14 日语入门篇画布尺寸与位深纠错（本地验收完成，未发布）

本轮按授权只处理`/ja/blog/pixel-art-tutorial-complete-guide-2025/`的尺寸、颜色数量和位深相关说明。改动内容源仍为`src/content/blog-posts.ja.json`第二个对象；不改搜索标题/描述、其他文章、首页或共享模板，不提交、推送、部署或请求收录。

- 全文核对发现两处互相强化的错误分类：基本概念把8-bit/16-bit分别绑定固定画布范围，后面的画布设置又把尺寸绑定初级/中级/高级。两处都已纠正，不只删除一句。
- 依据[Aseprite新建精灵说明](https://www.aseprite.org/docs/new-sprite/)，宽高像素数与色彩模式独立设置；依据[Aseprite色彩模式](https://www.aseprite.org/docs/color-mode/)，该软件Indexed模式的256色是调色板上限，不是画布尺寸或必须使用的颜色数；[GIMP3图像编码说明](https://docs.gimp.org/3.0/en/gimp-image-encoding.html)说明位深与色彩数据精度。初次两个旧文档地址404后改读真实对应页面，未把失败链接写进文章。日语路径的GIMP对应页正文仍大量英文，因此文章明确链接英文资料，不误标为已完整日语化。
- 正文现在区分像素宽高、实际使用色数、色彩模式与RGB每通道位深；“8-bit风/16-bit风”不定义固定尺寸或颜色数量，针对具体游戏机时需单独核对约束，不把所有8-bit概括为同一个硬件标准。
- 保留16×16、32×32、64×64、128×128、256×256作为图标/瓦片、角色/单独物体、背景的自拟练习例，明确不是硬件或格式标准、不是水平等级。实际步骤从本练习32×32开始，必要时考虑64×64，背景可选择更大尺寸；配色的8～16色也标为练习起点，可按需要调整。
- 只修改上述三个相关小节中的四段正文区间及`updated`日期，原2025-10-28发布日期、Aseprite价格条目与其确认日期保留。比较篇与动画篇的原始字节未变，其他608个保护文件未变，前轮语言菜单、404与测试修复保留。
- Node20隔离构建通过，用时13.01秒，构建链SEO/dist/缓存及64条重定向检查通过，输出`artifact://412`；根`dist/`未重新生成。
- 真实浏览器1440/390宽、JavaScript开启/关闭四组均HTTP200，三个相关小节、用途示例、位深说明、练习配色和三个正确官方外链真实存在；旧固定尺寸/水平分类未显示，已核实价格保持一致。canonical、日语、可收录状态、发布日期正确，四组无横向溢出，未出现pageerror。已查看并保留手机尺寸说明、桌面色彩段落及桌面练习步骤截图，没有新增固定文案的永久测试或声称全套测试通过。
- 对比243份构建HTML元信息，242份未变；目标head按语义逐项检查，唯一变化是BlogPosting的实际`dateModified`。搜索标题仍为`初心者のための完全ピクセルアートガイド (2025) - ゼロから作成まで | Pixel Art Village`，57字符；描述仍为`初心者のための完全ガイドでゼロからピクセルアートを学びましょう。基本技術をマスターし、適切なツールを選択し、最初のピクセル傑作を作成します。`，70字符。源值、构建和真实页面一致。未改描述，70字符仍不符合未来修改时150–160的目标，不能把本轮正文验收称为描述达标。

证据保留于`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-missing-blog-1dKA55/japanese-intro-canvas/`，包括`source-proof.json`、`runtime-proof.json`、`metadata-proof.json`、`verification-result.json`与三张实际修改区域截图。本轮托管浏览器及专用预览已关闭，没有新增临时执行脚本或依赖。

本轮不是整篇教程或全站审查。截图还显示该页步骤内分段有序列表重新从1编号，未在本轮扩大修改共享列表渲染；影响范围需另行定位。搜索描述扩写、五种语言首页SEO优化、旧公共语言资源与其他无关正文问题仍未处理。

## 2026-10-13 日语入门篇Aseprite价格条件核对（本地验收完成，未发布）

本轮仅处理`/ja/blog/pixel-art-tutorial-complete-guide-2025/`、`src/content/blog-posts.ja.json`第二个对象的Aseprite价格条目，不重写入门教程、不改其他工具或首页SEO，不提交、推送、部署或请求收录。

- 核对纠正了历史记录的前提：`$19.99`并非已证实过时。[Aseprite官方购买页的itch.io入口](https://www.aseprite.org/buy/?itch)嵌入[商品23045](https://itch.io/embed/23045?border_width=2)，指向[David Capello/Igara的实际商店](https://dacap.itch.io/aseprite)。2026-10-13两处都显示`$19.99 USD or more`，商品页明确最低19.99 USD。普通官方购买页为动态结算，静态读取没有可核对金额；不能把itch.io报价推广为所有渠道、币种或付款总额。
- 保留19.99这个已核实数字，改为日语说明“官方所指itch.io商店显示的最低19.99 USD”，加官方销售链接和2026-10-13确认日期，并要求其他渠道价格、付款总额按相应销售页核对。不编造税费、汇率、月费/年费、终身更新或试用条件；把同一条未获依据的“行业标准”改成官方可证实的像素画与动画编辑器用途。
- 原2025-10-28发布日期、标题、excerpt、tags、其他正文段落保留。仅改`[1].body[41]`并按现有内容惯例加入`updated: 2026-10-13`，使资源的实际修改日期正确；这个日期不代表全文重新审校。其余两个日语对象逐字节保留，前轮动画篇、比较篇、语言菜单、404及测试修复未回退。
- 最终Node20隔离构建通过，用时12.48秒，SEO/dist/缓存与64条重定向检查通过，输出`artifact://401`。一次早期值比较误把JSON属性插入顺序当成内容差异；改用深值比较后通过。未复制新内容前启动的旧源构建不作为本轮价格修改验收证据。
- 真实浏览器1440宽、JavaScript关闭，以及390宽、JavaScript开启两组均HTTP200；价格条件、官方外链、日语、canonical、可收录状态及修改日期正确。手机未出现横向溢出，已查看两组价格段落截图；开启JavaScript的一组未出现pageerror。没有运行竞品或进入支付流程，没有新增永久文案断言或声称跑过完整测试套件。
- 最终完整搜索标题仍为`初心者のための完全ピクセルアートガイド (2025) - ゼロから作成まで | Pixel Art Village`，57字符；完整描述仍为`初心者のための完全ガイドでゼロからピクセルアートを学びましょう。基本技術をマスターし、適切なツールを選択し、最初のピクセル傑作を作成します。`，70字符。源值、构建与实际页面一致。本轮未修改搜索文案；旧描述未达到150–160字符规则，不能称为达标，留待另行授权该页SEO修改，不在价格核对中自动扩写。
- 对比243份HTML元信息，242份完全未变，唯一变化页为本篇；按语义逐项核对，目标head只改变BlogPosting的`dateModified`，发布日期、title/description、canonical、hreflang、OG/Twitter等不变。其余608个保护文件未变，上一轮菲律宾语错误文案保留，根`dist/`未重新生成。
- 本地SEO资料入口已读取，但内容指南文件受EPERM限制，不能声称读过该指南或以空搜索证明没有资料。本轮价格采用上述实际读取的官方/发布者来源，未据此保证收录、曝光或排名变化。

证据为`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-missing-blog-1dKA55/japanese-intro-price/`中的`source-proof.json`、`runtime-proof.json`、`scope-proof.json`及桌面/手机截图。本轮托管浏览器和专用预览已关闭，没有新增临时执行脚本或依赖。

“日语入门篇价格未核实”现已解决，但不等于整篇已纠错。正文仍有把8-bit/16-bit对应固定画布范围的旧说明，本轮保留；五种语言首页SEO优化和日语公共语言资源等其他事项仍未处理。旧迭代记录作为当时状态保留，以本条为本轮价格核对结论。

## 2026-10-13 博客测试未定义变量修复（定向验收完成，未发布）

本轮只修`tests/blog.spec.js`中已记录的5处`italianForbidden`未定义错误，并补本条记录。不改网页、文章、语言资源、分享图、首页SEO或前轮404实现，不提交、推送、部署或请求收录。

- 5处错误实际位于阿拉伯语、瑞典语、泰语、越南语和菲律宾语测试，不是5个意大利语页面；原文件不存在`italianForbidden`定义。按已记录错误直接修复，未重跑旧lint来确认已知报错。
- 印尼语和挪威语原有两份完全相同的旧虚构产品、无依据承诺及模板残留检查。通过语言服务器迁移为文件顶部唯一的`legacyBlogContent`，复用原正则内容、不降低检查范围；5处错误引用接入同一规则，原两处消费者保留，没有删除断言、定义空规则或增加例外。语言服务器确认1处定义与7处消费者。
- 整个`tests/blog.spec.js`的ESLint通过，用时1.02秒；历史记录中的这5处未定义变量不再属于当前未处理项。没有据此声称全项目lint通过。
- 复用上一轮隔离候选，Node20构建通过，用时12.25秒，构建链dist/SEO/缓存及64条重定向检查通过，输出`artifact://389`；根`dist/`未重新生成。
- Chromium定向运行7种受影响语言的比较文章，390宽度、JavaScript开启/关闭，共14项通过，0失败、0跳过、0重试，用时14.6秒。新修的5个测试分支及原印尼语、挪威语消费者都实际执行；未运行完整博客测试矩阵或全站Playwright套件。
- 609个既有保护文件未变，上一轮菲律宾语404错误文案单字段修复保留；无页面内容或SEO修改，五种语言首页SEO优化继续暂缓，日语入门篇旧价格等其他事项未处理。

本轮自建预览已停止，临时Playwright配置已删除。证据为`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-missing-blog-1dKA55/legacy-guard-checks/verification.json`。永久改动只有博客测试与本条迭代记录。

## 2026-10-13 缺失博客文章404链路修复（本地验收完成，未发布）

本轮承接上一轮记录的缺失英语动画篇及未知`constructor`文章直达问题，只修错误页、构建和预览响应，不创建文章译文、不改有效文章内容或首页SEO。五种语言首页SEO优化仍暂缓；没有提交、推送、部署或请求收录。

### 修改与边界

- Cloudflare Pages原本已有`public/404.html`，且`_redirects`中的SPA200兜底只是注释。因此，不能把本地预览的“首页HTML+200”认定为线上当前行为。按[Pages官方就近404规则](https://developers.cloudflare.com/pages/configuration/serving-pages/)，由预渲染统一生成根`dist/404.html`与18种配置语言的共享博客`404.html`，删除旧独立`public/404.html`，不创建假文章网址、不增加重定向规则或sitemap网址。
- 根错误页复用现有通用NotFound界面；博客错误页复用现有文章错误标题、描述与真实博客返回链接。错误head只有相应标题、描述和`robots=noindex`，没有首页或有效文章的canonical、hreflang、OG/Twitter与JSON-LD。共享模板没有`data-ssr-root`，现有`createRoot`按真实请求网址挂载，不把保留的模板网址冒充当前页面做hydration。有效页面继续原有SSR/hydration。
- `BlogPost.jsx`复用上一轮的`virtual:blog-article-locales`精确Map，在加载正文前同步判断当前语言是否真有该slug；不再借英语fallback把缺失译文当有效文章。有效正文组件按语言重新挂载，保留原正文加载器和文章内容。缺失页有实际`LocalizedLink`返回博客，并允许通过既有菜单切到确实存在的译文。
- `Seo.jsx`的显式noindex分支先清旧head、停止有效页head获取；路由变化同时更新错误页标题、描述和robots。连续两个缺失网址不会丢失noindex，回到有效页后恢复完整页面信息；旧异步请求不能覆盖新页。
- `serve-dist.cjs`保留真实文件/index优先，缺失时就近选择404文件并返回HTTP404，HEAD无响应正文；无错误文件时也不回首页200。`npm run preview`改用同一服务，避免标准预览命令仍走Vite首页兜底。构建验证只更正旧404注释，保留根404产物必需检查。
- 唯一文案修改为`public/locales/tl/translation.json`的`blog.notFound.desc`：删除会原样显示的HTML/`{{ TERM_0 }}`模板词，改成完整错误提示。最终描述为155字符，源码、构建与实际页面一致；标题字段未改，其他菲律宾语字段逐项一致。没有批量润色其余语言的旧错误文案。

### 实际验收

- Node20隔离构建通过，候选`npm run build`用时14.41秒，构建链SEO、dist、缓存与64条重定向检查通过。TypeScript检查和两个改动组件、错误页测试的定向ESLint通过；没有声称全项目lint通过。
- Chromium本轮5项错误页/既有通用404检查通过；上一轮菜单回归及英语、德语、韩语桌面/手机SEO导航、失败恢复、取消旧请求共11项通过。首轮误设`EXPECT_CONSENT_BANNER=1`，而构建关闭了统计，11项停在不存在的Cookie弹窗等待；保留失败输出，纠正为0后11项通过，未放宽断言或修改这些既有测试。
- 实际HTTP检查：缺失英语动画篇、日语`constructor`（含无尾斜线/查询参数）、未知通用页和缺失博客内图片都为404；对应真实日语动画文章与首页为200。缺失页HEAD为404且0字节正文。标准`npm run preview -- --port 4412 --strictPort`另行启动并验证缺失页404、首页200。
- JavaScript关闭时，缺失英语文章仍有可见错误提示、noindex和博客返回链接。JavaScript开启后，日语未知文章干净挂载，没有React418或Seo同步错误，返回日语博客后恢复可用菜单及canonical、删除noindex。连续缺失SPA网址保留noindex，返回最初首页恢复原title、canonical和OG；真实从英语缺失页菜单切到日语动画文章后，正文、日语canonical与可收录状态恢复。
- 已查看1440宽英语及390宽日语错误页真实截图；日语手机页无横向溢出，错误提示和返回按钮可见。沿用现有语言文案不等于对全部语言重新完成文案审校。
- 基线225份HTML、候选243份：224份有效页面的title、description、canonical、hreflang、OG/Twitter和JSON-LD逐页一致；根404刻意替换，新增18份博客共享错误模板，19份错误文件均为干净head、非hydration模板。sitemap网址/内容及hreflang参考未变，文件只差构建时的生成时间注释；`_redirects`、`_headers`一致。
- 610个保护文件核验没有额外变化，唯一许可例外是上述菲律宾语单字段；根`dist/`、文章JSON、分享图、首页SEO及上一轮菜单四个文件保留。构建与运行位于隔离副本，没有手改根构建产物。

证据保留在`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-missing-blog-1dKA55/`，包括隔离构建、`runtime-proof.json`、`command-proof.json`及英/日真实截图。构建输出为`artifact://369`，初轮测试失败输出为`artifact://378`。临时预览和浏览器已关闭，临时执行配置已移除，源码回归测试保留。

### 未扩大处理

- 本地证明不等于线上已更新；Pages的线上404行为须在授权发布后再检查。[Google对HTTP状态的说明](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)也不保证索引变化立即发生。未修改其他托管平台的历史配置。
- 五种语言首页SEO、5处旧`italianForbidden`测试变量错误、日语入门篇旧价格及其余旧语言文案不在本轮处理范围，未宣称修复。

## 2026-10-13 博客文章语言菜单可用性修复（本地验收完成，未发布）

本轮只处理公共语言菜单把用户带到缺失文章的问题，不创建译文、不改文章内容、首页SEO或语言文案，不提交、推送、部署或请求收录。前轮已经记录日语动画篇没有英语对应文章；本轮直接据此修复，不把重看“Post not found”当成定位工作。

### 根因与修改范围

- `LanguageSwitcherBalanced.jsx`原来固定展示全部运行时语言；文章组件只在所选语言的数据中按slug找文章，不能据“支持该语言”推断“该文章有此译文”。
- `vite.config.js`新增`virtual:blog-article-locales`，在构建/开发服务中读取实际语言数据，生成仅含slug与语言代码的紧凑Map。沿用数组/数字键对象及有效slug的现有内容规则，不加载正文到语言菜单，不维护手写例外或译文清单，不更改文章加载器的fallback语义。
- `useLanguageSync.js`识别实际博客文章路径，按现有语言配置顺序计算`availableLangs`，并在写入语言偏好、改变i18n及导航之前拦截不可用目标。`LanguageSwitcherBalanced.jsx`使用同一清单，避免菜单与处理器判断不同。
- 当前语言没有文章时，保留不可选的当前语言占位，允许选择真实存在的其他译文；所有语言都没有该文章时禁用菜单，不自动跳到首页、博客索引或其他文章。首页、博客索引、About及converter不走文章过滤，保留原完整语言菜单；保留现有URL、历史、查询参数与hash处理规则。
- 代码审查发现旧`handleHotUpdate`只覆盖文件更新，不能覆盖新增/恢复的数据文件；依据安装的Vite7源码及[官方Environment API](https://vite.dev/guide/api-environment-plugins#the-hotupdate-hook)，改用环境级`hotUpdate`及moduleGraph，覆盖create/update/delete并保留已有受影响模块。隔离开发实验使用原ES文章数据，未造假译文；更新、删除及恢复后均实际验证菜单变化。
- 永久代码改动为`vite.config.js`、`src/hooks/useLanguageSync.js`、`src/components/LanguageSwitcherBalanced.jsx`及`tests/blog.spec.js`的一条行为回归测试；本条为配套记录，无新源码数据文件、图片、语言文案或依赖。

### 本地验收与范围证据

- Node20隔离基线与最终候选构建通过；最终`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0 npm run build`用时12.47秒，构建链`verify-dist`及缓存/重定向检查通过。候选四个修改文件与项目根文件字节一致，根`dist/`和sitemap未重新生成。
- 桌面1440与手机320宽度、JavaScript开/关，共4个文章场景及刷新通过。日语动画篇菜单准确保留`es/de/pt/fr/ru/ja`，没有英语选项；已查看真实桌面、手机截图与浏览器可访问性中的6个选项，未出现横向溢出。
- 实际切到西班牙语、德语、葡萄牙语、法语、俄语，均为同slug、正确语言正文及canonical，没有整页重载；查询参数保留，前进/后退通过。动画篇→日语比较篇会恢复英语，比较篇英语切换通过，后退回动画篇再次移除英语。
- 实际注入一个过时的英语选择事件，确认URL、已存语言及页面语言未变。直接打开缺失英语文章时，英语占位不可选而真实日语译文可选择；未知`constructor`文章路径无可用目标、菜单禁用且不重定向。显式网址语言优先于预存偏好通过。
- `/ja/blog/`、`/ja/`、`/ja/about/`和实际存在的`/ja/converter/photo-to-sprite-converter/`保持配置中的全部语言。初始实验误用无预渲染的`/ja/converter/image-to-pixel-art/`，随后按构建清单改用真实converter路径，保留失败诊断，不把该假设路径当成有效译文页。
- Chromium定向运行新文章菜单回归、既有波兰语文章英语往返和首页无重载切换，共3项通过、0跳过、0失败、0重试。最终三个生产源码文件ESLint通过。整个`tests/blog.spec.js`仍有5处旧`italianForbidden`未定义错误，基线和候选同位置、同错误，不能宣称全文件或全项目lint通过。
- 开发服务真实验证：移除ES数据中的动画文章后菜单去掉ES，恢复文章后恢复ES；删除整个ES数据文件后去掉ES，重新创建原文件后恢复ES。原文件最终逐字节还原。首次隔离开发环境的优化依赖请求HTTP504、页面未启动；为临时开发副本配置独立缓存后实验通过，缓存配置未写进项目根源码。
- 对比225份构建HTML，搜索title、description、canonical、OG/Twitter、hreflang与结构化数据均未变；67个文章页的菜单因实际译文覆盖不同而变化，不代表批量改稿。610个保护文件哈希未变，包括全部文章内容、语言资源、既有分享图、根构建产物、sitemap及共享图片处理代码。
- 临时证据目录为`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-blog-languages-qOcYWi/`，包括`runtime-menu-proof.json`、`development-hmr-proof.json`、`regression-proof.json`、`scope-proof.json`、真实截图与初始失败诊断。本地通过不等于线上已更新。

### 已知批外问题

- 本轮解决菜单通往不存在译文的入口，不改变直接输入不存在文章网址时的HTTP、未找到页面或SEO处理。基线和最终候选在缺失英语动画篇、未知文章`constructor`这两个无预渲染地址上均各有一次React418恢复渲染错误；首个不一致可能为HTML或text，完整消息分别保留，不能称为消除了该错误。有效文章与有效非文章路径没有新增运行时错误。
- `tests/blog.spec.js`的5处旧未定义变量、上述缺失文章直达处理及日语入门篇旧价格等问题仍未修改。五种语言首页SEO优化继续暂缓。

### 本轮清理

已停止本轮独占的候选预览、基线诊断及开发服务，释放两个托管浏览器；删除`menu-smoke.cjs`、`hmr-smoke.cjs`和临时Playwright配置，撤销仅开发副本使用的缓存配置并删除其独占缓存。保留构建副本、截图、回归结果及失败诊断，清理证据为上述临时目录的`cleanup-proof.json`。清理只针对本轮临时目录；未停止其他服务或改动个人浏览器。


## 2026-10-13 日语动画教程必要纠错（本地验收完成，未发布）

本轮只处理`/ja/blog/pixel-art-animation-tutorial-frame-by-frame/`，主要内容源为`src/content/blog-posts.ja.json`的第三个对象。保留原逐帧制作、瞬き与歩行主题和有用步骤，不改成照片转换教程、不开发本站动画功能。全文核对发现本站“基础动画”虚构能力、必须重复首尾帧的过强指令、瞬き示例时长计算不一致和混入中文等问题；均属于本篇必要纠错。前两个日语对象、首页、语言资源、其他语言及前轮修改保留，不提交、不发布、不请求收录。

### 改稿前搜索映射与依据

|目标网址|目标语言主词|搜索意图|返回query与完整日期窗口|证据与限制|是否改变原定位|
|---|---|---|---|---|---|
|`/ja/blog/pixel-art-animation-tutorial-frame-by-frame/`|`ピクセルアート アニメーション`；辅助`ピクセルアニメーション`、`フレーム`、`瞬き`|用动画编辑器制作手绘帧、设置时间并检查循环|2026-09-12至2026-10-09，web/final：`ピクセルアート アニメーション`为1点击/5曝光；`ピクセルアニメーション`为0点击/7曝光|`docs/GSC_JA_ANIMATION_BASELINE_2026-10-13.json`：目标page3点击/68曝光，平均位置7.2206；已收录、Google canonical为自身。query行不等于完整page汇总，不补造遗漏项；辅助词为具体教学内容判断，不称为已观测搜索量|保留原动画教学定位，纠正工具和时间说明，不转换为本站照片转换指南|

本篇Inspection、page、query/page三次只读请求均HTTP200；复用此前已保存的28个完整日期证据。Inspection最后抓取2026-10-12，不证明本轮未发布修改已抓取。原最终搜索标题59字符，已符合现有规则，优先保持；原完整描述88字符，需改为准确完整的150–160字符文案。

2026-10-13已读取Aseprite官方Animation、Frame Duration和Exporting，Piskel官网及GIMP3.0的GIF导出说明。GIMP首次旧文档地址返回404，随后定位到实际`file-gif-export.html`；不使用失败页面作为依据。Aseprite/Piskel/GIMP的步骤依据官方说明，未运行这些编辑器，不声称已有共同实验或动画导出实测。封面如复用静止图，必须明确不是本文动画实测结果；不生成假GIF冒充本站输出。

### 本篇修改与准确边界

- 删除本站支持“基础动画”的说法，明确本站是静止图转换工具，没有像素画笔、图层、时间轴或逐帧编辑。上传GIF不等于导出动画；实际可下载PNG、JPEG、WebP，不写GIF/SVG导出。
- 保留逐帧基础、瞬き和8帧歩行练习。帧率、画布尺寸与步行动作为练习示例，不写成通用标准或质量保证；循环检查最后一帧到第一帧的动作衔接，不要求两帧内容相同。
- 瞬き示例统一为5张图：第一张显示2个时间单位，其余各1个，共6个时间单位；以12FPS等效计算约0.5秒。167毫秒加4×83毫秒为499毫秒，说明这是取整近似；固定帧率编辑器需重复第一张图，得到6个时间轴帧。
- 补充官方编辑器入口、保存原项目、GIF/PNG连番导出及3条可见FAQ。Aseprite/Piskel/GIMP未实际运行，不称为编辑器共同测试、现成动画成品或本站动画导出实验。
- 沿用原静止图装饰封面，日语标签和正文说明其不是瞬き/歩行成品或动画GIF。沿用本站既有`/blog-og/_index.png`分享图，不新造动画图或本篇OG；下载实验的双帧GIF仅为临时验证输入，不写进文章或发布资源。

### 最终搜索标题与描述

- H1和原标题字段保持不变；最终完整标题59字符，包含程序追加品牌：`ピクセルアートアニメーションチュートリアル - 初心者向けフレームバイフレーム | Pixel Art Village`。
- 最终完整描述155字符：`ピクセルアートアニメーションをフレームごとに作る入門ガイド。瞬きの5つの状態と表示時間、8フレームの歩行例で、動きとループのつながりを考えます。AsepriteやPiskelなどの外部エディターが必要な理由、保存とGIF・PNG連番の書き出しも紹介。公式情報と練習例を分け、当サイトの静止画変換との違いも説明。`。
- 初版158字符描述在预渲染时被截断，手机端“加粗内嵌链接”又显示原始网址并溢出。实际重现后，仅调整本篇完整描述和3条普通Markdown链接；未改共享SEO、预渲染脚本、正文解析器或CSS。最终静态HTML、禁用JavaScript和运行时的完整描述一致，没有以自动截断充数。

### 构建、真实页面与范围证明

- 使用Node20，在临时基线与候选目录运行`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0 npm run build`；最终候选构建12.61秒完成，包含构建链`verify-dist`通过。不在项目根目录重新生成`dist/`或sitemap。
- 实际浏览器覆盖1440/390/320宽度×JavaScript开/关，共6个页面场景；目标页HTTP200，博客列表入口、刷新、最终title/description、canonical、自身hreflang、OG/Twitter、文章与FAQ结构化数据、静态封面及官方链接通过。320宽度页面和正文均无横向溢出；已查看桌面、手机标题封面与正文链接的可读截图。
- 使用真实双帧32×32GIF作为临时输入，在1440与390宽度各下载PNG/JPEG/WebP，6个文件均实际解码为32×32、单帧静态图。证明本轮对本站静态输出的说明；不判断固定取得GIF哪一帧，不当作动画编辑器性能或成品实验。
- 日语→实际存在的西班牙语同篇→刷新→返回日语通过；缺失英语对应页的失败另列批外问题，不冒充英语切换通过。分享图实际HTTP200，可解码为1200×630PNG，与基线字节一致。
- 225份构建HTML对比：元信息变化仅本篇及日语博客索引；正文变化为本篇、索引和另外两篇日语页的相关文章卡片。前两个日语源码对象逐字节不变；17个保护文件均未变，含首页构建产物、相关语言资源、其他语言内容、已有测试、前轮ES/JA分享图和根目录sitemap。隔离候选内容源与项目根源码一致；无公共组件修改、无新图、无永久测试新增。
- 永久记录为本篇内容源、本条迭代记录和`docs/GSC_JA_ANIMATION_BASELINE_2026-10-13.json`。临时证据位于`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-ja-animation-naPtGY/`，含`runtime-smoke-proof.json`、`scope-and-build-proof.json`、`visual-2-pages.json`、初始失败证据、截图和6个真实下载文件。未提交、推送、部署或请求收录；本地验收不等于线上已更新。

### 批外问题与后续边界

- 前轮记录的日语动画篇虚构本站动画功能问题，本轮已纠正。日语入门篇旧价格、日语语言资源中的能力说明及英文`Select language`无障碍名称仍未改动。
- 已重现公共语言菜单允许本篇切到不存在的英语对应文章：界面显示`Post not found`，本地服务器仍HTTP200，运行时canonical指向首页，而非有效英语文章。证据为`missing-english-counterpart.json`和截图；本轮不创建假译文、不改公共切换器或其他语言，不能把该场景记作通过。后续应单独处理不存在对应文章时的语言菜单与路径行为。

### 验收清理

本轮独占预览`ja-animation-final-naptgy`已停止，托管浏览器`ja-animation`已释放；删除自建临时脚本`smoke.cjs`与`gsc-ja-animation.py`，保留截图、下载文件、失败重现与结果JSON，清理记录为临时证据目录的`cleanup-proof.json`。未向仓库增加永久测试、临时脚本或验证用GIF。


## 2026-10-13 日语工具比较篇纠错（本地验收完成，未发布）

本轮仅处理`/ja/blog/best-pixel-art-converters-compared-2025/`及`src/content/blog-posts.ja.json`的B1。改稿前源码、隔离构建及真实页面确认：旧文声称测试十款工具，给出无证据的分数和排名，把本站导出写成PNG/GIF/SVG，并推荐无IT审批的企业使用。已删除这些无法证明或越权的结论。日语文件实际只有三篇，其余两篇、日语语言资源、首页、前轮ES/PL/NL/IT和共享图片处理均保留，不提交、不发布、不请求收录。

### 改稿前搜索映射与事实依据

|目标网址|目标语言主词|搜索意图|已返回query与完整日期窗口|证据与限制|是否改变原定位|
|---|---|---|---|---|---|
|`/ja/blog/best-pixel-art-converters-compared-2025/`|`ピクセルアート変換ツール比較`；辅助`無料`、`オンライン`、`ドット絵`|比较照片转换、手绘像素与动画工具，说明免费在线工具的适用任务|2026-09-12至2026-10-09，web/final：`ピクセルアート作成のオンラインツールを比較したい`（26曝光）、`最新の画像からピクセルアート変換を比較したい`（4）、`無料ピクセルアートのオンラインツールを比較したい`（43）、`画像からピクセルアート変換のオンラインツールを比較したい`（2）；这些query均为0点击|`docs/GSC_JA_COMPARISON_BASELINE_2026-10-13.json`：目标page为1点击/82曝光，平均位置5.1341；已收录、Google canonical为自身。返回query行曝光之和75不等于page曝光82，不补造遗漏行。主词及辅助词为保持该比较任务的编辑选择，不宣称精确搜索量|保留工具比较定位和已观察到的免费在线比较意图；仅修事实，不改成其他主题|

只执行本篇URL Inspection、page、query/page三次只读请求，全部HTTP200；完整28日期证据复用既有TL保存响应，没有读取其他canonical流量或请求收录。检查时最后抓取时间为2026-09-11，不能用既有收录状态证明本地新稿已发布或重新抓取。

2026-10-13已重新读取Aseprite、Piskel官网及GIMP Pixelize和Save/Export官方文档，复用已验收四工具模型。本站案例复用有出处的向日葵工作JPEG960×762和真实PNG80×63；竞品只核对官方功能，不做或声称同图质量/速度测试。新日语分享图沿用既有生成器，必须目视核对日文字形、换行与1200×630图片。文章参数名称以当前日语控件为准，不重写其他页面。

### 本轮交付与验收

- B1现为Pixel Art Village、Aseprite、Piskel、GIMP四工具的用途、功能和限制比较。保留“免费在线工具比较”的已观察搜索意图，明确本站用于照片转换、Piskel用于手绘和动画，不把四款都称为免费在线转换器。披露本站运营者身份；竞品只核对官方资料，没有共同照片质量/速度实验，不提供臆造评分、排名或旧价格。
- 原网址及2025-11-01发布日期保持不变，更新时间为2026-10-13。全文、表格、作者入口、展示标签、三条FAQ、案例参数和相关文章文字均在这一对象内完成日语化；保留必要名称、格式缩写、原样控件名，以及明确注明语言的官方资料。未修改共享模板、语言资源或测试源。
- 最终完整搜索标题为`ピクセルアート変換ツール比較：写真のドット絵化・手描き・アニメ制作の選び方 | Pixel Art Village`，57字符（含品牌、空格和标点）。完整描述为`ピクセルアート変換ツール比較：写真のドット絵化、手描き、アニメ制作に使う4ツールを目的別に紹介。無料のオンライン変換と描画ソフトの違い、対応形式や制限を確認できます。Pixel Art Villageの実際の設定とダウンロードできるひまわりのPNGも掲載。同条件で品質や速度を試したランキングではありません。`，154字符。源码、构建HTML、运行及刷新后的description/OG/Twitter值一致，没有依赖描述截断。
- 向日葵工作JPEG960×762、真实PNG80×63及Don McCulley/Commons/CC0出处保留，区分Commons原始5040×4000照片与工作图片尺寸。只新增`public/blog-og/ja/best-pixel-art-converters-compared-2025.png`；沿用既有生成器，1200×630，HTTP200且可解码。结果图441×350区域与实际PNG最近邻放大逐像素相同，已目视检查日文字形、完整文字及图片，无缺字方框或截字。
- 首轮实际点击暴露正文Markdown预先带`/ja/`会在客户端成为`/ja/ja/`，而原图Markdown链接会变成`/ja/photo-sunflower-source.jpg/`。只按既有内容模型纠正本篇：页面Markdown使用`/`、`/blog/.../`，交给既有组件加语言前缀；工作JPEG沿用西语比较篇的纯文字说明和原生封面展示，结果PNG保留已有结构化figure原生下载。不改链接组件、预渲染器或资源规则，不以HTTP200的首页回退充当正确目的页。
- 最终Node20隔离`npm run build`通过，包含自带`verify-dist`及缓存/重定向检查，完整输出`artifact://274`。使用现有`scripts/build/serve-dist.cjs`预览，未在根目录构建。前后225个HTML的SEO标签/JSON-LD差异仅本篇和日语Blog列表；正文差异在本篇、列表和两篇日语教程，后两者来自既有相关文章卡片传播，不是教程正文重写。其余两篇源对象按字节不变；16个受保护文件按字节无变化，含规则、首页构建、ES/PL/NL/IT源、日语等语言资源、原有测试、共享图片处理、根目录sitemap和ES分享图。所有首页SEO保持不变。
- 临时Playwright Chromium141真实烟测最终通过：1440/390/320屏宽，各自JavaScript关闭/开启，共六组。覆盖列表进入、直接打开、刷新、标题与完整描述、唯一canonical、自身日语hreflang、无noindex、四工具表、三条可见FAQ与对应FAQPage、BlogPosting/Breadcrumbs、作者、封面原图/结果图地址及尺寸、两张资源的MIME和实际字节、作例PNG点击下载字节一致，以及横向不溢出。内链检查限定真实地址并核对目的页canonical/语言，不只看状态码。
- 开启JavaScript的三种屏宽均实际点击两篇日语教程和日语工具首页后返回，标题/目的canonical/语言及上传控件符合目标；另对两篇教程直接打开和刷新。日语本篇切到英语同slug、刷新及返回通过。独立托管Chromium另验1440/320实际页面和截图，日文字形、比较表移动端排列、canonical、三条FAQ及无横向溢出通过。
- 1440和390屏宽下实际上传工作JPEG，像素尺寸12、无调色板、关闭自动调色板/抖动/网格，以PNG原生像素尺寸下载；两次均80×63，完整解码RGBA与展示PNG一致。该结果限受验Chromium141会话，不保证各浏览器原生像素相同；未执行Firefox/WebKit或竞品共同实验，没有新增永久测试或声称运行整个测试套件。
- 证据保留在`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-ja-comparison-UocvUv/`：`before-fix.json`、`initial-link-failure.json`、`initial-visual-2-pages.json`、`runtime-smoke-proof.json`、`scope-and-build-proof.json`、`final-body-links.json`、`visual-2-pages.json`、真实下载和截图。初次链接失败及最终成功均保留，不放宽断言掩盖问题。未提交、推送、部署、请求收录或报告新稿搜索增长。
- 收尾已关闭本轮专用浏览器和前后两个预览服务，删除临时GSC和运行烟测脚本。隔离构建副本、初次链接失败诊断、最终成功报告、真实下载及截图保留，供后续发布前复查。

### 批外问题记录

- `src/content/blog-posts.ja.json`入门篇（当前139行）仍写Aseprite旧价格`$19.99`，本轮未核实为当前价格；动画篇（当前326行）仍将本站列为“変換と基本アニメーション”，与现有无动画能力冲突。两篇源保留，已知问题待单独授权范围处理；本轮链接验收不等于已审查并纠正它们的全部正文。
- `public/locales/ja/translation.json`的`adjustments.palette.note`仍有重复文字及将非Pico-8命名预设概括为自动生成的旧说明；语言选择控件实际aria-label仍为`Select language`。记录为日语公共语言资源的后续事项，不为本篇扩大修改首页或其他页面。


## 2026-10-13 西班牙语工具比较篇纠错（本地验收完成，未发布）

本轮只处理`/es/blog/best-pixel-art-converters-compared-2025/`，主要内容源为`src/content/blog-posts.es.json`中的B1。改稿前已核对源码及隔离构建真实HTML：旧文仍声称测试十款工具、给出无实测依据的评分，错误列出本站PNG/GIF/SVG导出。旧源描述253字符，旧构建描述被自动截断；不能用截断结果代替合格完整文案。西班牙语其余四篇、首页、语言资源、前轮PL/NL/IT与共享导出修改均保留，不提交、不发布、不请求收录。

### 改稿前搜索映射与事实依据

|目标网址|目标语言主词|搜索意图|返回query与完整日期窗口|证据与限制|定位是否改变|
|---|---|---|---|---|---|
|`/es/blog/best-pixel-art-converters-compared-2025/`|`convertidores de pixel art`，辅助`editor de píxeles`、`animar sprites`|按照片转换、手绘像素和动画用途选择工具|2026-09-12至2026-10-09，web/final；query/page未返回行|`docs/GSC_ES_COMPARISON_BASELINE_2026-10-13.json`：目标page为0点击/9曝光；Inspection已收录且Google canonical为自身。主词为内容编辑判断，不是已返回搜索词或搜索量|保留工具比较任务；去除无法证明的质量排名与十工具测试，不改变为其他页面主题|

只对本篇做URL Inspection、page、query/page三次只读请求，全部HTTP200；28个完整日期证据复用既有已保存响应，不查询其他canonical流量。窗口早于本轮修改，不能作为修复效果。

按已验收比较篇的四工具模型复用Pixel Art Village、Aseprite、Piskel和GIMP；2026-10-13重新读取Aseprite及Piskel官网、GIMP的Pixelize与Save/Export官方说明。官方功能说明不当作共同照片实测。本站案例复用有出处的向日葵JPEG960×762及真实PNG80×63，保留参数、许可和单会话边界；需要的新西班牙语分享图沿用现有生成器，不开发或更改共享逻辑。

### 本轮交付与验收

- 只重写西班牙语B1：比较四款工具的功能和用途，不再声称共同照片测试、十工具实测、质量排名或未经证明的评分；标明本站作者身份和2026-10-13官方来源核对时间。本站格式更正为PNG/JPEG/WebP，并说明不提供动画GIF或SVG导出。其他三款工具只有官方资料核对，没有运行或做效果、速度对比。
- 保留原网址及2025-11-01发布日期，更新时间为2026-10-13。正文、比较表、三条FAQ、案例参数、作者链接、案例下载及同语言相关文章链接已补齐；文章展示字段保留在这一内容对象，不修改语言资源或共享模板。向日葵案例说明工作JPEG为960×762、实际PNG为80×63，不把工作图片尺寸误写成Commons原始图片尺寸。
- 最终完整搜索标题为`Convertidores de pixel art: comparativa | Pixel Art Village`，59字符（含程序追加品牌、空格和标点）。完整描述为`Compara cuatro herramientas de pixel art para fotos, dibujo y animación. Revisa funciones, límites y un PNG real; no es una prueba de calidad conjunta.`，151字符。源码完整文案、构建HTML、运行后及刷新后的description/OG/Twitter描述均一致，没有依赖截断凑长度。
- 只新增`public/blog-og/es/best-pixel-art-converters-compared-2025.png`，1200×630；由既有生成器生成。HTTP200、图片解码及441×350的结果图区域逐像素核对通过，确为本文80×63 PNG的最近邻放大；已查看实际西班牙语文字和两张向日葵图片，没有改生成器或复制其他语言生成资源。
- 修改前隔离构建与浏览器确认旧标题、正文“Probamos 10”及错误的PNG/GIF/SVG说明仍存在。修改后Node20隔离运行`npm run build`通过，包括构建自带`verify-dist`与缓存/重定向检查。使用现有`scripts/build/serve-dist.cjs`预览，不改根目录`dist/`或sitemap。
- 临时真实浏览器验收通过六组：1440/390/320像素屏宽，各自JavaScript关闭/开启。覆盖Blog列表进入文章、刷新、标题/完整描述、唯一canonical、自身西语hreflang、无noindex、四工具比较表、可见三条FAQ及对应FAQPage、BlogPosting、作者、原图/结果图尺寸、示例PNG实际下载、同语言链接HTTP200和横向不溢出。开启JavaScript时进一步点击相关文章再返回本篇。英文同slug切换、刷新与返回西班牙语另行通过。
- 1440和390像素屏宽下，实际上传工作JPEG，设置像素尺寸12、无调色板、关闭自动调色板/抖动/网格，以PNG原生像素尺寸下载；两次均为80×63，解码完整RGBA与已展示PNG一致。该结果来自已安装Playwright Chromium会话，不承诺其他浏览器原生处理逐像素相同。没有做Firefox/WebKit或其他工具的共同实测，也没有新增永久测试。
- 既有“Spanish beginner article retains its existing content and cover”回归用例1项通过，重试为0，测试源未修改。独立托管Chromium另验1440/320像素实际页面、HTTP200、语言、三条FAQ、SEO值和不溢出，并保存截图。首次复用临时意大利语截图函数时仍带`/it/blog/`路径，错误等待西班牙语标题而超时；只纠正临时函数路径与语言条件后通过，没有据此修改产品代码或放宽断言。
- 两次构建的225个HTML逐页对比：SEO标签/JSON-LD差异仅出现在本篇及`/es/blog/`列表。本篇标题、摘要等经既有相关文章展示传播，使西语颜色理论篇、技巧篇和列表正文出现差异；不是重写其他文章。西班牙语其余四篇内容源按字节保持一致；13个受保护文件按字节核对无变化，包括首页规则、语言资源、PL/NL/IT文章、共享图片处理、原有测试、根目录sitemap和`dist/index.html`。所有首页SEO保持不变。
- 验收资料保留在`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-es-comparison-OqVWfk/`：`before-fix.json`、`runtime-smoke-proof.json`、`scope-and-build-proof.json`、`visual-2-pages.json`、既有回归JSON报告、下载PNG及截图。构建完整输出为`artifact://239`。本轮只形成本地修改；没有git提交、推送、部署、请求收录或声称获得修复后的搜索增长。


- 收尾已关闭本轮独立浏览器和前后两个预览服务；删除三个临时执行文件（GSC脚本、运行验收脚本、临时Playwright配置）。前后构建副本、失败路径诊断、成功报告、下载和截图保留，供后续发布前复查。

## 2026-10-13 意大利语已发布五篇的必要复查（本轮本地修改已验收，未发布）

用户在暂缓五个首页再次优化之后，选择“继续修意大利语五篇”。先核对历史：这五篇及五张分享图已随2026-10-11的`e733f09`正式发布，后面的部署回执优先于较早的“本地完成”阶段记录。本轮不重写、不重复计算为新增五篇修复；主内容源仍为`src/content/blog-posts.it.json`，只修现存问题，保留其他未提交工作。

### 本轮修改与保留

- B1工具比较、B2复古限色：正文、搜索标题、描述及更新时间均未修改；原有四工具说明、来源与固定/自动调色板纠错保留。
- B3效果排错：透明控件名改为`Sfondo trasparente (PNG)`，说明当前JPEG/WebP输出使用白底；补充PNG放大不平滑、缩放只影响显示、启用网格后仅在放大导出且两边单元尺寸均至少2像素时写入网格。补充已发布下载只代表受验会话，不保证各浏览器的原生像素完全一致。
- B4 Illustrator：只同步PNG透明控件名，保留“依据Adobe文档、浏览器单独绘制尺寸图、实际转换器下载”的区别及10月11日来源日期，不声称本轮运行过Illustrator。
- B5入门：描述从149字符改为153字符；明确最大10 MiB，即10 485 760字节本身允许上传，保留长边超过2200像素的等比预处理，不再笼统声称所有界面都写10MB。
- B3/B4/B5的更新时间改为2026-10-13。五篇标题、原发布日期、slug、封面、分享文案和图像路径均保留。五张1200×630意大利语分享图与候选构建逐文件相同，无需重新修改。
- `public/locales/it/translation.json`只改九项直接涉及操作的叶子：三个输入错误、条件网格颜色、导出说明、PNG透明控件、语言选择、预览替代文字及处理中状态。已完成的固定调色板说明和`Numero di colori`标签不重做；尺寸按钮英文名按现有控件保留，教程与新增说明注明这一点。
- 只调整`tests/blog.spec.js`的意大利语段：删除固定日期、任意正文句子、调色板字面文案和默认值断言；保留实际路由、SEO、FAQ、图片下载、同意选择、字节边界、色数上限及透明像素检查。标题和三种描述的长度断言读取真实页面值；自动调色板按当前滑块值操作到24，不依赖默认16。

### 最终完整搜索标题与描述长度

以下包含品牌、空格及标点，构建HTML与真实浏览器的对应值均核对。未修改标题字段，不重复追加品牌。

|文章|完整标题字符数|完整描述字符数|
|---|---:|---:|
|B1 工具比较|55|152|
|B2 复古限色|59|151|
|B3 效果排错|59|153|
|B4 Illustrator|59|151|
|B5 图片像素化入门|59|153|

B5最终完整标题：`Come pixelare un’immagine e salvare PNG | Pixel Art Village`。最终完整描述：`Impara a caricare una foto, regolare Dimensione pixel e salvare PNG dopo la nuova anteprima. File PNG reali 120×95 e 80×63 distinguono dimensioni e zoom.`。

### GSC只读复查

保存`docs/GSC_IT_BLOG_BASELINE_2026-10-13.json`，保留10月11日旧基线。只查询五个意大利语URL，各做一次URL Inspection、page维度和query/page维度，共15次请求，全部HTTP200；没有请求收录，没有查询其他语种或把其他canonical流量归入意大利语。Search Analytics使用2026-09-12至2026-10-09的28个完整日期、web/final；完整日期证据复用10月12日已保存的全站日期响应。

最新Inspection五篇均为`Submitted and indexed`，Google canonical均为本篇意大利语网址。B1/B3在该统计窗口没有返回page/query行，不将空结果写成精确零流量。B2为2点击/85曝光、9条query行；B4为0/33、3条；B5为0/51、4条。此窗口早于10月11日发布，且与旧窗口不同，不能据此评价发布后增长。B2最后抓取仍为10月10日，也不能把“已收录”视为五篇都已读取新正文。本轮修改尚未上线，当前索引状态不是本轮修改的效果。

### 本地验收、失败定位与范围

隔离目录为`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-it-local-FYCvWD/`。基线与候选均用Node20、`VITE_E2E=0`、分析关闭执行正常`npm run build`，包括预渲染和构建产物检查，通过；真实工作树的`dist/`和两份sitemap未重建或修改。

入门描述回归在旧构建准确失败：要求至少150，实际149；候选真实值153。最终使用项目`playwright.config.ts`指定的`scripts/build/serve-dist.cjs`验收服务器，既有意大利语46项全部通过，0重试、0跳过，涵盖五篇×1440/390/320像素×初始HTML/运行态、五张OG、六个工具流程、四个同意选择流程和语言切换。另用独立Chrome150保存五篇桌面/手机共十张真实整页截图，HTTP200、正确语言与元数据、图片可读，无横向溢出；目视核对导出说明及条件网格控件。

最初误用Vite preview时，45项通过，语言切换一项失败。实际HTTP定位证明：无尾斜杠的英文/意大利语文章路径被返回为首页HTML，SEO组件按现有规则拒绝错误页面，因此canonical缺失。改用既有项目静态服务器后，同一测试不改断言、不加等待、不加重试即通过；两种路径均返回正确文章，独立桌面/手机切换、刷新、返回也保持正确canonical，无SEO错误。原失败报告、截图、视频及两种服务器的HTTP证据保留；未据此修改共享SEO代码或误报为生产业务修复。

Chrome150实际上传、调参、下载共52份文件：尺寸、四种输入、三种静态输出、色数上限、PNG透明像素、JPEG/WebP不透明白底、显示缩放、网格、10 MiB含边界及2200长边处理均受验。六个同会话PNG放大文件与原生文件的纯像素重复逐RGBA通道完全一致。JPEG/WebP为有损编码，解码白区有轻微通道变化，不把JPEG角点必须精确255作为契约。与既有Chromium141原生参考的十项像素差异另行记录，不称完全复现；Chromium141既有实际参考下载比较通过。未确定差异根因，不归因于palette worker，也不改共享处理器掩盖差异。

225页构建对比：SEO标签/JSON-LD只变化三篇实际修改文章及意大利语Blog列表；首页SEO和其他语种不变。共享意大利语语言控件属性使十二个意大利语页面的正文HTML有变化，其余页面未变。B1/B2源对象、五张OG、PL/NL前轮源与控件、共享导出处理器、项目规则、真实工作树sitemap/dist及意大利语以外的测试内容均保持原样。

证据保留于上述目录的`delivery-proof.json`、`before-regression-report.json`、`final-existing-test-report.json`、`52-download-pixel-proof.json`、`225-page-scope.json`、`visual-10-pages.json`、`navigation-proof.json`、截图和下载文件；原失败另在`existing-test-report.json`及相应结果目录。临时执行脚本、配置和自建预览进程在验收后清理，保留证据。没有人类母语审校、Adobe应用运行、Firefox/WebKit或实体设备验收；没有提交、推送、部署或索引申请。五个首页重新优化仍暂缓。

## 2026-10-13 荷兰语五篇文章纠错与本地化（本地受验，未发布）

用户在波兰语与共享导出修复之后，明确选择“继续修荷兰语五篇”，没有选择提交发布。本轮主内容源仅为 `src/content/blog-posts.nl.json`，另改十一项直接涉及教程操作的荷兰语控件文案，生成五张荷兰语分享图，并保存只读 GSC 基线。保留原五个 slug、发布日期和前轮未提交修改，更新时间为2026-10-13。没有重写首页 SEO、其他语言内容、About、共享处理器、渲染器、构建脚本或测试；没有提交、推送、部署、请求收录。

### 内容范围与搜索依据

开始前在独立 Chromium 读取正式荷兰语比较篇：HTML语言为nl，但标题、H1及正文是英语，且实际出现 `We tested 10`。现在五篇正文、FAQ、图注、下载标签、相关文章、作者和分享文案均为荷兰语。比较篇按 Pixel Art Village、Aseprite、Piskel、GIMP 的不同任务说明，删除虚构十工具测试、评分和排名，披露网站运营方身份。SNES仅表示视觉风格，不承诺硬件兼容；Illustrator篇区分官方文档、尺寸算例、单独绘制的浏览器几何图和真正的转换器下载，不声称实际运行过Adobe。

| 保留的slug | 荷兰语主题词（编辑判断，不是GSC返回query） | 页面任务 |
|---|---|---|
| best-pixel-art-converters-compared-2025 | pixelart-converter / pixeleditor / tools vergelijken | 按转换、手绘、动画需求选工具 |
| how-to-get-pixel-art-version-of-image | pixel art in SNES-stijl / kleurenpalet / dithering | 图片的复古视觉、尺寸和限色 |
| make-image-more-like-pixel | pixel art verbeteren / dunne lijnen / exportproblemen | 按丢线、颜色、点纹和导出症状排查 |
| export-from-illustrator-image-to-pixel-art | PNG uit Illustrator / pixelafmetingen / transparantie | 先准备正确源PNG，再决定是否像素化 |
| how-to-pixelate-an-image | afbeelding pixeleren / pixelgrootte / PNG downloaden | 从上传、调参、等待预览到保存PNG |

沿用已验证的只读服务账号Tier1，通过官方Search Analytics与URL Inspection API查询上述五个荷兰语URL，共15次请求、全部HTTP200。窗口为2026-09-12至10-09、web/final；28个完整日期证据复用 `docs/GSC_TL_BLOG_BASELINE_2026-10-12.json`，不冒充新取的最新窗口。五页的page和query+page均未返回行，不写成零点击或零曝光，也不据此制造热门词。复古篇与Illustrator篇已收录且Google规范网址为自身；比较篇选择sv同slug、排错篇选择nb同slug、入门篇选择id同slug。声明canonical仍保留各自nl网址，没有请求其他语言规范页的流量数据，没有改canonical或发送收录请求。完整请求、状态、时间和响应保存在 `docs/GSC_NL_BLOG_BASELINE_2026-10-13.json`；这些状态反映正式旧页面，不是本地新稿的索引结果。

比较工具和Adobe说明复用此前核实的官方来源；本轮又读取Aseprite、Piskel首页、GIMP Pixelize及Adobe导出文档。文章保留既有12日来源核对日期，不冒充四工具同图实测，也不使用旧价格、广告或绝对隐私承诺。素材复用真实向日葵JPEG960×762、Pixel8/12输出、同会话24色dithering对照、浏览器几何图512/64，以及真实细线4/16和透明Pixel8下载；没有新增假图或把64浏览器源图说成512缩小副本。

### 最终SEO文案与长度

以下标题包含程序追加的 ` | Pixel Art Village`，按Unicode字符计数；描述为完整excerpt，未靠155字符截断达标。构建HTML和真实浏览器的title、description、OG与Twitter均逐项核对一致。

| 页面 | 最终完整搜索标题 | 字符数 | 最终完整描述 | 字符数 |
|---|---|---:|---|---:|
| 工具比较 | Pixelart-converter of editor kiezen \| Pixel Art Village | 55 | Kies uit vier pixelart-tools voor fotoconversie, tekenen of animatie. Bekijk functies, beperkingen en een echt PNG-voorbeeld, zonder ranglijst of scores. | 153 |
| 复古限色 | Pixel art in SNES-stijl: kleur en maat \| Pixel Art Village | 58 | Maak pixel art in SNES-stijl met minder kleuren en duidelijke blokken. Vergelijk echte PNG-bestanden, pixelgrootte en dithering, zonder consolegaranties. | 153 |
| 效果排错 | Pixel art verbeteren: lijnen en kleuren \| Pixel Art Village | 59 | Verbeter pixel art door verdwenen lijnen, samenvallende kleuren en storende stippen te onderzoeken. Vergelijk echte PNG-bestanden en pas instellingen aan. | 154 |
| Illustrator导出 | PNG uit Illustrator: formaat en export \| Pixel Art Village | 58 | Bereid een PNG uit Illustrator voor met de juiste afmetingen, schaal en transparantie. Leer wat PPI doet en wanneer je de afbeelding verder wilt pixeleren. | 155 |
| 入门 | Afbeelding pixeleren: je eerste PNG \| Pixel Art Village | 55 | Pixeleer je afbeelding stap voor stap: kies een bestand, stel pixelgrootte en palet in en download PNG. Bekijk echte voorbeelden en de grenzen van de tool. | 155 |

### 控件、构建与真实页面

`public/locales/nl/translation.json`仅九个已有值及两个缺失叶子变化：三项格式/大小错误、固定与自动调色板说明、自动颜色上限、预览alt与处理中状态、仅PNG的透明度标签、语言选择器，以及新增Rasterkleur和export.note。准确写明PNG/JPEG/GIF/WebP输入、10MiB的含边界限制，颜色数为上限而非必定达到。保留 `Toon raster` 和现有英文导出尺寸按钮名。首页实际覆盖tool.supports，所以没有借未使用字段扩成首页补译；首页英文hero、About和其他语言问题继续按原授权边界暂缓。

使用已安装Node20.19.0，在隔离基线/候选副本按 `VITE_E2E=0`、`VITE_ENABLE_ANALYTICS=0`完整构建；末次正文边界补充后再次build，ownership、SEO、verify-dist、cache/redirect检查均通过。本轮lint/typecheck通过。真实页面矩阵为五篇×1440/390/320宽度×开关JavaScript，共30组合：HTTP200、单H1、nl语言、canonical/hreflang、无noindex、完整SEO/社交值、BlogPosting/可见FAQ对应、作者与内部nl链接、图片/下载资源及无整页横向溢出均核对。15个启用JS场景刷新后保留页面身份和拒绝Cookie选择；末次排错说明另重验该页六组合及三次刷新。已查看五篇桌面、手机标题封面、窄屏FAQ、手机比较表卡片、末次排错说明及五张1200×630分享图。

1440/390两种宽度完成荷兰语入门→英语→刷新→历史返回荷兰语→Blog列表→同篇→刷新的真实交互。320/390额外检查自动颜色上限长标签、处理中荷兰语状态、导出说明与PNG透明标签的实际可见性，标签边界均在控件面板内。复用已有 `tests/sprite-locales.spec.js` 的nl真实上传/38×38透明PNG导出用例，1/1通过、零重试；没有复制另一套永久语言测试。

### 下载证据与浏览器边界

Chromium150.0.7871.24在1440/390完成48次真实按钮下载：几何细线/透明输出、PNG四种尺寸、Zoom、开关网格、白底、照片Pixel8/12、自动24色与dithering、Sunset8，以及四种输入和PNG/JPEG/WebP输出。核对实际格式/尺寸、透明与半透明像素、颜色数上限、同会话dithering差异、网格边界与格内像素。六份放大PNG全图RGBA等于同会话原生像素的精确扩展；Zoom下载一致、Pixel size不写网格。准确10,485,760字节输入成功，+1字节和SVG被拒绝并显示荷兰语错误；2300×1150输入在处理前变为2200×1100。

没有将跨浏览器例图差异算成逐像素通过：Chromium150的十份原生下载与既有PNG样例不完全相同，细线4在旧阈值220下可见带数为2而非样例的3。另用已安装Playwright Chromium141.0.7390.37，在1440/390实际下载五种原生案例，共十份，完整RGBA均与公开样例一致。输入文件在工作区与候选副本字节相同。只读源码旁查确认原生缩小在主线程canvas，K-Means worker仅生成颜色中心；共享导出平滑修复不修改原生缓存。浏览器结果差异的具体原因未确定，不能只凭版本相关性声称解码或canvas回归。排错篇已明确既有样例不保证每个浏览器逐像素相同，要求检查自己的PNG；本轮没有为此修改共享算法。

一次性验收脚本首轮等待未滚到的懒加载图片、要求无调色板的dithering关闭后像素改变、以及在SPA列表尚未替换文章时数到相关文章卡片，均是等待条件错误。后续改为对应的资源/状态/完整页面身份条件才取得上述完成记录。跨浏览器像素与旧带数阈值的不一致仍原样保留，没有用色差容差或改阈值伪造通过。

### 修改边界与交付状态

末次225份HTML对照：元信息/JSON-LD只变nl五篇及其Blog列表ItemList；其他语言与所有首页SEO不变。正文变化除nl五篇和列表外，nl首页/About/Contact/Privacy/Terms/Sprite仅为共用语言选择器的 `Select language`→`Kies een taal` 属性替换，逐页归一后完全一致。前轮波兰语源、locale、共享导出源、tests/blog及AGENTS逐字节保留。工作区dist/index和两个站图时间仍为10月11日，早于本轮开始；隔离构建没有覆盖它们，交付源码与受验候选一致，五张分享图已复制到工作区并与最终构建一致、对应本地HTTP200。

未进行荷兰语母语人工审校、实际Illustrator会话、Firefox/WebKit、实体手机、广告开启、正式发布或新稿索引效果验证。不能据本地验收承诺曝光恢复或排名提升。五个首页再次优化继续暂缓，波兰语与共享导出修复仍保留为本地未发布改动。

证据目录 `/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-nl-local-E9nDep/` 保存隔离源码、最终交付JSON、30组合与末次复验、导航、48次下载和像素结果、Chromium141十份样例核对、已有测试报告、条件控件截图、分享图及225页范围记录。已清理本轮六个一次性执行脚本/测试配置，关闭自有浏览器并停止 `nl-candidate-e9ndep` 预览服务；报告、截图、下载与隔离副本保留，没有操作其他会话或个人登录浏览器。

## 2026-10-13 共享2×/4×导出平滑问题修复（本地受验，未发布）

用户在波兰语五篇完成后，对“优先修共享放大导出问题”回复“继续”。本轮只改 `src/utils/imageProcessor.js` 的导出画布状态顺序、增强 `tests/blog.spec.js` 两个已有桌面/手机网格导出用例、更新波兰语效果排错与入门正文各一段，以及本记录。不新开语言批次，不重新优化五个首页，不提交、推送、部署或请求收录；保留前轮和其他任务的未提交修改。

根因是 `exportProcessedBlob` 在赋 `out.width/out.height` 之前设置 `imageSmoothingEnabled=false`，尺寸赋值将绘图状态重置，后续放大又使用默认平滑。现已删除过早设置，在正常缓存分支和无缓存解码分支中，都先定尺寸，再关闭平滑，再填背景/绘图。API 参数、缓存来源选择、尺寸倍率、格式、质量、背景、网格和 Zoom 逻辑不变，没有增加特殊图片判断或额外画布。修改前通过 LSP references 核对唯一实际调用方为 Editor 的下载逻辑，调用接口保持兼容。

### 修复前后证据

复用现有真实透明几何图512×512、Pixel Size8，原生 PNG64×64同时包含不透明、透明及半透明像素。已有网格用例增加无网格下载的完整 RGBA 最近邻比较，覆盖 Original size512×512、2×1024×1024、4×2048×2048，同时保留网格边界/格内像素、Pixel size不画网格、Zoom不影响导出的原断言。预期直接重复原生 PNG 的 RGBA 字节，不允许颜色或 alpha 误差，没有新增重复永久测试。

同一测试在隔离旧代码基线的2×下载处失败，零重试；修复代码的1440与390宽度两项均通过，2/2、零重试。实际下载全图对照：旧2×有41669像素不等于最近邻扩展，修复后2×和4×分别为0。已查看真实下载的同位置高对比边缘图，左侧旧版有平滑过渡，右侧修复版是清晰色块；不是只验证 setter 或源码字符串。两个用例共18次实际 PNG 下载，包含有/无网格和 Zoom 对照。

另用真实上传/下载 smoke 完成16次下载：透明几何图 PNG 四种尺寸，以及960×762向日葵的 PNG/JPEG/WebP 各四种尺寸。原生输出与已有公开例图逐像素一致；透明图2×/4×及非正方形照片2×1920×1524、4×3840×3048的 PNG，全图 RGBA 均等于 Original size的精确最近邻扩展。JPEG/WebP 验证实际格式与尺寸，不承诺有损编码的逐像素颜色相等。合计34次修复版真实下载；没有把失败基线下载计入通过数量。

首轮测试参照使用 Sharp 的 nearest resize，半透明RGB因预乘处理降低1，导致本来正确的512输出也失败；探针确认实际下载相对原生扩展为0差异，而参照有2176像素差异，例如alpha127的 `[237,253,245]` 被参照改成 `[236,252,244]`。保留首轮失败截图、视频、trace与报告，改为精确复制 RGBA 字节后，才取得上述真实的旧版2×失败/修复版通过证据。没有放宽断言或将源缺陷归为参照错误。

### 文案、构建与范围

功能证明后，撤去波兰语效果排错和入门两段“2×/4×可能平滑”的临时限制，改为明确 PNG 使用最近邻放大、不恢复丢失细节。没有改其他正文、标题、excerpt、slug、日期、FAQ或分享图。最终两篇手机真实页面均HTTP200，标题分别55/56字符、描述均153字符，正确说明可见、旧警告不再出现、scrollWidth390；最终工具实际上传透明图并查看 Pixel Size8预览和控件。

使用已安装 Node20.19.0，生产式 `VITE_E2E=0`、`VITE_ENABLE_ANALYTICS=0`，在隔离副本完成修复版构建与文案清理后的最终构建；build内 ownership/SEO/verify-dist/cache/redirect 检查、最终 lint/typecheck 均通过。工作区dist和两个原有站图未被构建脚本覆盖。225份最终 HTML 与本轮基线对照，所检查的元信息/JSON-LD无差异，去script正文仅上述两篇变化；首页和其他语言内容不变。共享下载功能的改变通过实际转换下载验证，而不是期待其出现在静态HTML中。

Chrome/Chromium已验证；本机缺少 Playwright Firefox/WebKit，未安装、未运行，不声称三浏览器通过。手机为390宽度模拟，不是实体设备。正常缓存下载路径已覆盖，无缓存路径按相同顺序修正但未单独强制调用；未验证广告开启、正式上线、新版索引或排名。

证据目录 `/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-export-fix-LAiVkL/` 保留旧/新源码副本、首轮参照失败、真正失败基线与通过报告、16次额外下载及结果、全图像素差异、真实边缘对照和225页内容范围记录。验收后删除临时执行脚本/测试配置并停止本轮自有预览，不删除结果，不接管个人登录浏览器或其他预览。上一节的共享导出待修项现已本地修复；正式站点仍未发布这项修复，五个首页再次优化继续暂缓。

## 2026-10-12 波兰语五篇文章纠错与本地化（本地受验，未发布）

用户暂缓五个首页的再次优化，随后对“先修波兰语五篇文章”回复“执行”。本轮只修改 `src/content/blog-posts.pl.json` 的原五篇、九项必要波兰语控件文案、五张波兰语分享图，以及一条语言导航回归测试；保留原 slug 和发布日期，更新时间为2026-10-12。没有重写首页、其他语言、About 或 converter 的内容源，没有修改共享转换、渲染或构建代码，没有提交、推送、部署或发送收录请求。

### 范围、依据与搜索意图

开始前独立 Chromium 读取正式波兰语比较页，实际看到 `lang=pl` 但标题和正文为英语，正文包含 `We tested 10`。本轮不是仅替换标题：删除虚构工具、评分、测试经历、导出能力及操作步骤，按已核实功能重写完整波兰语正文、FAQ、图注、下载标签、相关文章和作者链接。比较篇改为 Pixel Art Village、Aseprite、Piskel、GIMP 四种不同任务的工具说明，披露网站运营方身份，不冒充四工具同图实测或独立排名。SNES 只表示视觉风格，不声称生成可直接用于主机的资源。

| 原 slug | 本轮波兰语主题词（编辑判断，不是已返回 query） | 保留的搜索意图 |
|---|---|---|
| best-pixel-art-converters-compared-2025 | narzędzia pixel art / porównanie | 按转换、手绘、动画任务选择工具 |
| how-to-get-pixel-art-version-of-image | pixel art w stylu SNES | 图片的复古风格、尺寸、限色与 dithering |
| make-image-more-like-pixel | poprawa pixel art / kontury i kolory | 排查细线丢失、颜色合并、点状噪声和导出问题 |
| export-from-illustrator-image-to-pixel-art | eksport PNG z Illustratora | 区分 Adobe 导出尺寸、PPI、透明度与后续像素化 |
| how-to-pixelate-an-image | jak pikselizować obraz | 从上传、等待预览到下载 PNG 的入门流程 |

修复前以既有只读服务账号和环境变量引用凭据，uv 离线复用依赖，限定这五个 URL 的 URL Inspection、page、query/page 共15次官方 API 请求，全部 HTTP200。原始请求和响应在 `docs/GSC_PL_BLOG_BASELINE_2026-10-12.json`。窗口为2026-09-12至2026-10-09、final、28个完整日期；日期完整性复用当天同资源同窗口已有响应，不新增全站查询。五篇 query/page 均未返回行，不能写成零搜索需求或已验证关键词量；没有把 Google 关联的其他语言规范页统计归入波兰语。

| 文章 slug | 旧版索引记录 / Google 规范页 | page 统计（点击 / 展示 / 平均位置） |
|---|---|---|
| best-pixel-art-converters-compared-2025 | 已收录，本篇 pl | 0 / 2 / 5 |
| how-to-get-pixel-art-version-of-image | 已收录，本篇 pl | 0 / 2 / 6 |
| make-image-more-like-pixel | 重复，同 slug 的 nb | 未返回行 |
| export-from-illustrator-image-to-pixel-art | 重复，同 slug 的 it | 0 / 1 / 10 |
| how-to-pixelate-an-image | 重复，同 slug 的 id | 未返回行 |

这些是修改前线上旧版的记录，不是新版抓取、规范改选或效果评估。凭据缺失环境变量导致的第一次脚本启动错误已纠正，没有据此更改账号或站点权限，也没有将秘密字段写入记录。

核对了 [Aseprite 官方文档](https://www.aseprite.org/docs/save/)、[Piskel 官方页面](https://www.piskelapp.com/)及项目导入/保存源码、[GIMP Pixelize 文档](https://docs.gimp.org/3.0/en/gimp-filter-pixelize.html)、[Adobe 导出说明](https://helpx.adobe.com/illustrator/using/exporting-artwork.html)、[Export for Screens](https://helpx.adobe.com/illustrator/using/collect-assets-export-for-screens.html)与像素对齐说明。Illustrator 部分是官方文档参考和明确标注的尺寸计算，没有实际运行 Adobe。向日葵来源为 [Don McCulley 的 CC0 图片](https://commons.wikimedia.org/wiki/File:Sunflower_Public_Domain.jpg)；960×762 本地版本、尺寸8/12输出、同会话24色 dithering 对照、浏览器生成的512/64透明几何图与细线输出均复用已有真实文件，不将浏览器图标成 Adobe 导出。

### 完整搜索标题与描述

下表为包含自动追加品牌的最终完整标题，以及完整 excerpt。标题55–60字符、描述150–155字符，均位于本项目150–160描述范围内；未借助构建截断满足规则。最终 HTML 和 JavaScript 运行时的普通、OG、Twitter 描述均与源文案一致。

| 文章 | 最终完整搜索标题 | 标题字符数 | 最终完整搜索描述 | 描述字符数 |
|---|---|---:|---|---:|
| 比较 | Narzędzia pixel art: porównanie 4 opcji \| Pixel Art Village | 59 | Porównaj cztery narzędzia do konwersji zdjęć, rysowania pikseli i animacji. Poznaj ograniczenia, oficjalne źródła oraz prawdziwy przykład PNG z konwertera. | 155 |
| 复古限色 | Pixel art w stylu SNES: rozmiar i kolory \| Pixel Art Village | 60 | Zamień zdjęcie w pixel art inspirowany SNES. Porównaj PNG 120×95 i 80×63, paletę 24 kolorów oraz dithering. To styl wizualny, nie dane gotowe dla konsoli. | 154 |
| 效果排错 | Poprawa pixel art: kontury i kolory \| Pixel Art Village | 55 | Znajdź przyczynę znikających linii, zlewających się kolorów i nadmiaru kropek. Porównaj prawdziwe PNG i popraw ustawienia bez obietnic odzyskania detali. | 153 |
| Illustrator | Eksport PNG z Illustratora: poradnik \| Pixel Art Village | 56 | Przygotuj PNG z Illustratora: sprawdź wymiary w pikselach, skalę i przezroczystość. Odróżnij PPI od rozmiaru pliku oraz eksport źródła od pikselizacji. | 151 |
| 图片入门 | Jak pikselizować obraz i zapisać PNG \| Pixel Art Village | 56 | Pikselizuj obraz od podstaw: wczytaj plik, ustaw rozmiar piksela i paletę, zaczekaj na podgląd i zapisz PNG. Poznaj limity oraz wymiary pobranego wyniku. | 153 |

### 配套修改和本地验收

`public/locales/pl/translation.json` 仅九个现有叶字段变化：`consent.privacy`、`tool.supports`、`errors.fileTooLarge10`、`errors.onlyPngJpg`、`errors.maxFile`、`adjustments.palette.note`、`adjustments.paletteSize`、`preview.alt`、`preview.processing`。说明 PNG/JPEG/GIF/WebP 输入、10MiB 边界、固定与自动调色板区别、自动色数上限，而非承诺精确色数。没有扩修首页上传提示、调色板导入对话框、About 等已有残留，也没有将真实控件的英文导出模式名伪装成不存在的波兰语标签。五张 `/blog-og/pl/<slug>.png` 均1200×630，已查看文字与源/结果图，无裁切；完整生成器只在隔离副本运行，仅复制这五张图回工作区。

使用已安装 Node20.19.0，在独立基线和最终副本构建；生产式 `VITE_E2E=0`、`VITE_ENABLE_ANALYTICS=0`，未操作工作区 `dist`。最终 build（含 ownership、SEO、verify-dist、cache/redirect 检查）、lint、typecheck 通过，站图检查通过，205项包含真实多语言入口。225份 HTML 范围对照中，元信息/JSON-LD 仅五篇与 pl Blog 列表引用变化；去 script 正文仅上述六页及 pl sprite converter 的上传说明变化，后者可由旧 `tool.supports` 精确替换成新文案解释。非波兰语页面无此类差异，波兰语首页 SEO 不变，原有 AGENTS 和两个站图工作区文件逐字节保留。

最终独立 Chromium smoke 完成30个文章场景：五篇 × 1440/390/320宽度 × 有/无 JavaScript；有 JS 的15个场景还刷新复查并保留真实 Cookie 拒绝选择。检查 HTTP200、H1、完整标题/描述、pl语言、canonical/hreflang、OG/Twitter图片、无 noindex、作者链接、可见 FAQ 与 FAQPage/BlogPosting、图片载入、文章内语言链接和横向溢出，且确认两篇新加的放大导出限制实际显示。另直接打开真实本地浏览器，查看五篇桌面/手机首屏、正文图、手机限制说明和分享图；不是仅依据构建脚本推断页面正确。

完成58次真实下载：16次文章资源字节对照，42次桌面/390宽度转换下载。图片尺寸8/12、细线4/16及透明8的 Pixel size 输出与已有公开例图逐像素一致；实际验证固定/自动调色板上限、dithering、透明与半透明像素、网格在放大下载中的边界/格内像素、Pixel size不画网格、Zoom不改变下载、JPEG/GIF/WebP静态输入、入口与编辑器拒绝非法/超限输入、恰好10MiB允许、3000×1500输入缩至2200×1100。合成图片仅用于格式和边界，不冒充教程实际照片。新增的 Polish beginner pl→en→刷新→返回pl→列表往返→刷新回归1/1通过、零重试；没有复制整批永久测试，也不声称此测试在旧版必然失败。

早期 smoke 保留失败记录：错误假设重新上传会将尺寸12重置为1；连续上传未等待结果更新；将含网格或二次放大的文件按无网格原始预览比较。修正上传同步和比较对象后，继续检查真实导出字节，发现下述共享问题，没有把全部失败归为脚本错误或删除证据。最终 smoke 的通过表示上述文章、边界及已说明的实际导出行为通过，不表示2×/4×最近邻承诺已修复。

### 已确认的范围外问题与交接

透明几何图512×512、Pixel Size8得到64×64后，Original size的512×512下载与最近邻展开完全一致；但2×的1024×1024有41669像素、4×的2048×2048有165777像素不等于最近邻展开，桌面和390宽度结果相同，差异包含不透明、透明及半透明边界，不只是颜色舍入。格中心颜色仍一致，额外网格与 Zoom 行为按各自下载对象检查。

根因在 `src/utils/imageProcessor.js` 的 `exportProcessedBlob`：318行先设 `ctx.imageSmoothingEnabled=false`，328–329行再赋 `out.width/out.height`，334行才 `drawImage`。设置画布尺寸会重置绘图状态，见 [MDN 说明](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/width)。共享导出面板的最近邻提示因此不能当作已实现的保证。本轮没有扩改这个所有语言共用的工具；仅在波兰语效果排错和入门正文如实说明2×/4×可能平滑，并建议需要硬边放大文件时下载 Pixel size 后使用最近邻缩放。下一项工具修复应在画布定尺寸之后、绘图之前设置 smoothing，并用真实放大 PNG 边缘/透明像素保留回归，不靠隐藏提示修复。

文案由模型辅助起草，主代理另行核对功能、来源、语义与实际页面；不是母语人工审校。没有验证真实 Illustrator、Firefox/WebKit、实体手机、广告开启状态、正式上线的新版本或 Google/必应重新抓取与排名改善。GSC 所示两篇自身规范、三篇异语言规范仍是旧版基线，不能据此判断本批已改善或无效。五个首页再次优化继续暂缓。

证据保留在 `/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-pl-local-T8mmD9/`：修改前运行时摘录、隔离基线/最终构建、225页范围对照、最终SEO字段、早期失败与最终 smoke JSON、真实下载、页面/分享图截图及导航测试报告。临时执行脚本和测试配置在验收后移除，结果证据保留；没有使用个人浏览器登录态，没有创建调度。当前交付是本地修改与受验内容，不是已提交或已发布。

## 2026-10-12 搜索标题与描述长度规则（仅文档，未发布）

用户规定：以后本项目修改 SEO 搜索标题时控制在 55–60 字符，搜索描述控制在 150–160 字符，并尽可能利用空间放入更多相关关键词。规则已写入 `AGENTS.md` 的 SEO / GSC 规则，对所有语言适用，区间包含两端；标题按最终完整值计数，包含自动追加的品牌、空格和标点，描述包含空格和标点，不按字节计数，也不以自动截断后的长度代替完整文案长度。

关键词必须符合页面主题、搜索意图和实际内容，优先核心词及相关词，保持各语言自然、准确、可读，不重复堆词、不加无关词、不用空话凑长度；不据字符长度或关键词数量保证曝光、权重或排名提升。这是用户确定的项目标准，不是 Google 官方固定字符上限。后续逐页修改时记录最终字符数，并核对构建产物和真实页面；正文 H1 不受搜索标题长度要求约束。

本轮只追加项目规则及本条迭代记录，不修改已发布的五个首页描述、英文 4K/8K 文章或其他页面，不批量补齐长度，不更改业务代码、生成器或站图，也不提交、推送或发布。仅文档修改，验证新增规则及原有内容保留，不运行构建或页面验收。

## 2026-10-12 西班牙语入门文章描述单页修复及发布准备

用户对“继续修这页描述，控制150–160字符”回复“继续”，授权单页内容源修改、定向发布和线上验收。`/es/blog/pixel-art-tutorial-complete-guide-2025/` 的excerpt改为 `Guía de arte píxel para principiantes: elige herramientas, configura el lienzo y la paleta, dibuja líneas y aplica sombreado para crear tu primera obra.`，按源内容和浏览器完整值核算共152字符。原文实际190字符，此前183是计数错误，已向用户更正并修正本地旧记录；原初始HTML为151字符、运行时为190字符。现有生成器上限155，新152字符低于上限，无须共享代码改造或自动截断，保留已发布57字符标题、H1、body教程、日期、标签和网址。

复用现有excerpt字段，不增加不存在的seoDescription机制。受验225页中，元信息仅目标description/og:description/twitter:description/BlogPosting.description及西语Blog列表对应ItemList.description变化；正文显示仅目标页首摘要、列表卡片、比较文章和进阶文章的相关文章卡片四处变化，所有body差异均可由旧摘要精确替换成新摘要解释，其余正文和所有标题均不变。这是同一内容源的引用更新，不修改这些文章自身的搜索描述。

初始隔离基线为a15667a；期间菲律宾语独立发布了 `0a3bcef5dd38aa7843df3acfe6b2b00867a281d9`，故重新从最新基线构造发布副本，不使用旧提交的验收代替当前版本。最新基线修改前后build、修改后lint/typecheck及保留的Spanish beginner测试通过（1/1、零重试）；全部西语静态页面与此前真实浏览器受验版本一致，最新副本再次验证桌面刷新、同文档列表往返、390×844手机与手机刷新四阶段。普通/OG/Twitter/schema描述、页首摘要和列表卡片均为完整152字符，标题保持57，canonical/es语言正确，手机scrollWidth=390。桌面/手机截图及手机完整摘要截图已查看，未改工作区dist。

发布范围仅 `src/content/blog-posts.es.json` 的一个excerpt及本轮ITERATION章节、旧标题准备记录中的字符计数更正；提交文档从最新HEAD构造，不带入其他任务未提交记录、AGENTS、站图或GSC文件，也不改永久测试。独立index与短时共享index锁核对受验字段、章节和HEAD，沿用main触发Cloudflare Pages项目pixelartvillage1。证据 `/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-es-description.6f_gkgky/`。当前为受验发布准备，最终部署及线上验收见后续回执；未发送收录请求，不声明Google/必应搜索结果已更新、旧警告消失或流量提升。

## 2026-10-12 菲律宾语五篇定向发布准备

用户在发布前合并验收完成、明确“可进入提交发布阶段”后回复“继续”，本轮按该范围定向提交、推送并验收正式页面，不请求收录或开始下一语言。发布基线为 a15667a4126c40f6fbca7d97ade1f3a427b79ef9，复用已受验的九份整文件及菲律宾语测试追加块；ITERATION 提交版从该基线仅加入本批菲律宾语章节，其他任务的未提交文档、站图、AGENTS 与 GSC 文件不带入。最新正常模式全量 Chromium 548/548、零跳过和重试，build/lint/typecheck/站图检查及 225 份 HTML 对照均已通过。沿用 main Git 集成触发 Cloudflare Pages，不直接上传工作区 dist 或修改云端配置。最终提交、部署身份及正式验收结果以随后回执为准；此准备记录不等于上线成功。

## 2026-10-12 菲律宾语五篇发布前合并验收（本地通过，未发布）

用户对“先完成菲律宾语这一批的发布前合并验收，不换下一语言”回复“执行”。本轮只做隔离合并、构建、回归和记录，没有提交、推送、部署或请求收录，也没有新增业务修改或永久验收流程。Illustrator 官方文档参考继续明确标注未实测；用户已确认没有软件或素材，此缺口不作为本轮阻碍。

最初以 f2c675d 归档副本合入菲律宾语五篇、作者页文案、五张分享图、仅 tl 生效的 Breadcrumb 及现有菲律宾语测试块，正常模式 Chromium 全量 548/548 通过、零跳过、零重试，耗时约 6.6 分钟。期间其他任务将 main 更新为 a15667a4126c40f6fbca7d97ade1f3a427b79ef9，因此重新以该最新本地及远程基线构建受验版本，未用旧基线结果替代最新验收。候选共九份整文件及一个测试追加块；测试前缀使用已提交 a15667a 版本，保留该提交的西班牙语标题修复，不混入其他未提交工作。候选九份文件和菲律宾语测试块与当前工作区逐项一致。

最新候选使用 Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 构建，完整 build（含 SEO/dist 检查）、lint、typecheck、sitemap:verify 均通过，站图 205 项。EXPECT_CONSENT_BANNER=1 下 Chromium 全量 548/548 通过，零跳过、零重试、零失败，耗时 321.659 秒。上一轮 21 个失败中的两项作者页描述截断已在之前修为 154 字符；其余 19 项与 E2E 模式强制显示编辑器的行为冲突，33 项跳过与该模式隐藏 consent 有关。本轮用真实正常构建验证通过，未削弱断言或覆盖历史失败记录。

与同 SHA 的未修改正常构建对照 225 份 HTML：七份 tl 页面元信息及正文变化（五篇文章、Blog 列表、about），另两份 tl 页面仅因复用菲律宾语提示或文章链接发生正文变化（首页和 photo-to-sprite-converter）。其余 216 份 HTML 的元信息及去除 script 后的正文一致，没有非菲律宾语意外变化；此结论不是所有 HTML 字节相同。首次最新对照因基线构建尚未完成而缺少 404.html，待构建完成后重新执行通过，不归为页面故障。

独立 Chromium 验证最新五篇各自 1440×960 和 390×960 共十个视口，HTTP 200、H1、封面加载、无横向溢出，桌面及手机截图已查看。最终预览核对 tl Blog、tl about 和西语入门文章 HTTP 200，tl about 运行时标题 58、描述 154 字符；西语入门仍为已提交的新标题 57 字符。预览保留在 http://localhost:4358/tl/blog/ 。

最新证据位于 /tmp/pixelart-tl-release-check.UPWdLS-latest 及同前缀的 build.log、tests.log、results.json、report、static-comparison.json、visual.json 和截图；临时配置与证据均不加入项目。旧基线证据独立保留。最终 diff-check 通过，保留并行任务的 AGENTS、站图、GSC 记录及其他文档改动。

结论：本地发布候选验收通过，可进入定向提交发布阶段，但本轮未正式发布。Firefox/WebKit 浏览器未安装，因此未验证且没有擅自安装；菲律宾语母语审校、真实 Illustrator 导出案例、Google 新版抓取/收录仍未验证。比较文章仍是资料对照，不冒充竞争工具同图实测。正式上线及线上验收须按后续明确授权执行，不把上述本地结果当作 production 成功。

## 2026-10-12 菲律宾语 SEO 复查建议修正（本地完成两项，案例待补，未发布）

用户授权执行上一轮三项建议。本轮补齐 `/tl/about/` 的简介、搜索描述、工具/Blog及隐私/条款提示，明确 Pixel Art Village 为作者及工具运营方，说明五篇教程的 source、参数、真实下载与官方文档来源边界，不编造个人履历、独立评测或 Illustrator 实测。保留上一轮菲律宾语五篇、工具字段、分享图与测试；不改其他语言、文章正文、索引设置或工作区站图。

五篇文章的 BreadcrumbList 第一项在 React 与预渲染中均改为 Tahanan、`https://pixelartvillage.org/tl/`，仅对 tl 生效；构建产物检查确认五篇更新，其余 80 篇文章仍为原 Home/英文根入口。新增作者页初始 HTML/运行时、1440/320px及刷新断言，并在现有五篇断言中检查面包屑首页。

作者页完整搜索标题保留原值，58 字符；最终搜索描述为 154 字符，源码、初始 HTML、运行时完全一致。首稿 158 字符在预渲染中被 shortenText 截断，正常构建首轮专项 52/54，两个作者页初始 HTML 测试失败；收紧原文至 154 后重新构建并验证，不放宽断言、不改全站截断机制。保留 `/tmp/pixelart-tl-followup.448vjI-normal-first-report` 与 `-normal-first-results`。

验收副本从 HEAD `f2c675ddae2d6a32b633b1b1a8d9b9f36017a50f` 归档，叠加当前菲律宾语相关输入及本轮修改；最终副本 `/tmp/pixelart-tl-followup.448vjI-normal/` 的五份相关源码与工作区一致。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，最终 build（含 SEO/dist/缓存重定向）、lint、typecheck、diff-check 通过。EXPECT_CONSENT_BANNER=1 的最终菲律宾语 Chromium 专项 54/54，零重试、无跳过，31 秒，含四项新作者页检查及原有五篇/真实上传下载/错误边界/同意设置；不是全浏览器全站通过。1440/320px 作者页截图已查看，无正文溢出；最终 HTTP 和初始/运行时描述另行核对通过。最终报告 `-normal-report`，构建日志 `/tmp/pixelart-tl-followup.448vjI-normal-final-build.log`。

另执行过修改描述前的全量 Chromium 测试模式回归，VITE_E2E=1：548 项中 494 通过、21 失败、33 跳过，零重试，16.8 分钟，报告 `/tmp/pixelart-tl-followup.448vjI-report`。其中两个作者页描述截断已由上述最终专项修复并通过；其余 19 项在空/拒绝输入后期望 editor-controls 为 0，与 App 在 IS_E2E 下仍渲染 Editor 的逻辑冲突。七种语言的 14 项在未加本轮修改的同 HEAD 基线也全部复现，报告 `/tmp/pixelart-tl-followup-baseline.KtBMV3-report`；菲律宾语两项在正常模式最终专项通过；韩语两项、英文首页一项未单独基线复跑。跳过项包含既有依赖正常同意横幅的检查，菲律宾语四项已在最终正常模式全部执行。没有把测试模式结果改写为通过，也未扩修其他语言或整套测试配置；最终描述修正后未重跑全量及 Firefox/WebKit。

Illustrator 真实案例仍待补：本机应用目录与 Spotlight 未发现可用 Illustrator，无法生成真实导出面板截图及 Adobe 导出的 PNG。本轮不安装软件、不使用个人 Adobe 登录态、不拿 browser synthetic source 冒充 Illustrator 证据，原文的未实测说明保持不变。母语审校仍未完成。本轮未提交、推送、部署或请求收录；预览 `http://localhost:4355/tl/about/` 与 `/tl/blog/`，不代表线上已更新。

## 2026-10-12 菲律宾语五篇审评后修正（本地完成，未发布）

用户授权修复本轮审评发现的内容定位、比较维度、重复说明和上传提示问题。仍仅修改菲律宾语五篇内容源、必要 tl 语言字段、对应分享 PNG 和现有菲律宾语测试块；未修改共享组件、处理器、其他语言、站图或索引设置，未提交、推送、发布或请求收录。

内容修正：B2 的 H1、seoTitle、摘要、标签、badge、相关链接和分享图统一为 retro na pixel effect，不再承诺已实现 SNES 风格；只在边界说明与 FAQ 保留硬件区别，补充花瓣与背景颜色分离的观察方法。B1 比较表增加安装方式、图片导入和可编辑项目保存，区分 .aseprite、.piskel、XCF 与普通图片输出；重新核对 Aseprite 官方下载/保存文档、Piskel 官方页面与 ImportController/SaveController 源码、GIMP 官方打开/保存文档，不声称竞品同图实测或已验证其当前线上编辑器。失败的 Piskel wiki、猜测的源码路径未当作已读取来源，后以正确官方源码路径确认。B4 明确定位为 Illustrator export 文档参考，依 Adobe Export for Screens 官方文档补四步操作：入口、Artboards/Assets、PNG/scale 与输出检查。仍明确没有 Illustrator 实机导出或面板截图，独立 browser source 与本站转换不是 Adobe 实机证明。B3/B5 压缩重复功能否定、隐私声明和全流程说明，保留细线诊断、可复现参数及必要导出边界。

上传提示：修正 tl 的 tool.supports、errors.onlyPngJpg、errors.fileTooLarge10、errors.maxFile，并补实际首页使用的 home.entrySupports，统一 PNG/JPEG/GIF/WebP、10 MiB 和含等号边界。保留原键名和 maxFile 的 {{mb}} 插值，不改验证逻辑；上一轮两项 palette 字段继续保留。Cookie、首页正文、About 等批外英文回退未扩修。

验收副本 `/tmp/pixelart-tl-review.ImP7ZM/` 来自任务起点 main/HEAD `ce6a8ce530c0874ee27d2b50fa4dfeb09fa07aa8`，只叠加本批 tl 输入与菲律宾语测试块，排除其他未提交工作。期间另一任务提交越南语批次 `8c29aa2eae1e43995f2f34ac13f7822efdd2ee17`；仅涉及 vi 内容/资源/分享图、测试与迭代文档，已保留，不把其成果算作本轮或声称验收最新工作区合并版本。最终两份 JSON、五张 OG PNG 与菲律宾语测试块均与受验副本一致。五篇原 slug/date 不变，16 组 FAQ 与 15 幅既有图例保留；完整 title 含品牌为 55/56/56/55/55 字符，摘要为 145/141/150/142/132 字符，不视为 Google 硬门槛。

最终 Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 构建（含 SEO/dist/缓存重定向）、lint、typecheck、diff-check 通过，sitemap:verify 仍为 205 项。最终受影响 Chromium 56/56，零重试、无跳过，1.9 分钟（菲律宾语 50、既有三语言入口 6），不是全站整套回归。覆盖初始 HTML/运行时、1440/390/320px、元数据/FAQ/分享图、相关链接与语言切换；新断言覆盖标题不再承诺 SNES、完整比较表头与四步导出列表。实际 JPEG/GIF/WebP 上传及 PNG 下载均通过；首页非法格式、恰好 10 MiB、10 MiB+1、3000×1500 等比缩小及恢复保留。编辑器更换文件的非法格式与超限报错按正确 MiB 显示，拒绝后原 64×48 结果仍可下载。旧网格、palette、dithering、细线和透明度相关真实下载验证继续通过。

失败证据保留：首轮 48/56，通过以外的六项是新表头断言误放在仅正文的 .blog-article-prose 范围，另两项发现首页实际使用 home.entrySupports 而非 tool.supports，截图脚本同样发现该入口遗漏。修正断言到真实 table、补首页字段后，第二轮 54/56；剩余两项因新增成功上传测试后仍把已有 editor-controls 当作应消失，新输入被拒绝时正常保留旧编辑器。改为先回到空首页再验证原超限流程，并保留有结果时拒绝错误输入仍能下载的独立验证。第三轮 56/56 后补齐编辑器 maxFile 单位和错误路径测试，以最终第四轮 56/56 为本次完成证据，不使用自动重试或覆盖旧失败。另一次 lint 误扫临时 Playwright HTML 报告中的打包第三方 JS；报告移出应用目录后实际源码 lint 通过，未删除报告、放宽规则或修改第三方打包代码。

证据包括该目录中的 build.log、final-build.log、signoff-build.log、tests.log/results、final-tests.log/final-results、accepted-tests.log/accepted-results、signoff-tests.log/signoff-results、report-artifacts-lint.log、signoff-lint.log、signoff-typecheck.log、first-capture.log、capture.log 和页面截图。HTML 报告分别保留在同级 `pixelart-tl-review.ImP7ZM-first-report`、`-second-report`、`-accepted-report`、`-signoff-report`。已实际查看五篇桌面/320px 首屏、五张分享图、桌面/手机比较表与 Adobe 步骤、320px 上传提示；文字按宽度换行，截图中的表格边界裁切不当作页面截字。截图浏览器和测试已结束，最新本地预览为 `http://localhost:4346/tl/blog/`，仅预览服务保留，其他任务服务未操作。

剩余边界：独立菲律宾语母语审校、真实 Illustrator 导出案例、竞品实机、Firefox/WebKit、实体手机、生产及 Google 新版抓取/规范/排名未验证。Illustrator 缺少实机证据通过收窄为文档参考避免过度承诺，不声称已补真实 Adobe 案例；发布前仍需与最新代码合并验收。已知立即下载旧结果风险未修，等待新预览的通过不能证明处理器风险消除。到此停止本批，不开始下一语言。

## 2026-10-12 菲律宾语五篇修复（本地完成，未发布）

用户同意跳过已被另一任务接手的越南语，继续菲律宾语（tl）五篇本地修复。仅修改 `src/content/blog-posts.tl.json` 五篇、`public/locales/tl/translation.json` 的 `adjustments.palette.note` 与 `adjustments.paletteSize`、五张 `public/blog-og/tl/` PNG、现有 `tests/blog.spec.js` 的新增菲律宾语块、GSC 基线和本记录。没有修改共享组件、处理器、站图、其他语言或索引设置；越南语正文、语言资源、测试和其他工作区记录均保留。没有提交、推送、部署或请求收录。

五篇标题、摘要、标签、正文、表格、图片说明、分享图和作者入口已本地化，保留原 slug、发布日期及数字键对象结构，updated 为 2026-10-12。完整搜索 title 含品牌为 55/57/56/57/55 字符，摘要为 133/142/145/139/132 字符；这只是本项目的编辑要求，不是 Google 硬门槛。两张四行比较表、16 组可见问答及对应 FAQ schema、15 幅可下载真实案例均使用现有渲染器与图片；分享图均 1200×630。

比较篇删除虚构十款实测、评分和无广告隐私承诺，明确本站运营者身份、四工具各自用途及未做竞品同图测试。SNES 篇只谈视觉风格，不保证硬件合规，区分 120×95/80×63、24 色示例与 SNES 规范。排错篇区分细线丢失、显示放大、固定/生成 palette、同 session dithering、透明度及网格导出，纠正案例 source 为 512×512、Pixel Size 4/16 对应 128×128/32×32。Illustrator 篇分开 PPI 与像素尺寸、artboard 与 asset bounds、Adobe 文档步骤与浏览器 synthetic source，没有冒充实机导出。入门篇删除 Resize、自动恢复和图库步骤，按真实控件说明先等新预览再保存。照片来源写为本地 960×762 JPEG 版本，不把它冒充 Commons 原图尺寸。

语义复核：执行者在生成稿之后专门重读五篇标题、摘要和关键操作/限制段落，对照现有功能、实际 UI、数字和来源；复核固定/自动 palette、调参方向、否定条件、图注、导出尺寸与批内链接，调整两条搜索标题的自然措辞和两处重复章节 id。此为同一执行者自查，不是独立母语审校。品牌、软件名、格式、实际英文导出按钮及常用技术借词按用途保留，官方来源标明英文。两个 palette 字段修正后与教程一致；既有 Cookie 英文说明、格式错误提示写 PNG/JPG 及 `<10MB` 等批外翻译未扩修，正文按真实支持格式和含等号边界解释。

最终隔离版本基于 `6a2548736c28dc148ebb5a9a6f79cd3058e14156`，只加入本批输入，排除未提交越南语内容。测试文件采用该干净提交前缀与本轮菲律宾语新增块，不把其他任务未提交测试视为本批通过。验收期间并行任务提交日语首页描述 `ce6a8ce530c0874ee27d2b50fa4dfeb09fa07aa8`，只涉及日语资源与迭代文档；本轮未回滚或覆盖它，本副本没有声称验证最新工作区全量合并结果。菲律宾语两个应用输入、五张 PNG 及新增测试块与最终受验副本一致；原 slug/date 和仅两字段翻译变化已作结构检查。

Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下最终 build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 和 diff-check 通过，站图仍 205 项。定向修正后 5/5 通过，再运行最终相关 Chromium 106/106，零重试、无跳过，3.6 分钟：菲律宾语 50、泰语 50、既有三语言入口 6。不是完整全站回归。菲律宾语覆盖五篇初始 HTML/运行时、1440/390/320px、刷新、语言切换与导航、title/canonical/OG/Twitter/hreflang、FAQ/schema、唯一章节 id、两张表、图例加载解码及点击下载、五张分享图结果区域像素、Cookie 接受/拒绝持久化。

实际上传/下载覆盖 Pixel Size 8/12、生成 24 色和固定 Sunset 8、同 session dithering、细线 128×128/32×32、透明 PNG 64×64，并与当前预览或公开案例像素核对；覆盖非法输入、10MiB+1 拒绝、恰好 10MiB 接受及 3000×1500 等比缩小到 2200×1100 后恢复。四种导出大小验证网格开/关：Pixel size 的 1×1 单元不画线，放大模式网格可以写入文件；Zoom 不改变导出。两张公开限色 PNG 的不透明 RGB 均为 24 色；透明结果包含全透明、半透明及不透明像素。等待新预览的测试不代表修复立即下载旧结果的既有风险。

失败保留：首次 build 因 Illustrator 结果图误写在 source 目录而失败；静态图片核对又发现细线文件名和输入/参数说明不一致，改成现有实际资源及对应参数，不伪造新图。错误构建后的测试服务启动曾被提前发起，尚未开始测试，发现后主动终止，仅保留启动日志，不算任何通过。首轮有效定向 2/3 通过，失败因页面上方资源标签为 `Bumalik sa Blog`，下方 presentation 为小写 blog；统一本批 presentation 与定位后，下一轮 3/5 通过，两项失败因机械换语言误将 HTML `th` 表头 selector 改成 `tl`。仅纠正本批 selector，保留表格内容断言；随后 5/5 与最终 106 项通过。原 build.log、static-check.log、focused-tests.log、focused-final.log/focused-results/focused-report、corrected-focused.log/corrected-focused-results 与 reviewed-focused.log/reviewed-focused-results 保留，未用重试或最终绿灯覆盖历史失败。

已实际查看五张分享 PNG、五篇 1440/320px 首屏、320px 放大细线图例；标题与正文按宽度换行，横向溢出断言通过。手机导航品牌沿用既有省略显示，不声称全站所有文字无裁切。证据在 `/tmp/pixelart-tl-batch.swXdco/` 的 build-final-reviewed.log、lint-final.log、typecheck-final.log、static-corrected.log、input-consistency.log、test-selection.log、final-tests.log、final-results/、final-report/、screens-1440.png、screens-320.png、thin-line-320.png 与 og-sheet.png。相关测试和专用截图浏览器已结束，预览 `http://localhost:4345/tl/blog/` HTTP 200，独立 serve-dist PID 13262 保留；其他任务预览未操作。

本批完成五个本地目标，不把并行越南语尚未交付的页计入本批成果。未跑全站整套、未与后续最新代码作发布合并验收；母语读者审校、Illustrator/竞品实机、Firefox/WebKit、实体手机及 Google 新版抓取/规范/排名未验证。未开始波兰语或下一内容源，发布须另按用户授权推进。

## 2026-10-12 菲律宾语五篇修复准备（本地任务，不发布）

用户同意跳过已被另一任务接手的越南语，继续 `tl` 五篇本地修复。起点 main/HEAD `6a2548736c28dc148ebb5a9a6f79cd3058e14156`；仅处理 `src/content/blog-posts.tl.json` 五篇、必要分享 PNG、现有 Blog 测试、两项误导操作的菲律宾语调色板字段和本轮 GSC 记录。不修改越南语或其他语言、首页定位、共享代码、站图、索引设置；不提交、发布或请求收录。

改稿前以既有服务账号、webmasters.readonly 范围实际读取官方 REST API（Tier 1）。Skill 默认认证脚本/配置不作为已验证入口，复用已验证的读取方式，不输出凭据。final/web 完整窗口 2026-09-12..2026-10-09，逐日确认 28 天；五目标分别读取 page 与 query+page，以及两个 Google 关联规范页的相同窗口数据。原请求、响应、HTTP 状态及抓取时间保存在 `GSC_TL_BLOG_BASELINE_2026-10-12.json`。未返回不补零，关联挪威语统计不归属菲律宾语；索引记录不是实时测试或收录请求。

### 改稿前主题与查询映射

目标均为 `/tl/blog/<slug>/`，窗口同上。以下主词是保留原任务的内容定位，不是已验证当地搜索量。

| slug | 菲律宾语主词 | 意图与修复 | GSC 证据与限制 |
|---|---|---|---|
| best-pixel-art-converters-compared-2025 | mga tool sa pixel art | 按转换、绘制和动画选工具；删除虚构十款排名 | 已收录、自身规范；page/query 未返回 |
| how-to-get-pixel-art-version-of-image | pixel art na estilong SNES | 照片视觉风格、尺寸、限色和 dithering；不保证硬件合规 | 已收录、自规范；0 点击/23 曝光；pixel converter 为 0/2，不证明菲律宾语需求 |
| make-image-more-like-pixel | ayusin ang pixel art | 细线、颜色、点纹和导出排错；不恢复丢失细节 | Google 选择 nb 同名页规范；目标 page/query 未返回 |
| export-from-illustrator-image-to-pixel-art | PNG mula Illustrator | 像素尺寸、scale、透明度与后续转换；不冒充实机 Adobe 案例 | Google 选择 nb 同名页规范；目标 page/query 未返回 |
| how-to-pixelate-an-image | gawing pixel art ang larawan | 第一次上传、调参、等待新预览与保存 PNG | 已收录、自规范；page/query 未返回 |

复用哥飞库第三方内容教程的任务明确、案例与说明一致、自然内链方法，不把其长度、字数、密度或排名说法当 Google 规则。本批完整 title 按既定 55–60 字符编辑要求，用 seoTitle 与完整 H1 分工。竞品信息重新读取 Aseprite、Piskel 和 GIMP 官方文档；Illustrator 三份 Adobe 文档及照片作者/CC0 来源已核对。首次尝试的 Adobe 新路径不可访问，使用原有官方 using 路径成功核对，不把失败来源写成已读取。

当前隔离副本 `/tmp/pixelart-tl-batch.swXdco/build/` 从上述已提交基线生成，不混入并行越南语工作区内容；预定 Node 20、生产式 Cookie 构建及本批实际页面和上传下载验收。完成结果、失败与限制另记，准备记录不表示验收已通过。

## 2026-10-12 西班牙语入门文章SEO标题修复及发布准备

用户回复“执行”，授权单页 `/es/blog/pixel-art-tutorial-complete-guide-2025/` 的本地修复、定向提交发布和线上验收。完整SEO标题定为 `Guía de Arte Píxel para Principiantes | Pixel Art Village`，含品牌、空格、标点和重音字符共57字符；仅在 `src/content/blog-posts.es.json` 增加不带品牌的seoTitle，原标题继续用于H1和schema headline，正文、摘要、日期、标签及网址不变。查询明细保存643行；四个已保存记录日期中可见arte pixel（23次曝光）、pixel art tutorial（10次）及principiantes/aprender等入门意图，不是完整28天逐日窗口。正文确为概念、工具、基础技法和首幅作品步骤，未加入无关词或保证排名改善。

现有Spanish beginner回归测试固定旧101字符标题，与新约定冲突；删除该单行措辞断言，不重新固定新标题，保留防止正文/封面被其他语言替换的检查。发布范围因此为内容源、测试的一行删除和本轮ITERATION章节，共三个文件，不带入已有菲律宾语测试、共享BlogPost/预渲染、站图、AGENTS或其他文档改动。

基线 `f2c675ddae2d6a32b633b1b1a8d9b9f36017a50f`，独立Git归档副本排除上述未提交代码。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0下，修改前后完整build通过；修改后lint、typecheck通过，保留的Spanish beginner测试1/1通过，零重试。225份HTML对照仅目标title/og:title/twitter:title变化，其余元信息、225份去除script后的body均不变。原工作区未执行构建，未编辑dist。独立Chromium验证桌面刷新、同文档列表往返、390×844手机及手机刷新，四阶段均为新标题，H1、es语言、canonical及既有完整摘要正确，截图已查看，手机scrollWidth=390。正文摘要原文/运行时为190字符（原记录误写183，本轮描述修复前核算更正），初始HTML沿用旧机制截为151字符；该轮明确保留摘要，不声称完整摘要已满足150–160字符规则，也不顺带改变截断机制或完成正文重新本地化。

证据 `/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-es-title.fvmds5wq/`。发布前正式页仍为101字符标题，根、es首页、es Blog列表、es进阶文章和已修复英文4K文章五个对照已保存。提交ITERATION版本从基线仅插入本章节，测试提交版从基线只删除旧标题断言；使用独立index与短时共享index锁，沿用main触发Cloudflare Pages项目pixelartvillage1。当前为受验发布准备，最终部署/线上验收以发布回执为准；不发送收录请求，不声明Google或必应已重新抓取、旧警告消失或曝光提升。

## 2026-10-12 英文4K/8K文章SEO标题发布准备

用户回复“继续”，授权仅发布 `/blog/how-many-pixels-is-4k-and-8k/` 的57字符完整SEO标题与本轮记录，不包含其他页面修复或收录请求。发布基线为 `8c29aa2eae1e43995f2f34ac13f7822efdd2ee17`，真实暂存区为空；保留未提交的菲律宾语内容、测试、分享图、站图、AGENTS及其他文档。发布副本从Git归档构造，仅合入目标seoTitle；Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0下，build、lint、typecheck通过，225页SEO元信息及去除script后的body均与本轮已完成真实浏览器验收的构建一致。证据 `/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-4k-release.vg4uo9ff/`。

提交版ITERATION从上述基线只加入本轮单页修复和发布准备章节，不暂存混有其他任务记录的整份工作区文档。使用独立index定向提交两个文件，提交前在短时index锁内核对HEAD、暂存区、受验源内容和章节一致；沿用main推送触发的Cloudflare Pages项目pixelartvillage1，不直接上传工作区dist或切换发布渠道。当前为发布准备，最终部署及线上验收结果以之后的发布回执为准；不声明Google/必应已重新抓取或旧警告消失。

## 2026-10-12 英文4K/8K文章SEO标题单页修复（本地完成，未发布）

用户同意完整搜索标题使用 `4K vs 8K Resolution: How Many Pixels? | Pixel Art Village`，含品牌、空格和标点共57字符，符合本轮约定的55–60字符范围。唯一目标为 `/blog/how-many-pixels-is-4k-and-8k/`；`src/content/blog-posts.en.json` 仅为该文章增加 `seoTitle: "4K vs 8K Resolution: How Many Pixels?"`，复用既有品牌追加机制，不重复写入品牌。原标题 `How Many Pixels Is 4K and 8K? A Simple Resolution Guide` 继续用于可见H1和既有schema headline；正文、摘要、日期、标签、网址及其他文章字段保持不变。未扩大为全站标题规则修改，也不据关键词数量或字符长度保证排名、权重和曝光改善。

本地验收从提交 `8c29aa2eae1e43995f2f34ac13f7822efdd2ee17` 构造隔离副本；源内容修改前与该提交相同，JSON比较确认仅增加目标字段。Node 20.19.0、`VITE_E2E=0`、`VITE_ENABLE_ANALYTICS=0` 下，修改前后完整 `npm run build` 均通过，包含既有SEO、dist及缓存/重定向检查。225份HTML的SEO元信息对照仅目标页的title、og:title、twitter:title变化；其description、canonical、lang、JSON-LD均不变，其余224页元信息及225页去除script后的body均不变。英文文章共享的initialContent数据和构建脚本资源可能随新增字段变化，不声明只有一份HTML或资源文件字节改变；未在原工作区执行构建或手改dist。

独立Chromium验收初次加载、Blog列表进入文章、文章返回列表后再进入、桌面刷新、390×844手机和手机刷新，六阶段均为57字符新搜索标题，H1、摘要、canonical与en语言正确。返回列表及再进入通过同一文档标记确认SPA导航，列表保留自己的标题。1440×900桌面和手机截图已查看，手机scrollWidth=390，无横向溢出。新HTTP请求为200并匹配受验构建；正常浏览器缓存刷新为304。临时验收最初把304误判为失败，并在列表标题更新、链接渲染完成前读取或点击；调整为等待实际页面状态并接受正常缓存响应后完成验收，未因此修改业务代码、放宽元信息断言或增加永久测试。

证据：`/var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-4k-title.fwzod43z/`，含scope、修改前后源内容、静态及HTTP对照、运行时六阶段记录、桌面/手机截图和local-receipt；构建完整输出为 `artifact://294` 与 `artifact://297`。本轮未提交、推送、部署、发送收录请求或访问个人登录态；未核实Google/必应重新抓取或必应旧警告消失，不能将本地通过称为线上已修复。

## 2026-10-12 越南语五篇发布准备

用户对“越南语五篇定向提交、部署并完成线上验收”回复“继续”，授权本批发布，不包含菲律宾语或 Google 收录请求。起点本地 main 与已获取的 origin/main 均为 ce6a8ce530c0874ee27d2b50fa4dfeb09fa07aa8，真实暂存区为空；保留菲律宾语、站图、AGENTS、其他 GSC/PRD 和未归属迭代记录。发布副本 /tmp/pixelart-vi-release.RMkmpo/work/ 从该提交构造，只合入越南语内容、五项配套资源字段、五张分享图、现有 Blog 测试的越南语段、只读 GSC 基线及本批记录。发布前重新构建与验收；未通过时停止，不用旧版本结果代替当前版本。沿用 main 推送触发的 Cloudflare Pages 项目 pixelartvillage1 Git 集成，不上传整个工作区 dist，不修改发布渠道、索引配置或云端账号。

发布前验收：Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0；build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 和 diff-check 均通过，站图 205 项。完整 Chromium 494/494 通过，零重试、无跳过或 flaky，约 12.1 分钟；覆盖最新已提交代码及本批新增 50 项，不含未提交菲律宾语测试。独立服务 4352 仅提供此次生产式构建，替换默认 E2E 启动命令、不复用旧服务，真实 Cookie 接受/拒绝参与验收。日志 build.log、lint.log、typecheck.log、sitemap.log、full.log、full-results.json、full-report/ 和 full-results/。独立浏览器复查五篇 1440/390/320px 首屏、两张表格与两张图例，15 次 HTTP 200，无 pageerror 或横向溢出，三张首屏拼图已查看；证据 visual/。源内容、必要字段、测试越南语段和五张 PNG 与已验收版本一致；首轮副本构造因比较器处理尾部空行不一致而停止，修正比较器后再构造，未改业务或放宽页面断言。正式发布前五个目标网址均 HTTP 200，仍为旧英文标题，保存 production-before/、production-static-before.json 及六个首页对照。母语读者审校、Illustrator 实机、Firefox/WebKit、实体手机及 Google 新版抓取/规范选择仍未验证，不据本地通过声明流量改善。

## 2026-10-12 越南语五篇修复回执（本地完成，未发布）

本批五篇正文、标题摘要、标签、比较表、案例图注、作者与展示文字已本地化，保留原 slug、数字键 0..4 和 date，updated 为 2026-10-12。完整搜索标题含品牌分别 57、59、56、59、56 字符，摘要分别 136、137、137、141、137 字符；保留 16 个可见 FAQ 及对应结构化数据。只改越南语内容源、五张 /blog-og/vi/ PNG、必要五项语言字段、现有 Blog 测试越南语段、只读 GSC 基线和本文件相关段落，不改共享组件、处理器、首页描述、索引设置或工作区站图。删除虚构十款实测、付费/评分与不存在的编辑器能力，复用已注明来源和尺寸的 15 张图例，其中 13 张小图放大不平滑；没有伪造 Illustrator 实机输出。

受验隔离副本 /tmp/pixelart-vi-batch.gaf4Wl/work/ 从 6a2548736c28dc148ebb5a9a6f79cd3058e14156 构造，仅同步本批越南语文件与当时现有 Blog 测试，Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0。build-final.log 中 build（含 SEO、dist、缓存/重定向）通过，lint-final.log、typecheck-final.log、sitemap-final.log 通过，站图 205 项；git diff --check 通过。五张实际生成 PNG 1200×630，提交候选文件与最终副本图片字节一致，实际解码结果区与源图最近邻放大精确比较通过；五张图片均已逐张查看，越南语声调、标签完整，无截断。

首轮定向错误详见下面准备记录，日志、截图、视频及 trace 保留，不冒充首轮通过。修正内容源后的定向 4/4 通过，见 focused-final.log、focused-final-report/、focused-final-results/、focused-final-results.json。其后最终受影响 Chromium 回归 72/72 通过，零重试、无跳过或 flaky，约 1.8 分钟；包括本批 50 项及其他既有 i18n、canonical/hreflang、静态页、英文上传边界与导出选项 22 项。证据 regression.log、regression-selected.log、regression-report/、regression-results/、regression-results.json。没有使用 VITE_E2E=1 隐藏真实 Cookie，也没有连接默认 4173 旧服务。

页面与工具：五篇各 1440/390/320px 的初始 HTML 与运行时均检查列表进入、刷新、返回、同语言跳转、SEO 标签、schema/FAQ、案例尺寸、下载文件一致性和无横向溢出。工具实际验证像素大小 8/12、自动 24 色、固定 Sunset 8、同会话 dithering、细线 4/16、透明 PNG、非法输入、10 MiB 字节边界与 3000×1500 等比缩至 2200×1100。网格开启时 Pixel size 不绘制线，Original size/2×/4× 可绘制；预览缩放不改变下载像素。等待新预览后才下载，不据此宣称已修复既有立即下载旧结果风险。

专门语义复核由本轮同一执行者完成，方式为生成后重新逐篇对照已确认功能事实、当前控件与实际文件，不称独立或母语审校。B1 核对运营方身份、比较用途而非四工具同图实测、外部官方来源与上传限制；B2 核对视觉 SNES 风格不等于硬件格式、120×95/80×63、颜色上限及随机/同会话条件；B3 核对三细线到一色带的参数方向、固定/自动调色板、透明度和网格条件，不恢复丢失数据；B4 核对 256×256→512×512、300×200→600×400、假设 PPI 算例、三个 Adobe 来源及独立浏览器输入与真实转换输出的区别；B5 核对实际越南语按钮、等待顺序、10 485 760 byte、2200 长边、静态格式及大图导出不恢复细节。标题、摘要、表格、正文、图注、封面和分享标签之间未发现未解决的关键功能语义冲突；Blog、品牌、真实英文导出模式和技术名词保留，不强行翻成与界面不同的标签。母语措辞与独立读者理解仍未验证。

另用独立 Chromium 浏览器查看五篇三视口首屏、两种 320px 表格上下文和两个 320px 放大图例；见 visual/ 的 15 张 head 截图、拼图、table-context-*、figure-*、observations.json 和 visual.log。15 次 HTTP 200，无 pageerror、无横向溢出。长表格的元素截图带入固定导航覆盖，不作为首屏截字结论，另补完整视口上下文截图；没有为截图改导航或共享布局。专用浏览器已关闭，生产式静态预览 http://localhost:4347/vi/blog/ 返回 200，独立 serve-dist PID 89705 保留供用户查看，测试服务 4346 随测试退出，不操作其他任务预览。

收尾期间并行任务发布日语首页描述 ce6a8ce530c0874ee27d2b50fa4dfeb09fa07aa8，并追加菲律宾语源码、资源、测试和基线；均未回滚、覆盖或带入本批构建。当前越南语 JSON、五项资源字段和本批测试段与受验副本一致，旧测试帮助函数段亦一致；整份 Blog 测试因并行追加菲律宾语段而不同，不把菲律宾语测试称为本轮已通过。本批新增五篇，按此前完成 30 篇计本地累计 35/91，不计入并行未完成验收的其他语言。

停止边界：未提交、推送、部署或请求 GSC 收录；没有由本轮开始下一语言。母语审校、Illustrator/其他工具实机、Firefox/WebKit、实体手机、既有立即下载旧结果风险及 Google 新版抓取、规范选择、排名和曝光变化仍未验证。首页/页脚与 Cookie 说明的既有部分英文回退没有扩修；不能把本地通过当作流量或收录改善。后续发布须重新核对届时 HEAD、范围与发布副本，不直接把整个脏工作区部署。

## 2026-10-12 越南语五篇修复准备（本地任务，不发布）

用户对按 PRD 继续越南语五篇本地修复回复“继续”。起点 main/HEAD 为 0c813ea17ff0a5e279d5c2057f01a9373d3cbe42；仅处理 blog-posts.vi.json 五篇及必要分享 PNG、现有 Blog 测试、两项误导操作的越南语调色板字段、GSC 基线与本记录。保留并行泰语、韩语、站图及其他未提交记录，不提交、部署或请求收录。越南语首页描述已发布，不改该字段。

改稿前使用既有服务账号只读官方 REST API，final/web 完整窗口 2026-09-12..2026-10-09；原请求、响应和最近正式抓取状态保存在 GSC_VI_BLOG_BASELINE_2026-10-12.json。不把未返回查询写成零需求，不把关联其他语言规范页的统计归属越南语，也不把静态 URL Inspection 当实时测试或收录请求。

### 改稿前主题与查询映射

目标均为 /vi/blog/<slug>/，下列主词是保持原用途的内容定位，不是已证明的越南语搜索量。

| slug | 越南语主词 | 意图与修复 | GSC 目标证据 |
|---|---|---|---|
| best-pixel-art-converters-compared-2025 | công cụ pixel art | 按转换、绘制、动画选择四种工具；删除虚构十款排名与实测 | 0 点击/21 曝光，四条可见查询为 piskelapp .com、pixel art .com、pixel fine converter、pixelartvillage.com；当前 Google 选择 sv 规范 |
| how-to-get-pixel-art-version-of-image | ảnh sang pixel art phong cách SNES | 视觉风格、尺寸、限色与同会话 dithering；不保证硬件适配 | 已收录、自身规范；page/query 未返回 |
| make-image-more-like-pixel | cải thiện pixel art | 细线、固定/自动调色板、导出排错；不恢复丢失信息 | Google 选择 nb 规范；page/query 未返回 |
| export-from-illustrator-image-to-pixel-art | xuất PNG từ Illustrator | 像素尺寸、导出路径、透明度；不冒充 Illustrator 实机案例 | 已收录、自身规范，0/4；query 未返回 |
| how-to-pixelate-an-image | pixel hóa ảnh | 首次上传、调参、等待新预览与保存 PNG | Google 选择 id 规范；page/query 未返回 |

沿用原 slug 和 date，用 seoTitle 区分短搜索标题与完整 H1；全标题按用户 55–60 字符要求验收，不当作 Google 的硬性长度规则。复用有来源且可下载的既有实测图片，清楚区分浏览器生成输入、实际工具结果与 Adobe 文档步骤。功能依据以当前代码、真实控件和本地处理/下载验收为准；哥飞库第三方内容教程只采用意图清晰、案例与内容一致、自然内链的参考，不采用密度、字数或流量保证。

实施中发现 /vi/blog/ 列表仍有英文简介、无声调 H1 文案及英文返回字段，仅配套补译 blog.subtitle、blog.h1、blog.back；Blog 本身为常用名称，保留，不扩修首页、政策或全站翻译。首轮定向 4 项为 3 通过、1 失败：移植测试常量误读 blog-posts.sv.json，导致找瑞典语标题，部分分享图断言也实际读了瑞典语资料，不计为越南语通过。保留 /tmp/pixelart-vi-batch.gaf4Wl/focused.log、focused-report/、focused-results/ 和 focused-results.json，修正为越南语内容源后另目录重验；没有更改业务或放宽断言迎合错误定位。

这个文件是 `pixel-art-v2` 的长期优化记录。
以后每次改 SEO、converter 页面、工具 UI、构建脚本、sitemap、Blog、外链或部署，都要在这里留下记录。

## 2026-10-12 日语首页描述单页发布准备

用户对“定向提交并发布这次日语修复，再验收正式页面，不夹带其他任务改动”回复“继续”，授权发布 `/ja/` 首页描述。仅提交 `public/locales/ja/translation.json` 的 `home.seoDescription` 及本文件日语本轮修复、发布准备段落；ITERATION 提交版本从已提交基线构造，不直接暂存混有其他任务记录的整份工作区文档。起点本地与远程 main 均为 `6a2548736c28dc148ebb5a9a6f79cd3058e14156`，真实暂存区为空；提交时在短时共享 index 锁内重新核对 HEAD、暂存区及两个受验对象，若其他任务占用则停止，不覆盖其暂存。

实际发布副本 `/tmp/pixelart-ja-release.9rdEwV/build/` 从该干净提交生成，仅同步本轮日语字段，不带入越南语源码、翻译、测试或分享图的未提交改动。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 全部通过，站图仍 205 项。225 个生成 HTML 的完整头部与前轮真实浏览器已验收的日语副本全部一致，dist 日语语言包与单字段源码一致；对同一已提交基线，仅日语三份描述和两个既有 JSON-LD description 变化，去除脚本后的日语正文不变。日志与比较结果为 build-validation.log 和 release-static-verification.json。

正式域名发布前根首页、日语、韩语、俄语、葡语、越南语首页均 HTTP 200，初始 HTML 对照保存至 production-before.json；同一独立浏览器确认日语页仍是旧英文描述，保存 production-runtime-before.json。沿用 origin/main 推送触发的 Cloudflare Pages Git 集成，项目 `pixelartvillage1`，不直接上传 dist、不改云端配置、发布渠道或索引设置。按本次完整提交 SHA 核对对应部署和正式页面，再补发布回执，不把本地检查通过视为正式发布成功。

## 2026-10-12 日语首页描述单页修复（本地完成，未发布）

授权与范围：用户在韩语描述发布完成后继续任务，本轮明确只处理 `/ja/` 首页描述，先本地构建和真实页面验收、不提交或发布。仅修改 `public/locales/ja/translation.json` 的 `home.seoDescription` 及本条记录，不改 title、H1、正文、其他语言、Blog、converter、共享生成代码、工作区站图或索引设置，保留其他任务的本地改动。

依据与修改：此前必应重复描述报告包含日语首页，本轮源码和改前实际浏览器确认该描述字段仍为英文，不是缺键回退。沿用此前 API 导出的 2026-09-11、09-18、09-25、10-02 四批记录，日语首页合计 3 点击、102 展现，不当作完整 28 天逐日统计，不证明重复描述导致流量下降。改为 92 字符日语：`Pixel Art Villageで画像を無料でピクセルアートに変換できます。ブラウザでピクセルサイズとパレットを調整し、仕上がりをプレビューして、完成した画像をダウンロードできます。` 使用现有界面的ピクセルサイズ、パレット、ダウンロード术语，保留免费图片转换、浏览器调参、预览与下载的实际用途。不机械套用英文描述长度建议，不声称达到未经核实的必应最低长度标准，也不宣称独立母语审校。

构建与静态验收：隔离副本 `/tmp/pixelart-ja-meta.4xSj0Q/work/` 从 `6a2548736c28dc148ebb5a9a6f79cd3058e14156` 生成，继承已提交韩语修复及其他已提交内容，只同步本轮日语字段，不在原工作区构建。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，改前/改后 build 均通过，最终 lint、typecheck、sitemap:verify 通过，站图仍 205 项。比较两次 225 个 HTML 的 title、meta、link、HTML 语言及头部 JSON-LD，仅 `ja/index.html` 改变：普通、OG、Twitter 描述及两个既有 JSON-LD description 同步为新文案，无截断；其余 224 页头部、日语非描述头部信息及去除脚本后的正文不变。源 JSON 严格比较仅 `home.seoDescription` 改变；原工作区 AGENTS、葡语/越南语/俄语/韩语资源及两份站图的七项校验值均未变。预览显示既有 baseline-browser-mapping 数据过期提示，本轮未因此升级依赖。

真实页面：专用 4347 本地生产式预览 HTTP 200，同一独立浏览器改前确认英文描述，改后整页重新加载确认三份新日语描述。真实选择器按英文→日语→韩语→俄语→越南语→葡语→日语切换及再次整页重新加载通过，未将日语普通描述带入对照语言。日语运行时 title、canonical、lang、H1、上传输入数量与改前一致；1440×900 桌面及 390×844 手机截图已查看，上传入口存在，手机 scrollWidth=390 无横向溢出。证据在隔离目录上一层的 build-baseline.log、build-final.log、baseline-runtime.json、static-verification.json 和 runtime-verification.json；本轮没有测试图片转换或下载全流程。

边界：只完成本地修复，未提交、推送、发布或请求必应/Google 重新收录，不把本地通过写成正式站已更新。日语首屏仍有既有英文回退，本轮不补译正文，不计为完整首页补译；原报告缺失的 29 页明细未处理。没有验证必应新版抓取、建议消除或排名、点击改善。收尾仅关闭本轮专用浏览器和本地预览，不操作其他任务会话。

## 2026-10-12 韩语首页描述单页发布准备

用户对“定向提交并发布这次韩语修复，再验收正式页面，不夹带其他任务改动”回复“继续”，授权本轮发布 `/ko/` 首页描述。只提交韩语资源的 `home.seoDescription` 及本文件的韩语本轮修复、发布准备段落；ITERATION 从已提交基线构造提交版本，不直接暂存混有并行任务记录的整份工作区文档。起点本地和远程 main 均为 `ac2056d1afc966c352b87106feffec0f8216c228`，真实暂存区为空；提交时在短时共享 index 锁内重新核对 HEAD、暂存区及受验对象，若被其他任务占用则停止，不覆盖其暂存。

实际发布副本 `/tmp/pixelart-ko-release.MEq53R/build/` 从当前已提交基线重新生成，继承前轮验收后新增的已提交内容，不回退并行任务的提交。对该基线先构建原版本，再只同步韩语字段；Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 全部通过，站图仍 205 项。两次 225 个 HTML 头部比较仅 `ko/index.html` 的三份描述及两个既有 JSON-LD description 改变；其余 224 页头部、韩语非描述头部信息和去除脚本后的正文不变，韩语头部与前轮真实浏览器已通过的本地版本一致。日志及严格比较结果在 build-baseline.log、build-validation.log 和 release-static-verification.json。

正式域名发布前根首页及韩语、俄语、葡语、越南语首页均 HTTP 200，初始 HTML 元数据对照保存在 production-before.json；实际浏览器仍为韩语页原英文描述，保存 production-runtime-before.json。沿用 origin/main 推送触发的 Cloudflare Pages Git 集成，项目 `pixelartvillage1`，不直接上传 dist、不修改云端配置或索引设置。按本次完整提交 SHA 核对部署和正式页面，再记录发布回执，不把本地构建通过视为正式发布成功。

## 2026-10-12 韩语首页描述单页修复（本地完成，未发布）

授权与范围：用户在俄语描述发布完成后继续任务，本轮明确只处理 `/ko/` 首页描述，先完成本地验收、不自动提交或发布。仅修改 `public/locales/ko/translation.json` 的 `home.seoDescription` 及本条记录，不改 title、H1、正文、其他语言、Blog、converter、共享生成代码、工作区站图或索引设置，不带入并行任务的未提交内容。

依据与修改：此前必应重复描述报告包含韩语首页，本轮改前实际浏览器确认它仍显示英文描述；源码该字段本身是英文，不是缺键回退。沿用此前 API 导出的 2026-09-11、09-18、09-25、10-02 四批记录，韩语首页合计 5 点击、289 展现，不当作完整 28 天逐日统计，不证明重复描述导致流量下降。改为 103 字符韩语：`Pixel Art Village에서 이미지를 무료로 픽셀 아트로 변환하세요. 브라우저에서 픽셀 크기와 색상 팔레트를 조절하며 결과를 미리 보고, 완성한 이미지를 다운로드할 수 있습니다.` 描述图片转换、像素大小、调色板、预览和下载的实际用途；不机械套用英文描述长度建议，不声称达到未经核实的必应最低长度标准，也不宣称独立母语审校。

构建与静态验收：运行环境恢复后发现此前隔离目录不存在，重新从已提交基线 `0c813ea17ff0a5e279d5c2057f01a9373d3cbe42` 创建 `/tmp/pixelart-ko-meta.RkPqix/work/`，先构建未修改基线，再同步唯一韩语字段；没有复用已失效目录的验收结果，也不在原工作区构建。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，改前/改后 build 均通过，最终 lint、typecheck、sitemap:verify 通过，站图仍 205 项。两次 225 个 HTML 的 title、meta、link、HTML 语言及头部 JSON-LD 比较，仅 `ko/index.html` 变化：普通、OG、Twitter 描述与两个既有 JSON-LD description 同步为新文案，无截断；其余 224 页头部、韩语非描述头部信息及去除脚本后的正文不变。源 JSON 严格比较仅 `home.seoDescription` 变化。

真实页面：专用 4343 本地生产式预览 HTTP 200，同一独立浏览器改前确认英文描述、改后整页重新加载确认三份韩语描述。真实选择器按英文→韩语→俄语→越南语→葡语→韩语切换，再次重新加载通过，未将韩语普通描述带入对照语言。韩语运行时 title、canonical、lang、H1、上传输入数量与改前一致；1440×900 桌面及 390×844 手机截图已查看，上传入口存在，手机 scrollWidth=390 无横向溢出。证据在隔离目录上一层的 build-baseline.log、build-final.log、baseline-runtime.json、static-verification.json、runtime-verification.json；本轮没有测试图片转换或下载全流程。

边界：只完成本地修复，未提交、推送、发布或请求必应/Google 重新收录，不把本地通过写成正式站已更新。韩语首屏仍有既有英文回退，本轮不补译正文，不计为完整首页补译；日语首页重复描述及原报告缺失的 29 页明细未在本轮处理。未验证必应新版抓取、建议消除或排名、点击改善。收尾仅关闭本轮专用浏览器和预览，不操作其他任务会话。

## 2026-10-12 俄语首页描述单页发布准备

用户对“下一步定向提交并发布俄语这次修复，再验收正式页面”回复“继续”，授权发布 `/ru/` 描述修复。仅提交 `public/locales/ru/translation.json` 的 `home.seoDescription` 及本文件的俄语本轮修复、发布准备段落，不混入同一文档中其他任务的未提交记录，也不提交 AGENTS、工作区站图、泰语源码/翻译/测试/分享图或 GSC/PRD 资料。准备起点本地与远程 main 均为 `edae9c0ed421fa88970e1a79163e991a8dcc7ecf`，暂存区为空；提交前在短时共享 index 锁内重新核对 HEAD 和真实暂存区，若其他任务占用则停止，不覆盖其暂存。

实际待发布副本 `/tmp/pixelart-ru-release.45Jhjy/build/` 从该干净提交生成，只同步本轮俄语字段，继承已提交葡语、越南语和瑞典语内容。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，build（含 SEO、dist、缓存/重定向）、lint、typecheck 和 sitemap:verify 全部通过，站图仍 205 项。实际副本 225 个生成 HTML 的完整头部与此前已通过真实浏览器验收的俄语副本一致，dist 俄语语言包与单字段源码一致，日志为该目录上一层的 build-validation.log。正式域名发布前初始 HTML 和实际浏览器仍为旧英文描述，英文、葡语、越南语对照已保存至 production-before.json，俄语运行时基线为 production-runtime-before.json。

沿用 main 推送触发的 Cloudflare Pages Git 集成，项目 `pixelartvillage1`；不直接上传 dist、不改云端配置、发布渠道或搜索引擎设置。按本次完整提交 SHA 核对 Cloudflare check-run 和部署标识，再验收正式域名的初始 HTML、运行时、刷新、语言切换与桌面/手机页面；发布结果另记回执，不把本地通过写成正式发布成功。

## 2026-10-12 俄语首页描述单页修复（本地完成，未发布）

授权与范围：用户在葡语、越南语描述发布完成后回复“继续”，本轮明确只处理 `/ru/` 首页描述，先本地验收、不自动提交或发布。仅修改 `public/locales/ru/translation.json` 的 `home.seoDescription` 及本条记录，不改 title、H1、正文、其他语言、Blog、converter、共享生成代码、工作区站图或索引设置。保留瑞典语、泰语、阿语、GSC 资料与其他任务的本地改动。

依据与修改：原必应重复描述 CSV 包含 `/ru/`，此前 84 个报告网址的正式 HTML 核对确认它仍与韩语、日语首页共用英文描述；源码该字段本身也是英文，不是缺键回退。复用已有 API 导出，2026-09-11、09-18、09-25、10-02 四批俄语首页记录合计 10 点击、356 展现，不当作完整 28 天逐日统计，不证明重复描述导致流量下降。改为 148 字符俄语：`Превратите изображение в пиксель-арт бесплатно в браузере. Настройте размер пикселей и палитру, посмотрите и скачайте результат в Pixel Art Village.` 保留图片转换、像素大小、调色板、查看结果及下载的真实用途，不改页面定位，不宣称独立母语审校。

构建与静态验收：隔离副本 `/tmp/pixelart-ru-meta.M9Q9Pz/work/` 从 `edae9c0ed421fa88970e1a79163e991a8dcc7ecf` 生成，继承已提交葡语、越南语和瑞典语修复，仅同步本轮俄语资源，不带入并行泰语未提交内容。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0；改前/改后 build 均通过，含 SEO、dist、缓存/重定向检查，最终 lint、typecheck、sitemap:verify 通过，站图仍 205 项。两次 225 个 HTML 的 title、meta、link、HTML 语言和头部 JSON-LD 比对，只有 `ru/index.html` 变化：普通、OG、Twitter 描述及既有 JSON-LD 两个 description 同步为新文案，无截断；其余 224 页头部、俄语非描述元数据及去除脚本后的可见正文不变。源 JSON 严格比较仅 `home.seoDescription` 变化；原工作区 AGENTS、葡语/越南语资源、两份站图校验值未变。

真实页面：专用 4339 生产式本地预览 HTTP 200，改前实际浏览器复现原英文描述，改后初始 HTML 和运行时三份描述均为新文案。真实语言选择器按英文→俄语→越南语→葡语→俄语切换及俄语整页重新加载通过，未将俄语文案带入对照语言。运行时 title、canonical、lang、H1、上传输入数量与改前一致，1440×900 桌面和 390×844 手机截图已查看，手机 scrollWidth=390 无横向溢出。证据位于上述隔离目录上一层的 build-baseline.log、build-final.log、baseline-runtime.json、static-verification.json、runtime-verification.json；不将本轮描述验收写成图片转换或下载全流程回归。

边界：只完成本地修复，尚未提交、推送、发布或请求必应/Google 重新收录，正式站尚未发布本轮俄语文案。俄语首屏仍有既有英文回退，本轮不补译正文，不计为原 91 页计划中的完整首页补译。未验证必应新版抓取、建议消除或排名、点击改善；韩语、日语重复描述与报告缺失的 29 页明细未在本轮处理。专用浏览器和预览在收尾关闭，不操作其他任务的预览。

## 2026-10-12 越南语首页描述单页发布准备

并行提交处理：首次提交前检测到共享暂存区已被另一任务占用，断言停止，没有提交越南语或改动对方暂存内容，短时 Git index 锁已释放。待瑞典语任务提交并推送 `f3764cf2f9b51325edd2b709a0edd3b56f1641af`、暂存区清空后，将实际发布基线更新为该提交，继承已提交的瑞典语内容，不重复提交它。新隔离副本 `/tmp/pixelart-vi-release.RY8chi/build-rebased/` 的改前/改后 build 及改后 lint、typecheck、sitemap:verify 均通过；重新对比 225 个 HTML，仅 `vi/index.html` 描述元数据变化，JSON-LD 仅描述同步，可见正文不变，dist 越南语语言包与本轮单字段源码一致。证据为 build-rebased-baseline.log、build-rebased-final.log、rebased-static-verification.json；最终提交仅包含相对新基线的越南语两文件差异，不带入并行泰语等未提交内容。

用户对“下一步定向提交并发布这次修复，再验收正式页面”回复“继续”，授权发布 `/vi/` 描述修复。仅提交 `public/locales/vi/translation.json` 的 `home.seoDescription` 及本文件的越南语本轮修复、发布准备段落，不混入同一文档的瑞典语、阿语、葡语发布后记录或其他未提交内容，也不提交 AGENTS、工作区站图、瑞典语源码/测试/分享图和其他 GSC/PRD 资料。发布准备起点 main 与远程均为 `05178e4101c46604e67e465cec279726af56c8fc`，暂存区为空；共享工作区另有瑞典语发布准备，提交前重新核对 HEAD 和暂存范围，不覆盖其他任务。

实际待发布副本 `/tmp/pixelart-vi-release.RY8chi/build/` 从该干净提交生成，只同步本轮越南语字段。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，build（含 SEO、dist、缓存/重定向）、lint、typecheck 和 sitemap:verify 全部通过，站图仍 205 项。实际发布副本 225 个生成 HTML 的完整头部元数据与此前已通过真实浏览器验收的越南语修复副本一致，dist 越南语语言包与单字段源码一致，日志为该目录上一层的 build-validation.log。当前正式站 `/vi/` 仍为旧英文描述，英文、葡语和俄语对照已保存到 production-before.json。

沿用 main 推送触发的 Cloudflare Pages Git 集成，项目 `pixelartvillage1`；不另行直接上传 dist、不更改云端配置、发布渠道或索引设置。按本次完整提交 SHA 核对 Cloudflare check-run 和部署标识，再验收正式域名的初始 HTML、运行时、刷新、语言切换与桌面/手机页面；实际结果另记发布回执，不以本地通过代替正式发布成功。

## 2026-10-12 越南语首页描述单页修复（本地完成，未发布）

授权与范围：在“只替换 `/vi/` 首页描述，先构建和真实页面验收，暂不自动发布”的建议后，用户回复“继续”。仅修改 `public/locales/vi/translation.json` 的 `home.seoDescription`，并补本条记录；不改 title、H1、正文、其他语言、Blog、converter、共享生成代码、站图或搜索引擎设置，不提交、推送或发布。保留瑞典语、阿语、GSC 资料及其他本地任务改动。

依据与文案：必应原重复描述明细包含 `/vi/`，本次 84 个报告网址的正式 HTML 只读核对确认 vi/ru/ko/ja 四个首页仍共用英文描述；葡语首页已独立。复用既有 API 导出，越南语首页在 2026-09-11、09-18、09-25、10-02 四批页面记录合计 16 点击、197 展现，不当作完整 28 天逐日统计、不据此断言重复描述造成流量损失。源码该字段本身为英文，替换为 136 字符越南语：`Chuyển ảnh thành pixel art miễn phí trên trình duyệt. Chỉnh kích thước pixel và bảng màu, xem trước và tải ảnh về với Pixel Art Village.` 保留真实图片转换、像素大小、调色板、预览和下载用途，不改页面定位。正式 HTML 核对表在 `/tmp/pixelart-bing-audit.iIbmM1/`，不是必应新版建议回执。

构建与静态验收：隔离副本 `/tmp/pixelart-vi-meta.NXvxC8/work/` 从 `05178e4101c46604e67e465cec279726af56c8fc` 生成，保留已上线葡语修复，只同步本轮越南语资源；Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0。改前、改后 build 均通过，含 SEO、dist、缓存/重定向检查，最终 lint/typecheck 通过，生成站图仍 205 项。两次 225 个 HTML 的 title、meta、link、HTML 语言及头部 JSON-LD 对比，仅 `vi/index.html` 变化；普通、OG、Twitter 描述和既有 JSON-LD 两个 description 字段同步为新文案，无截断，其余 224 页头部及越南语其他元数据完全一致。越南语可见 body 去除脚本后完全一致，源 JSON 严格比较仅 `home.seoDescription` 变化；原工作区 AGENTS、葡语资源和两份站图校验值保持不变。

真实页面验收：专用 4331 生产式本地预览 HTTP 200，改前浏览器确认原英文描述，改后初始 HTML 与运行时三份描述均为新文案。真实语言选择器按英文→越南语→葡语→越南语切换及越南语整页重新加载通过，未将越南语描述带入对照语言。1440×900 桌面和 390×844 手机截图已查看，上传输入存在，手机 scrollWidth=390 无横向溢出；运行时 title、canonical、lang、H1 与改前一致。本轮不宣称完成图片转换或下载全流程测试，也不宣称独立母语审校。证据在上述隔离目录上一层的 build-baseline.log、build-final.log、baseline-runtime.json、static-verification.json、runtime-verification.json。

校验说明与边界：初次静态断言误将既有 JSON-LD 描述自动同步视为范围外变化；随后逐叶比较确认只有两个 description 字段变化，未追加源码修改，也未跳过其他字段检查，说明保留于 static-verification.json。越南语首屏仍有既有英文回退，本轮不补译正文；尚未发布，未请求必应/Google 重新收录，未验证必应新版抓取、警告消除或排名、点击改善。本次单字段修复不计为原 91 页计划中的完整首页补译，专用浏览器和预览在收尾关闭，不操作其他任务的预览。

## 2026-10-12 瑞典语五篇正式发布准备

用户明确授权“部署上线”。仅提交瑞典语五篇正文、两项工具调色板翻译、五张瑞典语分享图、瑞典语 GSC 基线、现有瑞典语测试和本文件的瑞典语三个相关章节，共 10 个文件。保留 AGENTS、其他语言及其他文档、两份工作区站图、其他 GSC/PRD 资料，不混入越南语首页描述。当前 main 与 origin/main 均为 `05178e4101c46604e67e465cec279726af56c8fc`；沿用 main 推送触发的 Cloudflare Pages Git 集成，项目 `pixelartvillage1`，不切换发布渠道或修改索引设置。

以获准暂存内容和干净 HEAD 生成隔离发布副本 `/tmp/pixelart-sv-release.qtgKuy/build/`，使用既有依赖与 Node 20.19.0，关闭分析、VITE_E2E=0。build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 和暂存 diff-check 通过，站图仍 205 项。最终 23 文件 Chromium 完整回归 394/394 通过，零重试、无跳过，约 8.4 分钟，其中瑞典语 50 项。实际暂存文件与受验副本逐字节一致，八个瑞典语应用/测试/图片输入也与前轮最终本地修复副本一致；文档仅补本轮发布准备和结果，不改变构建输入。证据为隔离目录上一层的 release-build.log、lint.log、typecheck.log、sitemap.log、release-regression.log、local-results/ 与 local-report/。发布后按完整提交 SHA 核对 Cloudflare 部署，再检查正式五篇、FAQ、图例、分享图、语言切换和实际下载。不申请 GSC 收录，不把部署成功当成 Google 新版抓取或流量改善。

## 2026-10-12 瑞典语五篇审评建议修复（本地通过，未发布）

授权与范围：用户对两项只读审评发现回复“执行建议”。本轮只修改 `src/content/blog-posts.sv.json`、现有 `tests/blog.spec.js` 的瑞典语部分和本条记录；不提交、部署或写入 GSC，不开始下一语言。分支 main、HEAD `05178e4101c46604e67e465cec279726af56c8fc`。保留此前瑞典语修复、首次失败证据及 AGENTS、站图、GSC/PRD 资料和并行越南语首页描述等原有或其他任务改动。

内容修正：排错篇与入门篇删除“网格永远只是预览辅助、不进入导出”的错误说明。按实际导出实现写清：Zoom 只影响预览；网格不改变文件像素尺寸，但 Original size、2× original、4× original 在每格宽高均至少 2 像素时可以把开启的网格线写进下载文件；Pixel size 的每格为 1×1 像素，不画导出网格。需要无网格线的文件时，先关闭 Visa rutnät。未改变工具的网格或导出行为。

例图展示：11 张原为原生小尺寸缩略图的正文例图复用已有 `pixelated` 字段，按相同可用宽度放大且不做平滑插值；连同原有两张细线结果，共 13 张小尺寸教学图。图注区分文件像素与显示放大。两张 512×512 源图保持原展示方式，下载资源、文件尺寸、透明度、alt 和来源未改。五篇非 body 字段与前轮已验收副本逐项一致，slug、发布日期、updated、标题、摘要、分享图和关键词定位保持不变。

验证：隔离副本 `/tmp/pixelart-sv-followup.YtR3My/build/` 使用现有依赖、Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0，避免在原目录构建覆盖工作区站图。build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 和 git diff --check 通过，站图仍 205 项。相关内容、瑞典语翻译、测试及 BlogPost、Editor、imageProcessor、预渲染代码与受验副本逐字节一致。

增强现有页面测试：1440/390/320px 的初始 HTML 与运行时均断言小尺寸例图清晰放大、宽度匹配现有容器，并保留真实文件尺寸和下载字节检查；排错与入门两篇强制检查网格条件说明，禁止旧错误表述。新增桌面/手机真实上传下载用例，以本站已有透明 512×512 源图、pixel size 8 比较四档导出尺寸：64×64 在网格开关前后解码像素一致；512×512、1024×1024、2048×2048 的网格开启结果不同，边界像素变化、格内像素不变；Zoom 调整后原尺寸下载像素仍一致。

新增两项定向测试 2/2 通过；最终相关 Chromium 56/56 通过，零重试、无跳过，约 1.9 分钟，其中瑞典语 50 项及既有三语言入口标签 6 项，不称为全站整套回归。已查看五篇新增放大例图的 1440px 与 320px 截图，图注与下载链接换行正常。证据为上述目录的 build.log、lint.log、typecheck.log、sitemap.log、focused-tests.log、final-tests.log、final-results/、final-report/ 与 screenshot-paths.json；前轮失败目录未覆盖。本次首次文档插入因另一任务新增顶部越南语记录而定位失败、未落盘；重读后仅追加本条，保留其内容。

状态：累计仍为本地修复 25/91。本轮生产式本地预览 `http://localhost:4335/sv/blog/`，旧 4220 及其他任务预览未操作。未发布或申请收录，母语审校、Illustrator 实机、Firefox/WebKit、实体手机及 Google 新版抓取/规范/搜索效果仍未验证。

## 2026-10-12 瑞典语五篇修复（本地完成，未发布）

用户在下一步说明后回复“继续”，授权处理 `src/content/blog-posts.sv.json` 五篇、必要分享图和现有测试，完成本地验收；不提交或发布。main、HEAD为923b3911767f3ff7184369bc83edd97d6e5b316e，保留AGENTS、其他文档及两份工作区站图改动。源码发现sv工具调色板说明误称除Pico-8外的命名调色板会自动生成；只配套修正 `adjustments.palette.note` 与 `adjustments.paletteSize` 两字段，其他英语回退控件按真实标签解释，不改首页FAQ残留或全站语言。

改稿前GSC：既有服务账号、webmasters.readonly实际读取；完整final/web窗口2026-09-12..2026-10-09逐日确认28天。五页及Google另选的三页规范网址分别读取page/query+page，未到25000行上限。B1/B2已收录、自规范，分别0点击43曝光及0点击8曝光；B3/B4目标page/query未返回，规范分别指向nb同名排错/Illustrator篇；B5目标0点击1曝光、query未返回，规范指向tl同名入门篇。不得以关联规范页的查询冒充sv表现。源头请求/响应及检查时间保存到GSC_SV_BLOG_BASELINE_2026-10-12.json，不是发布后效果。

### 改稿前主题与查询映射

下表目标均为 `/sv/blog/<slug>/`，窗口2026-09-12..2026-10-09；当地词为原任务的内容定位判断，不是已验证搜索量。

| slug | 瑞典语主词 | 意图 | 原样查询与限制 | 定位 |
|---|---|---|---|---|
| best-pixel-art-converters-compared-2025 | pixelkonstverktyg | 按照片转换/绘制/动画选工具 | piskel .com、piskelapp .com、pixel art best、was sind die besten hochwertigen bild-pixelierer-tools, die derzeit verfügbar sind?、ビジネスで信頼できる画像からピクセルアート変換ツールは？；不证明瑞典语需求 | 保留选择工具，删虚构十款实测与评分 |
| how-to-get-pixel-art-version-of-image | foto till pixelkonst i SNES-stil | 尺寸/限色静态图 | query未返回，page为0/8 | 保留视觉风格，非硬件模块 |
| make-image-more-like-pixel | förbättra pixelkonst | 轮廓/颜色/点纹/保存排错 | 目标page/query未返回，nb规范查询另列 | 保留排错，删除恢复和局部编辑承诺 |
| export-from-illustrator-image-to-pixel-art | exportera PNG från Illustrator | 正确源PNG尺寸与透明度 | 目标page/query未返回，nb规范page为0/97非sv指标 | 保留导出/按需转换，纠正PPI混淆 |
| how-to-pixelate-an-image | pixelera en bild | 首次上传/调参/保存 | query未返回，目标page为0/1；tl规范page/query未返回 | 保留入门，不增加Resize或图库 |

### 修改与本地验收

五篇保留原 slug 和发布日期，updated 为 2026-10-12。正文、摘要、标签、封面说明与分享文案改为瑞典语，删除虚构十款实测、评分、图库、动画及细节恢复等本站不具备的能力。实际完整 title（含品牌后缀）依次为 59/59/57/57/57 字符，摘要为 152/140/153/150/144 字符。两张比较表、16 组可见问答及对应 FAQ 结构化数据、15 幅真实案例图均经页面断言；FAQ 使用瑞典语标题与既有 faq 章节 id，不改共享解析逻辑。五张 1200×630 瑞典语分享 PNG 使用现有生成器，逐张查看字形、标签与真实结果区域，未新增生成逻辑。

图片均复用项目中真实资源，标明源图、文件尺寸、显示放大与工具输出的区别。SNES 篇说明仅为视觉风格，增加轮廓、明暗色块、小尺寸可辨性检查；排错篇以同宽放大的 128×128/32×32 下载案例说明细线丢失；Illustrator 篇区分像素尺寸、导出倍率和 PPI，给出尺寸算例但不冒充 Illustrator 实机截图或原生导出。Aseprite、Piskel、GIMP 和 Adobe 官方说明已在本轮联网读取；文章包含直接来源链接，不虚构价格或跨工具性能结论。两项 sv 调色板说明改为真实的固定/生成色数规则；仍为英文回退的实际控件标签按原样引用并解释，未借此扩修首页。

隔离副本 `/tmp/pixelart-sv-batch.Hb5tEz/build/` 起于 923b391，验收期间另一任务发布葡语描述后，同步该唯一应用文件至最新 HEAD `05178e4101c46604e67e465cec279726af56c8fc` 并重新构建、验收。保留所有其他工作区改动，未在原目录构建或覆盖站图。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0；最终 build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 与 diff-check 通过，站图仍 205 项。三个本轮应用/测试输入、五张分享图及最新葡语资源共九个文件与隔离副本逐字节一致，既有非瑞典语测试前缀、五个 slug 与发布日期机械比对保持不变。

最新副本相关 Chromium 测试 54/54 通过，零重试、无跳过，约 1.7 分钟；其中本轮瑞典语 48 项，既有三语言文章入口标签回归 6 项。覆盖初始 HTML/运行时、1440/390/320px、元数据、同语言导航与切换、16 组问答、五张分享图、Cookie 接受/拒绝与刷新持久化。1440/390px 实际上传、8/12 像素大小、自动 24 色与固定 Sunset 8、同会话 dithering、细线输出、透明 PNG 下载均验证当前预览与公开案例解码像素；非法文件、10MiB+1 拒绝、恰好 10MiB 接受与大图缩放后的恢复亦通过。测试等待新预览完成后下载，不声称修复立即下载旧结果的既有风险。最终日志与报告为 latest-tests.log、latest-results/、latest-report/；未将此 54 项称为全站整套测试。

失败证据保留：初次构建引用了不存在的复用图片路径，build.log 留存，改为真实的 `/tutorials/pixel-art-id/illustrator-pixel8.png` 后构建通过。首轮相关测试因测试误将比较表首列 th 当作 td、忽略单元格内手机列标签而失败；该轮 7 通过、1 失败、1 中断、45 未运行，保留 table-selector-failure-tests.log、对应 results/report。只修正测试定位以严格核对现有全部表值，2 项定向复测通过，再完成原基线 54 项及最新基线上述 54 项验收，没有删除失败证据或放宽内容断言。

已查看五篇桌面/320px 封面、手机正文上下文、手机工具控件与五张分享图；整页截图的固定导航位置受拍摄前滚动影响，不能据此当作首屏截字结论，另补回到页面顶部的桌面/手机截图。全稿自审已逐段核对真实功能、尺寸算例和来源边界，不冒充独立母语审校。预览保留 `http://localhost:4220/sv/blog/`，独立 serve-dist PID 53129；原阿语预览未操作。累计本地修复 25/91。未提交、推送、部署、请求 GSC 收录或开始下一语言；母语审校、Illustrator 实机、Firefox/WebKit、实体手机及 Google 新版抓取/规范/搜索效果仍未验证。

## 2026-10-12 葡语首页描述单页发布准备

用户明确选择“提交并发布 /pt/ 修复”。仅提交 `public/locales/pt/translation.json` 的描述修改及本文件中葡语本轮记录，不包含瑞典语、AGENTS、GSC 资料、修复盘点和两份工作区站图。起点本地与远程 main 均为 `923b3911767f3ff7184369bc83edd97d6e5b316e`，暂存区为空；原有未提交内容保留，不回滚或混入发布。

实际待发布副本 `/tmp/pixelart-pt-release.prWrNP/build/` 从该干净提交生成，只应用获准葡语字段和定向迭代记录。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，build（含 SEO、dist、缓存/重定向）、lint、typecheck 和 sitemap:verify 全部通过，站图仍 205 项。源 JSON 与基线仅 `home.seoDescription` 不同；待发布静态 HTML 的普通、OG、Twitter 描述与 146 字符新文案一致，title 保持原样，dist 葡语语言包与获准源码一致。记录补充不改变应用构建输入；构建日志为该目录上一层的 release-validation.log。

发布方式沿用 main 推送触发的 Cloudflare Pages Git 集成，项目 `pixelartvillage1`；GitHub Pages、CI 和 Lighthouse 为另行运行的现有检查，不以 GitHub Pages 成功代替正式域名部署。推送后按完整提交 SHA 核对 Cloudflare check-run 和部署标识，再验收 `https://pixelartvillage.org/pt/` 的初始 HTML、浏览器加载后描述、刷新与语言切换。未更改云端配置、发布渠道或搜索引擎索引设置；正式发布结果另记回执。
## 2026-10-12 葡语首页描述单页修复（本地完成，未发布）

授权与范围：用户对仅处理 `/pt/` 的建议回复“执行”。只修改 `public/locales/pt/translation.json` 的 `home.seoDescription`，并补本条记录；不改 title、H1、首页正文、其他语言、Blog、converter、共享生成逻辑或站图。保留原有 AGENTS、瑞典语翻译、两份站图及其他工作区改动，不提交、推送、部署或请求搜索引擎收录。

依据与修改：用户的必应重复描述 CSV 列出了 `/pt/`；线上抽查确认它与日语首页使用相同英文描述。已导出的页面统计在 2026-09-11、09-18、09-25、10-02 四批记录中，葡语首页合计 63 点击、722 展现，不把这四批记录当作逐日数据，也不据此证明重复描述导致流量下降。源码该字段本身为英文，不是缺键回退；沿用既有语言资源规则替换为 146 字符葡语：`Converta imagens em pixel art grátis no navegador. Ajuste o tamanho dos pixels e a paleta, veja a prévia e baixe o resultado no Pixel Art Village.` 保留图片转换、像素大小、调色板、预览和下载的真实用途，不改变页面定位。

构建与验收：为避免 prebuild 覆盖原有站图或生成资源，使用隔离副本 `/tmp/pixelart-pt-meta.xynljY/work/`、既有依赖与 Node 20.19.0，分析关闭、VITE_E2E=0。改前基线与改后 `npm run build` 均通过，含 SEO、dist 和缓存/重定向检查。两次 225 个 HTML 的 title、meta、link、HTML 语言和头部 JSON-LD 对比，仅 `/pt/` 元数据变化，其他 224 页保持一致；葡语可见正文去除脚本后完全一致。普通、OG、Twitter 描述均为新文案且无截断，title、canonical、hreflang 保持原样。源 JSON 结构比较仅 `home.seoDescription` 变化；原工作区 AGENTS、sv 翻译和两份站图的校验值未变。

真实页面：专用 4327 生产式本地预览 HTTP 200，独立浏览器确认初始 HTML 与加载后描述一致，刷新正确；通过真实语言选择器按英文→葡语→日语→葡语切换，未将葡语描述带入其他语言。1440×900 和 390×844 截图已查看，上传入口存在，title、canonical、lang 与 H1 均保持原样；不将该项元数据验收写成上传处理或下载全流程回归。证据为上述目录中的 build-baseline.log、build-final.log、baseline-home-metadata.json、static-verification.json、verification.json 和 runtime-verification.json。

状态与边界：本地修改完成，专用浏览器和预览在收尾关闭。未发布，未验证必应新版抓取、建议消除、排名或点击率改善。葡语首屏仍有既有英文回退，其他语言描述和报告明细缺项未在本轮修复；不把本次单字段修改计为原 91 页修复计划中的完整首页补译。

## 2026-10-12 阿语五篇正式发布准备

用户明确授权“部署上线”。仅发布五篇阿语正文、四个工具翻译字段、阿语分享图与排错图、必要方向/问答兼容代码和既有测试；不包含AGENTS、其他任务文档、工作区站图或下一语言。远程main与本地HEAD均为5108e1939fa96fb3ee6374f7793f0075aa5f34f8，保留已上线性能代码。最终合并版本本地344项Chromium零重试通过的记录见下；提交前另核对实际发布副本、构建、lint与typecheck，发布后核对对应提交的Cloudflare状态并验收真实线上阿语页面与工具。不请求GSC收录或承诺搜索表现。

实际发布副本 `/tmp/pixelart-ar-release.RsrPok/build/` 由干净HEAD和15个获准文件的暂存补丁生成，13个应用/测试/图片文件与前轮最终344版本逐字节一致，另外两个为阿语基线和仅阿语段落的迭代记录。Node20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0，build（含SEO/dist/缓存重定向）、lint、typecheck、sitemap:verify和暂存diff-check通过。发布前重跑完整Chromium：343/344通过，阿语48/48通过；唯一失败为英文SNES桌面用例请求本地photo-sunflower-pixel12.png遇ECONNRESET。未改业务或放宽断言，随后该文件8/8零重试复测通过。保留release-regression.log、local-results/、local-report/及recheck.log、recheck-results/、recheck-report/，不把首轮失败记为整套一次通过。

## 2026-10-11 阿语五篇审查建议修复（最终合并版本本地通过，未发布）

授权与范围：用户对五篇只读审查的五项建议回复“执行建议”。仅修改 `src/content/blog-posts.ar.json`、`public/locales/ar/translation.json` 的四个配套字段、两张阿语排错 PNG、现有阿语测试，以及问答识别所必需的两行共享代码。main、HEAD为 `5108e1939fa96fb3ee6374f7793f0075aa5f34f8`；保留原有阿语实施、AGENTS、站图、GSC资料及其他工作区改动，不提交、推送、部署或GSC写入，不启动下一语言。

内容：无调色板选项改为“بلا لوحة”，修正固定调色板说明、生成色数上限标签和dithering名称，同步三篇教程并删除已不适用的“界面解释错误”提醒。五篇FAQ标题统一为“الأسئلة الشائعة”；运行时与预渲染问答识别兼容既有 `faq` 章节id和原英文FAQ标题，保留16组问答结构化数据，不改其他语言正文。Illustrator篇增加256px画板在1x/2x下的256×256/512×512算例及300×200→600×400反例，明确是尺寸算例而非实机导出。SNES篇增加轮廓、明暗色块、小尺寸辨识度三项视觉判断和需手绘的边界，不冒充硬件规范。

真实排错案例：复用本站已有浏览器生成的透明PNG 512×512源图，实际上传本站工具并下载Pixel Size 4和16的128×128/32×32 PNG，新增于 `public/tutorials/pixel-art-ar/`。两种输出以相同显示宽度、不平滑放大，图注区分显示与文件尺寸，解释重新处理原图而非恢复32×32丢失细节。正常下载、当前会话预览、公开文件解码像素严格一致；两个视口像素相同。固定中部下方扫描线验证4保留三组分离线条、16仅一组，不只验证文件存在或截图非空。原slug、发布日期、title、seoTitle、摘要和分享文案未变，updated仍为2026-10-11。

最终构建与合并验收：隔离副本 `/tmp/pixelart-ar-followup.lRIiCr/` 包含当前HEAD性能代码和工作区适用改动，非沿用原81524cf隔离版。Node20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0；最终build（含SEO、dist、缓存/重定向检查）、lint、typecheck、受影响JS最终ESLint、sitemap:verify和diff-check通过，站图仍205项。受影响内容、翻译、共享代码、测试和PNG与隔离副本逐字节一致，现有非阿语测试前缀未改。独立4218生产式服务上，最终23文件Chromium完整回归344/344通过，零重试、无跳过，约6.9分钟，其中阿语48项（原46项增强及新增2项真实细线流程）；覆盖初始HTML/运行时、1440/390/320px、FAQ、实际标签/固定与生成调色板、真实PNG下载与输入错误边界。日志和报告为build-final-v2.log、consistent-tests.log、consistent-results/及consistent-report/，不将此前失败轮次记为通过。

失败记录：第一次后台服务未就绪导致连接拒绝，停止该轮并保留followup-tests.log、followup-results/和startup-failure-report/。随后完整回归341/344：英文SNES一次本地资源请求ECONNRESET，两个新增案例与先前CLI下载的PNG边缘像素不一致。核对CLI浏览器154.0.8037.99、测试浏览器141.0.7390.37；1440/390两次实际下载像素完全一致，原CLI154下载和截图留存，不据此声称所有浏览器输出逐像素相同。改用本轮验收浏览器141实际下载的两张PNG作为公开案例，并将新用例调整为先完整采集两个输出再严格比较，未放宽预览、公开像素或线条断言。reference-capture-tests.log及结果保留该差异失败，修复后3项定向复测通过，再完成上述最终344项完整回归。原341/344记录在final-tests.log、final-results/和first-regression-report/。

页面与停止：独立CLI浏览器检查新增SNES段落、Illustrator算例、排错图例及工具标签的1440/390/320px页面；有上下文截图，未见横向溢出，新增文字完整可读。工具截图首次因布局尚未稳定未定位到控件，原图保留；补用实际滚动、预览解码、两帧等待及元素y约150核对，最终tool-labels-positioned-*截图已查看。最终Chromium141报告的320px两张图例截图也已查看；紧贴figure的截图边缘不是完整页面截字结论。浏览器已关闭，旧4215预览未操作；新版预览 `http://localhost:4218/ar/blog/`，独立后台serve-dist PID62594保留并复核HTTP200。累计本地修复仍20/91，本轮是五篇补充纠错，不增加目标数。母语审校、Illustrator实机、Firefox/WebKit、实体手机和发布后Google抓取/规范/排名仍未验证；未修全站翻译或已知立即下载旧结果风险，未发布。

## 2026-10-11 阿拉伯语五篇与局部方向修复（本地完成，未发布）

授权与范围：用户先要求“继续”，在方向检查提出具体配套范围后回复“同意”。处理 `src/content/blog-posts.ar.json` 五篇及必要分享图/现有测试；额外只为阿语博客列表与五篇的初始HTML补dir=rtl，必要比较表仅在阿语分支右对齐，涉及 `scripts/build/prerender-spa.cjs`、`src/components/BlogPost.jsx`。不改全站RTL、其他语言内容、首页、工具、canonical/hreflang或索引覆盖，不提交、推送、部署或GSC写入。开工时main、HEAD为 `81524cf6ee7603fc717630c0d8f13919ba971f62`，保留原有id/nb/it及文档/测试/图片改动。收尾期间其他任务分别提交十五篇修复与性能优化；本次收尾检查HEAD为 `5108e1939fa96fb3ee6374f7793f0075aa5f34f8`。这些提交不属于阿语批次，不覆盖其文件或记录，不将隔离副本的测试结果冒充新HEAD整体合并验收。

改稿前GSC：使用既有服务账号、webmasters.readonly范围实际读取成功；技能默认认证脚本/配置不存在，未声称其检查通过。完整28天final/web窗口 `2026-09-11..2026-10-08`，逐日完整性确认，目标page和query+page分别请求，未触及25000行上限。五页当前全部已收录、自规范，不据此认为旧英文重复无须修复。B1–B4均0点击，分别94/1/30/16曝光；B5页面和查询未返回，不补零。B1九条query主要为英文/品牌，如piskel .com、the best pixel art；B2/B4没有query行，B3仅pixelbridges.ca一条。尚无已验证阿拉伯语搜索需求，不把英文/品牌表现当本地词搜索量。原请求/响应及时间已原样保存为 [GSC_AR_BLOG_BASELINE_2026-10-11.json](GSC_AR_BLOG_BASELINE_2026-10-11.json)，不是发布后结果。

### 改稿前主词与意图映射

下表窗口均 `2026-09-11..2026-10-08`；当地主词为保留原任务的定位判断，不是已验证搜索量。正文纠错不因没有当地查询而停止，也不为旧查询编造工具模块。

| 目标路径（均在/ar/blog/下） | 阿语主词 | 意图 | 已返回query与限制 | 定位调整 |
|---|---|---|---|---|
| best-pixel-art-converters-compared-2025/ | محولات فن البكسل | 按用途选照片转换器/绘图编辑器 | piskel .com、piskelapp .com、the best pixel art等九条；不证明阿语需求 | 保留比较，删十款虚构实测与排名 |
| how-to-get-pixel-art-version-of-image/ | تحويل الصور إلى فن بكسل | SNES风格的尺寸与限色静态图 | query未返回，page为0/1 | 保留SNES风格，非硬件格式 |
| make-image-more-like-pixel/ | تحسين فن البكسل | 轮廓、颜色、迪瑟、保存排错 | pixelbridges.ca仅1曝光；不是恢复功能依据 | 保留排错，删AI恢复/选区模块 |
| export-from-illustrator-image-to-pixel-art/ | تصدير PNG من Illustrator | 准备正确像素尺寸/透明度的源PNG | query未返回，page为0/16 | 保留导出/按需转换，纠正PPI混淆 |
| how-to-pixelate-an-image/ | تحويل صورة إلى بكسل | 第一次上传、调参、保存PNG | page/query均未返回，不补零 | 保留入门，不新增Resize或图库 |

### 实施、专门复核与本地验收

内容：完成五篇阿语正文、title/seoTitle、摘要、标签、两张比较表、16组FAQ、13个图块的图注/下载标签、作者与批内链接、展示和分享文案。保留数字键0–4、原slug和发布日期，updated为2026-10-11。五篇分别回答工具选择、SNES风格照片、轮廓/颜色/迪瑟/保存排错、Illustrator源PNG准备、首次上传保存。完整HTML标题字符数55/55/60/60/58，摘要140/143/151/148/138。比较篇披露本站运营者身份，不保留虚构十款实测、评分和价格；不新增AI恢复、选区编辑、Resize、图库、动画或SVG导出能力。

配套方向：预渲染仅为 `/ar/blog/` 列表及五篇的html补dir=rtl；运行时沿用LangRoot，不重做全站方向。两种文章渲染的比较表仅在ar分支右对齐。`scripts/build/gen-pseo-og.cjs` 仅为ar文案设置SVG文字方向与右侧锚点，图片几何和非ar分支保持原行为。生成五张1200×630阿语PNG，逐张目视核对字形、PNG/Illustrator等混排、标签与图像内容；相关测试核对实际尺寸、大小和结果区域像素。其他语言既有15张分享图与隔离生成结果逐字节一致。

数字与窄屏：实际字符坐标检查发现RTL正文中的960×762、80×63等尺寸可被显示成宽高倒置，即使文字断言已经通过。仅在阿语内容的62处尺寸表达式使用U+2066/U+2069从左到右隔离；不改尺寸数值、路径、slug、日期或技术事实。随后目视发现窄屏封面中带空格的尺寸仍可能被换行拆开，进一步只将十个封面标签的格式名与尺寸放入同一隔离片段、移除尺寸式内部空格。最终正文严格检查宽度首位数字在高度末位数字左侧；封面还检查两者位于同一行，不靠容差、重试或删断言通过。

资料与专门语义复核：完整重读最终270行阿语JSON，逐段核对五篇、两张表、16组问答、13个图块、链接、标签、菜单和分享文案。对照已有源码、真实控件及官方资料，区分10MiB字节拒绝与2200px等比缩小；8/12对应120×95/80×63；生成色数是上限且初始化可变；固定调色板不受数量滑条控制；透明保留不等于去背景；PPI不替代文件像素；SNES外观不等于硬件数据；Original size不恢复原细节。使用并解释真实英语导出标签及阿语中误译的迪瑟标签，提醒等待新预览再下载。Aseprite、Piskel、GIMP Pixelize/导出与Wikimedia本轮请求200。Adobe本轮三个英语官方URL请求403，复用并实际阅读此前意大利语批次成功取得的英语官方资料，不称本轮Adobe请求200或Illustrator实机验证。八个复用素材经解码与13处尺寸核对；两张24色例图各24种不透明RGB色，真实64×64透明转换有1600全透明、36半透明、2460不透明像素。浏览器原生512/64示意图、512→64本站真实转换、Illustrator资料步骤明确分开。本段是Friday执行者的专门自查，不是独立或母语审校。

构建与输入：隔离副本 `/tmp/pixelart-ar-batch.HOdy0K/build/` 基于开工HEAD，覆盖适用id/nb/it已验收输入及阿语稿件、三个共享文件、测试和图片，复用既有依赖，未安装包。Node20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0。最终一致版本build、lint、typecheck、verify:dist、sitemap:verify通过，站图仍205项；工作区diff-check通过。最终40个相关内容/翻译/代码/测试/图片/案例输入逐字节匹配隔离副本，GSC快照与原采集文件相同，原键/slug/发布日期与历史迭代正文保留。初始html的dir=rtl仅出现在六个阿语Blog页面，其他生成页面未新增该方向。dist、生成站图和其他语言图片留在副本，不覆盖工作区产物。此副本没有纳入后来5108e19的性能改动；阿语未来提交发布须在届时HEAD重新做合并验收。

测试：新增46项阿语用例，包括五篇×初始HTML/运行时×1440/390/320px共30项、五张分享图、四项Cookie选择保持、六项真实工具流程、一项语言切换恢复RTL/LTR。覆盖列表点击、文章/返回导航、直接访问/刷新、SEO与适用JSON-LD/可见FAQ、图片解码及文件字节、实际表格列与封面源图顺序；真实上传后8/12尺寸和公开PNG像素、生成色数上限、同会话迪瑟、512→64透明下载、非法文件、10MiB+1拒绝与边界恢复、3000×1500→2200×1100。阿语原生滑条在RTL时ArrowLeft增加数值；新流程使用ArrowUp，不改控件行为。原有测试前缀保留，同期意大利语额外断言单独识别并保留。

最终先完成阿语46项及意大利语适用页面/工具36项，共82项定向检查，零重试，约2.8分钟；随后完整23文件Chromium回归342/342通过，零重试、无跳过，约6.8分钟，命令为 `EXPECT_CONSENT_BANNER=1 AR_RUN=consistent-final npx playwright test --config=playwright.ar.config.ts --project=chromium --retries=0`。最新结果在consistent-final-tests.log、consistent-final-results/和consistent-final-report/，不是沿用较早版本的342项结果，也不是全浏览器或新HEAD整体验收。

保留的失败与方法修正：旧构建初始dir负例按预期失败；第一轮26项通过后视觉坐标仍发现尺寸倒置，旧数字稿负例及visual-before-numeric/保留；修复后封面换行问题截图另存visual-before-cover-labels/。中间合并时Friday同步了意大利语新断言/翻译却漏同步对应新稿件，18项意语正文检查失败，660秒外层命令超时，整轮未完成；不得称该轮通过或把它当阿语内容负例。final-input-audit.log明确报意语输入不一致，merged-final-tests.log及结果/trace保留。补齐三份意语输入并重新构建后，输入审计、82项定向和342项完整回归通过，没有删除或放宽意语断言。收尾截图首次因滚动尚未完成仍拍到首屏，原图/日志在crop-context-before-position-fix/；仅修正临时截图脚本为instant滚动、等待两帧并核对元素y=110，不改业务或测试源码。

真实页面与最终截图：最终五篇×三宽度15组HTTP200，图像实际解码，无横向溢出、本站资源4xx/5xx或页面脚本异常，尺寸坐标检查通过。三宽度列表、15组首屏与封面、五张最终分享PNG、桌面与手机比较表、Illustrator源图/透明转换和入门源图均已目视查看。收尾针对320px工具表、390px排错表、320px源图与真实转换补拍四组带上下文及16px留白的截图，检查定位与文本范围并实际查看：此前紧贴元素边界的裁图切掉部分阿语字形，完整页面中的文字并未截断。不改CSS。final-crop-positioned-check.log、final-crop-check.json及*-context.png、*-padded.png保存证据。Chromium模拟视口不称实体手机或真人阅读验收。

停止与未验证：阿语五篇本地完成，累计本地修复20/91个目标URL；不因此称Google规范归属、需求或流量已改善。预览 `http://localhost:4215/ar/blog/`、serve-dist PID41338保留，收尾独立浏览器已关闭。阿语批次未提交、推送、部署、请求收录或GSC写入，不自动开始sv；其他任务提交/发布状态以各自记录为准。阿语固定调色板说明与迪瑟界面误译仍未修，正文解释不能代替工具资源修复。已知立即下载旧结果风险、母语审校、竞品/Illustrator实机、Firefox/WebKit、实体手机、后来性能代码与阿语的合并验收及发布后效果仍未验证。本次授权至此结束。

## 2026-10-11 阿拉伯语批次开工检查（方向支持待确认）

授权与范围：用户在意大利语五篇交付后要求“继续”，下一主要内容源按PRD为 `src/content/blog-posts.ar.json` 五篇。先只读核对工作区、原稿、预渲染和运行时方向支持；保留此前全部本地改动，尚未改阿语正文、图片、测试或共享代码，未提交、推送或部署，累计本地完成仍15/91。

实际发现：使用既有4214生产式预览，独立Playwright浏览器分别关闭/开启JavaScript检查阿语博客列表及五篇，12组HTTP均200。初始HTML只有lang=ar，无dir属性，正文/列表容器计算方向为ltr；脚本加载后LangRoot将html.dir设置为rtl，六页容器全部变成rtl。这是实际初始HTML与运行时方向不一致，不是翻译尚未写好造成的测试失败。当前阿语稿仍为旧英文内容，本次不冒充已完成阿语文字或混排验收。四个相关源码文件与所访问隔离构建逐字节一致，排除检查另一份源码的情况；未检查线上部署。

需要确认的配套范围：仅为 `/ar/blog/` 及这五篇补初始HTML方向，优先限定 `scripts/build/prerender-spa.cjs` 的阿语Blog路由分支；文章比较表在 `src/components/BlogPost.jsx` 中目前写死text-left，必要时仅在阿语分支补右对齐并同步适用预渲染输出。不全站重做RTL，不改其他语言、首页、工具、canonical或hreflang。按PRD第10/13节，方向支持超出单纯JSON改稿，先向用户确认，不擅自扩改。分享图字体/字形、数字及参数混排还未验收；若另需生成器改动，先提供具体证据再列范围。

证据与停止：`/tmp/pixelart-ar-rtl-check.edxFXB/` 保存初始HTML、12组direction-observations.json、列表/入门初始与运行时截图、源码一致性记录及工作区检查。观测脚本成功执行不等于本批验收通过。独立浏览器已关闭，既有4214服务保留，未新开或关闭其他服务。本轮未采集阿语GSC或开始五篇改稿；先等待必要方向配套授权，再按完整GSC窗口、主词映射、改稿、真实工具和页面验收继续，不自动跳到sv。

## 2026-10-11 印尼语、挪威语、意大利语十五篇合并发布准备

授权与范围：用户对整理十五篇提交、验证和部署的建议回复“执行”。只纳入id/nb/it各五篇、三种语言配套翻译、十五张分享图、共用透明案例、相关测试和本批记录；排除阿语实施中的正文/方向/生成器/图片/测试，AGENTS、PRD、修复统计表、俄语GSC基线及其他原有文档改动。main与实时origin/main起点均为81524cf6ee7603fc717630c0d8f13919ba971f62，暂存区为空。使用干净HEAD隔离副本，复用既有依赖；原工作区其他改动不覆盖。采用既有Cloudflare Pages Git集成，不改渠道、配置或索引规则，不执行GSC写入。

最终发布版本验收：隔离副本 `/tmp/pixelart-15-release.P8MpQe/build/`，Node20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0。build（含SEO、dist、缓存/重定向检查）、lint、typecheck、sitemap:verify与暂存diff-check均通过；站图仍205项。独立4217生产式服务、EXPECT_CONSENT_BANNER=1、Chromium完整23个测试文件296项全部通过，零重试、无跳过，约5.4分钟；不是仅沿用分批结果。覆盖十五篇初始HTML/运行时三种宽度、SEO/FAQ/分享图/案例下载、语言切换、Cookie保持、真实工具正常/边界/错误输入及既有全站回归。二十二个内容/翻译/PNG与批准的工作区版本逐字节一致；测试仅保留阿语区段之前的现有辅助代码和三个批次，阿语正文和三份方向/生成器代码均维持HEAD原版。日志及浏览器证据在本目录release-build.log、release-regression.log、local-results/和local-report/。十五篇本地修复完成；正式部署和线上验收尚待回执。母语审校、Illustrator实机、Firefox/WebKit、实体手机及发布后Google表现未验证。

## 2026-10-11 意大利语复查建议修正（本地完成，未发布）

授权与范围：用户对意大利语复查的三项发现回复“给我修复”。按内容源顺序完成：先改 `public/locales/it/translation.json` 两个字段、构建及定向测试，通过后再同步 `src/content/blog-posts.it.json` 的B2/B3/B5正文和现有意语测试。main、HEAD仍为 `81524cf6ee7603fc717630c0d8f13919ba971f62`；保留此前各语言稿件、图片、文档及进行中的阿语正文/方向/生成器改动，不修改阿语或其他共享代码，不提交、推送、部署或GSC写入。

修改：调色板说明明确Pico-8、Lost Century、Sunset 8、Twilight 5、Hollow使用固定颜色集；主动开启Genera palette da immagine才从照片提取颜色，数量滑条不改变固定调色板。数量标签由重复的 `# Palette Palette Colori` 改为 `Numero di colori: {{value}}`，保留动态数值。三篇教程同步真实控件名称，其他事实、参数与下载步骤不变。逐字段比较确认翻译只有 `adjustments.palette.note`、`adjustments.paletteSize` 改变，文章只有 `1.body`、`2.body`、`4.body` 改变；未改主词、title/seoTitle、摘要、日期、URL、canonical/hreflang、分享图或功能。

测试：现有意语工具用例增加独立的固定调色板事实断言、错误自动生成说明的排除断言，以及16/24两个实际数值对应的可访问标签；不是只拿翻译JSON作为正确性依据。文章用例检查B2/B3/B5可见控件名称并排除重复/错误提示。原尺寸、限色、真实下载与预览、透明度及文件边界断言不放宽；本轮修改时意语之前部分及阿语之后部分与修改前逐字相同。收尾期间其他任务另增阿语封面数字方向断言，保留不覆盖，不纳入本轮意语通过范围。

构建与验证：HEAD隔离副本 `/tmp/pixelart-it-followup.DcfRDx/build/` 覆盖采样时工作区相关代码/内容/图片，复用既有依赖，不安装包，生成产物留在副本。Node20.19.0、`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0`。翻译阶段构建和6项Chromium定向测试通过；正文同步后重新构建，`npm run build`、`npm run lint`、`npm run typecheck`、`npm run verify:dist`、`npm run sitemap:verify` 和工作区 `git diff --check` 通过，站图仍205项。最终命令为 `EXPECT_CONSENT_BANNER=1 IT_FOLLOWUP_RUN=final npm run test -- --config=playwright.followup.config.ts --project=chromium tests/blog.spec.js tests/i18n.spec.js --grep='Italian batch|i18n basic|Spanish'`，在独立4216生产式服务、零重试下54项全部通过，约1.7分钟，无跳过。覆盖意语五篇初始HTML/运行时1440/390/320px、SEO/FAQ/图片下载、语言切换、Cookie保持、真实工具尺寸/颜色/迪瑟/透明下载和非法输入，并保留适用i18n回归；不是全仓库/全浏览器验收，不沿用原220项结果冒充本轮通过。

页面与证据：另用本轮独立Playwright CLI浏览器实际上传照片并开启自动调色板，查看1440/320px说明与数量标签，以及B2/B3/B5修改段落；HTTP200，相关页面无横向溢出，10张相关局部截图已目视查看，文字完整可辨。证据目录 `/tmp/pixelart-it-followup.DcfRDx/` 保存修改前副本、两轮构建、6项及54项测试结果/报告、质量日志和截图。两个受影响内容文件、共享测试的意语区段及之前的导入/辅助逻辑与最终验收副本逐字节一致。第一次收尾输入比较仅见阿语正文变化；随后整测试文件比较因其他任务新增阿语封面断言而失败，定向diff确认变化只在阿语区段，差异另存 `concurrent-ar-tests.diff`，没有放宽或忽略意语变更。保留这两项并行变化，不覆盖、追改或将本轮结果用于证明阿语新版本通过。

停止与预览：本轮独立浏览器已关闭，预览 `http://localhost:4216/it/blog/`、serve-dist PID65412保留，4214/4215及其他既有服务不关闭。未提交、推送、部署、重新读取GSC或请求收录；累计目标数不增加，本轮是已完成五篇的配套纠错。母语审校、Illustrator实机、Firefox/WebKit、实体手机和发布后Google表现仍未验证；其他首页/About语言问题、统计CSP告警和立即下载旧结果风险不在本轮范围。三项复查建议至此完成，不继续其他批次。

## 2026-10-11 意大利语五篇修复（本地完成，未发布）

授权与范围：用户在挪威语批次交付后要求“继续”，按PRD第12.3节处理 `src/content/blog-posts.it.json` 的B1–B5、五张意大利语分享图、现有Blog测试和本记录/只读GSC快照。main、HEAD `81524cf6ee7603fc717630c0d8f13919ba971f62`；开始时已存在的印尼语/挪威语稿件、资源、图片、共享测试及AGENTS/文档/基线保留。本轮不改其他语言、首页、工具、canonical、hreflang、索引覆盖，不提交、推送、部署或GSC写入。

改稿前GSC：既有服务账号以 `webmasters.readonly` 范围访问官方API，实际Tier1读请求成功。技能默认auth脚本/配置未发现，使用既有已验证脚本，仅把目标语言改为it；凭据路径通过命令环境提供，未保存凭据。取数2026-10-11T11:46:34.776479Z至11:47:15.792507Z，太平洋完整28天 `2026-09-11..2026-10-08`，final/web、页/query+page分别读取，未达25000行上限。原请求/响应原样保存为 [GSC_IT_BLOG_BASELINE_2026-10-11.json](GSC_IT_BLOG_BASELINE_2026-10-11.json)，不是发布后结果或新监控系统。

B1/B3页与query未返回，当前Google规范分别为sv比较篇/nb排错篇；B2当前已收录且自规范，2点击/86曝光，10条query含 `trasformare foto in pixel art`（1曝光/0点击）。B4已收录且自规范，0点击/35曝光、3条query。B5当前为重复规范到id入门篇，但本窗口仍返回0点击/51曝光、4条query，不能把当前规范状态当作历史每天状态。关联页去重读取：sv比较0/46、nb排错0/127、id入门6/804，不能将其全量当意大利语需求或未来新增流量。五页最近抓取依次为2026-10-09T01:22:13Z、10-10T04:59:05Z、08-25T16:13:16Z、10-04T19:02:57Z、10-07T04:03:47Z。

### 改稿前主词与意图映射

窗口均为 `2026-09-11..2026-10-08`。除了B2有一条当地语言查询，各主词是保留原任务的内容定位判断，不是已验证搜索量；这条查询也不能代表当地市场总需求。缺行记录未返回，不补零，不因缺少查询停止事实纠错。

| 目标网址 | 目标语言主词 | 搜索意图 | 已返回的相关query与完整日期窗口 | 证据来源与限制 | 是否改变原定位及理由 |
|---|---|---|---|---|---|
| `/it/blog/best-pixel-art-converters-compared-2025/` | `convertitori pixel art` | 按用途选照片转换器或像素编辑器 | 目标未返回；关联sv含 `piskel .com`、`piskelapp .com`、`pixel art best` | 关联行不证明意大利语需求；竞品据官方说明 | 保留比较，删除十款虚构实测及排名 |
| `/it/blog/how-to-get-pixel-art-version-of-image/` | `trasformare foto in pixel art`，限定 `stile SNES` | 照片的复古尺寸/限色静态结果 | `trasformare foto in pixel art`、`how to convert photo to pixel art`、`photo pixel art converter`；另有 `pixel art refiner` | 一条意语词仅1曝光；不为refiner虚构模块 | 保留SNES风格，明确不是硬件格式 |
| `/it/blog/make-image-more-like-pixel/` | `migliorare la pixel art` | 转换结果的轮廓、颜色、点纹和保存排错 | 目标未返回；关联nb含 `enhance pixel art`、`make image more pixelated`、`pixel art simplifier` | 关联旧英文查询不证明意语需求；不承诺恢复 | 保留结果排错，删除AI恢复/选择编辑 |
| `/it/blog/export-from-illustrator-image-to-pixel-art/` | `esportare PNG da Illustrator` | 准备像素尺寸/透明度正确的源图，按需转换 | `pixel art in illustrator`、`image pixelator art`、`soimages` 各1曝光 | 三条不等于页35曝光全量；Adobe意语403、英语200，读英语原文 | 保留导出和后续转换，纠正PPI误解 |
| `/it/blog/how-to-pixelate-an-image/` | `come pixelare un’immagine` | 首次上传、调参、保存PNG | `pixelartvillage`、`pixel art village`、`pixelate iamge`、`what aesthetic is this` | 品牌/英文查询不证明意语词搜索量；规范归属可能变化 | 保留入门，不新增Resize或图库操作 |

### 实施、专门复核与本地验收

内容：完成五篇意大利语正文、title/seoTitle、摘要、标签、两张表、16组FAQ、13个图块的图注/下载标签、作者入口、展示标签及分享图文案；保留数字键0–4、原slug和发布日期，updated为2026-10-11。五篇分别回答工具选择、SNES风格照片、转换排错、Illustrator源PNG准备、第一次上传保存。比较篇披露本站运营者身份，按Pixel Art Village、Aseprite、Piskel、GIMP四种工具功能比较，删除虚构十款实测、旧价格与评分；排错不承诺AI恢复，SNES不承诺硬件兼容，Illustrator区分PPI、文件像素与两种导出路径。最终HTML完整title字符数55/59/59/59/59，摘要152/151/153/151/149，不触发155字符截断。批内页面链接在实际HTML和运行时保持意大利语，资源地址不加语言前缀。未改共享渲染、工具行为、canonical/hreflang、重定向或其他页面。

资料与素材：重新读取Aseprite、Piskel、GIMP Pixelize/导出、Wikimedia照片与许可说明，均HTTP200；核对功能、导出格式、桌面使用建议、Don McCulley/CC0。Adobe三种意大利语文档请求403，随后相应英语官方文档200并实际读取Export for Screens、Export As/PNG和pixel-perfect相关说明；正文明确依据英语资料、菜单名称可能随语言/版本不同，未做Illustrator实机操作。失败响应和英语正文均保留，不把读取资料写成软件实测。复用八个既有输入/结果：960×762 JPEG、120×95/80×63 PNG、同会话24色迪瑟对照、浏览器512×512/64×64示意图及印尼语试点真实透明64×64下载。重新解码并核对13个图块尺寸；两张24色图实际各24种不透明RGB色，透明转换结果有1600全透明、36半透明、2460不透明像素。浏览器原生64×64和512→64本站转换明确分开，不冒充Illustrator导出或本轮新生成案例。新增 `public/blog-og/it/` 五张1200×630 PNG，实际解码、逐张目视检查，结果区域与素材逐像素相符，未覆盖其他语言图片。

专门语义复核：Friday在定向测试后、交付前完整重读最终JSON，逐段检查五篇标题/摘要/正文、16组问答、两张表、13个图块、图注、标签、链接和分享文案。对照源码、真实意大利语控件及官方资料，核对动作方向、数字、条件、否定和来源：10MiB字节拒绝与2200px等比缩小分开；8/12对应120×95/80×63；24色是上限而非必定24；固定调色板不由数量滑条改变；透明保留不等于去背景；PPI不替代文件像素；SNES风格不等于硬件数据；等待新预览后下载。保留品牌、格式、英语菜单和实际Pixel size/Original size标签并解释；Genera palette da immagine、Scarica Immagine Pixel Art与现有界面相符。未发现正文尚待解决的关键技术语义矛盾；这是同一执行者的专门自查，不是独立或母语审校，未调用额外Agent、翻译服务或付费工具。

构建与服务：从HEAD导出隔离副本 `/tmp/pixelart-it-batch.PKJEwC/build/`，覆盖既有id/nb验收输入及本轮it内容/测试/图片，复用node_modules，未安装或升级依赖。Node20.19.0、`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0`；`npm run build`、`npm run lint`、`npm run typecheck`、`npm run verify:dist`、`npm run sitemap:verify` 和工作区 `git diff --check` 全部通过。站图仍205项，五篇实际HTML均存在；dist、生成的sitemap和其他语言分享图留在隔离目录。使用项目既有 `node scripts/build/serve-dist.cjs --port 4214 --strictPort`，临时playwright.it.config.ts关闭默认webServer、retries=0、workers=2，Cookie横幅真实交互，不关闭既有预览。

测试：`tests/blog.spec.js` 新增46项意大利语用例：30个初始HTML/运行时×五篇×1440/390/320px组合、五张分享图、六项桌面/手机工具流程、四项Cookie选择保持、一项语言切换。既有downloadNorwegianResult仅新增可选下载按钮名称参数，默认挪威语行为和原断言不变；其余原测试前缀逐字核对一致。旧构建负例实际因缺少五个Leggi l’articolo列表链接按预期失败，日志/截图/trace保留；不是收集错误冒充负例。26项定向Chromium先全部通过、零重试，再执行六文件受影响回归：`EXPECT_CONSENT_BANNER=1 IT_RUN=final npx playwright test --config=playwright.it.config.ts --project=chromium --retries=0 tests/blog.spec.js tests/blog-ko-batch.spec.js tests/blog-ko-illustrator.spec.js tests/blog-snes.spec.js tests/i18n.spec.js tests/home-image-limits.spec.js`。最终220/220通过，约4.6分钟，零重试、无跳过；不是全仓库或全浏览器验收。

通过范围：列表真实点击、兄弟文章/返回导航、两处返回链接、直接访问/刷新、语言切换保持同一文章、完整SEO标签和适用JSON-LD/可见FAQ、图片解码/逐项下载及字节核对；真实上传后8/12尺寸与公开PNG像素对应、自动24色上限与同会话迪瑟变化、实际下载与新预览关闭平滑后的像素一致、512→64透明PNG、非法输入、10MiB+1拒绝/10MiB边界恢复、3000×1500→2200×1100。既有英/德/俄/韩/印尼语/挪威语相关Blog、语言导航和尺寸限制回归通过。不靠重试刷通过，不删断言或跳过失败覆盖。

真实页面：另外检查五篇×1440/390/320px共15组，HTTP200，正文图/封面实际解码，没有横向溢出、本站资源4xx/5xx或脚本异常。已目视查看15组首屏与封面、三视口列表、桌面/320px比较表、390px排错表、Illustrator手机源图/真实转换图和入门源图；字体、换行、图注和示例来源可辨。封面、表格、案例从真实全页裁取，避免固定页头遮挡局部截图。连续滚动拍摄的B4 320px首屏返回链接被页头遮挡，原图保留，另以新浏览器直接打开、确认scrollY=0拍摄entry-3-320-direct-check.png，实际返回链接及标题可见；不把截图定位差异当源码故障或改CSS。Chromium模拟视口不称实体手机或真人阅读验收。

最终范围与证据：29个受验收输入（id/nb/it正文、id/nb翻译、共享测试、15张分享图和八个案例文件）与隔离构建逐文件一致。意大利语数字键/slug/发表日期保留，GSC项目快照与原采集文件逐字节一致，历史迭代正文未覆盖。临时一致性审计首次因脚本自行多加一个尾换行失败，精确定位为比较方法错误；去掉审计脚本附加换行后原前缀逐字相同，未改业务、测试断言或输入文件，原失败日志保留。证据目录 `/tmp/pixelart-it-batch.PKJEwC/` 保存修改前副本、GSC/官方文档响应、build/质量/负例/26项/220项日志、final-results/、final-report/、asset-audit.json、输入一致性审计及全部截图。

停止与未验证：本批本地完成，预览 `http://localhost:4214/it/blog/`，serve-dist PID57393保留，独立验收浏览器已关闭。未提交、推送、部署、请求收录或读发布后GSC；不能称Google规范已改变或流量改善。累计本地修复15/91个目标URL。意大利语工具资源的固定调色板说明仍错误，本文解释正确行为，该资源和其他首页/About/页脚语言问题留到独立批次；已知立即下载旧结果风险未修，等待新预览的测试不能证明风险消除。母语措辞、当地搜索量、Illustrator/竞品实机、Firefox/WebKit、实体手机与发布后效果仍未验证。至此停止本批；PRD下一主要内容源为ar，尚未开始。

## 2026-10-11 挪威语复查建议修正（本地完成，未发布）

授权与范围：用户对挪威语五篇复查的三项问题回复“修复”。按内容源顺序完成：先改 `public/locales/nb/translation.json` 四个字段、构建及定向测试，通过后再同步 `src/content/blog-posts.nb.json` 的B2/B3/B5正文与现有Blog断言，最后原样保存已采集GSC基线并更新本记录。main、HEAD仍为 `81524cf6ee7603fc717630c0d8f13919ba971f62`；保留此前印尼语、挪威语稿件、图片、测试及无关文档改动，不提交、推送、部署或GSC写入。

工具与教程：明确Pico-8、Lost Century、Sunset 8、Twilight 5、Hollow均采用固定颜色；自动调色板需要开启，数量滑条只控制生成的调色板。复核当前功能，不改处理器或控件行为。按钮/控件统一为 `Last ned pikselbildet`、`Generer palett fra bildet`、`Antall palettfarger: {{value}}`，去除原重复用词。B2删除工具仍有错误说明的过期提醒，B2/B3/B5引用同步后的真实名称；仍保留Pixel size/Original size真实英语标签、SNES限制和等待新预览再下载的步骤。逐字段比较确认翻译只变四个字段，文章只变 `1.body`、`2.body`、`4.body`，未改标题、日期、摘要、主词、URL、分享图或其他两篇；测试改动只在挪威语区段，不保留要求错误提醒存在的旧断言，也不放宽尺寸/颜色/实际下载断言。

GSC保存：将 `/tmp/pixelart-nb-batch.krc0Ft/gsc-baseline.json` 逐字节复制为 [GSC_NB_BLOG_BASELINE_2026-10-11.json](GSC_NB_BLOG_BASELINE_2026-10-11.json)，保留原请求、响应、采集时间和关联sv页信息。JSON可解析，无凭据相关字段；完整28个连续final日期 `2026-09-11..2026-10-08`，13个数据请求及5个URL检查原响应均HTTP200。本轮没有重新取数、提交或请求收录；该文件是原采集快照，不代表修复后的Google抓取/规范选择，更不代表流量恢复。更新下方旧记录的文件入口，原采集来源及历史结果仍保留。

构建与测试：HEAD隔离副本 `/tmp/pixelart-nb-followup.ocyiGC/build/` 覆盖两种语言既有试点最终输入及本轮修改，复用现有依赖，未安装包或将生成产物写回工作区。Node20.19.0、`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0`。翻译阶段6项Chromium定向全部通过；正文同步后重新构建，`npm run build`、`npm run lint`、`npm run typecheck`、`npm run verify:dist`、`npm run sitemap:verify` 和 `git diff --check` 通过，站图仍205项。最终 `EXPECT_CONSENT_BANNER=1 NB_FOLLOWUP_RUN=final npm run test -- --config=playwright.followup.config.ts --project=chromium tests/blog.spec.js tests/i18n.spec.js` 在独立4213生产式服务、零重试下125项全部通过，约2.9分钟，无跳过；覆盖两语言批次、既有相关Blog和导航，包含初始HTML/运行时三视口、FAQ/元数据/图片下载、真实上传、尺寸/限色/迪瑟/透明下载、非法输入和Cookie选择保持。不是全仓库或全浏览器验收，不沿用上一批174项结果冒充本轮通过。16个受验收内容、测试、PNG输入与工作区最终文件逐文件一致。

页面与证据：另用本轮独立Playwright CLI浏览器实际上传照片、开启自动调色板，查看桌面和320px的说明、数量滑条、下载文案，以及B2/B3/B5修改段落；相应页面无横向溢出，截图已目视检查。首次大段控件截图受内层滚动和固定工具栏遮挡，另补桌面滚动定位及320px说明/开关/滑条局部截图；原截图未覆盖，不将截图定位问题写成新增源码故障。证据目录 `/tmp/pixelart-nb-followup.ocyiGC/` 保存修改前副本、两轮构建、6项及125项测试报告、质量日志与各轮截图。

停止与预览：独立浏览器已关闭；新预览 `http://localhost:4213/nb/blog/`，serve-dist PID27512保留，4210/4211/4212既有服务未关闭。尚未提交或部署；母语措辞、当地搜索量、Illustrator实机、Firefox/WebKit、实体手机和发布后Google表现未验证。其他首页/About/页脚翻译、立即下载旧结果风险等仍不在本轮范围；等待新预览的通过不代表旧结果风险已修复。三项复查建议至此完成，不继续意大利语批次。

## 2026-10-11 印尼语试点复查建议修正（本地完成，未发布）

授权与范围：用户对复查的三项建议回复“执行建议”。按两个内容源顺序完成，不同时扩写其他页面：先改 `public/locales/id/translation.json` 两个字段并构建、定向验收；通过后再改 `src/content/blog-posts.id.json` 的B2/B4两段正文，并构建、受影响回归。开始时main、HEAD为 `81524cf6ee7603fc717630c0d8f13919ba971f62`，保留原有五篇试点、测试、图片及无关文档改动，不提交、推送、部署或请求收录。

工具文案：`adjustments.palette.note` 说明五种内置预设均采用固定颜色，自动调色板需主动开启，数量滑条只作用于生成的调色板；与当前 `PALETTE_MAP` 及B2/B3正文一致。`consent.desc` 翻译成印尼语，保留原有“如果启用则展示Google AdSense广告”及随时接受/拒绝非必要Cookie的含义，不改同意逻辑或法律政策。结构化比较确认仅改变这两个翻译字段。第一轮生产式构建成功，桌面/手机Cookie接受、拒绝及刷新保持，加上两种视口实际上传、调参、下载的调色板工作流，共6项Chromium定向通过，零重试。

文章修正：B2删去“当前印尼语工具说明仍有错误”的临时提醒，保留固定/自动调色板区别。B4把开头的HTTP403及重复核查过程移出公开正文，保留Adobe资料核查日期2026-10-09、未运行Illustrator实机导出、浏览器示例与2026-10-11本站真实下载的来源边界。此前Adobe读取失败仍保留在上一条迭代记录及原始证据中，本轮未重新读取Adobe。与本轮修改前JSON逐字段比较，只有 `1.body`、`3.body` 不同；未改其他三篇、主词、title/seoTitle、摘要、日期、URL、canonical/hreflang、分享图或任何功能。

测试与构建：沿用 `tests/blog.spec.js` 中的印尼语批次，补Cookie说明无英语回退、两视口接受/拒绝真实持久化与刷新、工具调色板文案，以及B2不再含过期提醒、B4仍保留来源和实机限制但不含HTTP403的断言。使用HEAD隔离副本 `/tmp/pixelart-id-followup.bQC1Wz/build/`，仅覆盖本次相关内容、既有试点测试及六张试点PNG，复用既有依赖，不安装或升级包，不把生成产物复制回工作区。Node20.19.0、`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0`；最终 `npm run build`、`npm run lint`、`npm run typecheck`、`npm run verify:dist`、`npm run sitemap:verify` 及 `git diff --check` 通过。九个相关输入文件与最终验收副本逐文件一致。

最终验收：独立4211生产式服务、`EXPECT_CONSENT_BANNER=1`，临时配置禁用默认webServer、重试为0；本次相关 `tests/blog.spec.js` 与 `tests/i18n.spec.js` 合计79项Chromium通过，耗时1.7分钟，无跳过，不是全仓库或全浏览器验收。覆盖五篇初始HTML与运行时1440/390/320px、标题/元数据、FAQ、图片与下载、站内导航/刷新/语言切换、真实工具上传/尺寸/限色/迪瑟/透明度/文件限制，以及Cookie文案和选择保持。另用独立Playwright CLI浏览器实际查看320px Cookie说明、上传后调色板说明及B4桌面/320px开头，并读取B2最终正文，无相关横向溢出或文字截断；已查看截图，不等于实体手机或母语阅读验收。

过程与证据：第一次定向命令因CLI把 `--project chromium` 后的文件名同时当作项目名而退出，尚未执行用例；改为 `--project=chromium` 后运行通过，未改业务或放宽断言，首次错误日志保留。证据目录 `/tmp/pixelart-id-followup.bQC1Wz/` 包含两次构建日志、原失败命令、6项定向及79项最终测试结果、质量检查和Cookie/调色板/B4截图；前批 `/tmp/pixelart-id-pilot.nBc8If/` 的127项及各轮历史证据未覆盖。

停止与预览：本地完成，独立浏览器已关闭；新版预览 `http://localhost:4211/id/blog/`，服务PID1782保留给用户查看，4210及其他既有服务不关闭。未发布、未重新查询GSC或评价搜索恢复；母语措辞、当地词搜索量、Firefox/WebKit与实体手机仍未验证。其他首页/About/Privacy语言问题、立即下载旧结果风险、统计资源与CSP均未扩改。

## 2026-10-11 挪威语五篇修复（本地完成，未发布）

授权与范围：用户在印尼语试点交付后要求“继续”，按PRD第12.3节处理 `src/content/blog-posts.nb.json` 的B1–B5，一个主要内容源与必要挪威语分享图、现有Blog测试和本记录；不修改其他语言、首页、工具、canonical、hreflang或索引覆盖，不提交、推送、部署或GSC写入。开始时main、HEAD `81524cf6ee7603fc717630c0d8f13919ba971f62`。检查期间发现印尼语资源、内容及共享测试有新增本地改动，它们不由本轮产生、不覆盖；共享测试只追加本批用例，构建时另核对已有改动的实际输入。

改稿前GSC：以既有服务账号、`webmasters.readonly` 范围读取官方Search Analytics及URL Inspection，实际Tier1请求成功。技能提供的google_auth.py不存在，默认配置也不存在，不声称其检查已通过；复用上批已验证脚本并将目标语言改为nb，凭据路径只在命令环境提供，未保存凭据。取数时间2026-10-11T09:48:56.483313Z至09:49:36.580266Z，太平洋日期 `2026-09-11..2026-10-08`、final/web，属性日期返回完整28天，目标页page与query+page分别查询，未达到25000行上限。B1页/query均未返回，当前Google规范页为sv同主题（最近抓取2026-09-28T15:51:26Z）；该关联页同窗0点击/46曝光、5条query，不把全数当挪威语需求。B2/B3/B4/B5当前已收录、规范页为自身，分别0点击/6曝光、0/127、0/97、0/6；最近抓取分别2026-10-07T08:44:10Z、2026-09-04T04:57:55Z、2026-10-03T05:10:25Z、2026-08-13T17:32:16Z。当前规范记录不能证明窗口每天的规范选择，API未披露的query不补零。

### 改稿前主词与意图映射

本表窗口均为 `2026-09-11..2026-10-08`，原始请求/响应、关联sv页和采集时规范记录已原样保存到[项目内基线](GSC_NB_BLOG_BASELINE_2026-10-11.json)。原采集文件仍为 `/tmp/pixelart-nb-batch.krc0Ft/gsc-baseline.json`，日志为同目录 `gsc-read.log`；项目内副本不是新取数。当地主词均为内容定位判断，没有已验证当地搜索量；查询缺行不阻止事实修正及保留原任务的本地化。

| 目标网址 | 目标语言主词 | 搜索意图 | 已返回的相关query与完整日期窗口 | 证据来源与限制 | 是否改变原定位及理由 |
|---|---|---|---|---|---|
| `/nb/blog/best-pixel-art-converters-compared-2025/` | `pikselkunstkonvertere`；可见标题采用同义短语 `konverterere og editorer for pikselkunst`，避免320px长词溢出 | 按用途选择照片转换器或像素编辑器 | 目标页未返回；关联sv页有 `piskel .com`、`piskelapp .com`、`pixel art best` | sv行不证明挪威语词需求；竞品核对官方来源 | 保留工具比较，删除虚构十款实测及排名 |
| `/nb/blog/how-to-get-pixel-art-version-of-image/` | `foto til pikselkunst i SNES-stil` | 得到尺寸和颜色受限的复古照片 | 未返回 | 页面明确0/6；词组按已有任务拟定 | 保留SNES风格，明确非硬件适配 |
| `/nb/blog/make-image-more-like-pixel/` | `forbedre pikselkunst` | 排查转换后轮廓、颜色、点纹与保存问题 | 14条中有 `enhance pixel art`、`make image more pixelated`、`pixel art simplifier`，另有葡语恢复词 | GSC旧英文稿query不证明当地语言；不为葡语词编造复原能力 | 保留结果排错，删除AI恢复/选择编辑等虚构能力 |
| `/nb/blog/export-from-illustrator-image-to-pixel-art/` | `eksportere PNG fra Illustrator` | 先准备尺寸/透明度正确的PNG，按需转换 | 仅 `how to export pixel art`，1曝光 | 页面97曝光不等于该词全部；本轮Adobe HTTP200，步骤据文档而非实机 | 保留Illustrator栅格导出和后续转换，纠正PPI误解 |
| `/nb/blog/how-to-pixelate-an-image/` | `pikselere et bilde` | 第一次上传、调参和保存PNG | 未返回 | 页面明确0/6；按工具真实路径本地化 | 保留入门，不新增Resize或图库流程 |

### 实施、专门复核与本地验收

修改：完成五篇挪威语Bokmål正文与title/seoTitle、摘要、标签、比较/排错表、图注、下载文字、作者入口、展示标签和分享图；保留数字键0–4结构、slug和原发布日期，updated为2026-10-11。五种任务保持分工，不把入门流程在五篇中整段重复。比较篇披露本站运营者身份，使用Pixel Art Village、Aseprite、Piskel、GIMP四工具功能比较，删除虚构十款实测、旧价格和评分；SNES篇明确风格不是硬件模式，排错篇不承诺恢复模糊信息，Illustrator篇区分PPI/像素尺寸和两种导出路径，入门篇按真实控件完成一次保存。所有批内页面链接保持挪威语，资源路径不加语言前缀或页面尾斜杠。未改首页、处理器、共享渲染、canonical/hreflang、重定向或站图覆盖。

资料核对：11日重新读取Aseprite、Piskel、GIMP Pixelize及导出官方说明，以及Wikimedia照片来源页，全部HTTP200，核对功能、导出格式、桌面建议与Don McCulley/CC0。本次Adobe的Export for Screens、Export As/PNG、pixel-perfect三页也均HTTP200，实际读取相关菜单、Artboards/Full Document、Scale、PNG透明/抗锯齿和Snap to Pixel/Pixel Preview段落；不同于印尼语前批403，本篇可写11日重新核查成功，但仍明确没有运行Illustrator实机导出。源码与已纠错英/德/韩内容用于功能和任务复核，不把仍有问题的英文旧句原样翻译。

素材：复用既有JPEG 960×762、PNG 120×95/80×63、同轮24色迪瑟对照、自制浏览器512×512/64×64演示和印尼语试点真实64×64透明转换结果，不生成冒充工具导出的图。八个输入/结果文件重新解码并与隔离输入逐文件比较；13个正文图块尺寸相符。24色两图实际各24种不透明RGB颜色；真实64×64透明结果有1600全透明、36半透明、2460不透明像素。正文区分原生64×64浏览器渲染与本站512→64转换结果，不伪称Illustrator来源。通过原分享图生成器新增 `public/blog-og/nb/` 五张1200×630 PNG，全部实际解码、逐张目视检查，结果区逐像素比较通过；没有覆盖其他语言图片。

专门翻译复核：Friday在完成稿件及针对性H1修正后，单独完整读取最终JSON逐段自查，覆盖五篇标题/摘要/正文、16组问答、两张表、13个图块、图注、展示标签、分享图与批内引用。对照当前源码、Bokmål实际界面和官方资料，检查数值、方向、否定和条件、固定/自动调色板区别、操作次序与链接用途：10MiB拒绝和2200px等比缩小分开；8/12对应120×95/80×63；24色为上限而非必定24；透明保留不等于去背景；SNES风格不等于硬件数据；PPI不替代文件像素；新预览确认后再下载。品牌、软件名、格式和真实英语UI标签保留，B2/B5解释Generate palette from image、Pixel size、Original size及真实下载按钮名。未发现尚待解决的关键技术语义项；这是同一执行者的专门自查，不是独立或母语审校，也未调用其他Agent、翻译服务或付费工具。

构建与服务：HEAD隔离副本 `/tmp/pixelart-nb-batch.krc0Ft/build/` 覆盖本批内容/测试与已有印尼语最终改动和素材，复用node_modules，不安装或升级包。Node20.19.0，`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0` `npm run build` 两次（初稿、H1修正后最终稿）均通过，保留ownership、SEO、dist、缓存与重定向检查；最终 `npm run lint`、`npm run typecheck`、`npm run verify:dist`、`npm run sitemap:verify`、`git diff --check` 通过。站图仍205项，五篇实际HTML存在，生成的其他语言分享图、sitemap、dist留在隔离目录。最终服务采用项目既有 `node scripts/build/serve-dist.cjs --port 4212 --strictPort`，临时Playwright配置明确取消默认webServer，生产Cookie真实交互、retries=0，不复用4173、4210或4211。

失败与处置：新增测试首次因norwegianCopy多余右括号，收集0项，保留test-selection.log/before-tests.log，不把它写成旧内容负例或测试通过；仅改新用例语法后实际选中46项。旧4210构建上一项负例因挪威语列表仍缺五个Les artikkelen按预期失败，保留before-fixed记录。拟用4211已被其他既有服务占用，没有接管，改用空闲4212。首轮15项定向为8通过/7失败：六项因返回博客同名链接实际有顶部/底部两个，改为明确两个均检查准确href；另一个因本轮误用Vite默认preview，其无尾斜杠HTML请求返回首页，Seo拒绝错路由head，nb/id切换英文均复现。保留switch-diagnosis日志/响应，不改业务、canonical或删除断言；只关闭本轮Vite进程21788，改用项目既有serve-dist后语言切换通过。默认Vite预览这一限制不写成生产故障或源码已修。

真实内容失败：修正方法后的15项为14通过/1失败，B1初始HTML在320px的长复合词Pikselkunstkonvertere导致H1横向溢出，有原截图和trace。只将可见H1改为自然的同义短语“Konverterere og editorer for pikselkunst: foto, tegning og animasjon”，主主题与seoTitle不变，不放宽溢出阈值、不改CSS/布局。最终完整title代码点数55/58/58/56/58，摘要155/148/148/153/149，不触发155字符截断。最终稿重建后26项定向全部通过，再启动受影响回归；没有在前轮未结束或下载未核对时并行跑完整回归。

最终回归：`tests/blog.spec.js` 新增46项（30个初始HTML/运行时与1440/390/320px组合、五张分享图、桌面/手机六项工具流程、四项Cookie接受/拒绝持久化、一项语言切换）。与blog-ko-batch、blog-ko-illustrator、blog-snes、i18n、home-image-limits组成六文件，实际命令为 `EXPECT_CONSENT_BANNER=1 NB_RUN=final npx playwright test --config=playwright.nb.config.ts --project=chromium --retries=0 tests/blog.spec.js tests/blog-ko-batch.spec.js tests/blog-ko-illustrator.spec.js tests/blog-snes.spec.js tests/i18n.spec.js tests/home-image-limits.spec.js`，在4212生产式服务、Chromium、零重试下174项全部通过，约3.3分钟，无跳过；不是全仓库或全浏览器验收。涵盖列表真实点击、兄弟文章跳转/返回、直接访问/刷新、完整SEO元数据、适用JSON-LD和可见FAQ、所有案例实际解码与逐项点击下载/保存文件字节、两处返回链接、真实上传、8/12尺寸与公开PNG逐像素对应、自动24色上限及同轮迪瑟变化、下载在浏览器关闭平滑放大后与同轮新预览一致、512→64透明PNG、非法输入、10MiB+1拒绝/10MiB边界恢复、3000×1500→2200×1100等比缩小。既有英/德/俄/韩/印尼语Blog、语言导航和尺寸限制相关回归通过。

页面目视：最终服务另检查五篇×1440/390/320共15组，HTTP均200，无横向溢出、本站资源4xx/5xx或脚本异常。全部正文图和封面先滚动并真实解码，再归零拍首屏/全页，并从真实全页截图裁取封面、表格和案例，避免固定页头及懒加载造成的假截图。已查看15组首屏/封面、三视口列表、五张分享图、桌面/320px比较表、390px排错表、B4/B5手机案例；字体、换行与图片正常。原失败截图未覆盖，Chromium模拟视口不称实体手机或真人阅读验收。

证据与交付：`/tmp/pixelart-nb-batch.krc0Ft/` 保留GSC、官方页HTTP/正文、asset-audit.json、各轮失败/定向测试、最终构建/质量与174项日志、final-results/、final-report/、capture-observations.json及截图。最终源码、测试、八个复用输入/结果与五张挪威语PNG和验收输入逐文件一致。预览 `http://localhost:4212/nb/blog/`，独立serve-dist进程26126保留给用户查看，其他服务未关闭。共享测试原有前缀及并行印尼语修正保留，本轮只增加nb用例；其他内容源未被本轮覆盖。

停止与未验证：本地完成，未提交、推送、部署、请求收录或读取发布后GSC，不能称Google规范已改变或流量改善。未做Illustrator/竞品软件实机、母语读者、Firefox/WebKit或实体手机验收；Bokmål措辞不保证最优。挪威语资源的固定调色板旧说明仍错误，文章明确说明正确行为与旧提示的差别，该资源留到独立文案批次；未顺手补译首页/About/页脚。已知立即下载旧结果风险未修；等待新预览的通过不能证明风险已消除。至此停止本批，下一主要内容源按PRD为it，尚未开始。

## 2026-10-11 印尼语五篇修复试点（本地完成，未发布）

授权与范围：用户要求阅读并按 `docs/SEO_REPAIR_PRD_2026-10-11.md` 修复。按第12.2及19节先执行 `src/content/blog-posts.id.json` 的B1–B5，一个主要内容源及必要分享图、测试、记录；不扩展其他语言，不提交、推送、部署、请求收录或改索引/重定向。开始时main、HEAD为 `81524cf6ee7603fc717630c0d8f13919ba971f62`，原有AGENTS、迭代记录、PRD、CSV和俄语基线文件保留。

改稿前GSC：本轮读取时间为2026-10-11T09:06:45.810091Z至09:07:25.130518Z。复用已有服务账号文件，仅通过命令环境提供路径，以 `webmasters.readonly` 读取官方Search Analytics与URL Inspection，Tier 1能力实际请求成功。窗口为太平洋日期 `2026-09-11..2026-10-08`，final/web，站点日期查询返回完整28天；五篇页维度与query+page分开读取，未达到25000行限制，不把匿名查询缺失补成零。B1页及搜索词均未返回；B2明确返回0点击/4曝光但搜索词未返回；B3、B4页及搜索词未返回；B5返回6点击/804曝光与25条query。B1/B2/B5当前已收录且Google规范页为自身，B3/B4当前分别归到nb同主题页，最近抓取为2026-10-11T03:35:37Z与2026-10-03T18:22:44Z。关联nb页同窗分别0点击/127曝光和0点击/97曝光，不当成印尼语流量或历史每天规范选择的证明。

### 改稿前主词与意图映射

本表完整日期窗口均为 `2026-09-11..2026-10-08`，原始请求/响应与当前规范记录保留在 `/tmp/pixelart-id-pilot.nBc8If/gsc-baseline.json`，查询日志为 `gsc-read.log`。以下印尼语主词均是内容定位判断，不是已验证的印尼语搜索量；没有返回当地词不阻止原任务的事实纠错和本地化。

| 目标网址 | 目标语言主词 | 搜索意图 | 已返回的相关query与完整日期窗口 | 证据来源与限制 | 是否改变原定位及理由 |
|---|---|---|---|---|---|
| `/id/blog/best-pixel-art-converters-compared-2025/` | `konverter pixel art` | 选择照片转换器或手动编辑器 | 本窗未返回 | GSC无行；按现有比较任务定位，竞品查官方资料 | 保留用途比较；删除虚构十款实测/排名 |
| `/id/blog/how-to-get-pixel-art-version-of-image/` | `foto menjadi pixel art gaya SNES` | 调整照片尺寸与限色，得到复古静态结果 | 本窗未返回 | GSC页面0/4；按已确认功能定位，不是硬件适配需求证据 | 保留SNES风格；明确非游戏机数据转换 |
| `/id/blog/make-image-more-like-pixel/` | `memperbaiki hasil pixel art` | 排查转换后轮廓、颜色、点纹与保存问题 | 目标页本窗未返回；关联nb页有 `enhance pixel art`、`make image more pixelated` | nb数据不能当作id需求；不承诺恢复低清细节 | 保留转换后排错，删不存在的增强模块 |
| `/id/blog/export-from-illustrator-image-to-pixel-art/` | `ekspor PNG Illustrator` | 准备像素尺寸/透明度正确的源图，再按需转换 | 目标页本窗未返回；关联nb页有 `how to export pixel art` | 复用已核对Adobe依据；本轮HTTP读取403，不能称新核查成功 | 保留Illustrator栅格导出与后续转换用途，不把PPI写成尺寸 |
| `/id/blog/how-to-pixelate-an-image/` | `cara membuat gambar piksel` | 第一次上传、调参、预览与PNG保存 | 本窗有 `how to pixelate an image`、`pixelate an image`、`pixelate image for pixel art`；另有 `pixelate indie`，不猜其含义 | GSC英语query证明任务覆盖，不证明当地词搜索量；25条明细不等于804曝光全部 | 保留入门路径与PNG保存，本地化而非更换主题 |

### 实施、复核与本地验收

修改：只重写印尼语B1–B5五个条目，保留数字键对象结构、slug和原发布日期，更新日期为2026-10-11。正文、标题/seoTitle、摘要、标签、四工具比较/排错表、展示标签、图注、下载文字、作者入口和分享图均本地化；五篇任务分别为用途比较、SNES风格、转换后排错、Illustrator源图准备与后续转换、首次上传保存，不用同稿覆盖。完整搜索标题分别60/58/59/58/58个Unicode代码点，摘要144/149/155/154/152字符，未被现有155字符预渲染截断。批内引用均指向对应印尼语文章和本地工具首页，不再把已翻译目标称为英语；没有解除converter原有英语归并、改变canonical/hreflang或索引范围。

资料与素材：重新读取Aseprite、Piskel、GIMP Pixelize及导出官方页，均HTTP200，核对功能与输出，不沿用十款实测、旧价格或质量评分。Wikimedia来源页HTTP200，复核Don McCulley向日葵与CC0；复用960×762 JPEG、120×95/80×63真实PNG和同轮24色迪瑟对照，不复制生成新的照片案例。八个被引用输入/结果文件均实际解码，24色两图实际各24种RGB颜色，照片不透明。Adobe英文页及对应语言地址本轮HTTP403，失败响应保留；B4明确以10月9日已核查官方说明为依据，不冒充新读取成功或Illustrator实机测试。

新增真实结果：在HEAD生产式构建的印尼语工具中实际上传现有浏览器生成的512×512透明PNG，逐次调到Pixel Size 8、Palette None、自动调色板与迪瑟关闭、三项颜色调整0、PNG/Pixel size、透明背景开启、网格关闭，点击下载64×64 PNG。检查1600个全透明像素、2460个全不透明像素，其余为半透明；下载按浏览器关闭平滑放大后与同轮预览全部像素一致。文件为 `public/tutorials/pixel-art-id/illustrator-pixel8.png`。这是本站真实转换自制浏览器源图，不是Illustrator导出实验；正文区分原生64×64浏览器示意与本站64×64结果。五张目标语言分享图复用现有生成器，保存到 `public/blog-og/id/`，均1200×630可解码；已逐张目视核对文字及图片，没有覆盖其他语言素材。

专门翻译复核：执行者Friday先按已纠错韩语/德语及英文任务写稿，再在写稿结束后单独完整读取最终印尼语JSON逐段自查，对照功能源码、实际印尼语标签和下载结果。覆盖五篇标题/摘要/正文、16组问答、两张表、13个图块、图注、标签、分享图及批内引用；重点核对增大/减小方向、10MiB与2200px两种行为、8/12尺寸、24色上限而非恰好24、固定/自动调色板、透明保留不等于去背景、SNES风格不等于硬件数据、PPI与尺寸、否定及操作顺序。品牌、格式、UI真实英语按钮及英文官方链接保留并说明用途。本次是同一执行者的专门自查，不是独立或母语审校；未发现尚待解决的关键技术语义项，不保证所有当地措辞最优，未调用额外Agent或外部翻译服务。

构建与隔离：从HEAD导出 `/tmp/pixelart-id-pilot.nBc8If/build/`，仅覆盖本轮JSON、现有 `tests/blog.spec.js` 和新增PNG，复用锁定依赖，未新安装或升级包。Node20.19.0、`VITE_E2E=0 VITE_ENABLE_ANALYTICS=0` 的完整 `npm run build` 成功，保留ownership/SEO/dist/缓存与重定向检查；最终 `npm run lint`、`npm run typecheck`、`npm run verify:dist`、`npm run sitemap:verify`、`git diff --check` 通过。站图仍205项；生成的其他语言分享图、sitemap和dist均留在隔离目录，不复制回工作区。五篇实际HTML均存在。临时Playwright配置显式取消默认webServer，唯一入口为手动启动的本批4210生产式服务，不复用4173或E2E构建。

测试与失败保留：在现有Blog测试中参数化新增42项。旧HEAD构建上的B1桌面运行时用例因仍是英语标题按预期失败，原结果保留。首轮少量定向14项为13通过/1失败：语言切换实际网址无尾斜杠，测试误要求必须有；只规范化测试中的pathname，保留语言、准确路由、canonical及刷新/返回检查，单项复核通过。受影响六文件回归首轮127项为126通过/1失败：透明B4分享图的预期未模拟叠在背景上；加flatten后五图定向仍4通过/1失败。定向像素检查证明Sharp单流水线会在resize前执行flatten，2092字节不同；按生成器明确先resize输出PNG，再叠背景，全部字节差异为0，原像素精确比较未放宽。该单项通过后才启动最终回归，没有改业务代码、删断言或用自动重试刷通过。

最终结果：生产式Cookie模式、零重试的受影响Chromium六文件127项全部通过，耗时约2.1分钟，不是全仓库完整200项。包括印尼语五篇在1440/390/320px初始HTML与运行时、Blog真实点击、同语言文章跳转/返回、刷新、语言切换、完整标签及适用结构化数据、FAQ可见与数据一致、13个图块的实际加载/解码/逐个点击下载/文件字节、站内链接、五图尺寸与结果区像素，以及桌面/手机真实上传、8/12导出、24色与迪瑟同轮预览/下载对应、512→64透明PNG、非法文件与10MiB+1拒绝/10MiB边界恢复、3000×1500→2200×1100等比缩小。现有英/德/俄/韩Blog、Photo工具及导航标签和英文首页限制相关回归同时通过。

页面目视验收：另用隔离Chromium检查五页×1440/390/320共15组合，实际HTTP200，无横向溢出、本站资源4xx/5xx或脚本异常；已查看全部15首屏与封面、五张分享图，以及桌面比较表、手机比较/排错表和B4/B5正文示例。初次详情截图包含固定页头遮挡和下一张懒加载图未加载，保留原图；只补四组针对性截图，在全部图解码后从滚动归零的真实全页截图裁取内容，确认文字与图片正常，不改页面或覆盖首次截图。自动检测与目视检查均不等于真人阅读或实体手机验收。

证据与停止边界：`/tmp/pixelart-id-pilot.nBc8If/` 保留GSC原始请求/响应、官方页HTTP响应、`asset-audit.json`、真实PNG、旧版本/定向/首轮回归/透明像素诊断及最终测试报告、构建/质量日志、`capture-observations.json` 与各轮截图；最终测试为 `final-tests.log`、`final-results/`、`final-report/`。本地预览 `http://localhost:4210/id/blog/`，独立服务PID54577保留给用户查看，其他既有服务未关闭。工作区的JSON、测试和六张PNG与验收输入逐文件一致，本轮至此停止，不继续其他语言或重复构建。

未做与批外问题：未提交、推送、部署、请求收录或重新查询发布后GSC，不称91页全部修复或搜索效果改善；下一内容源建议按PRD为nb，但本轮未开始。Firefox/WebKit、实体手机、母语读者及Illustrator实机未验收。印尼语资源中的固定调色板旧说明仍错误，B2正文明确指出；首页/隐私等原有语言残留保留在各自批次，不混入本次内容文件。已知立即下载旧结果风险未修，本轮按要求等待新预览，不能把等待后的通过当作处理器修复。

## 2026-10-10 俄语教程与页脚正式发布

授权：用户明确要求“部署上线”。本次发布已完成本地验收的俄语教程一个条目、俄语分享图、配套 Blog 测试，以及俄语页脚链接分支和文案。不扩大到 About、其他文章、全站翻译、索引设置、重定向、广告或 GSC 写入；沿用 main 的现有 Cloudflare Pages Git 集成，不新建上传渠道，不修改 GitHub Pages、CI 或 Lighthouse 工作流。

发布前核对：main、HEAD 与实时 origin/main 均为 f745a9ed6ce47f6f3e9eaa37005de558cf7cf8d9，GitHub 既有登录有效。五个源码、测试及 PNG 与 /var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-ru-footer-kjYZQH/build/ 的隔离构建输入逐文件相同；结构化比较确认俄语内容只改变 pixel-art-tutorial-complete-guide-2025 条目。复用上一轮同一最终源码的 Node 20.19.0 build、lint、typecheck 成功结果，未写成重新运行；本次重新执行生产式 Cookie 模式完整 Chromium 回归，158 项全部通过、零重试（2.8 分钟），记录为 release-regression.log、test-results/ 和 report/。只暂存五个相关文件及本次、前两轮对应记录；AGENTS.md、GSC 操作记录、历史整理和旧发布回执的原有本地改动不混入提交。提交、云端部署及正式页面验收结果完成后仅本地补记，不为纯记录触发另一次部署。

## 2026-10-10 俄语页脚导航与文案修复（仅本地）

授权与范围：用户在只读审评后对“先修俄语页脚的真实导航与文案，不改正文、canonical、不部署”回复“继续”。仅修改共享 Footer 中的俄语工具链接分支及 public/locales/ru/translation.json 的页脚文案、页脚使用的 site.tagline，并补记本文件。开始时 main、HEAD 为 f745a9ed6ce47f6f3e9eaa37005de558cf7cf8d9；既有 AGENTS.md、迭代记录、俄语文章、Blog 测试与俄语分享图改动保留。不修改其他语言、文章内容、About、处理器、重定向、站图或索引规则，不提交、推送、部署或请求收录。

诊断与实施：public/_redirects 明确将 /ru/converter/* 重定向至英文源，不把这种既有回退策略误判成链接 404。普通图片、照片及 PNG 三个俄语入口指向 /ru/#tool，其实际上传和编辑器可留在俄语首页；另外六个专项入口直达已存在的英文 converter 页，添加可见的俄语“на английском”提示及 hreflang=en。保留六个英文页面的 URL 和规范策略，不新建俄语专项页。补齐原先回退英语的页脚工具标签、目录区标题与徽章替代文字，修正页脚品牌说明、版权与按钮的俄语词形。徽章素材中的英语与品牌名称不伪装成已翻译图片；俄语首页其他混语言内容不在本轮范围。

验证：从 HEAD 隔离构建，覆盖本轮两份源码及此前已完成的俄语文章、测试和分享图，保留主工作区生成文件。Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 的 build（含预渲染、SEO、dist 与缓存/重定向检查）、lint、typecheck、diff-check 均通过。复用既有 tests/blog.spec.js，Chromium 26 项通过、零重试；本轮未修改测试。新旧构建的 18 个语言 Blog 初始 HTML 比较中，17 个非俄语页脚的文字、链接和徽章属性完全相同，全部主内容未变；另核对英语、西语、德语、韩语首页页脚不变。俄语教程主内容、description、canonical、hreflang、OG/Twitter 未变。六个英文目的页均 HTTP 200 且 canonical 对应英文自身；俄语页脚不再含 /ru/converter/ 链接。

真实浏览器：Playwright CLI 独立 Chrome 在 1440/390/320px 检查俄语九个入口、语言提示及横向溢出，查看桌面和手机截图。实际点击普通图片入口并刷新后仍为俄语首页，上传原有 32×32 宝石 PNG 后出现真实预览，下载成功且为 32×32、带透明通道的 PNG；实际点击标注英文的像素化入口及刷新后均为英文专项页。随后核对英/西/德/韩运行时入口无俄语分支泄漏，返回俄语再次验证九个入口及俄语标签正常。首次附加上传验证误等待 canvas 可见而超时，实际预览为 img；保留该失败，不改应用逻辑，按真实预览解码与实际 PNG 下载条件复核通过。

交付与缺口：证据目录 /var/folders/ls/pbrjlnw91yl_5dbm46j0n22h0000gn/T/pixelart-ru-footer-kjYZQH/，包含 build.log、lint.log、typecheck.log、regression.log、HTML 对比、CLI 快照、截图与 PNG 下载；预览 http://localhost:4208/ru/blog/pixel-art-tutorial-complete-guide-2025/，独立后台 PID 55909。验收副本的本轮源码和当前工作区内容逐文件相同。未发布，未验证 Google 新抓取/收录/流量、母语审校、实体手机或 Firefox/WebKit；不把本地通过当成线上恢复。

## 2026-10-10 俄语完整教程内容补救（仅本地）

授权与范围：用户在剩余页面诊断后对“下一轮只修俄语完整教程，完成内容纠错、真实案例和页面验收，再按授权发布”回复“执行”。本轮仅修改 `/ru/blog/pixel-art-tutorial-complete-guide-2025/` 对应的 `src/content/blog-posts.ru.json` 一个条目，增加俄语分享图及现有 Blog 测试中的相关断言；不提交、推送、部署、请求收录或修改规范、语言替代页、重定向、站图及索引范围。开始时 main、HEAD 为 `f745a9ed6ce47f6f3e9eaa37005de558cf7cf8d9`；原有 AGENTS.md 和本文件改动保留。此前只读检查的“已抓取尚未收录”仅作选页依据，不认定内容问题为未收录的唯一原因。

内容：保留手绘入门定位和原 URL、发布日期 2025-10-28；更新日期记为 2026-10-10。主题为 `пиксель-арт для начинающих`，这是按用途选择的主词，不是已验证搜索量或排名结论。标题、摘要、署名、阅读时间、封面、步骤图说明、下载标签、相关文章及按钮文案均使用俄语；完整 SEO 标题 `Пиксель-арт для начинающих: урок 32×32 | Pixel Art Village` 为 58 个 Unicode 字符，55–60 仅沿用用户编辑目标，不称为 Google 硬上限。纠正 8-bit/16-bit 与固定画布尺寸的错误对应，去掉无依据的工具价格及泛泛软件清单，明确手绘编辑器与本站照片转换的用途不同。增加俄语动画文章、俄语首页转换工具及作者页面的相关链接，不链接未完成的虚假语言工具页。

案例与来源：复用本站原创 32×32 宝石练习，不新造或手工加工“工具结果”。包含轮廓、填色、阴影、最终图四个原 PNG，以及已有三张真实 Piskel 操作截图；七个正文 figure 均有俄语说明。提供零起点坐标、五个准确色值、透明背景、单帧 PNG、Scale 1.0x 与 Selected frame export 的完整步骤。正文保留原案例于 2026-10-09 的技术验证日期与非真人教学验收说明。当前另核对 Piskel 官方桌面使用建议，并在隔离 Chromium 实际重新逐像素绘制、填色、导出四阶段 PNG：每个下载为 32×32，每个像素符合设计，四张新下载与现有公开素材逐像素相同，未替换原素材。分享图复用已有生成脚本生成 1200×630 俄语 PNG，含原始案例而非通用向日葵图；已查看字形、排版及图片。

构建与验收：从 HEAD 在隔离目录构建，仅覆盖本篇内容及相关测试，未覆盖工作区已有文件或混入其他未提交改动。Node 20.19.0 的生产式 VITE_E2E=0 完整 build（含 ownership、SEO、dist、缓存及重定向检查）、lint、typecheck 和 diff-check 均通过。最终定向 Chromium 34 项全部通过、零重试：新增俄语文章在 1440/390/320px 的初始 HTML 和运行时测试，保留德语两篇、英文教程与真实上传导出、韩语入口，以及未修改西语文章的隔离断言。覆盖列表点击与刷新、title/description/H1/canonical/hreflang/OG/Twitter、发布日期及更新日期、俄语可见 FAQ 与三个问答的 JSON-LD 一致性、图像实际解码及尺寸、四个下载链接、最终 PNG 实际下载、五色及透明度、分享图案例像素一致、站内链接及俄语动画跳转。其他俄语条目与 HEAD 的结构化逐条比较完全相同；最终内容、测试和分享图与验收副本一致。

检查过程与失败保留：首次测试命令把文件参数误解析为项目名，未运行页面测试。临时配置合并又带入原 webServer 的 E2E 构建，运行时 Cookie 检查等待时主动停止；修正为单一生产式服务并重新构建，没有修改项目配置。第一轮有效 34 项中 32 项通过、2 项失败：320px 图片懒加载尚未完成时测试立即取值，以及旧隔离断言要求本次目标仍保留旧俄语标题和无步骤图。前者改为等待图像实际解码，保留相同成功条件；后者将未修改语言的隔离检查移到西语页，并用六项新俄语测试检验新版。随后完整 34 项通过，不删除失败日志、截图、视频或 trace，不以重复运行代替修正。附加截图脚本首次执行时测试服务器已退出，连接失败；启动独立预览后九组截图完成，原失败日志保留。

页面与边界：独立浏览器完成 1440/390/320px 首屏、坐标示意和导出说明九组截图，均无横向溢出或脚本异常；已查看桌面/手机首屏、320px 坐标和手机导出截图。预览为 `http://localhost:4207/ru/blog/pixel-art-tutorial-complete-guide-2025/`，独立后台 PID 1342。构建、真实 Piskel 绘制及下载、首次失败、最终测试和截图证据位于 `/tmp/pixelart-ru-tutorial.V2zgkN/`。未发布或重新查询 GSC，不证明 Google 新抓取、收录、规范选择或流量恢复；俄语母语读者、Firefox/WebKit 和实体手机未验收。其他候选页、全站翻译及处理器逻辑不在本轮范围。

## 2026-10-10 四篇韩语 Blog 与关联修复正式发布

授权：用户在明确“下一步是把四篇韩语文章和三处修复一起正式部署，并完成线上验收”后要求“执行”。本次发布两轮已完成的相关内容、素材和回归测试，不扩展到可选图片放大、其他文章、索引设置、广告、部署配置或 GSC 写入。沿用 main 的现有 Cloudflare Pages Git 集成，GitHub Pages、CI 与 Lighthouse 工作流保持不变；不另建直接上传渠道。

发布前核对：main、HEAD 与实时 origin/main 均为 `3d79780520d25134ae8492f05231520da64d787c`，GitHub 既有登录有效。十三份相关源码、测试和 PNG 与 `/tmp/pixelart-ko-followup.O7Dqqd/build/` 逐文件一致；复用上一轮同一最终源码的 Node 20 build、lint、typecheck、152 项 Chromium 全部通过/零重试及真实桌面/手机页面结果，不把复用写成另一次测试。只暂存相关文件及本次、前两轮对应记录；AGENTS.md、历史整理和旧发布回执的原有本地改动不混入提交。提交、云端部署及正式页面验收完成后补记结果；此处未将本地通过当作上线成功。

## 2026-10-10 韩语批次审评后的三处关联修复（仅本地）

授权：用户对只读审评发现的问题要求“修复”。本轮只修正韩语调色板说明、Illustrator 文章末段的过期语言提示，以及 Blog 列表未采用文章按钮标签的问题；不扩大到可选的图片放大、关键词研究、其他正文、索引设置或处理器逻辑。开始时 main、HEAD `3d79780520d25134ae8492f05231520da64d787c`；保留已有四篇韩语批次、素材、测试、AGENTS.md 和迭代记录改动，不提交、推送或部署。

修改：`public/locales/ko/translation.json` 的调色板提示明确 Pico-8、Lost Century、Sunset 8、Twilight 5、Hollow 都是内置固定调色板，区分图片生成调色板与固定色集，删除重复乱码和 `__PH_0__`。`src/content/blog-posts.ko.json` 条目 3 的末段改为指向韩语入门教程，不再称目标正文为英文；只改这句话，保留既有标题、描述及上次主体更新日期。`src/components/Blog.jsx` 复用现有 `presentation.readMoreLabel`，没有标签时仍用 Read more，与文章页的已有处理一致：韩语五篇显示 글 읽기，德语两篇采用已有的 Weiterlesen，其他未配置标签的文章继续英文回退，不改其他语言内容文件。

验证：沿用本轮页面 SEO 审评的结论，不重新假设曝光下降原因。在隔离目录从 HEAD 重新构建，并覆盖当前相关内容、语言资源、组件、素材与测试，避免构建生成文件混入工作区；六份受影响源码/测试与隔离目录逐文件一致。Node 20.19.0 的完整 build（含 ownership、SEO、dist、缓存与重定向检查）、lint、typecheck 及 diff-check 均通过。保持 VITE_E2E=0、生产式 Cookie 提示和真实拒绝操作；完整 Chromium 152 项全部通过、零重试。新增六项验证英文默认标签、德语已有标签和韩语五个入口的初始 HTML/运行时、按钮真实点击、刷新及 canonical；既有 Illustrator 与韩语实际上传测试增加过期语言提示、正确调色板说明和占位符消除的回归断言，保留原有元数据、下载、尺寸、限色和其他语言检查。

真实页面：在新预览的 1440/390px 检查韩语 Blog 列表、上传后的调色板说明及 Illustrator 交叉引用，共六个页面/视口组合，未发现横向溢出或脚本异常；已查看桌面/手机入口与调色板截图及手机引用截图，换行、按钮和说明正常。本地预览 `http://localhost:4206/ko/blog/`，独立后台 PID 67965；原 4200–4205 服务不改。构建、测试、截图和检查日志保留于 `/tmp/pixelart-ko-followup.O7Dqqd/`。

边界：未提交、部署或进行生产验收，未查询新 GSC、验证 Google 规范选择/收录或流量恢复；Firefox、WebKit、实体手机及韩语母语读者未验收。上一轮记录中的“发布前同步 Illustrator 交叉引用”和韩语工具调色板旧说明在本轮本地已修正，历史记录保留；可选图片放大与共享处理器的立即下载旧预览风险仍未改。

## 2026-10-10 剩余四篇韩语 Blog 批量本地化与功能纠错（仅本地）

授权：用户在回顾此前修复问题、讨论剩余四篇如何避免重犯后要求“执行”。本轮以 `src/content/blog-posts.ko.json` 一个内容源为范围，只改条目 0、1、2、4，增加必要案例 PNG、四张韩语分享图和对应测试；不提交、推送、部署、请求 Google 收录，也不改 canonical、hreflang、重定向、sitemap 或索引范围。开始时 main、HEAD `3d79780520d25134ae8492f05231520da64d787c`；用户原有 AGENTS.md、历史整理及旧回执改动保留，不覆盖。Illustrator 条目 3 与 HEAD 逐项相同，其他语言和共享组件不修改。

方法：复用 page-seo-workflow、seo-content、seo-google 和哥飞本地知识库。先一次性核对真实编辑器、导出行为与素材，再按四种意图改稿，共用已有正文、FAQ、比较表与分享图生成机制；不新建通用检查框架、安装项目依赖或用固定字数、关键词密度充当质量标准。标题长度含 ` | Pixel Art Village` 按 Unicode 字符计算，55–60 是用户编辑目标，不声称是 Google 的硬上限。

| 韩语目标 slug | 主词与用途 | 完整标题字符数 |
|---|---|---|
| best-pixel-art-converters-compared-2025 | `픽셀 아트 변환기 비교`：按照片转换、手工编辑、动画选择四种真实工具 | 59 |
| how-to-get-pixel-art-version-of-image | `사진 픽셀 아트 변환`：SNES 风格的尺寸与限色起点，不保证硬件兼容 | 57 |
| make-image-more-like-pixel | `픽셀 아트 보정`：按轮廓、颜色、点纹和导出症状排查 | 58 |
| how-to-pixelate-an-image | `이미지 픽셀화 방법`：首次上传、调参、PNG 保存及实际尺寸 | 59 |

关键词为按用途选择的主题，不是已验证的韩语搜索量或排名结论。Google API 能力检查本轮返回 Tier -1，无配置的 OAuth 或服务账号，未查询新的 GSC。2026-10-09 完整窗口与 URL 诊断仅作历史背景：其中韩语比较、结果调整文章曾被选择其他规范页；不能推成四篇当前都未收录，更不能把英文正文和虚构功能认定为全部曝光损失的唯一原因。没有接管个人浏览器或配置凭据。

内容：四篇标题、摘要、正文、图片说明、署名、日期显示、相关文章及返回文字均采用韩语；保留各自原发布日期，实际更新日期 2026-10-10。删除旧文中虚构的 Refiner、Optimizer、Enhance、图层/选择区、Resize 固定尺寸、图库发布和不实测试排名等说明。明确像素尺寸方向、自动与命名调色板的区别、PNG / Pixel size 与 Original size、预览缩放和导出尺寸的区别；把上传 10 MiB、长边 2200 像素限制放在入门篇，不将浏览器处理描述成网站没有任何外部通信。比较篇披露本站运营者身份，三种竞品按 2026-10-10 Aseprite、Piskel、GIMP 官方资料说明，不伪称同图实测。正文提供直接来源及 CC0 许可链接。每篇三组韩语问答，沿用解析器要求的 `## FAQ`，不修改共享解析规则或承诺搜索富媒体展示。

真实案例：沿用 Don McCulley 的 CC0 向日葵照片 `photo-sunflower-source.jpg` 的 960×762 JPEG 版本（不是原始最大分辨率）。在此前已验证、处理器与本轮 HEAD 相同的 4204 韩语编辑器中真实上传、逐次调参并点击下载，新增 `public/tutorials/pixel-art-ko/sunflower-pixel8.png`（120×95）、`sunflower-pixel12-colors24.png` 和 `sunflower-pixel12-colors24-dither.png`（均 80×63）。后两者同一会话，Pixel Size 12、自动调色板 24、RGB、亮度/对比/饱和度 0，仅切换迪瑟，实际均 24 个不透明 RGB 色且色集合相同。无自动调色板的 Pixel Size 12 输出继续复用原有 80×63 文件。每个调参步骤等待预览内容实际改变，不只等待 busy=false；不把测试等待当作已修复用户立即下载旧结果的共享异步风险。

新增事实与验证调整：当前 kmeansWorker 使用随机初始化，自动调色板重新生成时即使设置相同，具体色值也可能不同；两篇限色/排错文章明确说明这一点。自动限色输出验证真实尺寸、颜色上限、与本轮新预览的像素一致及同一轮开关迪瑟确实改变输出；不要求不同执行的随机调色板与静态案例逐像素相同。无自动调色板案例仍逐像素比对，文章的实际文件下载仍逐字节验证，未 mock 图片处理或固定随机数冒充真实行为。

测试过程：首次构建误设 VITE_E2E=1，使 Cookie 提示隐藏，而测试要求生产式 Cookie 交互；停止该轮，16 通过、4 失败、2 中断、124 未运行，记录和 trace 保留。改为 VITE_E2E=0，不删 Cookie 断言或改项目配置。第二轮完整 Chromium 146 项为 143 通过、3 失败：两项误要求随机自动调色板逐像素重现；另一项旧 Blog 测试仍定位已翻译掉的英文链接。分别改为符合真实行为的下载/预览、尺寸、限色、迪瑟验证，并将旧定位更新为韩语链接，保留目标 href 且增加实际点击后的韩语 H1 检查。没有重试刷绿或将首轮失败改写为通过。

补充测试诊断：为增加“下载与新预览一致”的检查，先用 Sharp 将大预览缩回小格子，cover 默认裁切和 fill 重采样均不等同于浏览器画布的最近邻显示，相关两次定向验证各两项失败。检查 trace 中真实 PNG 后，确认预览与下载的颜色集合相同，但重采样映射不同；最终用浏览器画布把实际下载格子扩大到预览尺寸，再逐像素比较，桌面与手机两项及韩语链接项共三项通过。中间在定向结果返回前误启动的完整回归也及时停止，26 通过、1 中断、119 未运行，不能计为完整通过。保留所有日志、截图、下载和 trace，不改处理器、放宽像素差异阈值或以反复随机运行挑选结果。

最终验收：HEAD 隔离构建目录覆盖本輪四篇内容、案例与测试，最终工作区内容源、两份相关测试、三张实际案例 PNG 及四张分享图与构建目录逐文件一致。Node 20.19.0 完整 build（含 ownership、SEO、dist、缓存与重定向检查）、lint、typecheck 和 diff-check 通过。最终生产式 Cookie 模式的完整 Chromium 146 项全部通过、零重试；新增 30 项涵盖四篇在 1440/390/320px 初始 HTML与运行时、Blog 点击、兄弟文章跳转、返回与刷新，title/description/H1/canonical/hreflang/robots/OG/Twitter、发布日期与组织署名、三组可见 FAQ 与 JSON-LD、站内链接、实际案例下载及文件一致、分享图 1200×630，以及桌面/手机实际上传、非法输入恢复、尺寸、颜色上限、迪瑟和下载与新预览一致。原有英文、德语、Illustrator、语言导航、工具与尺寸限制等回归仍保留。

真实页面：最终构建的隔离 Chromium 对四篇分别在 1440/390/320px 查看封面、比较表或案例及手机问答，等待字体、图片和滚动绘制稳定；12 个页面/视口组合无横向溢出、本站资源 4xx/5xx 或脚本异常。已直接查看各篇截图和四张韩语分享 PNG，字形、图像、大小与说明正常。分享图分别为 526910、510187、43988、524894 字节，不将 200KB 误设为 Google 的硬规则。

证据与预览：`http://localhost:4205/ko/blog/`，独立后台进程 PID 99671；原有 4200–4204 服务未改。隔离构建和失败证据位于 `/tmp/pixelart-ko-batch.WTKU0M/`，包括 `first-*`、`second-*`、`focused-*`、`sharp-fill-*`、`interrupted-*` 与 `verified-focused-*`；最终为 `build.log`、`final-tests.log`、`final-results/`、`final-report/`、`capture-results.json`、`cover-*`、`example-*`、`faq-*` 和实际下载。构建生成的其他语言 OG、sitemap、预渲染 HTML 不复制回工作区，dist 不手动编辑。纯记录补记不再触发构建或部署。

边界：本轮没有生产验收、Google 新抓取/规范选择/收录与流量效果验证，也没有竞品软件实机、韩语母语读者、Firefox/WebKit 或实体手机验收。既有 Illustrator 末段“相关像素化文章目前英文”的提示将因本轮本地翻译变旧；该条目不在本轮授权范围，暂不改，发布前需单独同步这一处交叉引用。韩语工具页的旧翻译与共享处理器风险不因本轮文章修复而视为已解决。

## 2026-10-09 韩语 Illustrator 文章及语言导航修复正式发布

授权：用户明确要求“部署上线”。发布范围为韩语 Illustrator 一个内容条目及素材、配套测试，以及此前已修正但尚未上线的 App 语言加载、Seo 站内导航同步与回归测试；不改其他文章、索引策略、重定向、广告、部署配置或 GSC。开始时 main、HEAD 与实时 origin/main 均为 `072249774b05017f3e7fb20c50c29aa9d64d6138`。用户 AGENTS.md、历史整理和旧发布回执的本地改动不混入提交。

发布前验证：复用隔离构建目录 `/tmp/pixelart-ko-illustrator.403pOs/build/`，九个发布源码、测试和素材文件与工作区逐字节一致；其他四篇韩语内容与 HEAD 相同。Node 20.19.0 重新完整 build（含 ownership、SEO、dist、缓存和重定向检查）、lint、typecheck 通过；生产式 Cookie 模式的完整 Chromium 116 项全部通过、零重试。记录为 `release-build.log`、`release-lint.log`、`release-typecheck.log`、`release-tests.log`、`release-results/` 与 `release-report/`。仅暂存本次正式发布及前两轮对应记录，不暂存本文件其他已有修改；沿用现有 main Git 集成，不新建部署渠道。提交、云端部署及正式页面结果待完成后补记，未将本地通过当作线上成功。

## 2026-10-09 韩语 Illustrator PNG 导出文章重写（仅本地）

授权：用户在单页 SEO 审评后回复“执行”。只重写 `/ko/blog/export-from-illustrator-image-to-pixel-art/`，不扩展到其他韩语文章，不改索引、canonical、hreflang、重定向或 sitemap 策略，不提交、推送、部署或提交 GSC。分支 main、HEAD `072249774b05017f3e7fb20c50c29aa9d64d6138` 未变。已有 AGENTS.md、迭代记录及上一轮 App、Seo、seo-navigation 测试修改保留；本轮预览包含这些尚未发布的共享修复。

方法与定位：使用 page-seo-workflow、seo-page、seo-content、seo-hreflang 和哥飞本地 SEO 知识库，按真实用途重写一个内容条目。主词为 `일러스트레이터 PNG 내보내기`（Illustrator PNG 导出），辅助主题为像素尺寸、透明背景和模糊排查；这是按页面意图选择，不是已验证的韩语搜索量结论。复用此前独立 URL 诊断作为背景，本轮没有查询新的 GSC 数据，也不能证明 Google 将此页归并到另一篇韩语文章的全部原因。

修改：只改 `src/content/blog-posts.ko.json` 中 Illustrator 条目。标题、摘要、正文、图片说明和页面内展示文字改为韩语，完整搜索标题含品牌共 57 个字符；原发布日期 2025-10-09 保留，更新日期为 2026-10-09，增加组织署名及关于页面链接。删除不存在的 Optimizer、批量导出、Optimized PNG、社区挑战等功能和无依据的 Canva 步骤；将“全部 300 PPI／关闭抗锯齿”改为按实际像素尺寸、显示需求和边缘效果判断。区分清晰 PNG 导出与主动像素化，不宣称本站能够恢复低清图片细节。另一个韩语像素化文章仍为英文正文，相关链接明确提示，本轮不重写它。其余四个韩语文章条目与 HEAD 逐项相同，其他语言内容源未修改。

依据与素材：2026-10-09 阅读 Adobe 官方韩语 artwork export、Export for Screens 文档及 pixel-perfect 文档，正文包含三个直接来源链接。本机没有 Illustrator，因此未执行 Illustrator 实机导出，正文明确披露此限制。原始自制 `size-source.svg` 在隔离 Chromium 中渲染并实际点击下载，保存为 512×512 与 64×64 PNG；实际尺寸、透明区域及不透明区域已检查。两张图片明确标为浏览器生成的尺寸演示，不冒充 Illustrator 截图、导出实验或客户案例。只复用现有构建脚本生成并复制本篇韩语 1200×630 分享图，不修改共享模板、增加依赖或复制其他生成产物。

测试过程：新增 `tests/blog-ko-illustrator.spec.js` 七项测试。旧内容在原有共享修复预览中进行两项桌面测试，均按预期失败。首轮完整 116 项为 110 通过、6 失败：韩语 FAQ 标题未被现有模板的 FAQ 识别规则匹配，未生成问答结构化数据。只将本篇该标题改为 `FAQ`，保留韩语问题和答案，未改共享解析器或削弱断言。原始失败日志、报告、截图和 trace 保留。

最终验收：将本篇内容、素材、测试与上一轮待发布共享修复覆盖到 HEAD 的隔离构建目录，逐文件比较与工作区一致。Node 20.19.0 完整 build（含 ownership、SEO、dist、缓存与重定向检查）、lint、typecheck、diff-check 通过；最终生产式 Cookie 模式的 Chromium 116 项全部通过、零重试。新测试覆盖 1440/390/320px 初始 HTML 与运行时、Blog 入口点击和刷新、title/description/H1/canonical/hreflang/robots/OG/Twitter、发布日期及组织署名、四组可见 FAQ 与 JSON-LD、标题层级、站内链接 HTTP 200、实际 PNG 下载及尺寸和像素一致、透明区域与分享图。另以真实隔离浏览器截图核对桌面和手机封面、导出说明、演示与问答，三个宽度无横向溢出、本站资源 HTTP 4xx/5xx 或脚本异常，刷新前后标题、正文、语言和规范网址一致。

证据与边界：`/tmp/pixelart-ko-illustrator.403pOs/` 保留 `before-tests.log`、`before-results/`、首轮 `tests.log`、`results/`、最终 `final-build.log`、`final-lint.log`、`final-typecheck.log`、`final-tests.log`、`final-results/`、`final-report/`、`final-capture-results.json`、`final-*.png` 与实际演示下载记录。本地预览为 `http://localhost:4204/ko/blog/export-from-illustrator-image-to-pixel-art/`，原有预览不动。本轮仅本地完成；Illustrator 实机、韩语母语读者、Firefox/WebKit、实体手机、production、Google 规范页更新及流量效果未验证。

## 2026-10-09 语言加载与站内跳转 SEO 标签修复（仅本地）

授权：用户在韩语两篇文章渲染诊断后要求“修复”。本轮只修共享语言加载与站内跳转后的页面标签，不重写韩语正文，不修改索引、canonical、hreflang、重定向或 sitemap 策略，不提交、推送、部署或提交 GSC。开始与结束分支 main、HEAD `072249774b05017f3e7fb20c50c29aa9d64d6138`；已有 AGENTS.md 与本文件的修改继续保留。使用 page-seo-workflow 的预渲染规则复用与真实页面验收思路。

已确认问题：韩语 Blog 点击文章时，语言预加载器因固定语言路由没有 `:lang` 参数而回到英文；点击进入与直接打开／刷新读取的内容源不一致。原 Seo 组件只更新标题、描述、语言和 noindex，canonical、hreflang、分享标签及结构化数据会停留在先前页面。此前诊断实际复现 pixelate → Blog → Illustrator 后 canonical 仍为 pixelate；这是确定的运行时信号冲突，但不能证明它是 Google 归并的唯一原因。此前 URL 诊断与本次代码验收分开，不把本地测试当作新的收录结果。

修改：`src/App.jsx` 将实际路由语言明确传给 TranslationPreloader；`src/components/Seo.jsx` 在站内切页时读取目标网址已有预渲染 HTML 的标签，保持其语言列表、结构化数据和英文归并策略，不在浏览器另造规则。回到原始页面恢复原始标签；请求先清除旧页面信号，检查响应、目标路由归属、canonical 与 JSON-LD，10 秒超时，失败记录错误，快速切页取消旧请求，避免迟到结果覆盖新页。代价是站内切页增加目标 HTML 请求；读取失败时不保留旧页面 canonical，正文仍可阅读，后续跳转或刷新可恢复。未新增依赖或构建脚本。

测试过程：新增 `tests/seo-navigation.spec.js`。旧版本两项韩语桌面／手机导航测试均按预期失败。首轮完整 108 项为 104 通过、4 失败，失败为测试使用隐藏的手机桌面导航及错误的德语 Cookie 按钮名称；修正定位后第二轮 107 通过、1 失败，trace 证实文章加载占位分支及正文分支可能各记录一次 503，而测试误要求仅一次。改为验证已记录目标路由的真实 503，同时保留正文、旧标签清除及恢复后的完整标签断言，没有放宽页面正确性要求。另补有效但属于错误路由的 HTML 拒绝用例。原始失败报告和 trace 全部保留，不用后续通过覆盖历史结果。

最终验收：只把本轮 App、Seo 与测试覆盖到 HEAD 的隔离构建目录，逐文件 cmp 一致；完整 Node 20.19.0 build（包含 ownership、SEO、dist、缓存和重定向检查）、lint、typecheck、diff-check 通过。最终生产式 Cookie 模式的完整 Chromium 109 项全部通过、零重试。新增用例覆盖韩语两篇、德语两篇、英文两篇的 1440/390px 点击、返回、换文章及刷新，完整头部与正文逐项对照真实预渲染 HTML，确认没有新增文档导航；还验证 503、无效 HTML、错误路由 HTML 后恢复，以及迟到请求不覆盖当前文章。失败模拟仅用于隔离错误路径，不当作真实线上请求证据。

真实页面：隔离浏览器在 1440/390/320px 重走 pixelate → Blog → Illustrator，刷新前后标题、正文、语言及 canonical 一致，无横向溢出、本站资源 4xx/5xx 或脚本异常。已查看最终三个宽度的封面及桌面正文截图。初次手机封面截图未等滚动与绘制稳定而为空，保留原图，等待滚动归零、字体及图片加载后重新截图；最终手机封面正常。另实际点击德语 Blog 页脚进入 `/de/converter/photo-to-sprite-converter/`，仍 canonical 到英文 Sprite，未强制自引用。

证据：`/tmp/pixelart-ko-head-fix.Ntnu1q/` 的 `before-tests.log`、`before-results/`、`tests.log`、`results/`、`verified-tests.log`、`verified-results/` 保留各轮结果；最终为 `final-build.log`、`final-lint.log`、`final-typecheck.log`、`final-tests.log`、`final-report/`、`final-results/`、`capture-results.json` 与 `verified-cover-*.png`。本地构建预览为 `http://localhost:4203/ko/blog/`，原有 4200 和 4202 预览不动。

边界：仅本地完成。韩语 JSON 中仍有英文正文和旧的不准确功能描述，语言源选择修复不等于翻译或内容质量修复；Google 的规范页选择是否更新必须在授权上线后再查。Firefox/WebKit、实体手机、真人阅读和 production 验收未执行；本轮没有重新查询 GSC 或请求编入索引。

## 2026-10-09 剩余问题网址诊断与英文 SNES 教程修正（仅本地）

授权：用户在“检查剩余问题网址，整理需要修复／正常排除／继续观察清单，再选一个页面执行”的建议后回复“执行”。本轮只修改 `/blog/how-to-get-pixel-art-version-of-image/` 的操作准确性，不部署、不提交 Git、不请求收录、不改变 canonical、hreflang、重定向、广告或索引范围。开始与结束 HEAD 为 `ca6f7704c4f2ca9e3ccc21b1dbe61d1cf87200a8`、分支 main；用户已有 AGENTS.md 和迭代记录改动保留。

方法：使用 seo-google、seo-content、page-seo-workflow 与哥飞本地知识库的单页证据思路。复用原有服务账号，通过只读 scope 查询 Google 官方 Search Analytics、URL Inspection 和 Sitemaps API，凭据只从环境变量指定文件读取，不写入配置、源码、笔记或报告。API 凭据检查返回 Tier 1，仅核实本轮所需的 GSC 读取能力；不将自动列出的其他 API 能力视为已验证。没有接管个人浏览器或创建新服务、依赖和监控流程。

日期：当前 API 的 firstIncompleteDate 为 `2026-10-07`。只比较完整 28 天窗口 `2026-08-12..09-08` 与 `2026-09-09..10-06`，查询使用 final 数据；页面汇总和 query+page 明细分开，查询明细不会覆盖匿名词，不能强行凑成页面点击总数。本轮结果是当前快照，不复用历史截图中的 279/184/50/26/6 等数量。

### 当前检查范围与结果

- 正式 sitemap 的 205 个网址全部实际 HTTP 检查：205 个直接 200、无重定向、每页一个 H1、自引用 canonical，HTML 与响应头未见 noindex。另查 8 个旧入口及 1 个故意不存在的控制网址；旧入口目前都能跳到 200 目标，控制网址实际 404。没有把控制网址当成需要修复的业务页面。
- URL Inspection 检查 100 个命名网址，其中 85 个为 sitemap 内的 Blog 文章，另外 15 个为重点入口和旧路径；没有检查全站每个网址的收录，也没有枚举 GSC 索引报告全部历史排除 URL。一个意大利语页面首次 API 返回 500，原失败记录保留，仅补查一次后成功，不把接口错误当作未收录。
- 最终 100 个状态为：66 个已收录、23 个 Google 选择其他规范网址、2 个已发现未收录、1 个已抓取未收录、4 个重定向、1 个历史 404、3 个 Google 未知。85 篇 Blog 中对应为 59 个已收录、23 个重复、2 个已发现未收录、1 个已抓取未收录。
- sitemap API 返回 0 errors、0 warnings、205 submitted，lastDownloaded 为 `2026-09-30T12:48:05.767Z`。其中 indexed=0 不代表网站零收录，与逐 URL 返回的已收录状态分开解释。
- 两篇德语已发布文章本次均返回 Submitted and indexed：比较页 lastCrawlTime 为 `2026-10-08T13:48:32Z`，入门教程为 `2026-10-09T07:07:34Z`。API 未提供 Google 保存的正文，不据此声称搜索标题已同步、排名恢复或全站故障消失。

### 需要修复或单独决策的清单

下表语言代码按 `/<语言>/blog/<slug>/` 展开为实际网址。23 个重复页不是源码漏写 canonical：页面目前自引用，但 22 个正文与 Google 选择的另一个网址正文完全相同（逐条 JSON 正文比较，不含标题等其他字段）。内容相同是已确认问题，不单独证明 Google 的全部选择原因；另一个韩语页面正文不同、目标主题也不同，必须独立诊断，不能全判为正常重复。后续先决定真实本地化还是合并，不强制把 canonical 改回自身或批量恢复旧网址。

| 分类 | 网址 / slug 与语言 | 本轮判断及行动 |
|---|---|---|
| 已修正、本地待发布 | `/blog/how-to-get-pixel-art-version-of-image/` | 已收录且有真实点击，Pixel Size 方向错误；本轮先修操作准确性，不以改稿代替发布 |
| 需要独立语言内容 | `best-pixel-art-converters-compared-2025`：id、it、ko、nb、nl、th、vi，共 7 个 | 均被归到 `/sv/blog/best-pixel-art-converters-compared-2025/`；正文与该页相同，本轮未翻译或改索引策略 |
| 需要独立语言内容 | `export-from-illustrator-image-to-pixel-art`：id、pl、sv、tl，共 4 个 | 正文与 Google 选中的 nb 或 it 对应文章相同；本轮保留，不伪装独立翻译完成 |
| 需要单独诊断 | `/ko/blog/export-from-illustrator-image-to-pixel-art/`，共 1 个 | Google 选中 `/ko/blog/how-to-pixelate-an-image/`，正文不相同；需要核对渲染、语言和页面主题，尚未证实原因 |
| 需要独立语言内容 | `make-image-more-like-pixel`：id、it、ko、nl、pl、sv、tl、vi，共 8 个 | 正文均与 Google 选中的 nb 文章相同；不能靠重复请求收录解决内容重复 |
| 需要独立语言内容 | `how-to-pixelate-an-image`：nl、pl、sv，共 3 个 | nl/pl 正文与 id 目标相同，sv 与 tl 目标相同；保留语言与规范策略，后续逐页决定 |
| 需要后续内容修正 | `/ar/blog/how-to-get-pixel-art-version-of-image/` | 当前源码仍写 SNES Refiner Module、Village Export Hub 等不存在的功能；当前窗口 0 点击、1 曝光，优先级低于本轮英文页，不扩大本轮语言范围 |
| 需评估旧新主题对应 | `/blog/turn-photo-into-pixel-art/`、`/blog/how-to-convert-image-to-pixel-art-step-by-step/`、`/blog/pixel-art-color-palette-guide/` | 当前跳到比较文章，GSC 为 URL unknown；跳转可用不等于意图匹配。本轮不改规则，不自动恢复旧页 |

### 正常排除与继续观察的清单

| 分类 | 实际网址 | 本轮证据与处理 |
|---|---|---|
| 正常重定向、无需单独收录 | `/en/`、`/no/`、`/fil/` | 当前分别 301 到 `/`、`/nb/`、`/tl/`，终点 200；GSC 同为 Page with redirect，保留 |
| 正常英文归并入口 | `/de/converter/photo-to-pixel-art/` | 当前 301 到英文 Photo，终点 200；GSC 为 Page with redirect，不冒充独立德语内容页 |
| 历史状态与当前 HTTP 不一致、观察 | `/converter/bmp-to-pixel-art/` | GSC 仍显示 Not found (404)，但当前实际 301 到 `/converter/image-to-pixel-art/` 且 200；不重新造一个重复 BMP 页，也不声称 Google 已更新状态 |
| 继续逐页观察 / 内容审评 | `/es/blog/pixel-art-tutorial-complete-guide-2025/`、`/fr/blog/pixel-art-tutorial-complete-guide-2025/` | 本次为 Discovered - currently not indexed，尚无 lastCrawlTime；当前 HTTP 200、允许索引，不据此直接认定内容导致拒收或复制德语新稿 |
| 需要后续单页内容诊断 | `/ru/blog/pixel-art-tutorial-complete-guide-2025/` | 本次为 Crawled - currently not indexed，当前 200、自引用 canonical；已有其他俄语文章有点击，不能批量排除整种语言 |

### 本轮英文教程修改与验收

选页依据：当前完整窗口英文 SNES 教程有 11 点击、256 曝光、平均排名约 7.88；前一窗口为 8 点击、263 曝光。真实 query+page 明细中有 snes pixel art、snes style pixel art、pixel art snes 等查询。该页当前已收录、允许抓取、抓取成功、Google/user canonical 一致，lastCrawlTime 为 `2026-10-07T18:52:42Z`。本轮不是未收录抢救，也不声称小样本排名变化来自既有改稿；选择它是因为已有读者会被确定的操作错误误导。

修改：只改 `src/content/blog-posts.en.json` 中该一个条目。保留 URL、title、description、H1、关键词、发布日期 2025-10-14 与分享图；实际更新日期记为 2026-10-09。纠正 Pixel Size 越大、块越大、输出像素越少的方向；补充 Generate palette from image 与 Palette Colors、命名调色板的区别；说明 PNG / Pixel size 导出和等待预览更新，声明 SNES-style 是视觉参考而非专用硬件模式。复用现有 Photo 向日葵案例作参数说明，不新增素材或手工加工结果，不修改图片处理器。

行为证据：使用真实浏览器上传原有 960×762 向日葵 JPEG，在主 Image converter 上实际逐次调参并下载 PNG。Pixel Size 8 为 120×95，Pixel Size 12 为 80×63；后者全部像素与既有 `photo-sunflower-pixel12.png` 一致。实际开启生成调色板，从 16 调到 24 色再下载，PNG 仍为 80×63，实际颜色数不超过 24。桌面与手机均通过，包含非法文本上传后正常恢复；每次等预览真实更新再下载，未将等待写成已修复共享处理器的立即下载旧结果风险。

测试过程：新增 `tests/blog-snes.spec.js`。修复前六种文章视口/脚本组合按预期失败、两项真实工具测试通过，证明原操作文案与实际行为不符。首版新增原图直链被已有 LocalizedLink 加上尾斜杠，六项文章测试捕获到错误；改为链接现有 Photo 案例页，增加正文实际站内链接 HTTP 检查，没有扩大修改共享链接组件或放宽有效断言。两轮失败报告和 trace 保留。

最终验收：从 HEAD 导出临时构建副本，仅复制本篇内容源和新增测试，避免刷新工作区 public sitemap 或混入无关改动。Node 20.19.0 完整 build（含 ownership、SEO、dist、缓存与重定向检查）、新增测试 ESLint、typecheck 和 diff-check 通过；生产式 Cookie 模式的 Chromium 定向 25 项全部通过、无自动重试。覆盖本篇 1440/390/320px 初始 HTML与运行时、Blog 入口点击和刷新、原标题/摘要/规范网址、发布日期与更新日期、可见 FAQ 与 JSON-LD、正文链接、真实下载尺寸和颜色数、无横向溢出，以及现有德语两篇、俄语、英文、韩语 Blog 和 Photo 实际导出回归。已查看桌面/手机参数、调色及导出说明截图，没有发现新增文字溢出或重叠；三个视口未记录到本站资源 HTTP 4xx/5xx 或脚本异常。

证据与边界：`/tmp/pixelart-remaining-pages.hLxFIc/` 保留当前日期窗口、页面/查询明细、sitemap API、214 个 HTTP 结果、100 个 Inspection 原始结果及一次 500 补查、修复前与首版失败报告、`build-final.log`、`verified-tests.log`、`verified-report/`、`verified-results/`、实际下载 PNG 和截图。预览为 `http://localhost:4202/blog/how-to-get-pixel-art-version-of-image/`。所有其他 Blog 条目与 HEAD 逐项一致，本轮没有改生产；未覆盖 Firefox/WebKit、实体手机或真人阅读测试。旧 GSC 报告中的所有 404/noindex/备用网址未获得完整 URL 清单，本轮不能声称全量修完或逐项确认正常。

### 英文 SNES 教程正式发布

新授权：用户在只发布已修正英文 SNES 教程的建议后回复“执行”。本次只提交该英文内容条目、`tests/blog-snes.spec.js` 与本轮诊断／修正／发布前记录，不扩大到其他页面，不改 canonical、hreflang、重定向、广告或索引设置，不提交 GSC。

发布隔离：开始时 main、HEAD 与实时远程 main 均为 `ca6f7704c4f2ca9e3ccc21b1dbe61d1cf87200a8`。复用从 HEAD 导出的干净副本 `/tmp/pixelart-remaining-pages.hLxFIc/build/`，两个发布源文件与工作区逐字节相同；文档只暂存本轮英文 SNES 记录，保留 AGENTS.md、历史整理和旧发布回执的本地改动，不混入构建生成的 sitemap、素材、依赖、配置或其他内容。

发布前验证：Node 20.19.0 重新完整 build（含 ownership、SEO、dist、缓存与重定向检查）、完整 lint、typecheck 与 diff-check 通过；生产式 Cookie 模式的完整 Chromium 99 项全部通过，无自动重试。证据为 `release-build.log`、`release-lint.log`、`release-typecheck.log`、`release-tests.log`、`release-report/` 与 `release-results/`。沿用现有 Git 集成部署，提交、部署回执及正式页面结果待后续补记，不将本地测试当作生产验收。

## 2026-10-09 德语像素画入门教程重写（仅本地）

授权：用户同意关键词研究后的单页方案。本轮只优化 `/de/blog/pixel-art-tutorial-complete-guide-2025/`，不提交、推送、部署或请求 Google 收录。开始时 main、HEAD `a3c72b4846803a151b75d1bcdee06e44f4fb3f41`；AGENTS.md 和本文件已有未提交改动，全部保留。

选词：主词为 `Pixel Art lernen`，辅助词为 `Pixel Art für Anfänger`、`Pixel Art Tutorial deutsch`，面向德语初学者的绘画学习需求，不把照片转换当作像素画绘制。此前读取的 Ubersuggest 德国/de 估计为主词月搜索量 20、难度 27；搜索量历史只到 2026-05，难度更新时间为 2026-04-06，不当作当前实时量或排名保证。此前 GSC 完整窗口 2026-09-08..10-05 该页没有点击与曝光，本轮没有刷新 GSC，不能据此认定它导致首页曝光损失。

内容：`src/content/blog-posts.de.json` 只替换该教程条目，保留原网址和发布日期 2025-10-28，实际修改日期为 2026-10-09。完整搜索标题为 `Pixel Art lernen: Anleitung für Anfänger | Pixel-Art-Dorf`，共 57 个字符；正文标题、摘要、德语展示标签、FAQ 和分享图与教程主题一致。去掉未经证实的价格、硬件清单和尺寸定义，改为原创 32×32 宝石练习：画布、轮廓、填色、阴影与高光、PNG 导出、常见错误。说明放大展示不改变文件尺寸，保留工具比较页和本站照片转换入口，FAQ 可见并同步现有 FAQPage 结构化数据。

真实练习：在隔离 Chromium 中操作 [Piskel 官方编辑器](https://www.piskelapp.com/p/create/sprite/)，通过实际画笔、油漆桶、调色和 PNG 下载界面完成四阶段原图。每张导出的 32×32 PNG 均解码检查全部 1024 个像素，与原创坐标和颜色设计一致；最终文件为五种不透明颜色及透明背景。四个下载文件位于 `public/tutorials/pixel-art-lernen/`，页面步骤图直接使用这些文件，没有用生成图片冒充编辑器结果。已核对 [Piskel 官方页](https://www.piskelapp.com/) 的使用说明，正文步骤对应本轮实际界面。复用现有 Sharp 脚本生成 1200×630 德语分享图，像素图使用最近邻放大。

必要模板支持：新增可选正文 figure 图块及原生 PNG 下载链接，React、内容加载器与预渲染同步处理，阅读字数不把图块计为字符串；封面可选方形和原图像素放大标志。只有目标条目启用这些数据，其他 89 个 Blog 条目与 HEAD 逐项一致，德语比较页和俄语旧教程回归通过。第一次新增教程测试的六种视口/脚本组合失败，原因是旧加载器把图块转成 `[object Object]`；修正加载器和预渲染归一化后重新完整构建与测试，没有放宽断言。初次失败的 trace 和报告保留在证据目录。

最终验收：Node 20.19.0 完整 build（含 ownership、SEO、dist 和重定向检查）、完整 lint、typecheck 通过。生产式 Cookie 模式的完整 Chromium 91 项全部通过，无自动重试；其中教程覆盖 1440、390、320px 宽度的初始 HTML（禁用 JavaScript）及运行时、从 Blog 点击与刷新、57 字符 title、canonical/OG/Twitter/hreflang、发布日期与修改日期、可见 FAQ 与 JSON-LD、四张步骤图、真实 PNG 下载及像素、分享图尺寸及实际像素、相关链接与无横向溢出。另覆盖已有 Blog、converter 和 18 个 Sprite 语言入口及实际导出。最终桌面与两种手机宽度的封面、步骤图截图已查看，未发现文章文字与图片重叠或裁切；这些隔离页面未记录到本站资源 HTTP 4xx/5xx 或页面脚本异常。构建日期刷新的两个 public sitemap 已恢复修改前内容，不混入全站日期变更。

证据：`/tmp/pixelart-de-tutorial.UdX1kX/` 中保留真实 Piskel 操作截图、四个下载 PNG、原创设计坐标、`build-final.log`、`tests-final.log`、`report/`、`results/` 及 `cover-*.png`、`figure-*.png`。本地预览为 `http://localhost:4200/de/blog/pixel-art-tutorial-complete-guide-2025/`。

边界：仅本地完成，未提交、推送、部署或提交 GSC，不声称 Google 已抓取新版、收录或排名恢复；Firefox/WebKit、实体手机和真人绘画验收未验证。首页、其他内容条目、全站语言及索引策略没有修改。

### 审评后的新手操作补强

授权：用户在 SEO 单页审评后要求“执行建议”。本轮继续只完善同一德语教程的新手操作图、坐标提示和真实署名，不修改多语言关联，不发布或提交 GSC。保留此前全部本地修改及用户已有文档改动，完整搜索标题仍为 57 字符，关键词、摘要、原网址和日期不变。

素材：重新操作隔离浏览器中的真实 Piskel，绘制、填色、下载四阶段 PNG，并再次核对全部像素。新导出文件与原有四个下载 PNG 字节完全一致，没有替换原图。新增三个原生浏览器界面截图：RESIZE（281×550）、调色器（272×195）、EXPORT（328×550），分别约 14、15、38 KB；注明实际截图日期和按钮位置，未用生成图冒充界面。第一张截图因面板滑入动画裁掉左侧，已保留初次证据并重新截取完整面板；最终素材已逐张查看。页面截图不作像素化处理、不放大超过原尺寸，并提供新标签页打开原尺寸图片的链接，方便手机查看小字。

轮廓说明：只在轮廓图上启用 HTML/CSS 坐标辅助，标出 x/y 方向、0–31 编号及对应网格，正文说明上边、最宽处和尖端的具体坐标。网格不是下载文件的一部分；四个原始 32×32 PNG 及透明度保持不变。截图检查发现窄屏最右坐标越出图框，已将边缘文字向内对齐，坐标锚点仍位于对应像素中心，并新增位置和文字边界断言。

署名：文章标题下可见 `Von Pixel Art Village`，链接现有 `/de/about/`；BlogPosting 的组织作者名称与介绍 URL 同步。没有虚构个人身份、头像或专业资历。正文明确说明步骤通过真实浏览器自动操作和 PNG 像素比对验证，不冒充真人初学者绘画测试。作者和坐标辅助均为可选条目配置，React 与预渲染保持一致；其他 89 个 Blog 条目与 HEAD 相同，比较页和俄语旧教程没有新增署名或图块。

最终验证：Node 20.19.0 完整 build、完整 lint、typecheck 和 diff-check 通过。最终版本生产式 Cookie 模式的 Chromium 91 项全部通过、无自动重试；教程覆盖 1440/390/320px 的初始 HTML和运行时、七张正文图片及真实尺寸、三个界面素材 HTTP/文件大小、原尺寸链接实际新标签页打开、十个坐标锚点与边缘文字边界、署名链接与组织作者数据、原始 PNG 下载/颜色/透明度，以及原有 SEO 标签、FAQ 和分享图检查。桌面及两种手机宽度的署名、坐标图、设置/调色/导出截图已查看，未发现目标内容裁切、文字重叠或横向溢出；隔离页面未记录到本站资源 HTTP 4xx/5xx 或脚本异常。构建自动刷新的两个 public sitemap 已恢复原内容，不混入全站日期更新。

证据：`/tmp/pixelart-de-tutorial-help.ZHgvqz/` 的 `piskel-capture-final.log`、真实界面截图、四个重新导出的 PNG、`build-final.log`、`tests-final.log`、`report/`、`results/` 和桌面/手机截图。本地预览仍为 `http://localhost:4200/de/blog/pixel-art-tutorial-complete-guide-2025/`。未提交、推送、部署或请求收录；多语言内容一致性问题留待单独确认，Firefox/WebKit、实体手机、真人绘画验收和 Google 抓取/收录/排名未验证。

### 德语教程正式发布

新授权：用户明确要求“上线部署”，授权提交、推送并部署已经完成本地验收的德语教程。只发布 `/de/blog/pixel-art-tutorial-complete-guide-2025/` 的原创宝石练习、七张正文图片、坐标提示、真实署名、57 字符搜索标题和德语分享图，以及必要的可选模板支持与测试。不修改其他语言内容、hreflang 策略、广告、索引设置，不提交 GSC。

发布隔离：开始时 main、HEAD 与实时远程 main 均为 `a3c72b4846803a151b75d1bcdee06e44f4fb3f41`。从 HEAD 导出干净副本 `/tmp/pixelart-de-tutorial-release.ZjrVrn/`，只加入七个相关代码/测试文件及八张图片；文档只暂存本篇教程及本次发布段落，保留 AGENTS.md、历史整理和旧发布回执的未提交修改。不混入构建生成的 sitemap 或无关图片，未新增依赖、云端配置或站点。

发布前验证：Node 20.19.0 完整 build（含 ownership、SEO、dist 和重定向检查）、完整 lint 和 typecheck 通过；生产式 Cookie 模式的完整 Chromium 91 项全部通过，无自动重试。证据为发布副本中的 `build.log`、`tests.log`、`release-report/` 和 `release-results/`。沿用现有 Git 集成部署；提交、部署回执和正式页面结果待后续补记，不将本地测试当作生产验收。


## 2026-10-08 德语转换器比较文章优化（仅本地）

授权：用户查看 GSC 索引报告并要求判断可恢复页面后，明确回复“执行建议”。本轮只优化 `/de/blog/best-pixel-art-converters-compared-2025/`，不发布、不请求 Google 收录、不批量修改其他未收录页面。开始时 main、HEAD `4badfb398e430333a908889d1a3ba61ca503c4a5`；AGENTS.md 和本文件已有未提交改动，全部保留。

诊断依据：上一轮当前 URL Inspection 显示该德语文章已抓取但未收录，最后抓取时间为 `2026-05-31T06:14:03Z`，抓取成功且 robots 允许；当前 HTTP 页面为 200、自引用 canonical，没有发现 noindex。API 未返回该页 googleCanonical/userCanonical，不能补造其选择结果。它是值得改善的真实德语文章，不是重定向别名；尚无证据证明其流量价值或它导致了首页曝光下降。

内容：`src/content/blog-posts.de.json` 只替换该文章条目，保留网址与原始发布日期 2025-11-01，另记实际修改日期 2026-10-08。原来缺少证据的“10 款实测”、星级与数字评分改为 4 款工具的用途比较，披露文章由本站团队撰写。明确本站实际验证与其他工具的官方资料不是同一种证据，不宣称横向速度/画质测试。修正本站导出为 PNG/JPEG/WEBP、10 MiB 上传及 2200px 长边处理限制，说明照片转换不能替代逐像素绘制或动画编辑。

资料核对：[Aseprite 官方页](https://www.aseprite.org/)、[Piskel 官方页](https://www.piskelapp.com/) 和 [GIMP Verpixeln 文档](https://docs.gimp.org/3.0/de/gimp-filter-pixelize.html) 已实时读取；文中各工具说明附对应链接，不沿用旧价格或未经证实的注册、隐私、协作能力。采用 [Google 评测内容建议](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews) 中的证据、用途、优缺点和来源思路，不套固定字数或把改稿当成收录保证。

真实案例：复用已归档的 Don McCulley/CC0 向日葵原图 `photo-sunflower-source.jpg`（960x762）及本站实际导出的 `photo-sunflower-pixel12.png`（80x63）。文章给出 Pixel Size 12、无调色板、Dithering 关闭、三项颜色调整为 0、PNG/Pixel size 导出，声明图片只展示本站，不冒充四工具同图实测。案例不裁切，结果按硬边像素放大，正文含来源及许可。

展示隔离：文章条目新增可选 presentation/cover/updated 数据，React 与预渲染回退读取同一配置；只此条目启用德语封面标签、阅读时间、相关文章与返回按钮、案例和修改日期。共享模板保留旧默认值；89 个其他 Blog 条目的展示元信息、封面和阅读时间与 HEAD 逐项一致，德语其余两篇文章数据未变。德语 Blog 已有本页入口，更新的标题和摘要自然来自同一内容源，没有另改列表页或全站语言政策。保留 canonical/hreflang 规则，新增可见 FAQ 并由现有解析器同步 FAQPage；datePublished 保留原日期，dateModified 使用实际修改日期。

本地验收：Node 20.19.0 完整 build（含 ownership、SEO、dist、重定向检查）、受影响文件 ESLint、typecheck、git diff --check 通过。首次内容替换缺逗号导致 JSON 构建失败，已修正并完整重建通过；没有放宽检查或更换依赖。构建日期刷新生成的两份 public sitemap 已恢复为修改前字节，不混入全站日期变更；正式 sitemap URL 集合仍为 205 个。

最终 Chromium 定向 19 项全部通过，无自动重试：目标页桌面 1440x900/手机 390x844 的初始 HTML 与运行时、从德语 Blog 点击进入并刷新、单 H1、title/description/canonical/OG/Twitter、德语 hreflang、发布日期与修改日期、三项 FAQ 与可见问答一致、德语展示标签、图片自然尺寸/完整展示/像素放大、官方来源及内部入口、无横向溢出；另覆盖已有英文与韩语 Blog、西语语言切换/首页/上传/生产 Cookie 模式及 Photo 桌面手机实际导出。Photo 两次真实下载均为 80x63 PNG，并与展示结果逐像素一致。桌面与手机截图已查看。证据保留在 `/tmp/pixelart-de-comparison.SL1sn1/results/` 与 `report/`，预览为 `http://localhost:4198/de/blog/best-pixel-art-converters-compared-2025/`。

边界：未提交、推送或部署；没有验证 Google 抓取新版、收录或排名恢复。未验证 Firefox/WebKit、实体手机或替代工具的实际转换流程。已有其他多语言英文回退、404、法语品牌标题及重定向问题未在本轮处理。

### 德语比较页标题长度修正

用户根据 AITDK 截图要求搜索标题控制在 55–60 个字符。完整 title 改为 `Pixel-Art-Konverter: 4 Tools im Vergleich | Pixel-Art-Dorf`，包含空格、分隔符与品牌共 58 个字符。只给该文章新增可选 seoTitle，正文 H1、Blog 列表标题、结构化数据 headline、描述、正文与网址保持不变；React 和初始 HTML 的 title/OG/Twitter 同步使用短标题，其他文章继续沿用旧默认规则。55–60 是此次编辑要求，不是 Google 的硬性字符限制；[Google 官方说明](https://developers.google.com/search/docs/appearance/title-link)指出标题会根据设备显示宽度截断。

本次最终 Node 20 完整 build、受影响文件 ESLint、typecheck 与 diff-check 通过。当前版本 Chromium Blog 7 项全部通过、无重试，包含目标页桌面/手机初始 HTML 与运行时的短标题及长度断言、H1 不变、社交标题同步、德语 Blog 入口和已有英文/韩语 Blog 回归。报告另存 `/tmp/pixelart-de-comparison.SL1sn1/title-report/`，不以此前 19 项结果替代本次检查。生成 sitemap 再次恢复修改前字节。仍仅本地，未提交、发布或请求收录；刷新现有 4198 预览即可查看。

### 德语比较页选型摘要前移与分享图

授权：用户在 SEO 单页审评后回复“执行”。本轮只落实此前建议的选型摘要前移和德语分享图，不修改多语言关联策略，不提交、推送、部署或请求 Google 收录。继续使用 page-seo-workflow 与 gefei-seo-knowledge-base 的证据和单页范围要求，不套固定字数或关键词密度指标。

内容与布局：四款工具的用途、运行环境、导出格式与限制改为对照表，放在文章介绍之后、目录和方法说明之前，移除正文原有重复选型列表。桌面五列，手机按工具逐项显示同一张语义表格，不复制两份内容；德语长词所在的限制列加宽。当前运行时摘要标题约在桌面 924px、手机 915px 文档位置，比审评时约 1834px/2620px 提前。明确这是功能对照，不是四款工具的同图质量实测；GIMP 导出说明补上[官方文档](https://docs.gimp.org/3.0/de/gimp-images-out.html)，区分 XCF 项目保存与 PNG/JPEG 导出。

分享图：复用现有 Sharp 构建脚本，新增只由该文章启用的 socialPreview 配置和 `public/blog-og/de/best-pixel-art-converters-compared-2025.png`，尺寸 1200x630。图中为德语标题、四工具名称与真实向日葵原图/本站 PNG 结果，未修改原始案例文件，没有虚构其他工具的结果。React、初始 HTML 的 OG/Twitter 图片与德语图片说明、BlogPosting image 同步使用新图，其他文章保持原有默认图片规则。完整 title 仍为 58 字符，H1、description、canonical、hreflang 和发布日期不变；德语另外两篇文章数据与 HEAD 一致。

最终版本验收：Node 20.19.0 完整 build（含 ownership、SEO、dist、重定向检查）、受影响文件 ESLint、typecheck 和 diff-check 通过。Chromium 定向 19 项全部通过，无自动重试，覆盖桌面 1440x900/手机 390x844、无 JavaScript 初始页面与运行时、表格行列与前置顺序、元信息与图片、FAQ/JSON-LD、已有英文/韩语 Blog、西语首页和语言切换，以及 Photo 桌面手机实际 PNG 导出。分享图 HTTP 200、1200x630 已确认，结果区域与真实 80x63 PNG 最近邻放大逐像素一致；Photo 实际下载仍与原案例一致。已查看最终桌面、手机比较表与分享图，无横向溢出或文字重叠。

证据：最终构建日志 `/tmp/pixelart-de-comparison.SL1sn1/comparison-build-final.log`，浏览器报告 `comparison-final-report/`，截图 `selection-final-1440.png`、`selection-final-390.png` 均在同一临时目录。构建刷新生成的两个 public sitemap 及无关 pSEO OG 已恢复原状态，未混入本轮改动。预览继续为 `http://localhost:4198/de/blog/best-pixel-art-converters-compared-2025/`。仅本地完成；Firefox/WebKit、实体手机、正式发布、Google 抓取/收录与搜索效果未验证，多语言关联问题仍未处理。

### 德语比较文章正式发布

新授权：用户明确要求“上线部署”，授权提交、推送并部署已经完成本地验收的德语比较文章。只发布 `/de/blog/best-pixel-art-converters-compared-2025/` 的内容、58 字符标题、真实案例、前置比较表和德语分享图，以及必要的可选模板支持与测试。不修改其他语言内容、hreflang 策略、广告、索引设置，不提交 GSC。

发布隔离：开始时 main、HEAD 与实时远程 main 均为 `4badfb398e430333a908889d1a3ba61ca503c4a5`。从 HEAD 导出干净副本 `/tmp/pixelart-de-release-G9NrVA`，只加入六个相关代码/测试文件和一张德语分享图；文档只暂存本篇文章及本次发布段落，保留 AGENTS.md、原有历史整理和其他发布回执的未提交修改。未混入构建生成的 sitemap 或无关 OG 图片，未新增依赖、云端配置或站点。

发布前验证：Node 20.19.0 完整 build（含 ownership、SEO、dist、重定向检查）、完整 lint 和 typecheck 通过；生产式 Cookie 模式的完整 Chromium 84 项全部通过，无自动重试，覆盖 Blog 初始 HTML/运行时、德语桌面/手机、分享图真实像素、现有 converter 与 18 个 Sprite 语言入口及真实导出等回归。构建日志 `build.log`、测试日志 `tests.log`、浏览器报告 `release-report/` 位于该发布副本。沿用现有 Git 集成部署；提交、部署回执与正式页面结果待后续补记，不将本地测试当作生产验收。

## 2026-10-08 首页曝光诊断与上传限制说明（仅本地）

授权：用户要求依据 SEO Skills 调查曝光损失，再明确回复“执行”。本轮只修正英文首页 `/` 的尺寸承诺，不改关键词定位、其他页面、其他语言、图片处理器、广告或索引设置，不提交、推送或部署。开始时 main、HEAD `da4aae3bb7293f7a8e7f2fcfde18914979927c36`；AGENTS.md 与本文件已有未提交改动，全部保留。

### 诊断证据与边界

通过 GSC 只读 API 查询；凭据内容没有写入代码或记录。最新 final 日期为 2026-10-04，比较完整的两个 28 天窗口 `2026-08-10..09-06` 与 `2026-09-07..10-04`，没有用 10 月 5 日之后的不完整数据判断下降。

| 指标 | 前一窗口 | 当前窗口 |
|---|---:|---:|
| 全站点击 | 12147 | 12157 |
| 全站曝光 | 268672 | 269116 |
| 英文首页点击 | 3540 | 2953 |
| 英文首页曝光 | 111658 | 95287 |
| 首页平均排名 | 7.52 | 7.10 |
| 首页 pixel art maker 曝光 | 4996 | 2734 |
| 首页 pixel art maker 平均排名 | 10.19 | 11.01 |

全站没有同步下降；英文首页曝光下降约 14.7%，Maker 查询曝光下降约 45.3%。尺寸页与 Sprite 没有明显承接该 Maker 查询，不能把新增页面定为抢词原因。当前首页、Photo、Sprite、16x16、32x32 的 URL Inspection 均通过，已收录、允许索引、抓取成功且 canonical 一致；当前正常不证明过去从未出现故障，也没有核查人工措施或安全问题。

Google Trends 浏览器实读：Worldwide、Web Search、三个 Search term、`2026-07-01..10-04`，实际图表为日数据。按上述两个 28 天窗口计算相对热度均值：pixel art maker `46.25 -> 35.68`，image to pixel art `16.68 -> 14.18`，pixel converter `61.57 -> 54.04`。这些是归一化抽样指数，不是绝对搜索量，不能与 GSC 降幅相减来分配原因。Maker 在本站 8 月 18 日附近的曝光下降没有对应的全球热度骤降，需求走弱不是唯一已证实的解释；算法日期和 Git 修改日期的重合也不构成因果证明。

初次核对的限制：隔离浏览器中的 Google 搜索结果被验证码阻断，当时没有完成当前结果页的意图核对；后续 Edge 核对见下节。印度 Trends 报错，未当作零。GSC 页面/查询细分数据与页面汇总不完全相等，没有强行凑出全部损失归因。[Google Trends 数据说明](https://support.google.com/trends/answer/4365533?hl=en)、[GSC API 明细数据限制](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data)。因此保留首页 title、description、H1，不据此改成宽泛 Maker 定位。

### 后续 Maker 细分与真实搜索结果核对

沿用上述完整日期窗口，以英文首页 URL 和准确查询 `pixel art maker` 同时过滤 GSC。设备明细曝光合计与该查询汇总一致：桌面 `3272 -> 2110`，手机 `1510 -> 568`，平板 `214 -> 56`。手机曝光降幅约 62.4%，但 CTR 从 2.32% 升至 3.17%；不能把手机损失统一归因于点击吸引力。国家明细中德国、泰国、芬兰等下降，巴西 `99 -> 277` 增长，并非只有美国下降。国家/设备构成变化也会影响汇总平均排名，不能把平均排名变化理解为每个地区都同幅下降。

用户打开并明确指定 Edge 后，通过其 Microsoft Edge 的新标签页完成公开 Google 搜索，没有修改 GSC、浏览器设置或其他已有标签页。查询使用 `hl=en&gl=us&pws=0`，页面显示 Results are not personalized；这是当下桌面、美国参数的单次样本，不是受控美国手机排名，也不是历史结果页。未把扩展注入的流量/难度、图片包、站内子链接或仅账号可见的 Search performance 小组件计入自然结果。

| 查询 | 当前样本的前四个自然结果 |
|---|---|
| [pixel art maker](https://www.google.com/search?q=pixel+art+maker&hl=en&gl=us&pws=0) | Pixilart、Pixel Art Maker、Piskel、Google Play Pixel Art Maker 应用 |
| [pixel art maker from image](https://www.google.com/search?q=pixel+art+maker+from+image&hl=en&gl=us&pws=0) | pixelartvillage.com、MakeBead converter、Pixel It、本站 pixelartvillage.org 首页 |

每个查询实际观察到 8 个自然结果，未凑成前十；宽泛 Maker 样本中未看到本站自然结果。`.com` 是竞品，不是本站。通过 [Pixilart](https://www.pixilart.com/draw)、[Piskel](https://www.piskelapp.com/)、[MakeBead converter](https://makebead.com/pixel-art-converter/) 和 [Pixel It](https://giventofly.github.io/pixelit/) 的实际页面核对，宽泛 Maker 前排偏绘制/编辑，from image 前排偏图片转换。本站 from image 查询 GSC 点击 `38 -> 49`、曝光 `930 -> 1171`，与图片转换定位仍有匹配的判断一致。

结论与边界：现有证据不支持为了宽泛 Maker 曝光而回滚首页标题、堆词、另造重复 Maker 页或新增画板。需求走弱、部分排名变化和搜索意图匹配是需要分别考虑的因素；没有 8 月 18 日前后的历史搜索结果，不能证明当时 Google 改变了意图、某个竞品导致下降，或把本次第 4 位样本当作所有用户的固定排名。此次续查只补记录，没有进一步修改页面，也没有提交或发布。

### 实际修改

源码确认首页上传上限为 `10 * 1024 * 1024` 字节，超过 2200px 长边的图片会在转换前缩小。英文首页功能区原来的 No Dimension Limits 改为 Image Upload Limits，明确说明 10 MiB 上限和 2200px 长边处理限制；对应图标提示同步。没有修改这些限制本身，也不将本项准确性修正说成曝光下降的修复。

内容源为 `public/locales/en/translation.json` 新增的 `home.imageLimits`，现有脚本同步 `src/locales/en.json`。HomeBelowFold 根据现有 locale context 只向英文首页传入这一项，WplaceFeaturesSection 复用可选内容覆盖方式；保留旧翻译键，避免非英文页面的英文回退内容跟随变化。其他语言的历史尺寸承诺未在本轮修正。title、description、H1、canonical、OG/Twitter、FAQ、既有结构化数据和其他功能区保持不变。

### 本地验证

项目开始时没有 node_modules，首次构建因 vite 缺失失败；使用 Node 20.19.0 按现有 package-lock 执行 npm ci，未新增或升级依赖、未改变锁文件。最终完整 build（含预渲染、ownership、SEO、dist 和重定向检查）、受影响文件 ESLint、typecheck、差异空白检查通过。保留浏览器数据过期及传递依赖弃用提示，未借此更新依赖。构建生成的两份 public sitemap 已恢复为构建前原始字节，不混入日期刷新。

最终 Chromium 定向测试 4 项通过，无自动重试：首页 HTTP 200/初始 HTML/单 H1/SEO 标签/既有三种 JSON-LD/可见 FAQ；西语、德语和 Photo 初始 HTML 不含新限制说明，西语/德语运行时及返回英语的隔离检查；1440x900 与 390x844 展示、图标提示、上传入口和无横向溢出；10 MiB+1 字节拒绝、10 MiB 接受并恢复上传、3000x1500 合成测试图缩至 2200x1100、Pixel Size 1→2→1 等待实际结果更新、真实下载 PNG 尺寸核对。测试图只用于边界验收，不作为公开案例。

测试过程：首次后台服务退出导致连接拒绝，确认 HTTP 200 后改用持久预览进程；初版误认为首页已有 FAQ/HowTo JSON-LD，并误认为默认 Pixel Size 不为 1，断言已按当前构建逻辑与编辑器源码修正。失败证据保留，未修改业务逻辑或放宽有效限制断言。桌面和手机截图已查看。证据目录 `/tmp/pixelart-home-limits-VRUP8d/`，最终结果位于 `results/`。本地预览 `http://localhost:4196/`；未验证 Firefox/WebKit、实体手机、生产发布、Google 抓取新版或曝光恢复。

### 首页限制说明发布

新授权：用户在下一步说明后明确回复“执行”，授权提交、推送和正式部署本轮英文首页限制说明，并做上线验收。此前“仅本地”是初始执行状态，不再代表本次发布授权。范围仍仅英文首页文案、语言隔离、对应测试和本轮记录；不改标题、其他页面、广告、索引策略或处理限制。

发布隔离：开始时 main、HEAD 和实时远程 main 均为 `da4aae3bb7293f7a8e7f2fcfde18914979927c36`。从 HEAD 导出干净发布副本 `/tmp/pixelart-home-release-nGvvxv`，只加入本轮五个代码/翻译/测试文件；不包含 AGENTS.md 或本文件原有历史整理改动。Node 20.19.0 完整构建（含 SEO、ownership、dist、重定向）、lint 和 typecheck 已通过。发布式 Cookie 模式下完整 Chromium 80 项回归全部通过，无自动重试；覆盖本轮限制说明、边界上传、其他语言隔离、Photo/Sprite 真实导出及其他现有工作流。暂存五个代码/翻译/测试文件与干净构建输入逐字节一致，未混入生成 sitemap。沿用现有 Git 集成部署；提交和生产状态后续补记。

## 2026-09-14 项目文件整理与 Git 归档

授权：用户要求整理项目文件，将应保留的内容提交上传，删除无用文件。本轮开始时 main 与实时 origin/main 均为 `ad2b50c`，没有未上传提交。保留并归档已有项目规则、竞品优先级记录、历史迭代及发布回执、HowItWorksSection 的可选 compactLayout 参数；该参数默认 false，当前调用没有开启，不改变现有页面布局。仅清理 AGENTS.md 的行尾空白和多余末尾空行，不重写规则。

Git 清理：35 个已经被现有 .gitignore 排除、却仍在 Git 跟踪中的本地文件退出跟踪，包括 Claude 本地配置、33 张 CodeBuddy 缓存图和一份 Superdesign 本地设计稿；电脑上的原文件全部保留，不改变本地权限或 hook。正式 OG 图、调色板数据、favicon 资源和历史文档保留，没有一律删除被忽略但仍受跟踪的资源，也没有改写 Git 历史。

实际删除：当前源码、测试和脚本均无引用，且历史记录确认已由 mana 案例替代的 `public/sprite-demo-pixel6.png`；另删除约 16MB 的旧 `.lighthouseci/` 自动报告。保留现有失败测试证据、人工截图、依赖和其他不明用途文件。两份 sitemap 按现有脚本重新生成，确认相对 HEAD 只有日期变化，正式 sitemap 仍为 205 个 URL；不修改生成策略或 URL 集合。

本地验证：Node 20.19.0 完整 build（含 SEO、dist 和重定向校验）、lint、typecheck、sitemap:verify 与差异空白检查通过。浏览器使用独立 4193 端口加载本轮真实 dist，不复用 4173 端口的旧发布副本。首次 Chromium 全套为 74 通过、1 跳过、1 失败：使用生产构建却未设置现有 EXPECT_CONSENT_BANNER 开关，Cookie 弹层挡住西班牙语页脚链接；保留失败证据，按生产弹层模式重新验证，不修改测试断言或业务代码。构建保留浏览器兼容性数据过期提示，未更新依赖。

最终浏览器结果：同一生产 dist 设置现有 `EXPECT_CONSENT_BANNER=1` 后，完整 Chromium 76 项全部通过，无自动重试；包含 Cookie 弹层、西班牙语导航、Photo/Sprite 桌面手机真实导出、调色板库导入导出和其他 converter 回归。未验证 Firefox/WebKit，临时端口随测试结束关闭。

上传边界：main 推送会触发现有自动部署，不修改部署配置；Git 上传、本地测试和生产验收分开记录，本轮不执行 GSC 提交或宣称搜索效果。

## 2026-09-14 Photo 页发布

新授权：用户明确要求“现在部署上线”，授权提交、推送及发布前述 Photo 页内容、真实案例和 on-page 小修。发布只包含本页源码、预渲染回退、三张相关图片、测试及本批记录；不包含已有 AGENTS、Claude 配置、竞品记录、HowItWorksSection、工作区 sitemap、旧 Sprite 示例及其他历史未提交文档修改。发布前 HEAD 与实时 origin/main 同为 `71b53602f9ea5f5885928343c773f368ab64a956`，沿用现有 Git 集成部署。干净暂存副本 `/tmp/pixelart-photo-release.uT9U2s` 用于最终验证；发布结果另行补记。

### Photo 发布回执

[Lighthouse CI 34924845946](https://github.com/elng12/pixelartvillage.org/actions/runs/34924845946) 最终成功。GitHub Actions 保留 Node 20 action runtime 弃用提示，本轮未升级工作流或依赖。

代码提交 `ad2b50c` 已推送 main。干净发布副本 Node 20 构建、lint、typecheck 通过；完整 Chromium 回归 75 项通过、1 项跳过，无重试。暂存的 8 个文件与干净构建输入逐字节一致，未混入无关工作区修改。

[CI 34924845971](https://github.com/elng12/pixelartvillage.org/actions/runs/34924845971) 与 [GitHub Pages 34924845968](https://github.com/elng12/pixelartvillage.org/actions/runs/34924845968) 成功。Cloudflare Pages 项目 `pixelartvillage1` 部署 `7392776a-3d8b-4fcc-a3ce-f55f7e49a9f1` 成功，正式域名已显示新版首段、真实照片案例及缩短的相关工具描述。

生产验证：Photo 初始 HTML、描述/OG/Twitter、单 H1、FAQ/schema、四词及五词主词独立第一、桌面 1440x900 和手机 390x844 真实上传/调参/下载共 3 项通过，无重试。两种尺寸下载的 80x63 PNG 与线上案例逐像素一致，无横向溢出；证据在 `/tmp/pixelart-photo-release.uT9U2s/production-test-results/`。Codex 隔离浏览器确认正式页面已更新。首页、Photo 和 PNG 页 HTTP 200/canonical 正常，robots 与 sitemap 正常，205 个 sitemap URL 抽查前 50 个全部 200，保留“未全量抽查”的警告。未修改广告设置，没有验证 Google 收录或排名提升；已有快速调参后立即下载旧结果的风险仍在范围外。此回执先保留本地，避免纯记录变更再次触发生产部署。

## 2026-09-14 Photo 页 on-page 小修（仅本地）

用户审查后授权“执行建议”。只调整英文 Photo 页首段、meta description 和本页相关工具短介绍；title、H1、URL、canonical、案例图片、工具参数及其他页面内容不变。首段自然加入完整主词，描述改为直接表达照片转换和 PNG 下载；相关工具短介绍来自 Photo 自己的 `relatedDescriptions`，React 与预渲染回退共用，不改 PNG/JPG 原页面正文。已有构建脚本同时更新 `public/pseo-og/photo-to-pixel-art.png` 中的描述文字，属于本页相关产物。

最终主内容词频复核（不含导航、页脚和元标签）：`photo to pixel art` 4 次，在四词短语中独立第一；`photo to pixel art converter` 3 次，在五词短语中独立第一。新增测试固定统计范围并检查各自严格高于其他同长度短语。这是本页词频验收，不代表 Google 搜索排名第一。

Node 20 完整构建及自带 SEO/dist/ownership/重定向检查、受影响文件 ESLint、typecheck 通过；最终 Chromium 6 项通过，无重试，包括新描述及 OG/Twitter 同步、词频断言、桌面/手机真实上传下载逐像素验证、首页/Sprite/PNG 回归。隔离浏览器刷新确认新文案。证据：`/tmp/pixel-photo-build.DhEAGk/onpage-acceptance/`。保留所有已有修改，构建后恢复原本 sitemap 字节；未提交、推送、部署或验证搜索效果，上一节记录的处理器风险仍未修复。

## 2026-09-14 Photo 页真实案例与文案去重（仅本地）

授权：用户在 Photo 页优化建议后回复“执行”。只修改 `/converter/photo-to-pixel-art/` 的英文内容、页面专属展示及对应预渲染回退；不提交、推送或部署，不改首页、其他 converter、翻译文件、Blog、广告或索引设置。保留开始时全部已有未提交修改。JSON 对比确认只改变 Photo 条目，title、description、H1 和 canonical 不变。

实现：合并原先桌面/手机各一份的介绍和要点 DOM，压缩介绍，将上传入口保留在首屏。原来的 CSS 色块只是装饰示意，本轮改为一张真实照片及本站工具实际下载的结果；不是 AI 图片，也不是手工重画。重复 DOM 不等于用户同时看到两份，也没有证据证明它导致此前流量下降。

素材：[Sunflower Public Domain](https://commons.wikimedia.org/wiki/File:Sunflower_Public_Domain.jpg)，Don McCulley，CC0；来源页已实时核验。使用 Wikimedia 的 960x762 JPEG 缩略图，保存为 `public/photo-sunflower-source.jpg`，下载后没有裁剪或修图。设置 Pixel Size 12、Palette None、dithering 关闭、Brightness/Contrast/Saturation 均为 0、grid 关闭、PNG、Pixel size 导出，透明背景选项保持默认开启；照片本身不透明。最终 `public/photo-sunflower-pixel12.png` 是本地构建页 Chromium 下载的 80x63 PNG，未二次加工。页面提供来源、许可、尺寸、参数与三条短建议，不宣称固定调色板适合所有肤色或所有照片。

验证：Node 20.19.0 最终完整构建通过，包含 ownership、SEO、dist 和重定向检查；受影响 JS/JSX ESLint、typecheck 和 diff-check 通过。Chromium 定向 6 项最终全部通过、无重试：Photo 初始 HTML/单份要点/FAQ 与 JSON-LD 一致、1440x900 与 390x844 上传入口、非法文件后重新上传、各控件、实际 80x63 下载与案例逐像素相同、无横向溢出，以及 Sprite/PNG/首页相关回归。下载证据在 `/tmp/pixel-photo-build.DhEAGk/acceptance/`。Codex 隔离浏览器和测试截图检查了页面与图片展示。构建生成的 sitemap 已恢复为构建前原始字节，未覆盖原本的本地修改。

测试过程保留的限制：初版测试错误假定导出按钮带 aria-pressed、预览图尺寸等于小尺寸导出，已按实际实现修正；调参后仅等待 aria-busy=false 也可能仍读到旧结果，最终测试等待每次预览图真正更新再下载。开发服务器首次生成的案例与构建页导出像素不一致，原因未确定，最终案例取自构建页真实下载，并在桌面和手机分别复现；没有放宽像素比较，也没有借此修改共享处理器。快速调参后立即下载的旧结果风险未修复，不将本轮内容修改说成处理器修复。未验证 Firefox/WebKit、实体手机、生产发布或搜索排名改善。预览：`http://localhost:4173/converter/photo-to-pixel-art/`。

## 当前状态

| 字段 | 内容 |
|---|---|
| 项目类型 | Vite + React 像素图工具站 |
| 当前阶段 | 工具主站已运行，SEO / pSEO 页面继续分批优化 |
| 当前最重要目标 | 让首页继续做主工具入口，先把首页大曝光变成更多点击 |
| 当前最大问题 | 首页 `maker` / `generator` 曝光大但 CTR 偏低；photo 页没有抢回核心词 |
| 当前 SEO 主文档 | `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` |
| 下次复查日期 | `2026-08-10` 用 `2026-07-31` 至 `2026-08-06` 的 final 数据复查首页和 `/es/` |

## 当前 SEO 判断

不要说“网站没流量”。更准确的说法是：

> 曝光已经起来了，但很多曝光没有变成点击。

首页当前很强，负责总入口是正常的。
问题是子页面还不够像专项答案页。

当前分工方向：

| 页面 | 应该承接 |
|---|---|
| `/` | `image to pixel art`、`pixel art converter`、`pixel art maker`、`pixel art generator` |
| `/converter/photo-to-pixel-art/` | 辅助承接 photo / picture 细分和 how-to 长尾，不再硬抢首页大词 |
| `/converter/png-to-pixel-art/` | `png to pixel art` |
| `/converter/gif-to-pixel-art/` | `gif to pixel art` |
| `/converter/8-bit-art-generator/` | `8 bit art generator` |

## 批次 A 边界

批次 A 已执行并完成 28 天复查。当前结论：

- photo 页没有伤害首页。
- photo 页已收录，技术上没有硬故障。
- photo 页没有成功接住 `photo to pixel art` / `picture to pixel art`。
- 后续不继续硬改 photo 页抢首页大词。

历史边界：

- 只动 `/converter/photo-to-pixel-art/`。
- 优先改 `src/content/pseo-pages.en.json`。
- 不顺手改首页、其他 converter、多语言、Blog、`8-bit` 页面。
- JSON 不够表达时，再考虑组件或预渲染脚本。

## 常用验证命令

| 命令 | 用途 |
|---|---|
| `npm run build` | 构建 + 预渲染 |
| `npm run verify:dist` | 验证生产产物 |
| `npm run lint` | lint |
| `npm run typecheck` | 类型检查 |
| `npm run seo:check` | SEO 检查 |
| `npm run sitemap:verify` | sitemap 检查 |
| `npm run seo:density` | 关键词密度 |
| `npm run test` | Playwright |

## 页面验收清单

每次页面改完，至少看：

1. 本地页面 HTTP 200。
2. 构建产物里对应 HTML 存在。
3. title / canonical 正确。
4. OG / Twitter 标签正确。
5. FAQ / HowTo JSON-LD 正常。
6. 页面真实控件可见。
7. sitemap 没漏目标页。

## 优化卡模板

每次开始前先填这张卡。

| 字段 | 内容 |
|---|---|
| 日期 |  |
| 问题 |  |
| GSC 证据 |  |
| 目标页面 |  |
| 当前主要承接页面 |  |
| 本轮边界 |  |
| 本轮不做 |  |
| 修改计划 |  |
| 验证方式 |  |
| 复查日期 |  |

## 记录模板

```md
## YYYY-MM-DD 优化记录

问题：
GSC 证据：
目标页面：
本轮边界：
修改：
验证：
未做：
复查日期：
下一步：
```

## 长期规则

1. 不从“感觉 SEO 不好”直接全站改。
2. 不拿当天 GSC 半成品数据下结论。
3. 不把讨论文档当成已部署结果。
4. 不削弱首页来救子页面。
5. 每个专项词要有明确 URL 归属。
6. 每轮都要写清楚“不动哪些页面”。
7. 页面验收必须打开真实页面或构建产物。

## 2026-06-09 初始化记录

问题：项目缺少统一迭代记录。
证据：创建 `docs/ITERATION.md`。
本轮边界：只补项目维护文档，不改业务代码。
修改：新增长期迭代记录模板。
验证：文件已创建。
未做：未修改页面、功能、SEO 内容、部署配置。
复查日期：下次项目改动前。
下一步：每次优化前先填“优化卡模板”。

## 2026-06-09 文档精修记录

问题：`AGENTS.md` 和 `docs/ITERATION.md` 需要写入 Pixelart 的真实 SEO 批次边界。
证据：`docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 已明确首页强、子页面弱、批次 A 目标为 `photo-to-pixel-art`。
本轮边界：只精修 `AGENTS.md` 和 `docs/ITERATION.md`，不改业务代码，不提交 git。
修改：补入 GSC 完整日期规则、Query/URL 归属、批次 A 边界、页面验收清单、常用命令。
验证：待复查文件内容和 git 状态。
未做：未修改首页、converter 内容、Blog、多语言、构建脚本、部署配置。
复查日期：下一轮 Pixelart SEO 批次开始前。
下一步：后续做 SEO 时，先按本文件确认本轮页面边界。

## 2026-06-22 批次 A 21 号后只读诊断记录

问题：用户确认已经过了 21 号，要求执行下一步任务。
GSC 证据：沿用 `docs/GSC_BATCH_A_MONITORING_2026-06-12.md` 第 7 节 14 天 final 数据；photo 页仍未明显接住 `photo to pixel art` / `picture to pixel art`。
目标页面：`/converter/photo-to-pixel-art/`。
本轮边界：只做线上和公开搜索只读诊断，不改代码，不提交，不部署。
修改：只补充本次诊断记录到 GSC 监控文档和迭代记录。
验证：线上页面 200；title、canonical、OG、Twitter、HowTo、SoftwareApplication、FAQPage 正常；sitemap 和首页都有 photo 页入口；上传图片后 Pixel Size、Brightness、Contrast、Saturation、Palette 控件可见。
未做：未改首页、其他 converter、多语言、Blog、schema、sitemap、构建脚本。
复查日期：`2026-07-05`。
下一步：等 28 天 GSC final 窗口；提前只允许查 GSC URL Inspection 是否有硬故障。

## 2026-07-05 批次 A 28 天复查记录

问题：批次 A 到了 28 天复查点，需要判断是否继续下一批 SEO 任务。
GSC 证据：GSC final 数据到 `2026-07-03`；正式统计窗口为 `2026-06-07` 到 `2026-07-03`，严格 28 天 final 还差 1 天。全站点击 `10,978`，曝光 `206,932`，CTR `5.31%`，平均排名 `7.50`。photo 页点击 `23`，曝光 `923`，CTR `2.49%`，平均排名 `48.01`。GSC URL Inspection 显示 photo 页已收录，Google 最近抓取时间是 `2026-06-29T06:09:34Z`，canonical 正确。
目标页面：`/converter/photo-to-pixel-art/`。
本轮边界：只做 GSC 复查、线上页面只读检查和文档记录，不改代码，不提交，不部署。
修改：更新 `docs/GSC_BATCH_A_MONITORING_2026-06-12.md` 和 `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 的 7 月 5 日复查结论。
验证：线上首页和 photo 页均为 200；photo 页 title、canonical、H1、meta description、FAQ、HowTo、上传区和 JSON-LD 正常；首页保留 photo 页入口；URL Inspection 为 `Submitted and indexed`。
未做：未改首页、其他 converter、多语言、Blog、schema、sitemap、构建脚本。
复查日期：下一轮 SEO 方案确定前。
下一步：先做只读诊断和下一轮方案判断；不要直接开 8-bit、image-to-pixel、多语言或博客的新代码批次。

## 2026-07-05 批次 A follow-up 只读诊断记录

问题：需要判断 photo 页是否继续抢 `photo to pixel art` / `picture to pixel art`，还是调整定位。
GSC 证据：`photo to pixel art`、`picture to pixel art`、`convert photo to pixel art`、`convert picture to pixel art`、`photo to pixel art converter` 等词仍主要由首页承接；photo 页在这些词上曝光少、0 点击、排名大多在 60 到 80 左右。
目标页面：`/converter/photo-to-pixel-art/`。
本轮边界：只做 GSC 长尾词诊断、SERP 抽样观察和文档记录，不改代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_A_MONITORING_2026-06-12.md` 增加第 10 节；在 `docs/GSC_SEO_DISCUSSION_LOG_2026-06-06.md` 增加第 26 节。
验证：线上 HTML 已确认新版 photo 页内容存在；公开搜索样本显示该类词主要是工具意图，综合 converter 页仍有竞争力。
未做：未改首页、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：确认 photo 页后续定位后再定。
下一步：建议承认首页继续承接大词；photo 页作为辅助专项页，后续只讨论是否转向更窄的 how-to / convert / photo-to-pixel 长尾方向。

## 2026-07-06 批次 B 首页核心词 CTR 草案记录

问题：批次 A 复查后，需要决定下一轮 SEO 是否继续做 photo 页，还是转向首页。
GSC 证据：`2026-06-07` 到 `2026-07-03` final 窗口里，`pixel art maker` 为 146 点击 / 8,534 曝光 / CTR 1.71% / 平均排名 9.08；`pixel art generator` 为 157 点击 / 8,082 曝光 / CTR 1.94% / 平均排名 8.07。首页保护词 `image to pixel art` 和 `pixel art converter` 表现稳定。
目标页面：首页 `/`。
本轮边界：只生成批次 B 草案，不改代码，不提交，不部署。
修改：新增 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md`；同步更新 GSC 讨论记录和本迭代记录。
验证：文档草案已列出目标词、保护词、改动边界、验收方式和不做事项。
未做：未改首页代码、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：批次 B 草案通过并上线后再定。
下一步：先审评批次 B 草案；如果通过，再拆首页代码任务，不直接大改首页。

## 2026-07-06 批次 B 草案审评和首页任务拆解记录

问题：用户同意进入下一步，需要审评批次 B 首页草案，并生成首页代码任务拆解。
GSC 证据：沿用 `2026-06-07` 到 `2026-07-03` final 窗口；`pixel art maker` 和 `pixel art generator` 曝光大但 CTR 偏低，首页保护词稳定。
目标页面：首页 `/`。
本轮边界：只做文档审评和任务拆解，不改首页代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 增加草案审评结论和首页代码任务拆解；在 GSC 讨论记录增加第 28 节；同步本迭代记录。
验证：已确认首页文案主要来自 `src/locales/en.json` 和 `public/locales/en/translation.json`；`src/App.jsx`、`ToolSection.jsx`、`HomeBelowFold.jsx` 默认不需要改。
未做：未改首页代码、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：批次 B 任务拆解通过并上线后再定。
下一步：先审评首页任务拆解；通过后才进入首页文案代码修改。

## 2026-07-06 批次 B agents 审评记录

问题：用户要求使用相关 agents 执行这次任务，需要并行审评批次 B 是否可以进入首页文案执行。
GSC 证据：沿用 `2026-06-07` 到 `2026-07-03` final 窗口；`pixel art maker`、`pixel art generator` 是机会词，`image to pixel art`、`pixel art converter` 是保护词。
目标页面：首页 `/`。
本轮边界：只让 agents 做只读审评，并把结论写回文档；不改首页代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 和 GSC 讨论记录里补充 agents 审评结论、最终候选英文文案、执行文件顺序和构建产物验收项。
验证：3 个 agents 分别完成 SEO/GSC 审评、前端代码边界审评、首页文案建议；共同结论是有条件通过，可以进入小范围首页英文文案执行。
未做：未改首页代码、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：批次 B 代码执行并上线后再定。
下一步：如果用户确认开始改代码，只改 `public/locales/en/translation.json` 并同步 `src/locales/en.json`，默认不改首页组件。

## 2026-07-06 批次 B 首页标题小改记录

问题：用户确认首页 SEO title 可以从 `Image to Pixel Art Converter | Pixel Art Village` 改为 `Image to Pixel Art Converter & Maker | Pixel Art Village`。
GSC 证据：沿用批次 B 草案；`pixel art maker` 曝光大但 CTR 偏低，首页保护词稳定。
目标页面：首页 `/`。
本轮边界：只改首页英文 SEO title，不改描述、不改 H1、不改首页布局、不改其他页面。
修改：更新 `public/locales/en/translation.json` 和 `src/locales/en.json` 的 `home.seoTitle`。
验证：`npm run build` 通过；`npm run sitemap:verify` 通过；`npm run lint` 通过；构建产物 `dist/index.html` 的 title、OG title、Twitter title 已同步为新标题；本地 preview 首页 HTTP 200，浏览器 title 为新标题，H1 仍是 `Image to Pixel Art Converter`。
未做：未改 meta description、heroSubtitle、FAQ、photo 页、8-bit、image-to-pixel、多语言、Blog、schema、sitemap、构建脚本。
复查日期：上线后先看 2 到 3 天硬错误，正式效果看完整窗口。
下一步：跑构建检查，确认 `dist/index.html` 的 title / OG / Twitter title 都同步为新标题。

## 2026-07-06 批次 B 标题小改复查计划记录

问题：用户确认先按短周期复查，不等到很久以后才看。
GSC 证据：本次只改首页 SEO title；目标是帮 `pixel art maker` 增加点击理由，同时保护 `image to pixel art` 和 `pixel art converter`。
目标页面：首页 `/`。
本轮边界：只补复查计划，不改代码，不提交，不部署。
修改：补充批次 B 标题小改后的复查节奏。
验证：计划已写入 `docs/ITERATION.md` 和 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md`。
未做：未改 meta description、H1、首页文案、photo 页、8-bit、多语言、Blog、schema、sitemap、构建脚本。
复查日期：`2026-07-08` 或 `2026-07-09`。
下一步：到期只做硬检查，重点看线上 title、Google 抓取、页面是否正常；不要马上继续第二刀。

## 2026-07-08 批次 B 第一次硬检查记录

问题：标题小改上线后到了 2 天硬检查点，需要确认有没有抓取、收录、页面或 SEO 标签硬问题。
GSC 证据：GSC URL Inspection 显示首页 `verdict=PASS`、`Submitted and indexed`、`pageFetchState=SUCCESSFUL`、`robotsTxtState=ALLOWED`、`indexingState=INDEXING_ALLOWED`，Google 最近抓取时间为 `2026-07-07T07:20:14Z`，canonical 为 `https://pixelartvillage.org/`。
目标页面：首页 `/`。
本轮边界：只做线上页面、Googlebot、sitemap、robots 和 GSC URL Inspection 硬检查；不判断 SEO 成败，不改代码，不提交，不部署。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 增加第 13 节硬检查结果；同步本迭代记录。
验证：线上首页 `200`，无跳转；title 为 `Image to Pixel Art Converter & Maker | Pixel Art Village`；canonical 正确；H1 仍为 `Image to Pixel Art Converter`；无 noindex；Googlebot 访问首页和 sitemap 均为 `200`；`robots.txt` 和 `sitemap.xml` 均为 `200`。
未做：未改 meta description、H1、heroSubtitle、FAQ、首页布局、photo 页、8-bit、多语言、Blog、schema、sitemap、构建脚本。
复查日期：`2026-07-11` 或 `2026-07-12`。
下一步：做早期信号检查，重点看 `pixel art maker`、`pixel art generator`、`image to pixel art`、`pixel art converter`；现在不继续第二刀。

## 2026-07-11 页脚增加 ObbyList 外链

问题：需要从 Pixel Art Village 给 `https://obbylist.com/` 增加一个可被搜索引擎正常抓取的普通外链。
目标位置：全站页脚底部链接栏。
本轮边界：只增加 ObbyList 链接和对应页面测试，不改首页文案、converter 页面、Blog、sitemap 或其他外链。
修改：增加文字链接 `ObbyList`，新窗口打开；`rel` 只包含安全属性，没有 `nofollow`。
验证：Playwright 的 Chromium 单项测试通过，真实页面能看到该链接，地址正确且没有 `nofollow`。
发布方式：随本次提交推送到 `main`，由 GitHub Pages 工作流自动发布。

## 2026-07-13 西班牙语首页描述去重记录

问题：必应报告多个页面的 meta description 重复；线上复核发现西班牙语首页 `/es/` 使用了与其他多语言首页完全相同的英文描述。
必应证据：`/es/` 最近页面明细中曝光增加 19，点击减少 17，平均排名保持第 4；更像点击率和搜索摘要问题，不是排名崩落。
目标页面：西班牙语首页 `/es/`。
本轮边界：只改西班牙语首页 `home.seoDescription`；不改葡萄牙语、Terms、Blog、英文首页、title、H1 或页面布局。
修改：将 `public/locales/es/translation.json` 中重复的英文描述替换为独立的西班牙语描述，说清免费在线转换、支持的图片格式、像素大小、调色板、预览和浏览器内导出。
验证：`npm run build`、`npm run sitemap:verify`、`npm run lint` 全部通过；本地 preview 的 `/es/` 返回 200，meta description、OG description 和 Twitter description 已同步为新的西班牙语文案，canonical 和 `lang=es` 正确，上传区可见，页面没有水平溢出。
未做：未修改其他多语言首页、其他 meta description、converter 页、Blog、Terms、schema、sitemap 或构建脚本。
复查节奏：上线后先检查抓取和搜索摘要，7 到 14 天后再对比 `/es/` 的曝光、点击、点击率和排名。

## 2026-07-13 批次 B 首页标题回滚记录

问题：批次 B 新标题上线后，首页机会词没有获得有效改善，两个保护词也出现早期下滑。
GSC 证据：最后完整日期为 `2026-07-11`；同星期 4 天对比中，首页点击下降 54.6%，曝光下降 47.2%，平均排名从 7.44 变为 12.11。`pixel art maker` 和 `pixel art generator` 的曝光分别下降 88.1% 和 90.2%；`image to pixel art` 点击下降 58.3%、CTR 从 5.95% 降至 2.97%；`pixel art converter` 曝光下降 58.4%、平均排名从 4.95 变为 8.17。
目标页面：首页 `/`。
本轮边界：只回滚英文首页 `home.seoTitle`；不改 meta description、H1、heroSubtitle、FAQ、首页布局、子页面或多语言页面。
修改：将标题从 `Image to Pixel Art Converter & Maker | Pixel Art Village` 恢复为 `Image to Pixel Art Converter | Pixel Art Village`，同步更新 public 和 src 两份英文文案。
验证：`npm run build`、`npm run verify:dist`、`npm run seo:check`、`npm run sitemap:verify`、`npm run lint` 全部通过；本地 preview 首页返回 200，title、OG title 和 Twitter title 已同步恢复，canonical 和 H1 正确，上传区可见，页面没有水平溢出。
未做：未修改其他首页文案、converter 页、Blog、schema、sitemap 或构建脚本。
复查节奏：上线后先确认 Google 重新抓取；正式数据使用完整窗口，不立刻做第二次首页文案修改。

## 2026-07-23 首页回滚和西班牙语描述复查记录

问题：7 月 13 日的英文首页标题回滚和西班牙语首页描述去重都到了复查点，需要确认 Google 是否重新抓取，并判断是否已经有足够数据下结论。
GSC 证据：本次能读取到的最新 final 数据截止 `2026-07-20`。URL Inspection 显示首页最近抓取时间为 `2026-07-23T02:36:02Z`，`/es/` 最近抓取时间为 `2026-07-21T06:04:28Z`；两页均为 `PASS`、`Submitted and indexed`、允许抓取、抓取成功，Google canonical 与页面 canonical 一致。
目标页面：首页 `/` 和西班牙语首页 `/es/`。
本轮边界：只读检查 GSC、URL Inspection 和线上真实页面；只更新复查文档，不改页面代码，不提交，不部署。
首页数据：标题测试期 `2026-07-06` 至 `2026-07-12` 为 523 点击、15,989 曝光、CTR 3.27%、平均排名 11.6；回滚后 `2026-07-14` 至 `2026-07-20` 为 829 点击、27,146 曝光、CTR 3.05%、平均排名 8.5。相比标题测试期，点击增加 58.5%，曝光增加 69.8%，平均排名改善 3.1 位。
首页判断：回滚后的时间段里，曝光和排名明显恢复，`pixel art maker` 和 `pixel art generator` 也从测试期低点恢复，但首页仍未完全回到 `2026-06-29` 至 `2026-07-05` 的原始基线。URL Inspection 只提供最近一次抓取时间，不能证明恢复全部由标题回滚造成；现有证据支持继续保留回滚后的原标题，不做第二次首页文案修改。
西班牙语数据：`2026-07-06` 至 `2026-07-12` 为 23 点击、412 曝光、CTR 5.58%、平均排名 18.8；`2026-07-14` 至 `2026-07-20` 为 17 点击、399 曝光、CTR 4.26%、平均排名 13.8。当前唯一确认的变更后抓取时间是 `2026-07-21`，而现有 final 数据截止 `2026-07-20`，所以还不能用来判断新描述成功或失败。
线上验证：首页和 `/es/` 均为 HTTP 200、无跳转、canonical 正确、无 noindex、上传控件可见、没有横向溢出；首页 title 已恢复为 `Image to Pixel Art Converter | Pixel Art Village`；`/es/` 的 meta、OG 和 Twitter description 均为新的西班牙语描述。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 补充首页回滚复查结论，并同步本迭代记录和下次复查日期。
未做：未改 title、meta description、H1、heroSubtitle、FAQ、首页布局、converter 页、多语言内容、Blog、schema、sitemap 或构建脚本。
复查日期：`2026-08-02`。
下一步：等 Google 重新抓取后的 7 个完整日期都进入 final 数据，再复查首页恢复程度和 `/es/` 新描述效果；期间不做第二次 SEO 文案修改。

## 2026-08-02 首页回滚和西班牙语描述 7 天复查记录

问题：到了 8 月 2 日计划复查点，需要使用 Google 重新抓取后的完整 7 天数据，判断英文首页是否继续恢复，以及西班牙语独立描述是否有效。
GSC 证据：本次只使用 final 数据，最新完整日期为 `2026-07-30`。首页 `2026-07-24` 至 `2026-07-30` 为 978 点击、32,938 曝光、CTR 2.97%、平均排名 8.13；相比回滚早期点击增加 18.0%、曝光增加 21.3%、排名改善 0.35 位。相比原标题基线，曝光高 10.4%，但点击仍低 11.8%，主要差距是 CTR。
首页重点词：`pixel art maker` 和 `pixel art generator` 已基本恢复；`pixel art converter` 的点击和曝光已恢复；`image to pixel art` 曝光接近基线，但 CTR 为 4.65%、排名 5.04，仍弱于基线的 6.23% 和 4.03。
西班牙语数据：新描述抓取后的 `2026-07-22` 至 `2026-07-28` 为 16 点击、356 曝光、CTR 4.49%、平均排名 13.60；与抓取前过渡期基本持平。样本很小，不能证明明显提升，也没有硬伤证据。
目标页面：首页 `/` 和西班牙语首页 `/es/`。
本轮边界：只读检查 GSC final 数据、URL Inspection 和线上真实页面；只更新复查文档，不改页面代码，不提交，不部署。
验证：首页和 `/es/` 均为 HTTP 200、无跳转；GSC 均为 `PASS`、`Submitted and indexed`、允许抓取、抓取成功，Google canonical 与页面 canonical 一致；两页均无 noindex。
修改：在 `docs/GSC_BATCH_B_HOMEPAGE_CORE_CTR_2026-07-06.md` 增加第 15 节，并更新本迭代记录的下次复查日期。
未做：未改 title、meta description、H1、heroSubtitle、FAQ、首页布局、converter 页、多语言内容、Blog、schema、sitemap 或构建脚本。
复查日期：`2026-08-10`。
下一步：等待 `2026-07-31` 至 `2026-08-06` 的 7 天 final 数据齐全，重点复查 `image to pixel art` 的 CTR 和排名；在此之前不做第二次 SEO 文案修改。

## 2026-08-15 首页核心词分解和摘要正文小改记录

问题：计划观察窗口已经齐全，首页总 CTR 仍未恢复；`image to pixel art` 的搜索结果摘要抽样采用了首屏第二段正文，而不是 meta description，这段正文只在介绍其他页面入口，点击理由偏弱。
GSC 证据：`2026-07-31` 至 `2026-08-06` 首页为 959 点击、32,261 曝光、CTR 2.97%、平均排名 8.19；`image to pixel art` 为 119 点击、2,336 曝光、CTR 5.09%、平均排名 5.12，仍弱于原标题基线的 6.23% 和 4.03。设备分解显示 Desktop CTR 从基线 6.05% 降至 4.45%，Mobile 从 6.54% 变为 6.01%。
目标页面：首页 `/`。
本轮边界：只改英文首页 `home.heroSubtitle2`，不改 title、meta description、H1、FAQ、布局、广告页、其他 converter、多语言页面或 Blog。
修改：把介绍站内页面分工的第二段正文，改为直接说明免费、支持格式、实时预览、像素大小、调色板、抖动和浏览器内导出。
验证：第一次构建因本地依赖未安装而明确失败；执行 `npm ci` 后，使用项目指定的 Node `20.19.0` 重新运行，`npm run build`、`npm run verify:dist`、`npm run seo:check`、`npm run sitemap:verify`、`npm run lint` 全部通过。第一次整套 Playwright 测试因三个测试浏览器未安装而失败；安装项目锁定版本的 Chromium、Firefox 和 WebKit 后，`npm run test` 120 项全部通过。Codex App 内置浏览器确认新正文可见，title、meta description、H1 和 canonical 未变化；非图片文件会显示明确错误，真实 JPG 能打开编辑器并显示 Pixel Size、Palette 和下载按钮；390px 移动端没有横向溢出。
复查节奏：上线并被 Google 重新抓取后，先看硬错误，再用抓取后的完整 7 天 final 数据复查 Desktop CTR 和四个首页重点词。
下一步：本轮不提交、不推送、不部署。发布后先确认 Google 重新抓取，再用抓取后的完整 7 天 final 数据复查。

## 2026-08-24 32x32 固定尺寸工具页实现记录

问题：需要判断并执行 `32x32` 专项页，避免再次上线只有文案和跳转按钮、没有独立产品能力的薄页面。
需求证据：Google Keyword Planner 使用“所有位置、所有语言、Google、过去 12 个月”查询；`image to pixel art 32x32` 和 `32x32 image converter` 均显示月搜 `100-1000`，前者同比 `+900%`、三个月变化 `0%`，精确长尾多为 `10-100`。账号没有活跃广告，因此只能看到区间，不能把 `+900%` 当成稳定增长率。GSC 最近 28 个 final 日期中，`image to pixel art 32x32` 已有 159 曝光、2 点击、平均排名约 9.14，主要由首页承接。
目标页面：`/converter/32x32-pixel-art/`。
本轮边界：只实现英文 32x32 固定输出功能和对应专项页；不改首页、photo 页、其他 converter 内容、多语言内容、Blog 或部署配置。
修改：将 `image to pixel art 32x32` 定为本页唯一核心词，title 为 56 字符，meta description 为 159 字符，H1 和首屏说明自然覆盖核心词；内容源增加机器可读的关键词、意图、归属 URL、辅助词和排除词，构建前新增 55-60 / 150-160 长度及唯一归属校验。新增真实 32x32 处理路径；提供“裁剪填满 / 完整适配”两种方形适配模式；预览按 32x32 网格显示；导出提供 32x32、64x64、128x128，其中放大版本使用最近邻缩放；新增专项内容、HowTo、FAQ、SoftwareApplication、OG 和 sitemap 路由；主转换页增加指向该专项页的上下文内链；新增尺寸和透明留白的浏览器回归测试。
首屏修订：首次真实页面检查发现 SEO 介绍、工具标题和上传区纵向重复，导致核心上传动作落到首屏下半部；第一版左右分栏又让标题与工具形成两个竞争焦点。最终改为单一居中 H1、一句价值说明、下方完整上传区和末尾三项关键信息。在 780 x 764 视口中上传区位于约 258-482px；390 x 844 移动端中位于约 319-543px，关键信息行底部约 657px，桌面和手机首屏都能完整看到主操作且无横向溢出。
验证：Node `20.19.0` 下 `npm run build` 通过，预渲染生成 `dist/converter/32x32-pixel-art/index.html`，title、canonical、OG、Twitter、HowTo、FAQ 和 sitemap 均通过构建检查。Chromium 专项测试验证 32x32 精确导出、完整适配透明留白、64x64 最近邻放大和 390px 无横向溢出；现有 export、pSEO ownership 和 layout 共 6 个 Chromium 测试通过；`npm run lint` 通过。本地真实页面为 HTTP 200，上传区、内容、FAQ 和站内链接可见。
已知测试基线：`npm run test:unit` 中新增的 32x32 纯函数和内容断言通过，但整套命令仍被仓库原有的 BMP 西班牙语显式跳转断言阻断；当前 `_redirects` 与 `HEAD` 都使用两段跳转策略，`npm run build` 的 redirect 校验通过，本轮不扩大范围修改该旧测试。
发布结果：实现提交为 `001f128`，已推送 `main`；GitHub Pages、CI 和 Lighthouse CI 均通过。线上目标页 HTTP 200，title 56 字符、meta description 159 字符、canonical、H1、上传区和主转换页上下文内链均已核对，线上 sitemap 已包含目标 URL。
GSC 结果：URL Inspection API 返回 `URL is unknown to Google`，符合新页面首次上线状态。已于 `2026-08-24T14:12:38Z` 重新提交 `https://pixelartvillage.org/sitemap.xml`，接口返回 pending、0 warnings、0 errors。当前内置浏览器登录的 Google 账号没有该资源权限，无法在 GSC 界面点击“请求编入索引”；没有使用仅适用于 JobPosting / BroadcastEvent 的 Indexing API 冒充普通页面提交。
未做：没有创建 16x16、Minecraft 或 AI 新页面；GSC 界面的单 URL“请求编入索引”仍待有权限账号完成。
复查节奏：发布并被 Google 抓取后，先确认 URL Inspection、canonical 和 sitemap；再用抓取后的完整 7 天和 28 天 final 数据对比该页的曝光、点击、查询归属和首页是否出现自相竞争。
下一步：用有 `pixelartvillage.org` 权限的 Google 账号在 GSC 对线上目标 URL 点击一次“请求编入索引”；随后等待实际抓取，在此之前不扩建第二个尺寸页。

## 2026-09-01 16x16 固定尺寸工具页实现记录

问题：32x32 专项页已经获得点击和稳定的查询归属，需要从 16x16、Minecraft、AI 三个方向中选择第二个真实工具页，而不是继续等待完整 14 天后才行动。
需求证据：GSC 使用 `2026-08-02` 至 `2026-08-29` 的完整 final 数据；16x16 相关可见查询共 56 曝光、1 点击，其中 `convert image to 16x16 pixel art`、`image to 16x16 pixel art`、`image to pixel art 16x16` 的平均排名约为 7.67 至 9.25，说明 Google 已经识别本站与该需求相关。Minecraft 搜索结果要求方块映射、材料统计和蓝图等当前产品没有的能力；AI 搜索结果主要要求真正的 AI 生成，与现有规则式转换器不匹配。本轮 Keyword Planner 新查询被 Google Ads 的广告拦截提示挡住，没有用猜测数字补齐。
目标页面：`/converter/16x16-pixel-art/`。
关键词归属：唯一核心词为 `image to pixel art 16x16`；辅助词为 `convert image to 16x16 pixel art`、`16x16 pixel art converter` 和 `image to 16x16 pixel art`；泛词 `image to pixel art` 继续归主转换页，`image to pixel art 32x32` 继续归 32x32 页面，`16x16 pixel art generator` 不在本页承诺范围内。
本轮边界：只新增英文 16x16 固定输出页并让现有固定尺寸组件同时支持 16 和 32；不改首页、不改 32x32 页面内容、不建 Minecraft 或 AI 页面、不新增多语言内容、不改 Blog 或部署配置。
修改：新增真实 16x16 处理路径，支持裁剪填满、完整适配、调色和抖动、16x16 精确导出，以及 32x32、64x64 最近邻放大。新增独立 H1、正文、HowTo、FAQ、SoftwareApplication、OG 和 sitemap 路由。title 为 59 字符，meta description 为 158 字符。通过内容顺序让主转换页的“Explore other converters”自动产生到新页的普通站内链接，便于搜索引擎发现。
首屏：沿用已经验收的固定尺寸页结构，采用居中 H1、一句价值说明、下方完整上传区和三项关键信息，不再使用左右分栏或工具前的大段 SEO 文案。1440 x 900 和 390 x 844 真实页面截图均确认标题、上传动作和关键信息清晰可见，没有横向溢出。
验证：Node `20.19.0` 下 `npm run seo:ownership`、`npm run build` 和 `npm run lint` 通过；构建生成 `dist/converter/16x16-pixel-art/index.html`，title、canonical、OG、Twitter、HowTo、FAQ、图片和 sitemap 均通过 dist 校验。Chromium 专项测试验证 16x16 精确导出、32x32 最近邻放大和 390px 无横向溢出，同时确认原 32x32 导出流程未回归，2 项测试全部通过。
已知测试基线：`npm run test:unit` 中新增的 16x16 内容与关键词归属断言通过；整套命令仍只有仓库原有的西班牙语 BMP 重定向断言失败，本轮没有扩大范围处理。
发布结果：实现提交为 `6b4d77a`，已推送 `main`；GitHub Pages、CI 和 Lighthouse CI 均通过。生产页由 Cloudflare 发布后返回 HTTP 200，title、description、canonical、H1、上传区、HowTo 和 FAQ 均已核对；线上 sitemap 和主转换页都已包含 `/converter/16x16-pixel-art/` 链接。
GSC 提交：上线后 URL Inspection 返回 `NEUTRAL / URL is unknown to Google`，没有抓取时间、Google canonical 或引用页，符合刚发布的新 URL 状态。已通过 Search Console API 重新提交 `https://pixelartvillage.org/sitemap.xml`，接口返回 HTTP 204；没有使用只适用于 JobPosting 和 BroadcastEvent 的 Indexing API 冒充普通页面提交。
当前状态：页面已经上线并进入 sitemap，Google 仍未发现或抓取，不能把部署成功写成已收录。
下一步：等待 Google 首次抓取；出现抓取时间后再核对 canonical，并用完整 final 数据观察 16x16 查询是否从首页转移到专项页。

## 2026-09-05 About 品牌身份链接修正

问题：GEO 只读审评发现 About 页 Organization.sameAs 指向 `https://github.com/pixelartvillage/pixelartvillage`，公开访问返回 HTTP 404。
证据：当前项目 origin 为 `https://github.com/elng12/pixelartvillage.org.git`；对应网页返回 HTTP 200，GitHub API 确认仓库公开且未归档。本地 HEAD 与远程 main 均为 `9cd5d2295b7084aa9d1c9a3c64e3fca8ac8be535`。
本轮边界：只修正 About 页品牌身份链接，不改首页、converter、Blog、翻译文案或页面布局，不提交、不推送、不部署。
修改：同步将 `src/components/About.jsx` 和 `scripts/build/prerender-spa.cjs` 的同一条 sameAs 替换为 `https://github.com/elng12/pixelartvillage.org`。共用 About 模板的语言版本随之使用正确地址，没有新增外部身份或全站 schema。
验证：Node `20.19.0` 下在临时副本运行 `npm run build`，构建及内置 SEO、dist、重定向检查全部通过；原工作区 `npm run lint` 通过。本地 18 个语言版本 About HTML 的 Organization.sameAs 和 canonical 断言全部通过；Codex 隔离浏览器确认 `/about/` 正文正常、无横向溢出，实际 DOM 保留正确 title、canonical 和新 sameAs。
工作区保护：构建副本为 `/tmp/pixelart-about-geo-TAdztq`，未覆盖原工作区已有的 sitemap、AGENTS.md 或其他无关改动。本轮代码差异检查通过。
初次验证状态：仅本地完成，生产尚未更新。未运行全套端到端测试，未修改 llms.txt、日期、统计数字或首页尺寸声明。

### 同日提交部署结果

授权：用户随后明确要求“提交部署”；仅发布本轮两个源码文件及本迭代记录，保留其他本地改动。
发布前验证：在基于远程 main 的干净临时 worktree `/tmp/pixelart-about-release-1fR1jk` 中，仅加入本轮变更；Node `20.19.0` 下 `npm run lint`、`npm run build`、`npm run verify:dist`、`npm run sitemap:verify` 通过，18 个 About HTML 的 sameAs 与 canonical 专项断言通过。
实现提交：`03756c19fec4f65e4ec917a1f6998077c6d2b5cb` 已推送 main，仅包含 `src/components/About.jsx`、`scripts/build/prerender-spa.cjs` 和本记录。
自动检查：[CI 33968334110](https://github.com/elng12/pixelartvillage.org/actions/runs/33968334110)、[GitHub Pages 33968334228](https://github.com/elng12/pixelartvillage.org/actions/runs/33968334228)、[Lighthouse CI 33968334286](https://github.com/elng12/pixelartvillage.org/actions/runs/33968334286) 均成功；该提交的 Cloudflare Pages 检查也成功，项目 `pixelartvillage1`，部署 ID `cda1bc5b-b2cb-4f12-acba-87d457c0ace9`。
生产验收：18 个语言版本的 About 页面均返回成功响应，新 sameAs 已生效、旧地址已消失；title、canonical、OG/Twitter、正文及其余 schema 与本次已验证构建一致。新 GitHub 目标返回 HTTP 200。生产启动检查确认首页、About、西班牙语 About、robots.txt 和 sitemap 正常；sitemap 共 205 个 URL，前 50 个抽样均返回 200，唯一提示是只抽查了前 50 个，而非全量逐 URL 验收。
当前状态：About 身份链接修正已在生产生效。本次没有重新执行 GSC 收录或 AI 引用效果检查，不把部署成功等同于 AI 引用提升。

## 2026-09-09 Photo 页自动广告单页排除

问题：此前真实页面诊断发现底部锚定广告遮挡内容，且查看上传后的编辑区时出现全屏广告。本轮用户要求继续处理，只限 Photo 页，不改全站广告设置。
目标页面：`https://pixelartvillage.org/converter/photo-to-pixel-art/`。
账号核对：通过 Codex 隔离浏览器切换已有登录账号，确认 AdSense 发布商编号与 `src/utils/loadAdSense.js` 中的编号一致，网站列表包含 `pixelartvillage.org`；未启用或修改其他账号。
变更前状态：全站自动广告启用，自动优化停用，意向驱动格式 1/1、重叠式格式 3/3、页内格式 0/2，排除网页数为 0。
实际操作：在 AdSense 的“排除的网页”中添加目标精确 URL，选择“仅此网页”，未选择“此版块下的所有网页”；点击“应用到网站”，选择“立即应用”并保存。未修改任何广告格式开关。
后台回执：北京时间约 16:36 保存成功，提示“大功告成！所做更改最多可能需要一个小时才能反映在您的网站上。”刷新后台后，全站自动广告仍启用，排除网页数为 1。
影响：目标页停止展示自动广告后会失去该页自动广告收入；首页、其他 converter、多语言和 Blog 未加入排除范围。未估算收入损失，也不将广告调整等同于 SEO 排名提升。
首次生产抽查：保存后重新打开目标页，使用站内公开 `showcase-before.jpg` 插画验证上传，编辑器出现；Pixel Size 从 1 调至 2、Palette 选为 Pico-8，预览更新。但页面仍出现底部锚定广告与意向广告，尚未证明排除已在前台生效。此次不是照片质量测试，未完成无广告的下载全流程及手机验收。
当前状态：后台配置已保存并确认持久化；前台消除广告遮挡仍待验收，不能标为已解决。Google 官方说明设置最多需要一小时生效：https://support.google.com/adsense/answer/9262311?hl=en 。
工作区边界：仅追加本记录，不改业务代码、SEO 文案、广告加载器或部署配置；保留原有四个无关修改文件。未提交、未推送、未部署；无源码变更，未运行构建或代码测试。
下一步：北京时间 17:36 之后，用新打开的 Photo 页完成桌面和手机的“上传 -> 调参 -> 预览 -> 下载”验收；若仍出现自动广告，再核对保存的精确排除规则与实际访问路径，不扩大到全站关广告。

## 2026-09-10 Sprite 页首屏上传与 PNG 需求补充（仅本地）

问题：用户截图中的 Sprite 页首屏被两段介绍和跳往主转换页的大蓝色提示框占据，实际上传区被挤到下方。用户同意在原页面上调整，不新建 URL。
GSC 证据：本次前序只读检查使用 `2026-08-10` 至 `2026-09-06` 完整窗口；目标页为 424 点击、2,270 展示、CTR 18.7%、平均排名 6.2。`png to sprite` 为 0 点击、33 展示、平均排名 14.0；`png to sprite converter` 为 2 点击、21 展示、平均排名 3.9。这是补充相同工具意图的依据，不是承诺排名提升。
目标页面：`/converter/photo-to-sprite-converter/`，仅英文。保留原 slug、title、meta description 和 H1，不修改首页、其他 converter 内容、多语言内容、Blog、广告或部署配置。
修改：在 `PseoPage.jsx` 增加仅匹配英文 Sprite 的首屏分支，显示 H1、一句简述和现有真实上传组件；编辑器继续复用原组件。长介绍移到工具后，原大提示框改成普通辅助内链。英文内容源补充 PNG 转单张 sprite 的说明、三步 HowTo 和三个 FAQ，明确保留已有透明区域不等于自动抠图，也不提供 sprite sheet 或动画帧生成。
验证：Node `20.19.0` 下在临时副本 `/tmp/pixelart-sprite-preview-ISHdPZ` 运行 `npm run build`，构建及自带 SEO、dist、重定向检查通过；原工作区 `npm run lint` 通过。静态 HTML 包含 SSR 根节点、原 H1 和上传区；title、canonical、OG、Twitter、FAQ 与 HowTo 已通过构建及浏览器断言。内容对比确认其余 11 个 converter 条目未变。
页面验收：Chromium 的 pSEO ownership、export options 和固定尺寸回归共 6 项通过，覆盖 1440 x 900 与 390 x 844 首屏上传区完整可见、无横向溢出、PNG 页原提示框保留、无效文件报错后恢复上传、Pixel Size 调整、真实下载文件尺寸与透明像素检查，以及原 16x16/32x32 导出。透明导出用合成测试图验证，不代表照片质量评测。桌面和手机截图已人工查看。
补充真人页面检查：Codex 隔离浏览器上传站内公开 `showcase-before.jpg` 后编辑器正常出现，Pixel Size 从 1 调到 2，Palette 选择 Pico-8，预览图片正常显示，无捕获到的页面 error 日志；内置浏览器的下载事件等待超时，未将其记为人工下载成功。实际导出文件的验证以上述 Playwright 测试为准。
工作区保护：仅改两个业务文件、一个已有测试文件，并追加本记录；未覆盖原有 AGENTS.md、sitemap 或其他无关改动。构建只在临时副本进行，未手改 dist。
当前状态：本地完成，本地预览为 `http://localhost:4173/converter/photo-to-sprite-converter/`；未提交、未推送、未部署，生产仍为旧版。未运行全套跨浏览器测试，也未执行新的 GSC 提交。
下一步：用户确认本地页面后再按明确授权提交发布；上线并确认 Google 重新抓取后，用完整窗口观察本页及 PNG 相关查询，不把本地验收当成 SEO 效果。

## 2026-09-11 Sprite 上传后体验审评修复（仅本地）

范围：用户授权修复审评中的四项问题；保留已有 Sprite 页面内容和未提交工作，不提交、不推送、不部署。
修改：收起后的上传入口仍渲染错误和读屏通知，补回描述关联；非图片、损坏 PNG、超过 10MB 的文件均保留旧预览并显示错误，之后可重新上传。手机设置自然展开，预览保留双向滚动；放大图以可访问的左上角为起点，小图仍居中。桌面预览与父容器等高，避免压住下载按钮。
隔离：通过显式页面参数仅让英文 Sprite 启用手机布局、标题层级、FAQ 前移和上传图标；恢复共用布局高度和其他页面原来的重置行为，首页/PNG 页 Reset 不再清除所选调色板。
示例边界：保留 CSS 示意图，但明确标注“Illustration only, not an actual conversion result.”，去掉真实原图/8-bit 结果的误导标签；试用按钮改为 Try demo image。真实转换前后对照素材尚未补充，本轮不声称完成真实样例。
验证：Node 20.19.0 下类型检查、受影响文件 ESLint 及 src/tests 差异空白检查通过。当前源码在临时副本 `/tmp/pixelart-sprite-fix-CwRxL2` 构建，完整 build 及自带 SEO、dist、重定向检查通过，不覆盖原工作区已有 sitemap 改动。
浏览器测试：当前构建的 Chromium 共 9 项通过（pseo-ownership 5、export-options 1、fixed-32x32 2、zoom-controls 1），无自动重试。覆盖 1440 x 900/390 x 844、成功上传后连续错误输入及恢复、PNG 透明导出、真实 CDP 触摸手势横向滚动、放大图左上角可达、首页/PNG 布局与 Reset 隔离，以及 16x16/32x32 导出。合成测试图仅用于功能验证，不代表图片质量评估。
人工页面检查：Codex 隔离浏览器检查当前构建的桌面/手机截图，示例可进入像素预览；手机再次选择非图片时错误可见、旧预览保留，控件 overflow 为 visible、内容自然展开。Firefox/WebKit 因本机缺少运行文件未能启动，未验证，未安装新工具。
交付：本地预览 `http://localhost:4187/converter/photo-to-sprite-converter/`；仍未提交、未部署，无新的外部 SEO 提交。全工作区 diff-check 中 AGENTS.md 原有空白告警未改动。

### 同日二次审评修复：吸顶下载栏与 Claude 配置

范围：只修复本轮发现的两处问题，保留其他未提交改动，不提交、不部署。
页面修复：英文 Sprite 的手机/平板参数区仍采用页面滚动，吸顶下载栏增加站点导航的 5rem 高度及 1px 边框偏移；lg 及以上继续使用原 top-0 和内部滚动，其他页面不变。
回归验证：新增测试先在修复前构建复现按钮 y=0 被 81px 导航遮挡；最终测试覆盖 390x844 和 820x1180 滚动后按钮未被遮挡、真实点击下载且页面不跳动，并补验桌面及其他页面的原吸顶设置。Node 20.19.0 构建、类型检查、受影响文件 ESLint 与差异空白检查通过；Chromium 10 项通过，无自动重试。Codex 隔离浏览器手机截图确认按钮顶边与导航底边均为 81px，点击命中按钮。Firefox/WebKit 本轮未验证。
配置修复：`.claude/settings.local.json` 使用事件数组和 command handler 结构，路径锚定 CLAUDE_PROJECT_DIR，去掉 BOM 以及无效的 Python/Node 工具名；原 Bash 权限不变。按 [Claude 官方文档链接的配置 schema](https://code.claude.com/docs/en/settings#edit-a-settings-file) 校验完整配置，并确认旧字符串 hook 会被拒绝。
未解决的脚本依赖：用户要求自行寻找后，检查了本机可访问目录（含隐藏/忽略文件）、Spotlight 文件索引及 Git 历史，未找到 `sessions_enforce.py` 或 `post_tool_use.py`。历史只显示 2025-11-04 的 5d221b3 引入路径引用，sessions 目录没有提交记录；macOS 部分受保护目录无法读取，未绕过权限。保留原脚本引用，不删除或编造检查逻辑；配置格式通过不等于 hook 可执行，缺少脚本仍会报错，实际执行能力未恢复。
交付：预览仍为 `http://localhost:4187/converter/photo-to-sprite-converter/`。构建只在临时副本进行，未覆盖原工作区 sitemap；脚本依赖未补齐，因此不将这部分标记为完全修复。

## 2026-09-11 英文 Sprite 单页 SEO 优化（仅本地）

范围：按用户目标只优化 `/converter/photo-to-sprite-converter/`，不提交、不推送、不部署、不操作 GSC 或付费工具。保留先前未提交工作；本轮不改 Claude hooks、首页、其他 converter 内容、多语言、Blog 或广告。
内容：Title 从 45 改为 56 字符，Description 从 139 改为 157 字符；核心词 `photo to sprite converter` 前置于标题，并自然分布于 H1、首段、H2、正文和 FAQ。辅助词为 `png to sprite converter`、`png to sprite`。补充输入选择、Pixel Size 3/6/12 起点、调色板和抖动选择、输出尺寸、透明背景及后期清理限制，不承诺自动抠图、动画或直接可用游戏素材。
真实示例：复用已有 `/showcase-before-w480.webp` 插画（480x637），通过本站编辑器完成 Pixel Size 6、Palette None、dithering off、Brightness/Contrast/Saturation 0、PNG Pixel size、Transparent background enabled 的实际导出。新增 `public/sprite-demo-pixel6.png`（80x106，21,205 字节），替换 CSS 示意图；页面说明这不是照片或手绘 sprite，原图不透明，转换不会去掉背景。回归测试将重新导出的像素数据与展示文件逐像素比较，不以示意图冒充结果。
统计口径：对未上传时的初始 HTML，分别读取 main 主内容区与 body 全页文本；排除 head、script、style、noscript、hidden 和 aria-hidden=true 内容，不计图片 alt。英文/数字分词保留词内连字符和撇号。密度为完整四词词组次数/总词数；排名按同长度词组次数计算，并列同名次。不是第三方工具原始分数，也不是 Google 排名门槛。

| 统计范围 | 本轮修改前 | 本轮修改后 |
| --- | --- | --- |
| 主内容区词数 | 592 | 1054 |
| 主内容区核心词次数/密度/排名 | 1 / 0.169% / 并列12 | 6 / 0.569% / 1 |
| 全页词数 | 760 | 1222 |
| 全页核心词次数/密度/排名 | 2 / 0.263% / 并列7 | 7 / 0.573% / 1 |

检查范围：在 Sprite 内容项补充 seo 字段，复用原 `validate-page-ownership.cjs`，使原有长度和关键词归属检查实际覆盖该页，不新增全站规则。现有 pseo-ownership 测试增加初始 HTML 的长度、前置词、H1/H2、首100词、主内容区/全页密度排名、OG/Twitter 一致性、robots/sitemap、真实示例加载及逐像素导出比对，并核对 FAQ 问答及 HowTo 步骤名与可见页面一致。
构建与页面：在 `/tmp/pixelart-sprite-fix-CwRxL2` 使用 Node 20.19.0 构建，build 及自带 SEO/dist/重定向检查通过，类型检查与受影响文件 ESLint 通过；原工作区 sitemap 未被构建覆盖。桌面 1440x900 和手机 390x844 截图已检查，上传按钮在首屏完整可见、真实对照图加载正常、无水平溢出。Codex 隔离浏览器桌面可用，后续连接失败，手机最终截图使用项目 Playwright Chromium 补验；截图位于 `/tmp/sprite-seo-390-first.png`、`/tmp/sprite-seo-390-example.png`、`/tmp/sprite-seo-1440-example.png`。
最终回归：当前构建的 Chromium 11 项全部通过，无自动重试（pseo-ownership 7、export-options 1、fixed-32x32 2、zoom-controls 1），覆盖 SEO、真实示例、首屏上传、错误恢复、透明导出、手机滚动下载、预览缩放及其他页面隔离。当前预览 HTTP 200；src 与已验收临时构建输入逐文件内容一致，受影响范围 diff-check 通过。
未验证：Firefox/WebKit、生产发布、实时 GSC/搜索展示与 SEO 效果均不在本次已完成证据中。预览为 `http://localhost:4187/converter/photo-to-sprite-converter/`，生产仍为旧版。

### 同日 PNG 辅助词自然布局补充

用户同意不强制三词榜第一、四词榜第二，改为强化 PNG 需求承接。仅调整 Sprite 内容源及对应测试：H2 使用 PNG to sprite converter，边缘处理段说明 PNG to sprite 流程，FAQ 改为具体的输入/尺寸/PNG 下载说明，不增加重复段落、不改核心词和标题描述、不删导航。
沿用上述统计口径，主内容区 1074 词：核心词 6 次、0.559%、四词榜第1；png to sprite converter 3 次、0.279%、并列第3；png to sprite 5 次、0.466%、并列第3。全页 1242 词：核心词 7 次、0.564%、第1；两个辅助词分别为 3 次、0.242%、并列第4，以及 5 次、0.403%、第5。排名是同长度词组频次，不是搜索排名，不为精确名次继续堆词。
验证：Node 20.19.0 临时副本完整构建及自带校验通过，受影响测试 ESLint、diff-check 通过，pseo-ownership Chromium 7 项全部通过，覆盖手机/桌面、可见文案与结构化数据一致性、真实导出、错误恢复和手机滚动。源码与临时构建输入一致；保留已有工作区改动，无提交、部署或外部操作。

## 2026-09-12 英文 Sprite 正文精简与透明物品案例（仅本地）

授权与范围：按 9 月 11 日用户要求，优化 `/converter/photo-to-sprite-converter/` 英文页；跨午夜完成本地验证。不提交、不推送、不部署，不做 GSC 提交或排名承诺。开始时 HEAD、origin/main 和实时远程 main 均为 `7a0ed7cb9b1c8b9e18880fedf24f9be9ab2f836b`；保留原有全部未提交修改。

内容与布局：移除英文页独立的三步操作区、三段长介绍、重复透明背景段落与底部主工具提示，流程融入上传按钮、参数表、导出选择三处。页面顺序为工具、一个真实案例、四行参数表与两项导出对比、五条可见 FAQ、相关工具。保留 Pixel Size 3/6/12、Palette None/Pico-8、dithering off 和颜色参数 0 的真实起点；导出说明区分 Pixel size 与 Original size，明确预览缩放不改变导出尺寸。正文只留一句透明背景限制，边缘清理、背景预处理、动画和固定尺寸细节集中在 FAQ。正文/FAQ 最大宽度 768px，FAQ 改为分隔线列表，不用折叠隐藏重复内容；相关工具描述同步缩短，仅影响本页显示。

语言隔离：当前仅有英文 pSEO 内容文件，非英文 Sprite 路由会回退读取它。因此在同一 Sprite 条目增加 `englishSprite` 内容，只在英文目标页及该页预渲染元信息中应用；保留旧基础字段供其他语言回退。逐条比较确认全部 12 个基础条目未变，另外 11 个英文 converter 内容未变；没有改翻译文件、首页或共享图片处理逻辑。

元信息与断言：英文 title 为 `Photo to Sprite Converter | Pixel Art Village`，H1 保持 `Photo to Sprite Converter`，canonical 保持原 URL；description 准确描述单张图片、本地处理和已有透明区域。删除 Sprite 测试中的密度、词频名次、硬性长度及强制 H2 重复关键词断言；ownership 脚本仅将 Sprite 的长度改为编辑参考，其他页原规则不变。保留关键词归属、非空元信息、OG/Twitter 一致性、robots/sitemap、可见 FAQ 与 JSON-LD 一致性、真实导出及错误恢复检查。

案例来源与授权：[Free Health and Mana Potions](https://opengameart.org/content/free-health-and-mana-potions)，作者 bevouliin.com，页面明确标注 [CC0](https://creativecommons.org/publicdomain/zero/1.0/)，并说明提供透明 PNG。下载该条目附件 `health and mana potions.zip` 中的 `PNG/mana.png`，原样复制为 `public/sprite-mana-source.png`（228x228，12,671 字节）；源文件字节比较一致，没有抠图、裁切、重画或生成图。素材是游戏物品图标而不是照片，页面已说明。

真实导出：通过本站本地页面加载该 PNG，Pixel Size 6、Palette None、dithering off、Brightness/Contrast/Saturation 0、PNG、Pixel size、Transparent background on，点击真实下载按钮生成 `public/sprite-mana-pixel6.png`（38x38，2,907 字节）。最终展示文件由项目 Playwright Chromium 141.0.7390.37 下载，未做后期处理。原图完全透明/半透明/不透明像素分别为 10,872 / 642 / 40,470；结果为 237 / 173 / 1,034，四角透明度均为 0，中心为 255。灰色只来自页面展示背景。原有未跟踪的 `sprite-demo-pixel6.png` 保留，没有删除用户已有文件。

验证过程说明：初次使用另一浏览器环境下载的结果与项目 Chromium 的重采样像素不同；最终改用项目同一 Chromium 实际下载，保留严格逐像素比对，并在最终构建重新导出通过，不放宽像素断言。旧手机滚动测试依赖 End 键却没有确认缩放值改变，换用较小素材后暴露问题；改成真实点击缩放滑条并断言大于 4，再验证触摸横向滚动及导出尺寸不随缩放改变。没有扩展修改共享缩放逻辑。

最终检查：Node 20.19.0 下 `npm run build`（含 ownership、SEO、dist、重定向检查）、`npm run lint`、`npm run typecheck` 和受影响文件 diff-check 均通过。构建使用临时副本 `/tmp/pixelart-sprite-content-spRTBO/build`，未覆盖原工作区已有 sitemap；最终输入文件与工作区逐文件一致。

真实页面与回归：当前最终构建 Chromium 11 项全部通过，无自动重试（pseo-ownership 7、export-options 1、fixed-32x32 2、zoom-controls 1）。覆盖 1440x900、390x844 真实素材上传、Pixel Size 6 改 7、Pico-8、预览更新和实际下载 32x32；案例默认导出 38x38 与展示文件逐像素一致，Original size 为 228x228且透明角保留；还覆盖非法文件/损坏 PNG/超限文件恢复、手机触摸滚动、390/820 宽吸顶下载、首页与 PNG 页原布局及 Reset、16x16/32x32 导出、西班牙语 Sprite 回退页原 title/HowTo/四条 FAQ。初始 HTML 和客户端元信息、五条可见 FAQ 与结构化数据一致。

人工检查：Codex 隔离浏览器查看桌面参数/导出区，以及手机首屏、前后图对齐、参数表；手机实际试用素材并调至 Pixel Size 7、Pico-8，预览正常且页面无横向溢出。下载文件尺寸与像素结论以上述 Playwright 实际下载检查为准。构建日志仍提示浏览器兼容性数据过期，没有因此更新依赖。

交付与限制：本轮最终预览为 `http://localhost:4173/converter/photo-to-sprite-converter/`，使用上述临时副本的最终构建；此前 4187 端口预览未替换。测试日志在 `/tmp/pixelart-sprite-content-spRTBO/tests-final.log`，HTML 报告（含桌面/手机截图）在该副本 `playwright-report/`。未验证 Firefox/WebKit、实体手机浏览器、生产页面、Google 抓取或搜索效果；本地通过不等于线上更新或排名提升。

### 同日恢复已确认元信息与主关键词检查（仅本地）

用户指出上一轮修改标题、描述及取消主关键词首位检查不符合已确认要求，并明确要求恢复。仅修改英文 Sprite 覆盖内容及对应测试，保留精简正文、透明物品案例和其他已有未提交改动。title 恢复为 `Photo to Sprite Converter - Free PNG | Pixel Art Village`；description 恢复为 `Photo to Sprite Converter turns photos and PNGs into single sprite-style images. Adjust pixel size and palettes, preview changes, and download PNGs for free.`。首屏一句介绍自然补回主关键词，没有新增段落；恢复全页可见正文四词组中主关键词频次严格高于其他词组的测试，不要求辅助词名次或固定密度。

当前验证：Node 20 临时副本完整构建及自带校验、测试文件 ESLint、Chromium 7 项受影响测试全部通过，无重试。覆盖初始 HTML 和客户端元信息、FAQ 一致性、真实素材下载与透明像素比对、桌面手机上传调参下载、错误恢复及其他页面隔离。全页 innerText 四词组统计主关键词 3 次，其余最高 2 次，独占第一；此统计不是用户截图插件的统计结果。1440x900 和 390x844 页面截图复核，均无横向溢出。Codex 隔离浏览器连接报 request-header policy 错误，本次改用项目 Playwright 浏览器截图检查，未直接复核用户插件。

预览继续使用 `http://localhost:4173/converter/photo-to-sprite-converter/`，日志为 `/tmp/pixelart-sprite-content-spRTBO/build-restore.log` 和 `tests-restore.log`，截图为同目录 `restore-1440.png`、`restore-390.png`。未提交、推送或部署；线上状态未改变，也未验证搜索排名。


## 2026-09-12 英文 Sprite 页发布

授权：用户明确要求“推送部署”。仅发布 `/converter/photo-to-sprite-converter/` 英文页及必要的页面专属展示逻辑、测试和两张透明物品 PNG。标题保留 `Photo to Sprite Converter - Free PNG | Pixel Art Village`，描述保留已确认的 Photo to Sprite Converter turns photos and PNGs 开头原文；正文保持精简参数表、导出对比、五条 FAQ 与真实案例，不恢复重复长说明。

案例：[Free Health and Mana Potions by bevouliin.com](https://opengameart.org/content/free-health-and-mana-potions)，CC0；原 PNG 228x228，本站 Pixel Size 6 / Palette None / dithering off 实际下载结果 38x38，无后期加工，透明角保留。保留主关键词可见正文四词组独占第一的测试，不要求辅助词名次或固定密度；未直接验证用户截图插件。

发布隔离：从当前远程 main `7a0ed7cb9b1c8b9e18880fedf24f9be9ab2f836b` 构造干净发布副本 `/tmp/pixelart-sprite-release-chgOSO`。全部 12 个基础内容条目与该提交一致，只新增英文 Sprite 覆盖字段（含其 seo），因此较早的本地非英文回退内容修改不进入发布。对应西班牙语测试按已发布版本校验原 title、HowTo 和七条 FAQ。保留这些未发布内容、旧示例 PNG、HowItWorksSection 未使用样式、Claude 配置、AGENTS、其他文档和 sitemap 的本地改动，不一并提交。

发布前：干净发布副本的 Node 20 构建及自带 SEO/dist/重定向检查、lint、typecheck 通过；Chromium 11 项回归全部通过，无重试，覆盖真实导出像素、透明度、上传错误恢复、手机滚动、尺寸与缩放和页面隔离。生产是否成功，以后续部署回执及线上验收补充为准。


发布结果：代码提交 `eb77238678b66ee0faa291ad89bd8ee9a49db161` 已推送 main。[CI 34622499624](https://github.com/elng12/pixelartvillage.org/actions/runs/34622499624)、[GitHub Pages 34622500071](https://github.com/elng12/pixelartvillage.org/actions/runs/34622500071)、[Lighthouse 34622499666](https://github.com/elng12/pixelartvillage.org/actions/runs/34622499666) 全部成功；Cloudflare Pages 项目 pixelartvillage1 的检查成功，部署 ID `5f96b6b6-5bfc-4281-8123-fb2737a0b415`。

生产验收：目标页 HTTP 200，title、description、canonical 和五条 FAQ/JSON-LD 与发布版本一致，原图和结果资源为 228x228 / 38x38。隔离 Playwright 浏览器桌面 1440x900 试用真实素材并下载 38x38 PNG；手机 390x844 调至 Pixel Size 7、Pico-8 后实际下载 32x32 PNG，两次下载四角 alpha 均为 0，页面无水平溢出。首页和 PNG 页抽查 HTTP 200。`/es/converter/photo-to-sprite-converter/` 在线仍按原有 `_redirects` 301 到英文页，不把重定向后的内容当作西班牙语独立页面验收。

部署切换过程中曾短暂遇到图片/旧资源 404，部署完成后刷新恢复，重新验证图片正常加载和真实下载；未修改缓存或全站配置。本轮浏览器选择拒绝非必要 Cookie，不代表已验证允许广告后的体验。未验证用户关键词插件、Firefox/WebKit、实体手机或 Google 搜索效果。发布截图与下载证据保存在 `/tmp/pixelart-sprite-release-*`，其他未提交改动仍保留本地。

## 2026-09-12 西语首页翻译残留清理（仅本地）

范围：在 On Page SEO 只读检查后，按已确认的单页范围执行 `/es/` 首页修复，不提交、不推送、不部署。开始与结束 HEAD 均为 `ba5e0310553324a9aa99e59067281b8fd3ad6df0`；保留已有 Claude 配置、AGENTS、其他文档、HowItWorksSection、pSEO 内容和测试、sitemap 以及未跟踪旧示例 PNG 的改动。

内容：仅在西语 `home` 命名空间补首屏 H1/说明、上传格式提示、工具推荐、调色板介绍、格式 FAQ、Cookie 说明、跳转正文链接和页脚缺失翻译。格式 FAQ 不再显示 `English translation` / `Wait, I need to clarify` 等翻译对话。已有西语和英文 title/description 原文不变。上传提示按实际行为写为本页打开编辑器并注明 10 MB，未照搬旧英文的下一页说法。品牌、调色板专有名称和第三方徽章图片不翻改。

隔离：组件新增可选文案参数，只由西语首页传入；原共享西语翻译命名空间内容逐项比对保持一致，未改变其他页面文案。测试发现既有 TranslationPreloader 从静态语言路由读取不到 `:lang`，同语言内页跳转可能切回英文。本轮仅为 `/es/` 显式传入 `es`，保障从内页返回首页时保持西语；其他内页和语言的共享同步缺陷没有扩改。

验证：Node 20.19.0 下完整 `npm run build`（包含 ownership、SEO、dist、重定向检查）、`npm run lint`、`npm run typecheck`、本轮文件 diff-check 均通过。构建位于临时副本 `/tmp/pixelart-es-home-sCEA3x`，不覆盖原工作区已有 sitemap；最终 src 和西语翻译输入与工作区内容一致。构建保留生产式 Cookie 行为，未设置 VITE_E2E=1。浏览器兼容性数据过期告警未触发依赖更新。

最终 Chromium 24 项通过，无自动重试：i18n 7、seo-hreflang 2、pages 8、pseo-ownership 7。覆盖无 JavaScript 初始 HTML、西语首页 1440x900/390x844、七条可见 FAQ、canonical/hreflang、Cookie 拒绝、英文已确认元信息、页面专属文案隔离与内页返回首页，以及原英文 Sprite 的真实案例、主关键词检查、错误恢复和手机导出。新增西语流程使用本站已有真实物品 PNG（228x228），经 Pixel Size 6、Pico-8、PNG Pixel size 实际下载为 38x38，四角 alpha 为 0 且保留可见图像像素，下载附在测试报告。初次测试的连续按键被现有逐帧调节合并，改为逐次等待可见数值更新，不改调参实现、不放宽最终尺寸断言。

真实页面：Codex 隔离浏览器复核最终桌面首屏、手机首屏和格式 FAQ、页脚与 Cookie 布局，页面无横向溢出；手机真实上传和调参后预览正常。该浏览器的下载事件等待超时，下载文件结论以项目 Playwright 实际保存并解析的 PNG 为准。运行时 title、description、H1、canonical、OG/Twitter 已核对；现有三个 JSON-LD 均可解析，首页本来没有 FAQPage schema，本轮不新增。

交付与限制：本地预览 `http://localhost:4190/es/`；最终日志为临时副本 `build-final.log`、`tests-final.log`，下载证据在 `playwright-report/`。仅完成本次首页 On Page SEO 文案范围；其他多语言页、内页语言同步、上传后共享编辑器中少量英文标签，以及原有尺寸无限制等功能承诺未扩改。Firefox/WebKit、实体手机、线上重新抓取、第三方评分和 Google 搜索效果未验证；本地结果不代表线上已更新或排名改善。

## 2026-09-12 修复未提交 Sprite 内容的语言隔离回归（仅本地）

授权：用户在未提交改动审查后要求修复。仅处理 Sprite 共享内容回退及相关测试，不提交、不推送、不部署。开始核对 HEAD、origin/main 和实时远程 main 均为 `ba5e0310553324a9aa99e59067281b8fd3ad6df0`，保留西语首页、其他文档、配置、sitemap 和旧示例图片等已有改动。

修复：恢复 `src/content/pseo-pages.en.json` 中原有 Sprite 基础内容，把英文专项内容及 seo 保留在 `englishSprite` 内。该文件现与 HEAD 一致；英文已确认标题、描述、真实案例、参数表和五条 FAQ 不变。非英语 Sprite 不再被新增英文 HowTo/FAQ 覆盖，也不再显示与实际默认值 1 冲突的 Pixel Size 6 说明。西语隔离测试恢复原 title、西语 HowTo 和七条 FAQ，增加错误默认值文案不存在、上传后滑条默认值为 1 的断言；使用合成图片仅测试控件状态，不冒充真实案例。

验证：先将恢复后的测试运行在修复前的本地构建上，按预期因西语 Sprite title 被英文专项标题覆盖而失败，确认能拦住回归。随后在已有临时副本 `/tmp/pixelart-es-home-sCEA3x` 重新完整构建，包含 ownership、SEO、dist 和重定向检查，通过；源码及测试输入与工作区一致，未覆盖工作区 sitemap。最终 lint、typecheck、受影响文件 diff-check 通过。中断恢复后重新运行 Chromium 回归，i18n 7 项及 pseo-ownership 7 项全部通过，无重试；覆盖桌面/手机、英文元信息和主关键词检查、FAQ/JSON-LD、真实案例及透明 PNG 下载、西语首页隔离、非英语 Sprite 上传默认值。构建保留已有浏览器兼容性数据过期告警，没有更新依赖。

本地预览：`http://localhost:4190/es/converter/photo-to-sprite-converter/` 返回 200；英文页为 `http://localhost:4190/converter/photo-to-sprite-converter/`。本次真实页面验证通过项目 Playwright Chromium 完成，未新增人工浏览器截图检查，未验证 Firefox/WebKit、实体手机或线上页面。仅为本地修复，不改变生产部署及既有线上重定向行为。

## 2026-09-12 所有语言 Sprite 入口统一新版结构（仅本地）

新授权：用户明确要求“所有语言页都应采用新版结构”，因此本轮不再保留非英语 Sprite 的旧版布局。范围仅为 `/converter/photo-to-sprite-converter/` 及配置中的 17 个非英语前缀入口；不改其他 converter 内容、首页文案、Blog、翻译文件、线上重定向或 sitemap 收录范围，不提交、推送或部署，保留其余已有未提交改动。

实现：Sprite 页面不再用英语条件决定布局，统一采用工具、真实物品案例、四行参数表、两项导出对比、五条 FAQ、相关工具的顺序。全部入口默认 Pixel Size 6，手机控件正常随页面滚动。沿用原有 CC0 素材及真实导出文件，英文已确认 title/description 和主关键词检查不变；没有重新生成或加工案例图片。仅对 Sprite 路径显式同步当前界面语言，防止切换语言时控件被预加载器切回英文。

语言边界：目前 pSEO 专项内容只有英文，因此本轮完成的是 18 个语言入口的结构统一，不是 18 种全文翻译。上传按钮使用现有翻译，非英语正文保留本语言的英文回退提示；案例、参数表、FAQ 等英文正文标注 lang=en、dir=ltr，避免阿拉伯语页面里的标点和原图/结果顺序倒置。其他已有缺失翻译继续遵循原英文回退机制。

静态页面：为原先没有独立 HTML 的非英语 Sprite 入口补齐初始新版内容及匹配的 FAQ/JSON-LD，不再返回首页 SEO 标签。英文回退页 canonical 指向英文 Sprite 原页，HowTo 的内容语言标为 en；不将这些回退入口加入 sitemap 或作为新的语言替代页。现有生产 `_redirects` 仍将非英语 converter 路径 301 到英文页，发布行为未变。

验证：Node 20 完整构建及自带 ownership、SEO、dist、重定向检查通过；lint、typecheck、受影响文件 diff-check 通过。最终 Chromium 33 项通过，无重试：原 i18n 7 项、pseo-ownership 7 项，加 18 个语言入口和一项连续语言切换测试。逐一检查 1440x900 与 390x844 页面无横向溢出、初始 HTML 和运行时新版结构、canonical、五条可见 FAQ 与 schema 一致、默认值 6；每种语言真实上传 228x228 素材并下载 38x38 PNG，与案例文件逐像素相同且四角透明，再调到 7 和 Pico-8 验证预览变化。测试修正了缺失翻译键的标准英文回退、等待实际预览与导出选中状态、阿拉伯语原生滑条按键方向及切换语言时可选尾斜杠，不放宽实际尺寸或像素断言。

浏览器复核：Codex 隔离浏览器检查西语桌面/手机首屏、案例和参数表，以及日语、阿拉伯语手机入口；阿拉伯语英文回退内容的阅读方向已修正。构建复用 `/tmp/pixelart-es-home-sCEA3x`，最终输入与工作区一致，未覆盖原工作区 sitemap。本地预览仍为 `http://localhost:4190/es/converter/photo-to-sprite-converter/`，可从顶部切换语言。未验证 Firefox/WebKit、实体手机、生产部署或 Google 搜索效果；本地结构通过不代表完整翻译、线上已发布或排名改善。

## 2026-09-12 西语首页与多语言 Sprite 定向发布

授权：用户在审查和下一步说明后明确回复“执行”，授权提交、推送、部署已验收的西语首页修复及所有语言 Sprite 新版结构，并做线上验收。保留其他已有未提交改动，不改变全文翻译范围、非英语 converter 重定向、canonical 策略或索引范围。

发布隔离：开始时 HEAD、origin/main 与实时远程 main 均为 `ba5e0310553324a9aa99e59067281b8fd3ad6df0`。从 HEAD 导出干净副本 `/tmp/pixelart-locale-release-UDpfZM`，仅加入 13 个相关代码/翻译/测试文件；不包含 Claude 配置、AGENTS、竞品文档、未使用的 HowItWorksSection 样式、工作区 sitemap 或旧示例 PNG。本记录只暂存本批相关段落，其他历史文档修改仍保留本地。沿用仓库 Git 集成部署，不另建站点或修改云端配置。

发布前检查：Node 20.19.0 下完整构建及 ownership、SEO、dist、重定向检查通过，lint、typecheck 和受影响文件 diff-check 通过。构建仅在干净副本生成产物，未覆盖工作区 sitemap；保留现有浏览器兼容性数据过期告警，没有更新依赖。完整 Chromium 73 项回归全部通过，无重试，覆盖 18 个 Sprite 入口、首页、Blog、导航、调色板管理、透明导出、固定尺寸、手机布局和 SEO；Codex 隔离浏览器复核了干净副本西语首页。13 个暂存代码/翻译/测试文件与构建输入逐字节一致。推送及生产状态待后续回执补充。

### 本次发布回执

代码提交 `285986090f46b0baebc55b761fd8c4afd28ab3b1` 已推送 main。[CI 34685733463](https://github.com/elng12/pixelartvillage.org/actions/runs/34685733463)、[GitHub Pages 34685733457](https://github.com/elng12/pixelartvillage.org/actions/runs/34685733457)、[Lighthouse 34685733459](https://github.com/elng12/pixelartvillage.org/actions/runs/34685733459) 全部成功。Cloudflare Pages 项目 pixelartvillage1 检查成功，部署 ID `6a48873f-102e-4142-87c0-57ca420f7285`。

生产验证：正式域名运行 Chromium 9 项针对性检查全部通过，无重试；覆盖西语首页初始 HTML、已确认 title/description、桌面 1440/手机 390 布局、文案隔离、语言切换和 Cookie 文案；西语首页使用真实透明素材，Pixel Size 6 / Pico-8 实际下载 38x38 PNG，透明角保留。英文 Sprite 初始元信息、五条可见 FAQ/JSON-LD 一致；实际导出 38x38 与已有案例逐像素相同，Original size 实际下载 228x228 且透明角保留。手机再调到 Pixel Size 7 / Pico-8，预览变化，无横向溢出。证据位于 `/tmp/pixelart-locale-release-UDpfZM/production-test-results/` 和该副本的 Playwright 报告。

线上边界：逐一请求全部 17 个非英语 Sprite 地址，均返回 301 到英文原页，未解除原重定向。Codex 隔离浏览器确认西语首页新文案已生效；从英文 Sprite 站内切换西语时显示新版结构及明确的英文回退提示，而非旧 HowTo/大提示卡。独立多语言全文翻译和语言页直接访问策略不在此次发布范围。

上线检查：首页、西语首页、英文 Sprite 和 PNG converter 均为 HTTP 200，canonical 域名正确，robots 与 sitemap 正常；sitemap 共 205 个 URL，前 50 个抽查全部返回 200，唯一告警为未全量抽查。未修改广告设置；隔离浏览器 Sprite 页面仍可出现原有自动广告，不把此次测试等同于无广告或所有访客体验通过。Firefox/WebKit、实体手机、GSC 收录及搜索排名效果未验证。无关工作区修改仍保留本地。

后续复查补记：仅文档提交 `ebb02e5` 推送后，Cloudflare 部署 `882e550d-023e-4193-be44-71eb061b3338` 及 CI/Pages/Lighthouse 全部成功，业务源码未变。再次运行相同 9 项线上测试时，8 项通过，手机 Sprite 测试有一次上传后 20 秒未出现预览而失败；保留了失败截图、视频和页面快照，没有删除失败记录或放宽断言。该项随后单独开启 trace 复测通过，再连续独立运行 3 次均通过，包含真实 38x38 下载、逐像素比对、透明角和 Pixel Size 7 / Pico-8 预览检查。失败原因未确定，不能据此认定是网络或缓存，也不能把后续通过称为已修复。该间歇现象作为本次发布的剩余风险；原失败证据在 `production-test-results/`，后续 trace 分别在 `production-sprite-recheck/` 与 `production-sprite-repeat/`，均位于上述干净副本。没有据此扩大修改共享图片处理或广告逻辑。

## 2026-10-12 泰语五篇正式发布准备

恢复任务时原 `/tmp/pixelart-th-release.JnwyRM/` 证据目录已不存在，没有把中断后的测试状态推断为通过。在当前 main/origin/main `0c813ea17ff0a5e279d5c2057f01a9373d3cbe42` 上重新生成隔离发布副本 `/tmp/pixelart-th-resume.NaIfAn/build/`，仅加入上述十个泰语文件；保留最新俄语描述提交。Node 20 下 build、lint、typecheck、sitemap:verify 与 diff-check 通过；最终完整 Chromium 回归 444/444 通过，零重试、无跳过。日志与报告在新副本上层的 build.log、lint.log、typecheck.log、regression.log、results/、report/。本次结果来自实际最终应用输入，不沿用已丢失的旧临时目录结果。

用户对“与最新代码合并验收、完整 Chromium 回归、只提交泰语文件并上线验收”的建议回复“执行”。本次仅发布五篇泰语正文、两个配套调色板字段、五张分享 PNG、泰语 GSC 基线、泰语测试及本文件泰语相关章节，不混入 AGENTS、俄语、两份工作区站图或其他任务记录。起点本地与 origin/main 均为 edae9c0ed421fa88970e1a79163e991a8dcc7ecf，暂存区为空；沿用 Cloudflare Pages 项目 pixelartvillage1 的 main Git 集成，不修改发布渠道、云端配置或索引设置。发布前在独立副本构建和完整回归，发布后核对同 SHA 的部署及正式页面、上传下载；不请求 GSC 收录。


## 2026-10-12 泰语五篇修复（本地完成，未发布）

用户明确要求继续修下一语言，按既定顺序处理 `src/content/blog-posts.th.json` 五篇和必要图片、测试；不提交、发布或请求收录。起点 main/HEAD 为 05178e4101c46604e67e465cec279726af56c8fc，保留瑞典语未提交内容、测试、图片、其他任务文档和两份工作区站图。泰语调色板说明同样误称除 Pico-8 外的命名调色板自动生成，只配套修正 `adjustments.palette.note`、`adjustments.paletteSize`；其他控件按真实文字解释，不扩修首页与全站翻译。

改稿前使用既有 readonly 服务账号实际读取 GSC，final/web 完整窗口 2026-09-12..2026-10-09，逐日返回 28 天；五个目标及一个关联规范页的 page/query+page 无 25000 行截断。B1 被归并到 sv 比较篇，目标 page/query 未返回；B2/B3/B4/B5 已收录且自身规范。B2 为 0 点击/2 曝光，B3 page/query 未返回，B4 为 0/20，B5 为 0/5。关联 sv 比较篇为 0/43，不冒充泰语流量。源请求、响应、抓取时间保存至 GSC_TH_BLOG_BASELINE_2026-10-12.json。

### 改稿前主题与查询映射

目标均为 `/th/blog/<slug>/`，窗口同上。泰语主词是保留原用途的内容定位，不是已验证当地搜索量。

| slug | 泰语主词 | 意图 | 返回 query 与限制 | 定位 |
|---|---|---|---|---|
| best-pixel-art-converters-compared-2025 | เครื่องมือพิกเซลอาร์ต | 按转换、绘制、动画选择工具 | 目标未返回；sv 关联查询不能归属 th | 保留选择工具，删虚构十款实测及评分 |
| how-to-get-pixel-art-version-of-image | ภาพถ่ายเป็นพิกเซลอาร์ตสไตล์ SNES | 静态图视觉风格、尺寸和限色 | query 未返回，目标 page 0/2 | 保留视觉风格，不冒充硬件模式 |
| make-image-more-like-pixel | ปรับภาพพิกเซลอาร์ต | 细线、颜色、dithering 和导出排错 | page/query 未返回，不补零 | 保留排错，删除恢复与选区能力 |
| export-from-illustrator-image-to-pixel-art | ส่งออก PNG จาก Illustrator | 源 PNG 尺寸和透明度 | export village，0/1；目标 page 0/20，不证明泰语需求 | 保留导出准备，分开 PPI 和像素尺寸 |
| how-to-pixelate-an-image | ทำภาพเป็นพิกเซลอาร์ต | 首次上传、调整和保存 | pixelate indie，0/2；目标 page 0/5，不证明泰语需求 | 保留入门，删除 Resize、图库和恢复承诺 |

### 修改与验收

五篇正文和展示字段完整改为泰语，保留原 slug、发布日期和数字键对象结构，updated 为 2026-10-12。完整 title（含品牌）依次 60/57/57/55/60 字符，摘要 134/130/128/129/113 字符。比较篇按四工具实际用途选择，不再声称十款实测、评分或不存在的隐私保证；SNES 篇明确仅视觉风格，检查轮廓、明暗和小尺寸辨识；排错篇解释细线、固定/生成调色板和同会话 dithering；Illustrator 篇区分像素尺寸、倍率与 PPI，并标明未进行 Illustrator 实机导出；入门篇删除 Resize、自动恢复和图库分享步骤。两张四行比较表、16 组泰语问答及结构化数据、15 幅真实案例和五张 1200×630 泰语分享图复用现有渲染器、生成器与资源，没有修改共享代码。

官方依据在本轮重新联网读取 Aseprite、Piskel、GIMP、Adobe 与向日葵原图作者/许可资料，正文保留直接链接及来源语言。不复用过期价格，不把本站 PNG 冒充竞品同图实验或 Illustrator 原生导出。真实下载按钮使用现有 `ดาวน์โหลดรูปภาพศิลปะพิกเซล`；两字段调色板说明修正后与教程相符。已有 contrast 标签误译为 `ตรงกันข้าม`，正文说明它指คอนทราสต์，不扩改第三个字段；Pixel size/Original size 等既有英文回退按真实按钮解释。全文自审核对了操作方向、固定与自动模式、否定条件、尺寸算例、批内链接用途和图注，不冒充独立母语审校。

隔离副本 `/tmp/pixelart-th-batch.0lQZZX/build/` 从干净 05178e4 生成，仅加入泰语改动和当时已有瑞典语成果，排除 AGENTS、工作区站图、其他 GSC 文档及并行越南语首页改动。验收期间另一任务提交瑞典语 `f3764cf2f9b51325edd2b709a0edd3b56f1641af`；该提交应用输入已包含在本副本，本轮未操作暂存、提交或远程。三个泰语应用/测试输入、两项瑞典语应用输入和五张泰语 PNG 与副本共十文件逐字节匹配，测试保留完整已提交瑞典语前缀，只新增泰语块。

Node 20.19.0、VITE_E2E=0、VITE_ENABLE_ANALYTICS=0 下，build（含 SEO、dist、缓存/重定向）、lint、typecheck、sitemap:verify 和 diff-check 通过；站图仍 205 项。少量定向检查后，最终相关 Chromium 106/106 通过，零重试、无跳过，约 3.7 分钟：泰语 50、瑞典语 50、三语言既有入口标签 6。泰语覆盖五篇初始 HTML/运行时、1440/390/320px、刷新、导航及语言切换、title/canonical/OG/Twitter/hreflang、16 组可见 FAQ 与 schema、真实图片及图例下载、五张分享图结果区域像素、Cookie 接受/拒绝持久化。

1440/390px 实际上传及下载验证尺寸 8/12、自动 24 色、固定 Sunset 8、同会话 dithering、细线 128×128/32×32 与透明 64×64 PNG，严格匹配当前预览和公开资源解码像素。另验证非法文件拒绝、10MiB+1 拒绝、恰好 10MiB 接受及大图等比例降至 2200×1100 后恢复。四种导出尺寸下表格线开/关与预览缩放真实文件验证通过：Pixel size 的 1×1 单元不画线，放大输出可包含线，Zoom 不改文件。两张公开限色 PNG 均为 24 个不透明 RGB 色；透明结果包含全透明、半透明、不透明像素。等待新预览的测试不等于修复立即下载旧结果的既有风险。

失败保留：首轮 3 项定向检查 2 通过、1 失败，原因是新测试链接正则仍残留 `/sv/`，页面真实链接为 `/th/`。仅修正新增泰语测试规则，未改业务或放宽同语言要求；随后针对链接假设的 3 项复测通过，再完成上述 106 项。原 focused-tests.log、focused-results/、focused-report/ 和 locale-recheck.log/results/report 均保留，最终证据为 final-tests.log、final-results/、final-report/。所有必要测试进程已结束。

已逐张查看五张分享 PNG，五篇 1440/320px 首屏上下文、320px 放大细线与尺寸图例，以及 390px 工具控件；文字和图片可读，无横向溢出断言通过。首屏截图独立滚回顶部，避免将固定导航在整页截图中的位置当作截字问题。预览 `http://localhost:4221/th/blog/` 返回 HTTP 200，独立 serve-dist PID 56279 保留；原阿语、瑞典语预览未操作。累计本地修复 30/91。泰语未提交、发布或请求 GSC 收录，未开始下一语言；未跑全站整套，母语审校、Illustrator 实机、Firefox/WebKit、实体手机及 Google 新版抓取/规范/搜索效果仍未验证。
