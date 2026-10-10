# Pixel Art Village 迭代记录

这个文件是 `pixel-art-v2` 的长期优化记录。
以后每次改 SEO、converter 页面、工具 UI、构建脚本、sitemap、Blog、外链或部署，都要在这里留下记录。

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
