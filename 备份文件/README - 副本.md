📝 英语填字游戏 (秒开版)
一款基于纯前端技术（HTML5/CSS3/JavaScript）开发的现代英语填字游戏。本项目特点是秒开加载、离线运行，并配备了完整的音效、动画、多语言支持和统计系统。

License
Version

✨ 核心特性
🚀 秒开体验：使用预生成的题库数据，无需服务器计算，瞬间加载。
📱 响应式设计：完美适配桌面端、平板和移动端设备。
💾 自动保存：利用 LocalStorage 自动保存游戏进度，随时继续。
🎨 个性化设置：支持 深色模式、音效开关、动画开关及多种配色。
🌍 多语言支持：内置 中文 / English / 日本語 界面切换。
📊 数据统计：详尽的游戏统计（连胜、最佳时间、完成率）。
🎮 游戏体验：
3种难度级别 (简单/中等/困难)
智能输入导航 (自动跳过黑格、方向切换)
实时正确性检查
单词释义提示
📂 项目结构
text

📦 Crossword-Project
│
├── 📄 index.html              # 游戏主入口 (原 aa-秒开版.html)
├── 📄 README.md               # 项目说明文档
│
├── 📁 css/                    # 样式文件夹
│   ├── 📄 main.css            # 核心样式
│   ├── 📄 responsive.css      # 响应式适配
│   ├── 📄 animations.css      # 动画效果
│   └── 📄 dark-mode.css       # 深色模式主题
│
├── 📁 js/                     # 逻辑文件夹
│   ├── 📄 app.js              # 应用入口
│   ├── 📄 game.js             # 游戏核心逻辑
│   ├── 📄 audio.js            # 音效管理器
│   ├── 📄 animation.js        # 动画管理器
│   ├── 📄 storage.js          # 本地存储管理
│   ├── 📄 i18n.js             # 国际化(多语言)
│   ├── 📄 theme.js            # 主题管理
│   ├── 📄 settings.js         # 设置面板逻辑
│   └── 📄 statistics.js       # 统计面板逻辑
│
├── 📁 data/                   # 数据文件夹
│   └── 📄 puzzle_db_aa.js     # 预生成题库 (核心数据)
│
└── 📁 tools/                  # 开发工具
    ├── 📄 generate_db_aa.py   # Python 题库生成脚本
    └── 📄 words.txt           # 原始词库文件
🚀 快速开始
1. 玩家模式 (直接游玩)
由于是纯前端项目，您不需要安装 Node.js 或 Python 环境即可游玩。

下载本项目所有文件。
直接使用浏览器（Chrome, Edge, Safari 等）打开 index.html。
开始游戏！
2. 开发者模式 (修改与生成题库)
如果您想修改词库或重新生成谜题，需要 Python 环境。

环境要求：

Python 3.6+
操作步骤：

编辑词库：
打开 tools/words.txt，添加或删除单词（格式：一行一个单词，全大写）。

生成题库：
在终端/命令行中运行以下命令：

Bash

cd tools
python generate_db_aa.py
注意：脚本会自动读取 words.txt 并将生成的 puzzle_db_aa.js 输出到 data/ 目录（需根据脚本实际路径配置调整）。

刷新页面：
刷新浏览器中的 index.html，新生成的题目即可生效。

🛠️ 题库生成器说明
generate_db_aa.py 是项目的核心工具，负责将单词转化为填字游戏网格。

输入：words.txt
输出：puzzle_db_aa.js
生成逻辑：
简单 (Easy): 10x10 网格，约 5-7 个单词。
中等 (Medium): 13x13 网格，约 8-12 个单词。
困难 (Hard): 16x16 网格，约 13-18 个单词。
脚本会尝试生成 1000 个不同组合的谜题用于随机抽取。
🎮 操作指南
操作	方式
输入字母	键盘 A-Z
移动光标	方向键 / 点击格子
切换方向	空格键 / 点击当前格子
删除字母	Backspace / Delete
切换单词	Tab 键
查看提示	点击右侧列表或点击格子
⚙️ 浏览器兼容性
Browser	Supported
Chrome	✅ Yes
Firefox	✅ Yes
Safari	✅ Yes
Edge	✅ Yes
IE 11	❌ No
🤝 贡献与扩展
欢迎提交 Pull Request 或 Issue！

添加新语言：在 js/i18n.js 中添加新的语言包。
优化算法：改进 tools/generate_db_aa.py 中的交叉词生成算法。
扩充词库：向 tools/words.txt 添加更多常用英语单词。
📜 许可证
本项目采用 MIT License 开源许可证。您可以自由使用、修改和分发代码。