\# 中华李氏字辈查询系统 · 功能简介



一句话：输入辈分用字，秒查四川各地李氏字辈与聚居地！



\## 能做什么

\- 精准查询 —— 按输入顺序完全匹配  

\- 模糊查询 —— 只要包含即可命中  

\- 高亮显示 —— 命中字辈自动标红，一目了然  

\- 来源标注 —— 结果注明出处，1=权威书籍，2=网络补充  



\## 数据优势

\- 源自私有典藏资料 + 公开网络，持续更新  

\- 通过 CDN 边缘加速，全国秒开  

\- AI 爬虫屏蔽，数据不泄露、不被训练  



\## 免费用法

1\. 在搜索框输入辈分汉字（先高辈后低辈，命中率更高）  

2\. 点击“精准”或“模糊”查询  

3\. 即刻查看聚居地、完整字辈与来源备注  



无需注册、不限次数 —— 欢迎广大宗亲、文史爱好者使用！



---



\## 技术升级：双线竞速（TiDB Serverless + 静态 JSON）

| 线路 | 优点 | 场景 |

| ---- | ---- | ---- |

| 静态 JSON | 零成本、无服务器 | 默认保底 |

| TiDB Serverless | 数据实时更新、支持更大体量 | 自动择优 |



首次查询会自动 ping 两条线路，\*\*谁快用谁\*\*，结果记入 localStorage，后续直达最快线路；任意线路失败自动回退并重新竞速。



\## 快速部署（仅需一次）

\### 1. TiDB 侧

\- 创建 Serverless 集群 → 数据库 `lishizibei` → 表 `zibeiyugaikuang` 导入数据。  

\- \*\*Security\*\* 设为 `Allow all IP` → 复制连接串备用。



\### 2. Cloudflare Pages 侧

\- 把本仓库推送到 GitHub → 在 \[Pages](https://pages.dev) 绑定仓库。  

\- \*\*Settings → Environment variables\*\* 新增 `DATABASE\_URL` = 上一步连接串 → Save and Deploy。  

\- 验证：

&nbsp; - `https://\&lt;your-domain\&gt;/api/ping` 返回 `{}`  

&nbsp; - `https://\&lt;your-domain\&gt;/api/query` 返回 JSON 数组即成功。



\### 3. 立即体验

手机/PC 打开 Pages 给的域名 → 输入辈分 → 查询速度\&lt;200 ms，线路自动最优。



\## 目录结构





\## 常见问题

\- \*\*Worker 500\*\* → 检查 `DATABASE\_URL` 是否正确、TiDB 白名单是否开启。  

\- \*\*查询慢\*\* → 在 TiDB 控制台给常用字段加二级索引，或改 SQL 分页。  

\- \*\*只想用静态线路\*\* → 直接删除 `functions/` 目录即可回到纯 JSON 模式（但将失去竞速与 TiDB 实时更新能力）。



\## License

MIT

