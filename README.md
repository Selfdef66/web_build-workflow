# 单片机开发工作流平台

一个用于管理单片机开发评审流程的静态网站，包含 MDR、PDR、HDR 等评审流程文档。

## 功能特性

- 📄 **Markdown 驱动** - 使用 Markdown 编写内容，便于版本管理
- 🌓 **主题切换** - 支持亮色/暗色主题，自动保存用户偏好
- 🔍 **全文搜索** - 快速检索所有评审文档
- 📑 **侧边目录** - 自动生成章节导航
- 📜 **版本历史** - 记录文档更新历程
- 📥 **PDF 导出** - 一键导出文档为 PDF
- 📱 **响应式设计** - 完美适配桌面、平板和手机

## 项目结构

```
workflow/
├── index.html              # 首页
├── pages/                  # 子页面
│   ├── mdr.html            # MDR 设计评审
│   ├── pdr.html            # PDR 原型评审
│   └── hdr.html            # HDR 硬件评审
├── assets/
│   ├── css/                # 样式文件
│   └── js/                 # JavaScript 文件
├── content/                # Markdown 内容
│   ├── mdr/
│   ├── pdr/
│   └── hdr/
├── config/                 # 配置文件
│   ├── navigation.json     # 导航配置
│   └── pages.json          # 页面元数据
├── data/                   # 数据文件
│   └── history.json        # 版本历史
└── 404.html                # 404 页面
```

## 本地开发

使用 VS Code Live Server 或任意静态服务器：

```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js
npx serve

# 或使用 VS Code Live Server 扩展
# 右键 index.html -> Open with Live Server
```

## 添加新页面

1. 在 `content/` 目录下创建新的 Markdown 文件
2. 在 `config/pages.json` 中添加页面配置
3. 在 `config/navigation.json` 中添加导航链接
4. 在 `pages/` 目录下创建对应的 HTML 文件
5. 在 `data/history.json` 中添加版本历史记录

## 更新内容

1. 编辑 `content/` 目录下的 Markdown 文件
2. 更新 `data/history.json` 中的版本历史
3. 更新 `config/pages.json` 中的 `lastUpdated` 字段

## 部署到 EdgeOne Pages

1. 登录 [EdgeOne Pages 控制台](https://edgeone.ai/document/177029)
2. 连接 Git 仓库
3. 选择构建配置（本项目无需构建）
4. 部署完成后获取访问域名

## 技术栈

| 技术 | 用途 |
|-----|-----|
| HTML5 | 页面结构 |
| CSS3 | 样式设计 |
| JavaScript | 交互逻辑 |
| marked.js | Markdown 解析 |
| Prism.js | 代码高亮 |
| Fuse.js | 搜索索引 |

## 许可证

MIT License