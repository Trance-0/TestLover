<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MBTI 测试网站 - 项目需求总结

## 项目概述
仿照真题量表风格，使用 Next.js 构建一个手机端 MBTI 性格测试网站。

## 核心功能
1. **题库系统**：JSON 格式构建 100 道 MBTI 测试题，覆盖 E/I、S/N、T/F、J/P 四个维度
2. **随机出题**：每次测试从 100 题库中随机抽取 30 道题
3. **置顶进度条**：页面顶部固定显示答题进度条，实时更新
4. **匹配度进度条**：用户答完 30 题后，进度条下方额外显示"人格匹配度"进度条和提交按钮
5. **随机匹配度**：根据用户选择随机提升或降低匹配度（永远不会到 100%）
6. **过场动画**：提交后播放 5 秒无实际意义的"AI 分析中"过场动画
7. **最终报告**：动画结束后显示报告页面，核心结论为「你是一个很爱做题的人。」

## 技术栈
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- 纯前端实现，无后端依赖
