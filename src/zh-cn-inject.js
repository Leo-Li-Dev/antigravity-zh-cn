/**
 * Antigravity 2.0 Desktop Chinese Localization Engine (zh-CN)
 * ANTIGRAVITY_ZH_CN_PATCH v1.0.0
 *
 * Works both inside Electron preload.js (via webFrame / window context)
 * and via Chrome DevTools Protocol (Runtime.evaluate / Page.addScriptToEvaluateOnNewDocument).
 */
(function () {
  'use strict';

  const PATCH_VERSION = '1.0.3';
  const STORAGE_KEY = 'antigravity_zh_cn_enabled';

  // Avoid duplicate initialization in the same window context
  if (typeof window !== 'undefined' && window.__ANTIGRAVITY_ZH_CN_ACTIVE__ === PATCH_VERSION) {
    if (typeof window.__ANTIGRAVITY_ZH_CN_SCAN__ === 'function') {
      window.__ANTIGRAVITY_ZH_CN_SCAN__();
    }
    return;
  }

  // Exact match dictionary (English -> Simplified Chinese)
  const EXACT_MAP = {
    // === Left Sidebar & Main Navigation ===
    'Sidebar': '侧边栏',
    'Toggle Sidebar': '切换侧边栏',
    'Toggle sidebar': '切换侧边栏',
    'Close Sidebar': '关闭侧边栏',
    'New Conversation': '新建对话',
    'New conversation': '新建对话',
    'Conversation History': '对话历史',
    '对话历史记忆': '对话历史',
    'Scheduled Tasks': '计划任务',
    'Automations': '自动化任务',
    'Skills & Customizations': '技能与自定义',
    'Customizations & Skills': '自定义与技能',
    'Customizations': '自定义扩展',
    'Projects': '项目',
    'Workspaces': '工作区',
    'Conversations': '对话列表',
    'Pinned Conversations': '置顶对话',
    'Recent Conversations': '最近对话',
    'Settings': '设置',
    'Open IDE': '打开 IDE',
    'Open Antigravity IDE': '打开 Antigravity IDE',
    'Open in Antigravity IDE': '在 Antigravity IDE 中打开',
    'Open in Hub': '在主界面中打开',
    'Open in Cider': '在 Cider 中打开',
    'Open in Remote Control': '在远程控制中打开',
    'Outside of Project': '未归属项目',
    'Not in Project': '未在项目中',
    'No Project': '无项目',
    'Untitled Conversation': '未命名对话',
    'Untitled project': '未命名项目',
    'No conversations yet': '暂无对话',
    'No conversations found': '未找到对话',
    'No pinned conversations': '暂无置顶对话',
    'Create New Project': '创建新项目',
    'Create Project': '创建项目',
    'Create Cloud Project': '创建云端项目',
    'New Project': '新建项目',
    'New Workspace': '新建工作区',
    'Add Workspace': '添加工作区',
    'Open Workspace': '打开工作区',
    'Open Folder': '打开文件夹',
    'Open Folder (Interactive)': '打开文件夹（交互式）',
    'Select Workspace': '选择工作区',
    'Select workspace': '选择工作区',
    'Select Project': '选择项目',
    'Current workspace': '当前工作区',
    'All Workspaces': '所有工作区',
    'Available workspaces': '可用工作区',
    'No workspaces open.': '暂未打开工作区。',
    'No workspaces found': '未找到工作区',
    'Search Conversations': '搜索对话',
    'Search conversations...': '搜索对话...',
    'Search for conversations...': '搜索对话...',
    'Search conversations (by name or Cascade ID)': '搜索对话（按名称或 Cascade ID）',
    'Provide Feedback': '提供反馈',
    'Feedback': '反馈',
    'Send Feedback': '发送反馈',

    // === Display & Grouping Options ===
    'Display Options': '显示选项',
    'Group By': '分组方式',
    'Group By Workspace': '按工作区分组',
    'Group By Project': '按项目分组',
    'Sidebar grouped by workspace': '侧边栏已按工作区分组',
    'Sidebar grouped by project': '侧边栏已按项目分组',
    'Updated sidebar grouping': '已更新侧边栏分组方式',
    'Sort By': '排序方式',
    'Last Updated': '最后更新',
    'Last Used': '最近使用',
    'Last Prompt': '最后提问',
    'Custom Order': '自定义排序',
    'Filter': '筛选',
    'Only Unread': '仅看未读',
    'Archived': '已归档',
    'Archived Only': '仅看已归档',
    'Display': '显示项',
    'Subtitles': '副标题',
    'Decorations': '状态图标',
    'Workspace + Worktree': '工作区 + 工作树',
    'Project + Worktree': '项目 + 工作树',
    'Mark All as Read': '全部标为已读',
    'Mark as Read': '标为已读',
    'Mark as Unread': '标为未读',
    'Mark Read': '标为已读',
    'Mark Unread': '标为未读',
    'Mark This Conversation as Read': '将此对话标为已读',
    'Mark This Conversation as Unread': '将此对话标为未读',
    'Rename This Conversation': '重命名此对话',
    'Rename Conversation': '重命名对话',
    'Archive This Conversation': '归档此对话',
    'Archive Conversation': '归档对话',
    'Archive conversation': '归档对话',
    'Restore Conversation': '恢复对话',
    'Archive / Restore': '归档 / 恢复',
    'Pin This Conversation': '置顶此对话',
    'Pin conversation': '置顶对话',
    'Unpin This Conversation': '取消置顶此对话',
    'Unpin conversation': '取消置顶对话',
    'Delete Conversation': '删除对话',
    'Delete Permanently': '永久删除',
    'Permanently delete': '永久删除',
    'Move to Group': '移动到分组',
    'Move to New Group': '移动到新分组',
    'Remove from Group': '从分组中移除',
    'New Group': '新建分组',
    'Create Group': '创建分组',
    'Rename Group': '重命名分组',
    'Delete Group': '删除分组',
    'Group Actions': '分组操作',
    'Pinned Actions': '置顶操作',
    'Move Up': '上移',
    'Move Down': '下移',
    'Drop to add to group': '拖放至此以添加到分组',
    'Fork Conversation': '分支（Fork）对话',
    'Share Conversation (Preview)': '分享对话（预览版）',
    'Copy Conversation Markdown': '复制对话为 Markdown',
    'Copy Conversation ID': '复制对话 ID',
    'Copy Trajectory ID': '复制轨迹 ID',
    'Open Trajectory Debug View': '打开轨迹调试视图',
    'Trajectory Debug View': '轨迹调试视图',

    // === Top Bar & Window Navigation ===
    'Go Back': '后退',
    'Go Forward': '前进',
    'Back': '返回',
    'Forward': '前进',
    'Back to home': '返回首页',
    'Reload': '重新加载',
    'Reload app': '重新加载应用',
    'Reload Window': '重新加载窗口',
    'Reload this window.': '重新加载此窗口。',
    'Toggle Auxiliary Pane': '切换辅助面板',
    'Toggle Overview Panel': '切换概览面板',
    'Auxiliary Pane': '辅助面板',
    'Notifications': '通知',
    'Dismiss notification': '忽略通知',
    'More actions': '更多操作',
    'More Actions': '更多操作',
    'More options': '更多选项',
    'More info': '更多信息',
    'Learn more': '了解更多',
    'Learn more.': '了解更多。',
    'Update Available': '有可用更新',
    'Update Anyway': '立即更新',
    'Updating…': '正在更新…',
    'Check for Updates': '检查更新',

    // === Auxiliary Pane (Right Side Panel) ===
    'Overview': '概览',
    'Review': '审查',
    'Review Changes': '审查更改',
    'Files': '文件',
    'All Files': '全部文件',
    'Recent Files': '最近文件',
    'Recent files': '最近文件',
    'Modified Files': '已修改文件',
    'Files Changed': '已更改文件',
    'Agent Edits': '智能体编辑',
    'Staged Changes': '暂存的更改',
    'Branch Changes': '分支更改',
    'Changes': '更改',
    'Manifest Changes': '清单更改',
    'No file changes': '暂无文件更改',
    'No changes to review': '暂无需要审查的更改',
    'Terminal': '终端',
    'Terminals': '终端',
    'Standalone Terminals': '独立终端',
    'Standalone terminals': '独立终端',
    'Open Terminal': '打开终端',
    'New Terminal': '新建终端',
    'Add Terminal': '添加终端',
    'Split Terminal': '拆分终端',
    'Delete Terminal': '删除终端',
    'Close Terminal Tab': '关闭终端标签页',
    'New Terminal Tab': '新建终端标签页',
    'Terminal header': '终端标题栏',
    'Terminal input': '终端输入',
    'Connecting to terminal...': '正在连接终端...',
    'Creating terminal...': '正在创建终端...',
    'No active terminals': '暂无活动终端',
    'No active terminals. Click + to create one.': '暂无活动终端，点击 + 创建一个。',
    'Subagents': '子智能体',
    'No subagents': '暂无子智能体',
    'Stop Subagent': '停止子智能体',
    'Stop subagent': '停止子智能体',
    'Stop All Subagents': '停止所有子智能体',
    'Collapse subagents': '折叠子智能体',
    'Expand subagents': '展开子智能体',
    'View child subagents': '查看子智能体',
    'Background Tasks': '后台任务',
    'Background Task': '后台任务',
    'Background task': '后台任务',
    'Background Task Output': '后台任务输出',
    'No background tasks': '暂无后台任务',
    'Cancel Task': '取消任务',
    'Cancel task': '取消任务',
    'Cancel All Tasks': '取消所有任务',
    'Stop Task': '停止任务',
    'Task Logs': '任务日志',
    'Goals': '目标',
    'Goal': '目标',
    'Documents': '文档',
    'No documents': '暂无文档',
    'What counts as a document': '什么是文档',
    'Artifacts': '产物 (Artifacts)',
    'No artifacts generated': '暂未生成产物',
    'Export Artifact': '导出产物',
    'Export artifact': '导出产物',
    'Export as PDF': '导出为 PDF',
    'Artifact Name': '产物名称',
    'Artifact updated by agent': '智能体已更新产物',
    'Dismiss artifact update notice': '关闭产物更新提示',
    'Links': '链接',
    'No links': '暂无链接',
    'Uploads': '上传文件',
    'No uploads': '暂无上传文件',
    'Customize Sections': '自定义显示模块',
    'Accumulated State': '累计状态',
    'Open Preview': '打开预览',
    'Open in Preview': '在预览中打开',
    'Open in preview': '在预览中打开',
    'Open in Preview Pane': '在预览面板中打开',
    'Open in Preview Tab': '在预览标签页中打开',
    'Open preview in embedded pane': '在内嵌面板中打开预览',
    'Open in Built-in Browser': '在内置浏览器中打开',
    'Open with External Browser': '使用外部浏览器打开',
    'Open in external browser': '在外部浏览器中打开',
    'Open System Browser': '打开系统浏览器',
    'Open in new tab': '在新标签页中打开',
    'Open in new window': '在新窗口中打开',
    'Open in Tab': '在标签页中打开',
    'Open side-by-side view': '打开并排视图',
    'Web Preview': '网页预览',
    'Embedded web preview': '内嵌网页预览',
    'Preview': '预览',
    'Preview unavailable': '预览不可用',
    'Full View': '完整视图',
    'Custom View': '自定义视图',
    'File Explorer': '文件资源管理器',
    'File explorer': '文件资源管理器',
    'Collapse All': '全部折叠',
    'Expand All': '全部展开',
    'Collapse All Folders': '折叠所有文件夹',
    'Expand All Folders': '展开所有文件夹',
    'View Stacked Diff': '查看堆叠差异 (Stacked Diff)',
    'View Split Diff': '查看并排差异 (Split Diff)',
    'Show Whitespace Changes': '显示空白字符更改',
    'Hide Whitespace Changes': '隐藏空白字符更改',
    'Collapse Diffs': '折叠差异',
    'Expand Diffs': '展开差异',
    'Viewing Diff': '正在查看差异',
    'View Diff': '查看差异',
    'Open Diff': '打开差异对比',
    'View File': '查看文件',
    'Open File': '打开文件',
    'Empty directory': '空目录',
    'Empty log': '空日志',
    'No files or folders found': '未找到文件或文件夹',
    'File not found': '未找到文件',

    // === Chat Canvas & Input Box ===
    'Ask anything, @ to mention, / for actions': '输入任何问题，输入 @ 引用上下文，输入 / 调用指令',
    'Ask a quick question without interrupting the main conversation.': '快速提问（不中断当前主对话）。',
    'Message subagent, @ to mention': '向子智能体发送消息，输入 @ 引用上下文',
    'Message input': '消息输入框',
    'Add context': '添加上下文',
    'Add Context': '添加上下文',
    'Record voice memo': '录制语音备忘',
    'Record Audio': '录制音频',
    'Start Voice Recording': '开始语音录制',
    'Stop Voice Recording': '停止语音录制',
    'Toggle Voice Recording': '切换语音录制',
    'Stop recording': '停止录制',
    'Stop Recording and Send': '停止录制并发送',
    'Cancel recording': '取消录制',
    'Finalizing transcription...': '正在完成语音转写...',
    'Sending transcribed message...': '正在发送转写消息...',
    'Send message': '发送消息',
    'Send immediately': '立即发送',
    'Send Now': '立即发送',
    'Queue message': '加入发送队列',
    'Queued messages': '排队中的消息',
    'Queued Messages': '排队消息',
    'Sends after agent finishes working': '将在智能体完成当前工作后发送',
    'Collapse queued messages': '折叠排队消息',
    'Expand queued messages': '展开排队消息',
    'Cancel Sending Message': '取消发送消息',
    'Stop': '停止',
    'Stop execution': '停止执行',
    'Stop Execution': '停止执行',
    'Continue Response': '继续生成回复',
    'Scroll to Bottom': '滚动到底部',
    'Conversation Log': '对话记录',
    'No more older messages': '没有更多历史消息了',
    'Load older messages': '加载更早的消息',
    'User message': '用户消息',
    'Agent response': '智能体回复',
    'Good response': '回答得好',
    'Bad response': '回答不佳',
    'Good Response': '回答得好',
    'Bad Response': '回答不佳',
    'Undo to this point': '撤销到此步',
    'Undo To Here': '撤销到此处',
    'Confirm Undo': '确认撤销',
    'Revert file changes': '还原文件更改',
    'Only the conversation will be rewound; your files will be left as-is.': '仅回退对话进度，您的文件将保持原样。',
    'Undo restores your entire workspace to its state at this point.': '撤销将把整个工作区恢复到此时间点的状态。',
    'This undo action will not make any code changes.': '此撤销操作不会修改任何代码。',
    'The conversation was compacted to fit within the context window.': '对话已压缩以适应上下文窗口限制。',
    'The conversation was compacted while generating this response.': '生成此回复期间对话已进行上下文压缩。',
    'Waiting for user input': '等待用户输入',
    'Waiting for your input': '等待您的输入',
    'Input required': '需要输入',
    'Action required': '需要操作',
    'Action Required': '需要操作',
    'Needs attention': '需要关注',
    'Blocked, needs input': '已阻塞，需要输入',
    'Thinking': '思考中',
    'Thinking...': '思考中...',
    'Thought Process': '思考过程',
    'Sources': '参考来源',
    'Click to learn more about sources': '点击了解有关参考来源的更多信息',
    'Proceed with Plan': '按计划继续执行',
    'Proceed Anyway': '仍然继续',
    'Accept Step': '接受此步',
    'Reject Step': '拒绝此步',
    'Cancel Step': '取消此步',
    'Cancel step': '取消此步',
    'Confirmation required to execute this step': '执行此步骤需要您的确认',
    'Requires manual confirmation.': '需要手动确认。',
    'This command ran in the sandbox.': '此命令已在沙盒中运行。',
    'Run (unsandboxed)': '运行（非沙盒）',
    'Select an option...': '请选择一个选项...',
    'Select an option': '请选择一个选项',
    'Other (write your answer)': '其他（自行输入回答）',
    'Multi-select': '多选',
    'Previous question': '上一题',
    'Next question': '下一题',
    'Cancel questionnaire': '取消问卷',
    'Cancel questionnaire and stop the agent': '取消问卷并停止智能体',

    // === Tool Step Prefixes & Statuses ===
    'Analyzed': '已分析',
    'Analyzing': '正在分析',
    'Edited': '已编辑',
    'Editing': '正在编辑',
    'Created': '已创建',
    'Viewed': '已查看',
    'Viewing': '正在查看',
    'Searched': '已搜索',
    'Ran': '已运行',
    'Typeahead menu': '自动补全菜单',
    'Analyzing content': '正在分析内容',
    'Analyzed content': '已分析内容',
    'Analyzing Task Log': '正在分析任务日志',
    'Analyzed Task Log': '已分析任务日志',
    'Checking command status': '正在检查命令状态',
    'Checked command status': '已检查命令状态',
    'Running command': '正在运行命令',
    'Ran command': '已运行命令',
    'Searched files': '已搜索文件',
    'Searched for files': '已查找文件',
    'Semantic searching': '正在语义搜索',
    'Semantic searched': '已完成语义搜索',
    'Code search': '代码搜索',
    'Code Search': '代码搜索',
    'Internal search': '内部搜索',
    'Browser task': '浏览器任务',
    'Opened browser': '已打开浏览器',
    'Read URL': '已读取 URL',
    'Reading page': '正在读取页面',
    'Read page': '已读取页面',
    'Created outline': '已生成大纲',
    'Searched web': '已搜索网页',
    'Invoked subagent': '已调用子智能体',
    'Git commit': 'Git 提交',
    'Used MCP tool': '已使用 MCP 工具',
    'Generated image': '已生成图片',
    'Generated media': '已生成媒体文件',
    'Used tool': '已使用工具',
    'Tool arguments': '工具参数',
    'Tool Output': '工具输出',
    'Tool Calls': '工具调用',
    'Copy command': '复制命令',
    'Copy Command': '复制命令',
    'Click to copy full command': '点击复制完整命令',
    'Copy output': '复制输出',
    'Copy thinking': '复制思考过程',
    'Copy code': '复制代码',
    'Copy as Markdown': '复制为 Markdown',
    'Copy Path': '复制路径',
    'Copy path': '复制路径',
    'Copy File Path': '复制文件路径',
    'Copy File Name': '复制文件名',
    'Copy Content': '复制内容',
    'Copy Link': '复制链接',
    'Copy link': '复制链接',
    'Copy Image': '复制图片',
    'Copy image': '复制图片',
    'Copy to clipboard': '复制到剪贴板',
    'Copied to clipboard': '已复制到剪贴板',
    'Copied!': '已复制！',
    'Path copied!': '路径已复制！',
    'Link copied to clipboard.': '链接已复制到剪贴板。',
    'Show more': '展开更多',
    'Show less': '收起',
    'See more': '查看更多',
    'See less': '收起',
    'See all': '查看全部',
    'See more results': '查看更多结果',
    'Working directory:': '工作目录：',
    'Working Directory:': '工作目录：',
    'Full output written to': '完整输出已写入',

    // === Model Selector & Permission Presets ===
    'Select Model': '选择模型',
    'Select a model to send message': '请选择模型以发送消息',
    'Select Model to Send Message': '请选择模型以发送消息',
    'No Model Selected': '未选择模型',
    'No Models Available': '暂无可用模型',
    'No models available': '暂无可用模型',
    'Loading models...': '正在加载模型...',
    'Error Loading Models': '加载模型出错',
    'Edit Model': '编辑模型',
    'Add Model': '添加模型',
    'Add Custom Model': '添加自定义模型',
    'Edit Custom Model': '编辑自定义模型',
    'High': '高 (High)',
    'Medium': '中 (Medium)',
    'Low': '低 (Low)',
    'Fast': '快速 (Fast)',
    'Slow': '慢速 (Slow)',
    'Turbo': '极速 (Turbo)',
    'Turbo mode': '极速模式 (Turbo)',
    'Default': '默认',
    'Full machine': '整机访问',
    'Machine': '整机',
    'Custom': '自定义',
    'Inherit Global': '继承全局设置',
    'Use Global Settings': '使用全局设置',
    'Autonomous Mode': '自主模式 (Autonomous)',
    'Autonomous mode': '自主模式',
    'Best of N': '择优模式 (Best of N)',
    'Number of responses': '生成回复数量',
    'Disables all safety barriers for maximal iteration velocity.': '关闭所有安全拦截，以获得最快的迭代速度。',
    'A high-risk mode that disables all safety barriers. The agent operates with full system access, auto-executes all terminal commands, and reads or writes to all local files without review prompts.': '关闭所有安全护栏的高风险模式。智能体拥有完整的系统访问权限，会自动执行所有终端命令，并直接读写本地文件而无需人工确认。',
    'Requires manual review for all terminal commands and file accesses outside of the working folders.': '所有终端命令以及工作目录以外的文件访问均需人工审查确认。',
    'Useful for typical development with an emphasis on security. It prioritizes safety over speed by requiring manual approval for all terminal commands and files outside the project directory.': '适用于注重安全性的日常开发。所有终端命令及项目目录外的文件操作均需手动批准，安全优先于速度。',
    'All terminal commands require review. The agent can read or write to any file in the machine.': '所有终端命令均需人工确认，但智能体可以读写计算机上的任意文件。',
    'Useful for tasks that require file access across your full machine. The agent has full read and write access to all local files, but all proposed terminal commands require manual review and approval before running.': '适用于需要跨全盘访问文件的任务。智能体拥有所有本地文件的读写权限，但所有终端命令在运行前仍需手动审查批准。',
    'Every command requires approval.': '每条命令均需人工批准。',
    'Ask before sensitive operations.': '在执行敏感操作前询问。',
    'Automatically decide if commands run.': '自动判断命令是否可以直接运行。',
    'Run all commands without restrictions.': '无限制运行所有命令。',
    'Working': '运行中',
    'Working...': '运行中...',
    'Working…': '运行中…',

    // === Settings Categories & Screens ===
    'General': '常规',
    'Appearance': '外观',
    'App': '应用',
    'Application': '应用程序',
    'Account': '账户',
    'Accounts': '账户',
    'Signed-in accounts': '已登录账户',
    'Editor': '编辑器',
    'Editor Settings': '编辑器设置',
    'Open Editor Settings': '打开编辑器设置',
    'Tab': 'Tab 补全',
    'Permissions': '权限',
    'Global Permissions': '全局权限',
    'Local Permissions': '本地权限',
    'Permission Settings': '权限设置',
    'Permission Details': '权限详情',
    'Permission Preset': '权限预设',
    'Security Preset': '安全预设',
    'Agent Settings': '智能体设置',
    'Agent Behavior': '智能体行为',
    'Agent security mode': '智能体安全模式',
    'Terminal & Tooling Permissions': '终端与工具权限',
    'Tool Permissions': '工具权限',
    'File Permissions': '文件权限',
    'Network Permissions': '网络权限',
    'Browser': '浏览器',
    'Workspace Creation': '工作区创建',
    'Labs': '实验室 (Labs)',
    'Advanced': '高级',
    'Advanced Settings': '高级设置',
    'Models & Usage': '模型与用量',
    'Models': '模型与用量',
    'Manage your model quota and credits.': '管理您的模型配额与 AI 额度。',
    'Refresh quota and credits data': '刷新配额与额度数据',
    'Model Quota': '模型配额',
    'No quota information available.': '暂无配额信息。',
    'Refreshing...': '正在刷新...',
    'Plan': '订阅方案',
    'Your Plan:': '当前方案：',
    'Your Plan: Google AI Ultra': '当前方案：Google AI Ultra',
    'Your Plan: Google AI Pro': '当前方案：Google AI Pro',
    'Your Plan: Antigravity': '当前方案：Antigravity',
    'You can upgrade to a higher Google AI Ultra plan to receive the highest rate limits.': '您可以升级到更高级别的 Google AI Ultra 订阅方案，以获得最高的速率限制。',
    'You can upgrade to a Google AI Pro or Ultra plan to receive higher rate limits.': '您可以升级到 Google AI Pro 或 Ultra 订阅方案，以获得更高的速率限制。',
    'Upgrade to get 1,500 requests per day with Agent Mode and Gemini CLI, access to Gemini in Google Cloud, plus $1,000 in Google Cloud credits': '升级即可享受智能体模式与 Gemini CLI 每日 1,500 次请求额度、Google Cloud 中的 Gemini 访问权限，以及 $1,000 Google Cloud 赠金',
    'Gemini-powered code suggestions and chat in multiple IDEs': '在多种 IDE 中提供由 Gemini 驱动的代码建议与对话功能',
    'Unlimited coding assistant with the most powerful Gemini models': '搭载最强大 Gemini 模型的无限量编程助手',
    'Upgrade': '升级',
    'Manage': '管理',
    'Model Credits': '模型额度 (Credits)',
    'Enable AI Credit Overages': '启用 AI 额度超额抵扣',
    'When toggled on, Antigravity will use your AI credits to fulfill model requests once you\'re out of model quota. Antigravity will always use your model quota first before using AI credits.': '开启后，当您的模型配额用尽时，Antigravity 将使用您的 AI 额度来响应模型请求。在使用 AI 额度之前，Antigravity 会始终优先使用您的模型配额。',
    'See Activity': '查看使用记录',
    'Get More AI Credits': '获取更多 AI 额度',
    'For Antigravity Business consumption options, see': '有关 Antigravity 商业版用量选项，请参阅',
    'documentation': '说明文档',
    'Gemini Models': 'Gemini 模型',
    'Claude and GPT models': 'Claude 与 GPT 模型',
    'Claude and GPT Models': 'Claude 与 GPT 模型',
    'Other Models': '其他模型',
    'Other models': '其他模型',
    'Models within this group: Gemini Flash, Gemini Pro': '此分组包含的模型：Gemini Flash、Gemini Pro',
    'Models within this group: Claude Opus, Claude Sonnet, GPT-OSS': '此分组包含的模型：Claude Opus、Claude Sonnet、GPT-OSS',
    'Within each group, models share a weekly limit and a 5-hour limit. Quota is consumed proportionally to the cost of the tokens. Thus, limits will last longer with shorter tasks or using more cost-effective models. The 5-hour limit smooths out aggregate demand to fairly distribute global capacity across all users, while your weekly limit is tied directly to your individual tier.': '在每个分组内，各模型共享每周配额与 5 小时配额。配额消耗量与 Token 成本成正比，因此处理简短任务或使用高性价比模型时配额更耐用。5 小时配额用于平滑整体请求峰值以公平分配全局算力，而每周配额则直接取决于您的个人订阅等级。',
    'Weekly Limit Remaining': '本周剩余配额',
    'Five Hour Limit Remaining': '5 小时剩余配额',
    '5-Hour Limit Remaining': '5 小时剩余配额',
    '5 Hour Limit Remaining': '5 小时剩余配额',
    'Daily Limit Remaining': '今日剩余配额',
    'Monthly Limit Remaining': '本月剩余配额',
    'Rate Limit Remaining': '剩余速率配额',
    'Resets in <1m': '将在 1 分钟内重置',
    'Quota': '配额',
    'Usage': '使用情况',
    'Token Usage': 'Token 用量',
    'Loading token usage...': '正在加载 Token 用量...',
    'No token data available.': '暂无 Token 用量数据。',
    'There are no customizations enabled.': '当前未启用任何自定义扩展。',
    'The breakdown below shows token usage from customizations like rules, skills, and MCP. If a budget is exceeded, large rules are demoted to path pointers and large customizations are excluded automatically.': '下方明细展示了规则、技能与 MCP 等自定义扩展的 Token 占用情况。若超出预算，较大的规则将自动降级为路径指针，较大的自定义扩展将被自动排除。',
    'Customization token budget exceeded. Large customizations are excluded from context.': '自定义扩展 Token 预算已超限，较大的扩展已从上下文中排除。',
    'Rules and customization token budgets exceeded. Large rules are demoted to path pointers and large customizations are excluded from context.': '规则与自定义扩展 Token 预算均已超限，较大的规则已降级为路径指针，较大的扩展已从上下文中排除。',
    'Rules token budget exceeded. Large rules are demoted to path pointers.': '规则 Token 预算已超限，较大的规则已降级为路径指针。',
    'Context usage': '上下文占用',
    'Shortcuts': '快捷键',
    'Keyboard shortcuts': '键盘快捷键',
    'Keyboard shortcuts for quick navigation and control.': '用于快速导航和操作的键盘快捷键。',
    'Navigation': '导航',
    'Previous Pane Tab': '上一个面板标签页',
    'Next Pane Tab': '下一个面板标签页',
    'Open Keyboard Shortcuts': '打开键盘快捷键',
    'Notifications': '通知',
    'Notification Settings': '通知设置',
    'Notification Preferences': '通知偏好设置',
    'Volume': '音量',
    'Remote Control': '远程控制',
    'These settings can only be changed on the computer running the app, not from a remote session.': '这些设置只能在运行本应用的本地电脑上修改，无法在远程控制会话中更改。',
    'Show Remote Control QR code': '显示远程控制二维码',
    'A label for this computer when you connect from another device. Changing it reconnects.': '从其他设备连接时用于识别此电脑的名称，修改后将重新连接。',
    'Enter device name...': '输入设备名称...',
    'Remote Control link': '远程控制链接',
    'Copy link': '复制链接',
    'Windows Subsystem for Linux': '适用于 Linux 的 Windows 子系统 (WSL)',
    'Run the app against a Linux environment. Connecting relaunches the app into the selected WSL distro.': '在 Linux 环境中运行应用。连接后将重启应用并进入所选的 WSL 发行版。',
    'Local Windows environment': '本地 Windows 环境',
    'The app is currently connected to a WSL distro. Reopening locally relaunches it directly on Windows.': '当前已连接到 WSL 发行版。选择在本地重新打开将直接重启进入 Windows 环境。',
    'Marketing Emails': '产品动态邮件',
    'Receive product updates, tips, and promotions from Google Antigravity via email.': '通过电子邮件接收来自 Google Antigravity 的产品更新、使用技巧与活动资讯。',
    'Telemetry': '遥测与使用数据',
    'When toggled on, Antigravity collects usage data to help Google enhance performance and features.': '开启后，Antigravity 会收集使用数据以帮助 Google 改进产品性能与功能。',
    'Sign Out': '退出登录',
    'Signing Out...': '正在退出登录...',
    'Sign In': '登录',
    'Not Signed In': '未登录',
    'Terms of Service': '服务条款',
    'By using this app, you agree to its': '使用本应用即表示您同意其',
    'Provide Feedback': '提供反馈',
    'Configure tab completion, suggestions, and navigation behavior.': '配置 Tab 自动补全、代码建议与光标导航行为。',
    'To modify editor settings, open Settings within the editor window.': '若要修改编辑器详细设置，请在编辑器窗口内打开设置。',
    'Configure default behaviors, skills, and MCP servers.': '配置默认行为、技能 (Skills) 与 MCP 服务器。',
    'When enabled, the agent will include default customizations, including default skills.': '启用后，智能体将自动加载内置的默认自定义扩展与技能。',
    'Browse and enable plugins from the Build With Google catalog.': '浏览并启用 Build With Google 目录中的插件。',
    'Configure hooks that run on agent lifecycle events.': '配置在智能体生命周期事件触发时自动执行的钩子 (Hooks)。',
    'Try out early-stage features before they ship. These may be changed or removed at any time. These features are experimental, and we make no guarantees about performance or functionality.': '抢先体验尚在研发阶段的实验性功能。这些功能随时可能变更或移除，我们不对实验性功能的性能或稳定性作任何保证。',
    'Configure agent execution, queued message delivery, and permissions.': '配置智能体执行方式、队列消息发送策略以及安全权限。',
    'Inherits your Global Permissions when working in this project.': '在此项目中工作时继承您的全局权限设置。',
    'Manually customize individual settings.': '手动自定义各项权限设置。',
    'Danger Zone': '危险区域',
    'Version Info': '版本信息',
    'Version': '版本',
    'App version': '应用版本',
    'Close Settings': '关闭设置',

    // === Individual Settings Labels & Options ===
    'Strict Mode': '严格模式 (Strict Mode)',
    'Full access': '完全访问 (Full access)',
    'Agents have full access to your machine and external resources.': '智能体拥有对您计算机和外部资源的完全访问权限。',
    'Sandboxed': '沙盒隔离 (Sandboxed)',
    'Agents run in a secure sandbox that restricts access to external resources outside of your trusted folders.': '智能体在安全沙盒中运行，限制访问受信任文件夹以外的外部资源。',
    'Strict': '严格受限 (Strict)',
    'Terminal commands always require review and the agent cannot access files outside of its given workspaces.': '终端命令始终需要审查批准，且智能体无法访问指定工作区以外的文件。',
    'File Access': '文件访问',
    'Agent Non-Workspace File Access': '智能体非工作区文件访问',
    'Allows the agent to access files outside of your current workspace.': '允许智能体访问当前工作区以外的文件。',
    'Allow the agent to automatically view and edit files outside the current workspace. Use with caution: this gives the agent access to additional potentially-relevant information, but also allows the agent to access credential files, secrets, and other sensitive data on your system.': '允许智能体自动查看和编辑当前工作区以外的文件。请谨慎使用：这会让智能体获取更多上下文信息，但也可能访问系统上的凭据、密钥或其他敏感数据。',
    'Outside of folders file access policy': '工作目录外文件访问策略',
    'Configures how the agent tries to access files outside of its working folders.': '配置智能体访问工作目录以外文件时的处理策略。',
    'Terminal Command Auto Execution': '终端命令自动执行策略',
    'Controls whether terminal commands require your approval before running.': '控制终端命令在运行前是否需要您的批准。',
    'Always Proceed': '始终自动执行',
    'Request Review': '请求人工审查',
    'Require Review': '需要人工审查',
    'Proceed in Sandbox': '在沙盒中自动执行',
    'Auto': '自动 (Auto)',
    'Auto (Preview)': '自动（预览版）',
    'Vetted (Preview)': '安全白名单（预览版）',
    'Always Allow': '始终允许',
    'Allow Once': '允许一次',
    'Allow once': '允许一次',
    'Always run': '始终运行',
    'Ask first': '先询问我',
    'Always Ask': '始终询问',
    'Allow': '允许',
    'Deny': '拒绝',
    'Enabled': '已启用',
    'Disabled': '已禁用',
    'Enable Terminal Sandbox': '启用终端沙盒',
    'Enable Sandbox Mode': '启用沙盒模式',
    'Enable Sandbox Mode (Preview)': '启用沙盒模式（预览版）',
    'Run terminal commands with sandbox restrictions.': '在沙盒限制下运行终端命令。',
    'Restricts agent tools to a secure, isolated local sandbox.': '将智能体工具限制在安全、隔离的本地沙盒中运行。',
    'Sandbox Allow Network': '允许沙盒访问网络',
    'Allow sandboxed commands to make network requests.': '允许沙盒内的命令发起网络请求。',
    'When enabled, sandboxed commands are allowed to make network requests.': '启用后，沙盒中运行的命令将被允许发起网络请求。',
    'Enable Shell Integration': '启用 Shell 集成',
    'When enabled, Agent will use IDE\'s shell integration to detect and report terminal command execution.': '启用后，智能体将使用 Shell 集成来检测和报告终端命令执行情况。',
    'Command Setup Script': '命令前置初始化脚本',
    'A shell setup script run before every command the agent executes.': '在智能体执行每条命令之前运行的 Shell 初始化脚本。',
    'Review Policy': '产物审查策略',
    'Plan Review Policy': '计划审查策略',
    'Artifact Review Policy': '产物审查策略',
    'Specifies the agent\'s behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.': '指定智能体在请求您审查产物文档（如方案计划、报告等）时的行为。',
    'Whether the agent asks you to review its documents.': '控制智能体是否请求您审查其生成的文档。',
    'Enable Sounds for Agent': '启用智能体提示音',
    'Play a sound when the agent finishes generating a response.': '当智能体完成生成回复时播放提示音。',
    'When enabled, Antigravity will play a sound when Agent finishes generating a response.': '启用后，当智能体完成回复时将播放提示音。',
    'Sound': '声音',
    'Chime volume': '提示音音量',
    'Set the volume of agent sounds.': '设置智能体提示音的音量。',
    'Enable Notifications for Agent': '启用智能体系统通知',
    'Enable Notifications': '启用通知',
    'Show browser notifications when your action is needed or execution finishes.': '当需要您的操作或任务执行完成时显示系统通知。',
    'Manage your notification preferences.': '管理您的通知偏好设置。',
    'To modify notification settings, open your operating system\'s system preferences.': '若要修改通知权限设置，请打开操作系统的“系统设置”。',
    'Open System Preferences': '打开系统设置',
    'Open Preferences': '打开偏好设置',
    'Auto-Expand Changes Overview': '自动展开更改概览',
    'Automatically expand the Changes Overview toolbar when the agent finishes generating a response.': '当智能体完成回复时自动展开更改概览工具栏。',
    'Let the agent access past conversations to inform its responses.': '允许智能体参考历史对话内容以提供更准确的回复。',
    'When enabled, the agent will be able to access past conversations to inform its responses.': '启用后，智能体可以访问过去的对话记录以辅助当前回答。',
    'Auto-Open Edited Files': '自动打开已编辑文件',
    'Open files in the background if the agent creates or edits them': '当智能体创建或编辑文件时在后台自动打开',
    'Open files in the background if Agent creates or edits them': '当智能体创建或编辑文件时在后台自动打开',
    'Open Agent on Reload': '重新加载时打开智能体面板',
    'Open the agent panel on window reload': '窗口重新加载时自动打开智能体面板',
    'Agent Auto-Fix Lints': '智能体自动修复 Lint 错误',
    'When enabled, Agent is given awareness of lint errors created by its edits and may fix them without explicit user prompting.': '启用后，智能体会感知其编辑产生的代码检查（Lint）错误并自动尝试修复。',
    'Explain and Fix in Current Conversation': '在当前对话中解释并修复',
    'Continue "Explain and Fix" actions in the current conversation instead of starting a new one.': '在当前对话中继续执行“解释并修复”操作，而不是新建对话。',
    'Inline Actions': '内联快捷操作 (Inline Actions)',
    'Show a floating notification card when background conversations need your input. Answer questions, approve commands, and grant permissions without leaving your current conversation. Share feedback at go/inline-actions-feedback.': '当后台对话需要您的输入时显示悬浮通知卡片，无需离开当前对话即可回答问题、批准命令或授予权限。',
    'Adds an Autonomous Mode switch to the modes dropdown below the input box. Turns sent with it on run non-interactively: the agent does not ask questions or request new permissions.': '在输入框下方的模式菜单中添加“自主模式”开关。开启后发送的对话将以非交互方式运行：智能体不会中途提问或请求新权限。',
    'Verbose Agent Chat': '显示详细思考过程',
    'Display and preserve intermediate thinking steps.': '显示并保留智能体的中间思考步骤。',
    'Custom Context Menus': '自定义右键菜单',
    'Replace the default browser right-click menu with quick actions.': '使用快捷操作菜单替换默认的浏览器右键菜单。',
    'Conversation Width': '对话面板宽度',
    'Configure the maximum width of the conversation panel.': '配置对话面板的最大显示宽度。',
    'Markdown Artifact Width': 'Markdown 产物宽度',
    'Configure the default width of markdown artifacts.': '配置 Markdown 产物文档的默认显示宽度。',
    'Narrow': '窄 (Narrow)',
    'Wide': '宽 (Wide)',
    'Fill': '铺满 (Fill)',
    'Light Theme': '浅色主题',
    'Dark Theme': '深色主题',
    'Light Mode': '浅色模式',
    'Dark Mode': '深色模式',
    'Switch to Light Mode': '切换到浅色模式',
    'Switch to Dark Mode': '切换到深色模式',
    'Toggle Between Light/Dark Themes': '切换浅色/深色主题',
    'Select Theme': '选择主题',
    'Configure the agent\'s visual theme and display preferences.': '配置智能体的视觉主题与显示偏好。',
    'Prevent Sleep': '防止系统休眠',
    'Prevent the computer from sleeping while the app is running.': '在应用运行期间防止电脑进入休眠状态。',
    'Keep In Menu Bar': '保持在菜单栏运行',
    'Keep the app accessible from the menu bar and running in the background when all windows are closed.': '关闭所有窗口后仍在后台保持运行，并可通过顶部菜单栏图标随时打开。',
    'Automatic Check for Updates': '自动检查更新',
    'Automatically prompt you to restart the app when a new update is available. When disabled, you can check for updates manually from the app menu.': '当有新版本可用时自动提示重启更新。禁用后，您仍可从应用菜单中手动检查更新。',
    'Enable Browser Tools': '启用浏览器工具',
    'Browser Javascript Execution Policy': '浏览器 JavaScript 执行策略',
    'Controls whether the agent can run custom JavaScript to automate complex browser actions.': '控制智能体是否可以在浏览器中运行自定义 JavaScript 以自动化复杂网页操作。',
    'Block all browser JavaScript execution.': '阻止所有浏览器 JavaScript 执行。',
    'Prompt for approval before running browser scripts.': '在运行浏览器脚本前提示需要批准。',
    'Allow full browser script execution without prompting.': '允许直接执行浏览器脚本而无需提示。',
    'Chrome Binary Path': 'Chrome 可执行文件路径',
    'Path to the Chrome/Chromium executable. Leave empty for auto-detection.': 'Chrome/Chromium 可执行文件的路径，留空则自动检测。',
    'Browser User Profile Path': '浏览器用户配置路径',
    'Custom path for the browser user profile directory. Leave empty for default (~/.gemini/antigravity-browser-profile).': '自定义浏览器用户数据目录路径，留空则使用默认路径（~/.gemini/antigravity-browser-profile）。',
    'Browser CDP Port': '浏览器 CDP 调试端口',
    'Port number for Chrome DevTools Protocol remote debugging. Leave empty for default (9222).': 'Chrome DevTools 协议远程调试端口号，留空则使用默认值（9222）。',
    'Enable Remote Control': '启用远程控制',
    'Manage your conversations from the companion website.': '通过配套网页端远程管理您的本地对话。',
    'Work with local agents from another device.': '从其他设备连接并使用本地智能体。',
    'Nickname': '设备昵称',
    'Device Name': '设备名称',
    'A nickname for identifying this application in the companion website. Changing this will restart the connection.': '用于在配套网页端识别此设备的昵称，修改后将重启连接。',
    'Show Selection Actions': '显示选中文本快捷操作',
    'Show "Edit" and "Chat" buttons when selecting text in the editor.': '在编辑器中选中文本时显示“编辑”和“对话”按钮。',
    'Suggestions in Editor': '编辑器内代码建议',
    'Show suggestions when typing in the editor': '在编辑器中输入时显示代码补全建议',
    'Tab to Jump': '按 Tab 跳转光标',
    'Predict the location of your next edit and navigate you there with a tab keypress.': '预测您下一步编辑的位置，按 Tab 键即可直接跳转。',
    'Tab to Import': '按 Tab 自动导入',
    'Quickly add and update imports with a tab keypress.': '按 Tab 键快速添加或更新依赖导入语句。',
    'Tab Speed': 'Tab 补全速度',
    'Set the speed of tab suggestions': '设置 Tab 代码补全建议的触发速度',
    'Highlight After Accept': '采纳后高亮文本',
    'Highlight newly inserted text after accepting a Tab completion.': '采纳 Tab 补全后高亮显示新插入的文本。',
    'Tab Gitignore Access': '允许 Tab 访问 .gitignore 文件',
    'Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.': '允许 Tab 补全查看和编辑 .gitignore 中列出的文件。如果您的 .gitignore 包含密钥或敏感凭据文件，请谨慎开启。',

    // === Permissions Rules & Grants ===
    'File Access Rules': '文件访问规则',
    'Configure allowed and denied paths for file reads and writes.': '配置允许或拒绝读写的文件与目录路径。',
    'Network Access Rules': '网络访问规则',
    'Configure allowed and denied URLs for reading.': '配置允许或拒绝读取的 URL 与域名。',
    'Browser Actuation Rules': '浏览器操作规则',
    'Browser Actuation Permissions': '浏览器操作权限',
    'Configure allowed and denied URLs for browser actuation.': '配置允许或拒绝智能体通过浏览器交互操作的 URL。',
    'Allow/deny agent browser actuation access to specific URLs.': '允许/拒绝智能体在特定 URL 上执行浏览器交互操作。',
    'Workspace File Access': '工作区文件访问',
    'Workspace Command Access': '工作区命令访问',
    'Workspace Web Access': '工作区网络访问',
    'Read Files': '读取文件',
    'File Reads': '文件读取',
    'Paths the agent can read inside this workspace.': '智能体在此工作区内可读取的路径。',
    'Paths the agent can read.': '智能体可以读取的路径。',
    'Allow/deny agent read access to specific files or directories.': '允许/拒绝智能体读取特定文件或目录。',
    'Write Files': '写入文件',
    'File Writes': '文件写入',
    'Paths the agent can modify.': '智能体可以修改的路径。',
    'Allow/deny agent write access to specific files or directories.': '允许/拒绝智能体写入特定文件或目录。',
    'Terminal Commands': '终端命令',
    'Allow/deny specific terminal commands.': '允许/拒绝执行特定的终端命令。',
    'Configure allowed terminal commands.': '配置允许执行的终端命令。',
    'Terminal commands the agent can execute.': '智能体可以执行的终端命令。',
    'Commands Outside Sandbox': '沙盒外命令',
    'Commands the agent can run outside the sandbox in this workspace.': '智能体在此工作区内可在沙盒外运行的命令。',
    'Commands the agent can run outside the sandbox.': '智能体可在沙盒外部运行的命令。',
    'Allow/deny agent command execution outside the sandbox.': '允许/拒绝智能体在沙盒外部执行命令。',
    'Configure allowed commands outside the sandbox.': '配置允许在沙盒外运行的命令。',
    'Read URLs': '读取 URL',
    'URLs the agent can read or open in this workspace.': '智能体在此工作区内可读取或打开的 URL。',
    'URLs the agent can read or open in the browser.': '智能体可在浏览器中读取或打开的 URL。',
    'Allow/deny agent read access to specific URLs or domains.': '允许/拒绝智能体读取特定 URL 或域名。',
    'Execute URLs': '操作 URL',
    'URLs the agent can actuate on in this workspace.': '智能体在此工作区内可执行交互操作的 URL。',
    'URLs the agent can actuate on using the browser.': '智能体可使用浏览器进行交互操作的 URL。',
    'MCP Tools': 'MCP 工具',
    'External tools the agent can call via Model Context Protocol.': '智能体可通过模型上下文协议 (MCP) 调用的外部工具。',
    'Configure external tools via Model Context Protocol.': '配置通过模型上下文协议 (MCP) 接入的外部工具。',
    'Access grants': '权限授权项',
    'Folders these agents can access.': '这些智能体可以访问的文件夹。',
    'Commands and files these agents can use.': '这些智能体可以使用的命令与文件。',

    // === Customizations, Plugins, Skills, Rules, MCP, Hooks ===
    'Plugins': '插件 (Plugins)',
    'Bundles': '插件包 (Bundles)',
    'Skills': '技能 (Skills)',
    'Skills & Rules': '技能与规则',
    'Rules': '规则 (Rules)',
    'Agents': '子智能体 (Agents)',
    'Custom Agents': '自定义智能体',
    'MCP': 'MCP 服务',
    'MCP Servers': 'MCP 服务器',
    'MCP servers': 'MCP 服务器',
    'Hooks': '钩子 (Hooks)',
    'UI Extensions': '界面扩展 (UI Extensions)',
    'UI extensions': '界面扩展',
    'Marketplace': '插件市场',
    'Installed': '已安装',
    'Installing': '正在安装',
    'Built In': '内置',
    'Global': '全局',
    'Workspace': '工作区',
    'Recommended': '推荐',
    'Recommended Skills': '推荐技能',
    'Installed Skills': '已安装技能',
    'Enable Recommended Skills': '启用推荐技能',
    'Refresh Skills': '刷新技能',
    'Refresh skills': '刷新技能',
    'Refresh skills paths': '刷新技能路径',
    'Manage Skills': '管理技能',
    'Include Jetski Default Customizations': '包含内置默认自定义项',
    'Include default customizations, such as default skills.': '包含系统内置的默认自定义扩展（如默认技能）。',
    'Search and discover customizations to extend your Agent\'s capabilities.': '搜索并发现自定义扩展，增强智能体的能力。',
    'Skills are instructions that extend what Agent can do.': '技能（Skills）是用于扩展智能体专项能力的指令集与脚本。',
    'Find plugins - bundles of skills, agents, MCP servers, UI extensions and more, and install them in one click.': '探索插件——包含技能、子智能体、MCP 服务器、界面扩展等的组合包，支持一键安装。',
    'Add a whole working set at once — a bundle is a curated group of plugins.': '一次性添加整套工作组件——插件包是精选的插件集合。',
    'Create a Plugin with the Agent': '使用智能体创建插件',
    'Create plugin': '创建插件',
    'Installed MCP Servers': '已安装的 MCP 服务器',
    'Add MCP Server': '添加 MCP 服务器',
    'Add MCP Servers': '添加 MCP 服务器',
    'Add MCP': '添加 MCP',
    'Open MCP Config': '打开 MCP 配置文件',
    'Copy Config File Path': '复制配置文件路径',
    'Refresh MCP servers': '刷新 MCP 服务器',
    'Delete MCP Server': '删除 MCP 服务器',
    'Delete Skill': '删除技能',
    'Manage Hooks': '管理钩子 (Hooks)',
    'Agent Hooks Configuration': '智能体钩子配置',
    'Add Handler': '添加处理器',
    'Loading customizations...': '正在加载自定义扩展...',
    'Loading installed plugins...': '正在加载已安装插件...',
    'Loading available plugins...': '正在加载可用插件...',
    'Loading plugins...': '正在加载插件...',
    'Loading skills…': '正在加载技能…',
    'Loading skills...': '正在加载技能...',
    'Loading MCP servers...': '正在加载 MCP 服务器...',
    'Loading custom agents...': '正在加载自定义智能体...',
    'Loading hooks...': '正在加载钩子...',
    'No customizations match your search.': '没有匹配搜索条件的自定义扩展。',
    'No matching customizations found.': '未找到匹配的自定义扩展。',
    'No plugins available.': '暂无可用插件。',
    'No matching plugins found.': '未找到匹配的插件。',
    'No skills or rules yet.': '暂无技能或规则。',
    'No custom agents yet.': '暂无自定义智能体。',
    'No MCP servers installed': '暂未安装 MCP 服务器',

    // === Automations / Scheduled Tasks ===
    'New Automation': '新建自动化任务',
    'Add automation': '添加自动化任务',
    'Edit automation title': '编辑自动化任务标题',
    'Start Automation': '启动自动化任务',
    'Back to Automations': '返回自动化列表',
    'No automations configured.': '暂未配置自动化任务。',
    'Schedule': '执行计划',
    'Trigger': '触发条件',
    'Not scheduled': '未设置计划',
    'Hourly': '每小时',
    'Daily': '每天',
    'Weekly': '每周',
    'Run Now': '立即运行',
    'Uptime': '运行时长',
    'Recent Events': '最近事件',
    'Events': '事件',
    'No events recorded': '暂无事件记录',
    'No events recorded.': '暂无事件记录。',
    'Loading events...': '正在加载事件...',
    'Loading logs...': '正在加载日志...',
    'Full Logs': '完整日志',
    'View Logs': '查看日志',
    'Close Logs Modal': '关闭日志窗口',

    // === Common Buttons, Statuses & Actions ===
    'Open': '打开',
    'Close': '关闭',
    'Close (Esc)': '关闭 (Esc)',
    'Close (Escape)': '关闭 (Escape)',
    'Cancel': '取消',
    'Confirm': '确认',
    'Confirm & Save': '确认并保存',
    'Save': '保存',
    'Saved!': '已保存！',
    'Submit': '提交',
    'Submitting...': '正在提交...',
    'Create': '创建',
    'Creating...': '正在创建...',
    'Create New': '新建',
    'Use Existing': '使用现有',
    'Add': '添加',
    'Edit': '编辑',
    'Delete': '删除',
    'Deleting...': '正在删除...',
    'Remove': '移除',
    'Rename': '重命名',
    'Restore': '恢复',
    'Archive': '归档',
    'Share': '分享',
    'Fork': '分支 (Fork)',
    'Split': '分屏',
    'Split Right': '向右分屏',
    'Split Down': '向下分屏',
    'Split Conversation Vertically': '垂直拆分对话',
    'Split Conversation Horizontally': '水平拆分对话',
    'Equalize Split Panes': '均分分屏面板',
    'Remove From Split': '退出分屏',
    'Remove from Split': '退出分屏',
    'Replace With New': '替换为新对话',
    'Copy': '复制',
    'Cut': '剪切',
    'Paste': '粘贴',
    'Select All': '全选',
    'Undo': '撤销',
    'Discard': '放弃更改',
    'Commit': '提交 (Commit)',
    'Amend': '修正提交 (Amend)',
    'Push': '推送 (Push)',
    'Include unstaged changes': '包含未暂存的更改',
    'Refresh': '刷新',
    'Refreshing...': '正在刷新...',
    'Retry': '重试',
    'Try Again': '重试',
    'Try again': '重试',
    'Skip': '跳过',
    'Decline': '拒绝',
    'Dismiss': '忽略',
    'Got it': '知道了',
    'Configure': '配置',
    'Setup': '设置',
    'Authenticate': '身份验证',
    'Sign in': '登录',
    'Sign In': '登录',
    'Sign out': '退出登录',
    'Sign Out': '退出登录',
    'Signing Out...': '正在退出登录...',
    'Not Signed In': '未登录',
    'Restart': '重启',
    'Download': '下载',
    'Downloading...': '正在下载...',
    'Download PDF': '下载 PDF',
    'Download SVG': '下载 SVG',
    'Download image': '下载图片',
    'Download video': '下载视频',
    'Save Image': '保存图片',
    'Save Video': '保存视频',
    'Search': '搜索',
    'Searching': '正在搜索',
    'Searching...': '正在搜索...',
    'Searching…': '正在搜索…',
    'Clear search': '清除搜索',
    'Clear Search': '清除搜索',
    'Clear filter': '清除筛选',
    'Clear all': '全部清除',
    'No results': '无结果',
    'No results found.': '未找到结果。',
    'No matching results': '没有匹配的结果',
    'Loading': '加载中',
    'Loading...': '正在加载...',
    'Ready': '就绪',
    'Running': '运行中',
    'Starting': '启动中',
    'Stopped': '已停止',
    'Pending': '等待中',
    'In Progress': '进行中',
    'Idle': '空闲',
    'Blocked': '已阻塞',
    'Error': '错误',
    'Unknown': '未知',
    'Status': '状态',
    'Type': '类型',
    'Source': '来源',
    'Name': '名称',
    'Description': '描述',
    'Options': '选项',
    'Details:': '详情：',
    'Error:': '错误：',
    'Error Details:': '错误详情：',
    'Zoom In': '放大',
    'Zoom in': '放大',
    'Zoom in (+)': '放大 (+)',
    'Zoom Out': '缩小',
    'Zoom out': '缩小',
    'Zoom out (-)': '缩小 (-)',
    'Reset Zoom': '重置缩放',
    'Reset zoom': '重置缩放',
    'Reset zoom (0)': '重置缩放 (0)',
    'Zoom': '缩放',
    'Find': '查找',
    'Find in Conversation': '在对话中查找',
    'Find in Pane': '在面板中查找',
    'Match case': '区分大小写',
    'Match whole word': '全字匹配',
    'Use regular expression': '使用正则表达式',
    'Previous match': '上一个匹配项',
    'Next match': '下一个匹配项',
    'New Tab': '新建标签页',
    'New tab': '新建标签页',
    'Close Tab': '关闭标签页',
    'Close tab': '关闭标签页',
    'Close other tabs': '关闭其他标签页',
    'Close tabs to the right': '关闭右侧标签页',
    'New Window': '新建窗口',
    'New Editor Window': '新建编辑器窗口',
    'Command Palette': '命令面板',
    'Open Command Palette': '打开命令面板',
    'Download Diagnostics': '下载诊断信息',
    'Restart Main Language Server': '重启主语言服务器 (Language Server)',

    // === Placeholders ===
    'Search...': '搜索...',
    'Search skills…': '搜索技能…',
    'Search all skills on Agent Market…': '在智能体市场中搜索所有技能…',
    'Search customizations...': '搜索自定义扩展...',
    'Search MCP servers by name': '按名称搜索 MCP 服务器',
    'Search for MCP servers to add to your configuration': '搜索要添加到配置中的 MCP 服务器',
    'Search tabs, files, plugins, subagents, artifacts, tasks...': '搜索标签页、文件、插件、子智能体、产物、任务...',
    'Search conversations, commands, and code...': '搜索对话、命令和代码...',
    'Search for commands...': '搜索命令...',
    'Search projects...': '搜索项目...',
    'Search workspaces...': '搜索工作区...',
    'Search files...': '搜索文件...',
    'Search file contents...': '搜索文件内容...',
    'Search across files...': '跨文件搜索...',
    'Type to search for code across your workspace.': '输入关键字以在工作区中搜索代码。',
    'Enter project name...': '输入项目名称...',
    'Enter workspace name (e.g., my-feature)': '输入工作区名称（例如 my-feature）',
    'Enter a prompt for the agent to run...': '输入要让智能体执行的提示词...',
    'Prompt to execute on schedule...': '按计划定时执行的提示词...',
    'Prompt to run when triggered...': '触发时运行的提示词...',
    'Cron expression e.g. 0 */6 * * *': 'Cron 表达式，例如 0 */6 * * *',
    'Enter file or directory path...': '输入文件或目录路径...',
    'Enter URL pattern...': '输入 URL 匹配规则...',
    'Enter tool name or server...': '输入工具名称或服务器...',
    'Enter command...': '输入命令...',
    'Write a comment...': '写下评论...',
    'Add a message...': '添加消息...'
  };

  // Dynamic Regex Rules ([RegExp, replacementOrFunction])
  const REGEX_RULES = [
    [/^Worked for (\d+)h\s*(\d+)m$/i, '已工作 $1 小时 $2 分钟'],
    [/^Worked for (\d+)m\s*(\d+)s$/i, '已工作 $1 分 $2 秒'],
    [/^Worked for (\d+)m$/i, '已工作 $1 分钟'],
    [/^Worked for (\d+)s$/i, '已工作 $1 秒'],
    [/^Worked for (<1s|\d+ms)$/i, '已工作 $1'],
    [/^Thought for (\d+)m\s*(\d+)s$/i, '已思考 $1 分 $2 秒'],
    [/^Thought for (\d+)s$/i, '已思考 $1 秒'],
    [/^Thinking for (\d+)s$/i, '已思考 $1 秒'],
    [/^(\d+)s ago$/i, '$1 秒前'],
    [/^(\d+)m ago$/i, '$1 分钟前'],
    [/^(\d+)h ago$/i, '$1 小时前'],
    [/^(\d+)d ago$/i, '$1 天前'],
    [/^(\d+)w ago$/i, '$1 周前'],
    [/^(\d+)mo ago$/i, '$1 个月前'],
    [/^(\d+)y ago$/i, '$1 年前'],
    [/^(\d+)s$/i, '$1秒'],
    [/^(\d+)m$/i, '$1分'],
    [/^(\d+)h$/i, '$1小时'],
    [/^(\d+)d$/i, '$1天'],
    [/^(\d+)w$/i, '$1周'],
    [/^(\d+)mo$/i, '$1个月'],
    [/^(\d+)y$/i, '$1年'],
    [/^just now$/i, '刚刚'],
    [/^Yesterday$/i, '昨天'],
    [/^Today$/i, '今天'],
    [/^Select model, current:\s*(.+)$/i, '选择模型，当前：$1'],
    [/^Agent permissions preset selector, current:\s*(.+)$/i, '智能体权限预设，当前：$1'],
    [/^Cancel \((.+)\)$/i, '取消 ($1)'],
    [/^Close (.+)$/i, (m, p1) => {
      if (p1 === 'Sidebar') return '关闭侧边栏';
      if (p1 === 'Settings') return '关闭设置';
      if (p1 === 'panel') return '关闭面板';
      return '关闭 ' + p1;
    }],
    [/^No more older messages, showing (\d+) of (\d+)$/i, '没有更多历史消息了（显示 $1 / $2 条）'],
    [/^(\d+) subagents? running$/i, '$1 个子智能体正在运行'],
    [/^(\d+) subagents? blocked$/i, '$1 个子智能体已阻塞'],
    [/^(\d+) tasks? running$/i, '$1 个任务正在运行'],
    [/^(\d+) background tasks?$/i, '$1 个后台任务'],
    [/^(\d+) files? changed$/i, '$1 个文件已更改'],
    [/^See all \((\d+)\)$/i, '查看全部 ($1)'],
    [/^Show more \((\d+)\)$/i, '展开更多 ($1)'],
    [/^Show submitted \((\d+)\)$/i, '显示已提交 ($1)'],
    [/^Child Subagents \((\d+)\)$/i, '子智能体 ($1)'],
    [/^Tool Calls \((\d+)\)$/i, '工具调用 ($1)'],
    [/^Generation Steps \((\d+)\)$/i, '生成步骤 ($1)'],
    [/^Comments \((\d+)\)$/i, '评论 ($1)'],
    [/^Settings -\s*(.+)$/i, '设置 - $1'],
    [/^Your Plan:\s*(.+)$/i, '当前方案：$1'],
    [/^Available AI Credits:\s*(.+)$/i, '可用 AI 额度：$1'],
    [/^Models within this group:\s*(.+)$/i, '此分组包含的模型：$1'],
    [/^Shared with:\s*(.+)$/i, '共享配额模型：$1'],
    [/^You can upgrade to a (?:higher )?(.+?) plan to receive (?:the )?(highest|higher) rate limits\.?$/i, (_, plan, lvl) => {
      const isHighest = String(lvl).toLowerCase() === 'highest';
      return `您可以升级到${isHighest ? '更高级别的 ' : ' '}${plan} 订阅方案，以获得${isHighest ? '最高的' : '更高的'}速率限制。`;
    }],
    [/^When toggled on, (.+?) will use your AI credits to fulfill model requests once you're out of model quota\. \1 will always use your model quota first before using AI credits\.$/i, '开启后，当您的模型配额用尽时，$1 将使用您的 AI 额度来响应模型请求。在使用 AI 额度之前，$1 会始终优先使用您的模型配额。'],
    [/^You have used (some|all) of your (.+?) limit,\s*it will (?:fully )?refresh in (.+?)\.?$/i, (_, amount, win, dur) => {
      const winZh = translateQuotaWindow(win);
      const durZh = translateQuotaDuration(dur);
      const amtZh = String(amount).toLowerCase() === 'all' ? '已用尽' : '已使用部分';
      return `您${amtZh}${winZh}配额，配额将在 ${durZh}后完全刷新。`;
    }],
    [/^You have reached your (.+?) limit,\s*it will (?:fully )?refresh in (.+?)\.?$/i, (_, win, dur) => {
      return `您已达到${translateQuotaWindow(win)}配额上限，配额将在 ${translateQuotaDuration(dur)}后完全刷新。`;
    }],
    [/^You have(?:n't| not) used any of your (.+?) limit\.?$/i, (_, win) => {
      return `您尚未消耗任何${translateQuotaWindow(win)}配额。`;
    }],
    [/^Your (.+?) limit will (?:fully )?refresh in (.+?)\.?$/i, (_, win, dur) => {
      return `您的${translateQuotaWindow(win)}配额将在 ${translateQuotaDuration(dur)}后完全刷新。`;
    }],
    [/^Resets in (.+)$/i, (_, dur) => {
      return `将在 ${translateQuotaDuration(dur)}后重置`;
    }]
  ];

  function translateQuotaWindow(w) {
    const s = String(w || '').trim().toLowerCase();
    if (s === 'weekly') return '本周';
    if (s === '5-hour' || s === 'five-hour' || s === '5 hour' || s === 'five hour' || s === '5h') return ' 5 小时';
    if (s === 'daily') return '今日';
    if (s === 'monthly') return '本月';
    if (s === 'hourly') return '每小时';
    return ' ' + w + ' ';
  }

  function translateQuotaDuration(d) {
    let s = String(d || '').trim().replace(/\.$/, '');
    if (/^<\s*1\s*m(?:in(?:ute)?s?)?$/i.test(s) || /^less than a minute$/i.test(s)) {
      return '不到 1 分钟';
    }
    s = s
      .replace(/(\d+)\s*days?\b/gi, '$1 天')
      .replace(/(\d+)\s*hours?\b/gi, '$1 小时')
      .replace(/(\d+)\s*minutes?\b/gi, '$1 分钟')
      .replace(/(\d+)\s*mins?\b/gi, '$1 分钟')
      .replace(/(\d+)\s*seconds?\b/gi, '$1 秒')
      .replace(/(\d+)\s*secs?\b/gi, '$1 秒')
      .replace(/(\d+)d\b/gi, '$1 天')
      .replace(/(\d+)h\b/gi, '$1 小时')
      .replace(/(\d+)m\b/gi, '$1 分钟')
      .replace(/,\s*/g, ' ');
    return s.replace(/\s+/g, ' ').trim();
  }

  function translateText(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;

    // Fast skip if purely numeric, single symbol, or already purely Chinese
    if (/^[0-9\s.,:%+-/\\|()[\]{}<>@#$^*~`!?"'=]+$/.test(trimmed)) return null;

    if (Object.prototype.hasOwnProperty.call(EXACT_MAP, trimmed)) {
      const target = EXACT_MAP[trimmed];
      return raw.replace(trimmed, target);
    }

    for (let i = 0; i < REGEX_RULES.length; i++) {
      const [re, rep] = REGEX_RULES[i];
      if (re.test(trimmed)) {
        const replaced = typeof rep === 'function' ? trimmed.replace(re, rep) : trimmed.replace(re, rep);
        return raw.replace(trimmed, replaced);
      }
    }
    return null;
  }

  function isSkippedElement(el) {
    if (!el || el.nodeType !== 1) return false;
    const tag = el.tagName;
    if (
      tag === 'SCRIPT' ||
      tag === 'STYLE' ||
      tag === 'NOSCRIPT' ||
      tag === 'CODE' ||
      tag === 'PRE' ||
      tag === 'TEXTAREA' ||
      tag === 'SVG' ||
      tag === 'PATH'
    ) {
      return true;
    }
    if (el.isContentEditable) return true;
    if (el.id === 'agy-zh-toggle-btn') return true;
    const cls = typeof el.className === 'string' ? el.className : '';
    if (
      cls.includes('monaco-editor') ||
      cls.includes('xterm') ||
      cls.includes('prism') ||
      cls.includes('hljs') ||
      cls.includes('katex') ||
      cls.includes('code-line') ||
      cls.includes('material-symbols') ||
      cls.includes('material-icons') ||
      cls.includes('codicon')
    ) {
      return true;
    }
    return false;
  }

  function hasSkippedAncestor(node) {
    let cur = node.parentElement;
    while (cur) {
      if (isSkippedElement(cur)) return true;
      cur = cur.parentElement;
    }
    return false;
  }

  function isEnabled() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === null ? true : v !== 'false';
    } catch (_) {
      return true;
    }
  }

  function setEnabled(val) {
    try {
      localStorage.setItem(STORAGE_KEY, val ? 'true' : 'false');
    } catch (_) {}
  }

  const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label', 'data-tooltip-content'];

  function processTextNode(node, enabled) {
    if (!node || node.nodeType !== 3) return;
    if (hasSkippedAncestor(node)) return;

    const current = node.nodeValue;
    if (!enabled) {
      if (node.__agyOrigText && current === node.__agyZhText) {
        node.nodeValue = node.__agyOrigText;
      }
      return;
    }

    // If already translated by the current patch version and unchanged by React
    if (node.__agyZhText && current === node.__agyZhText && node.__agyVer === PATCH_VERSION) {
      return;
    }

    const sourceText = (node.__agyOrigText && current === node.__agyZhText) ? node.__agyOrigText : current;
    const zh = translateText(sourceText);
    if (zh && zh !== current) {
      node.__agyOrigText = sourceText;
      node.__agyZhText = zh;
      node.__agyVer = PATCH_VERSION;
      node.nodeValue = zh;
    } else if (node.__agyVer !== PATCH_VERSION && node.__agyZhText && current === node.__agyZhText) {
      node.__agyVer = PATCH_VERSION;
    }
  }

  function processElementAttrs(el, enabled) {
    if (!el || el.nodeType !== 1 || el.id === 'agy-zh-toggle-btn') return;
    for (let i = 0; i < TRANSLATABLE_ATTRS.length; i++) {
      const attr = TRANSLATABLE_ATTRS[i];
      if (!el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr);
      if (!current) continue;

      if (!el.__agyOrigAttrs) el.__agyOrigAttrs = {};
      if (!el.__agyZhAttrs) el.__agyZhAttrs = {};

      if (!enabled) {
        if (el.__agyOrigAttrs[attr] && current === el.__agyZhAttrs[attr]) {
          el.setAttribute(attr, el.__agyOrigAttrs[attr]);
        }
        continue;
      }

      if (el.__agyZhAttrs[attr] && current === el.__agyZhAttrs[attr] && el.__agyVer === PATCH_VERSION) {
        continue;
      }

      const sourceVal = (el.__agyOrigAttrs[attr] && current === el.__agyZhAttrs[attr])
        ? el.__agyOrigAttrs[attr]
        : current;
      const zh = translateText(sourceVal);
      if (zh && zh !== current) {
        el.__agyOrigAttrs[attr] = sourceVal;
        el.__agyZhAttrs[attr] = zh;
        el.__agyVer = PATCH_VERSION;
        el.setAttribute(attr, zh);
      }
    }
  }

  function walkAndTranslate(root, enabled) {
    if (!root) return;
    if (root.nodeType === 3) {
      processTextNode(root, enabled);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      processElementAttrs(root, enabled);
      if (isSkippedElement(root)) return;
    }
    const children = root.childNodes;
    if (!children) return;
    for (let i = 0; i < children.length; i++) {
      walkAndTranslate(children[i], enabled);
    }
  }

  function updateToggleButtonUI() {
    const btn = document.getElementById('agy-zh-toggle-btn');
    if (!btn) return;
    const on = isEnabled();
    btn.textContent = on ? '中' : 'EN';
    btn.title = on
      ? 'Antigravity 汉化已开启（点击或按 ⌘/Ctrl+Shift+L 切换英文）'
      : 'Antigravity Chinese Patch Paused (Click or ⌘/Ctrl+Shift+L for Chinese)';
    btn.style.opacity = on ? '0.85' : '0.45';
  }

  function ensureToggleButton() {
    if (!document.body) return;
    let btn = document.getElementById('agy-zh-toggle-btn');
    if (btn) {
      // Ensure position is on the bottom-right so it never blocks the sidebar Settings icon
      btn.style.left = 'auto';
      btn.style.right = '14px';
      btn.style.bottom = '10px';
      return;
    }
    btn = document.createElement('button');
    btn.id = 'agy-zh-toggle-btn';
    btn.type = 'button';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '10px',
      right: '14px',
      left: 'auto',
      zIndex: '2147483647',
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      border: '1px solid rgba(128,128,128,0.3)',
      backgroundColor: 'rgba(30,30,30,0.75)',
      color: '#e5e7eb',
      fontSize: '11px',
      fontWeight: '600',
      lineHeight: '22px',
      textAlign: 'center',
      cursor: 'pointer',
      padding: '0',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      userSelect: 'none',
      transition: 'opacity 0.15s ease, transform 0.15s ease'
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1.06)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      updateToggleButtonUI();
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleLanguage();
    });
    document.body.appendChild(btn);
    updateToggleButtonUI();
  }

  function scanAll() {
    if (!document.body) return;
    const enabled = isEnabled();
    walkAndTranslate(document.body, enabled);
    if (document.title) {
      if (enabled && document.title.includes('Outside of Project')) {
        document.title = document.title.replace('Outside of Project', '未归属项目');
      }
    }
    ensureToggleButton();
    updateToggleButtonUI();
  }

  function toggleLanguage() {
    const next = !isEnabled();
    setEnabled(next);
    scanAll();
  }

  let pendingNodes = new Set();
  let flushScheduled = false;

  function flushMutations() {
    flushScheduled = false;
    const enabled = isEnabled();
    const nodes = Array.from(pendingNodes);
    pendingNodes.clear();
    for (let i = 0; i < nodes.length; i++) {
      walkAndTranslate(nodes[i], enabled);
    }
  }

  function scheduleNode(node) {
    if (!node) return;
    pendingNodes.add(node);
    if (!flushScheduled) {
      flushScheduled = true;
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(flushMutations);
      } else {
        Promise.resolve().then(flushMutations);
      }
    }
  }

  function startObserver() {
    if (!document.documentElement) return;
    scanAll();

    const observer = new MutationObserver((mutations) => {
      const enabled = isEnabled();
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'characterData') {
          processTextNode(m.target, enabled);
        } else if (m.type === 'attributes') {
          processElementAttrs(m.target, enabled);
        } else if (m.type === 'childList') {
          const added = m.addedNodes;
          for (let j = 0; j < added.length; j++) {
            scheduleNode(added[j]);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRS
    });

    const keydownHandler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyL') {
        if (!e.altKey) {
          e.preventDefault();
          e.stopPropagation();
          toggleLanguage();
        }
      }
    };

    // Keyboard shortcut: Cmd/Ctrl + Shift + L to toggle Chinese / English
    window.addEventListener('keydown', keydownHandler, true);

    window.__ANTIGRAVITY_ZH_CN_CLEANUP__ = () => {
      observer.disconnect();
      window.removeEventListener('keydown', keydownHandler, true);
    };
  }

  if (typeof window !== 'undefined') {
    if (typeof window.__ANTIGRAVITY_ZH_CN_CLEANUP__ === 'function') {
      try {
        window.__ANTIGRAVITY_ZH_CN_CLEANUP__();
      } catch (_e) {}
    }
    window.__ANTIGRAVITY_ZH_CN_ACTIVE__ = PATCH_VERSION;
    window.__ANTIGRAVITY_ZH_CN_SCAN__ = scanAll;
    window.__ANTIGRAVITY_ZH_CN_TOGGLE__ = toggleLanguage;
    window.__ANTIGRAVITY_ZH_CN_DISABLE__ = () => {
      setEnabled(false);
      scanAll();
      if (typeof window.__ANTIGRAVITY_ZH_CN_CLEANUP__ === 'function') {
        window.__ANTIGRAVITY_ZH_CN_CLEANUP__();
      }
      const btn = document.getElementById('agy-zh-toggle-btn');
      if (btn) btn.remove();
      delete window.__ANTIGRAVITY_ZH_CN_ACTIVE__;
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserver, { once: true });
    } else {
      startObserver();
    }
  }
})();
