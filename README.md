# task-board-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# 创建项目

```sh
npm create vue@latest task-board-app
```

### 项目配置

```sh
√ Project name: » task-board-app
√ Add TypeScript? » Yes （必须选，强类型支持）
√ Add JSX Support? » No
√ Add Vue Router for Single Page Application development? » No （本项目暂时不需要路由）
√ Add Pinia for state management? » Yes （必须选，状态管理）
√ Add Vitest for Unit Testing? » No （入门可先不选）
√ Add an End-to-End Testing Solution? » No
√ Add ESLint for code quality? » Yes （代码规范检查）
√ Add Prettier for code formatting? » Yes （代码格式化）
```

# “类 Trello 任务管理看板”

# 1. 页面样式以及功能

┌─────────────────────────────────────────────────┐
│ 📋 Task Board
├─────────────────────────────────────────────────┤
│ 📝 待办事项 │ 🔄 进行中 │ ✅ 已完成 │
│ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────┐ │
│ │ 任务卡片1 │ │ │ 任务卡片3 │ │ │ 任务卡片5 │ │
│ └─────────────┘ │ └─────────────┘ │ └─────────────┘ │
│ ┌─────────────┐ │ ┌─────────────┐ │ │
│ │ 任务卡片2 │ │ │ 任务卡片4 │ │ │
│ └─────────────┘ │ └─────────────┘ │ │
│ [+ 添加卡片] │ [+ 添加卡片] │ [+ 添加卡片] │
└─────────────────────────────────────────────────┘

任务管理功能：增删改查
拖拽功能（同列，跨列）
搜索筛选功能（内容筛选，标签筛选）
标签功能（任务管理标签）

Vue3 + TypeScript 强类型组件开发
拖拽功能（使用 vue3-draggable 库）
自定义 Hooks 封装（如 useTask、useBoard）
动画过渡效果（Vue 内置 transition + CSS 动画）
组件通信（Props + Emits + Pinia

┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
│ Vue 3 组件 │ ←→ │ Pinia Store │ ←→ │ 响应式数据 │
│ (Composition API)│ │ (状态管理) │ │ (ref/computed) │
└─────────────────┘ └──────────────┘ └─────────────────┘
↕ ↕ ↕
┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
│ 用户交互事件 │ │ 业务逻辑 │ │ 数据持久化 │
│ (拖拽/点击/输入) │ │ (CRUD操作) │ │ (localStorage) │
└─────────────────┘ └──────────────┘ └─────────────────┘

# 2. 基础交互

添加模拟卡片交互

# 3. 让添加功能真正工作

创建任务数据管理 taskBoard.ts,以及 添加任务方法addTask
更新App.vue使用动态数据

# 4. 删除任务

taskBoard.ts添加删除任务deleteTask
更新 App.vue 添加删除按钮和功能

# 5. 移动任务功能（三个状态的任务可以任意移动）

安装拖拽组件 npm install vuedraggable@next
taskBoard.ts添加移动功能moveTask
更新 App.vue 添加移动按钮和功能

# 6. 编辑功能

taskBoard.ts添加编辑任务editTask
更新 App.vue 添加编辑按钮和功能（双击项编辑）

# 7. 搜索筛序功能

taskBoard.ts 添加搜索筛选逻辑
更新 App.vue 添加搜索界面以及搜索功能

# 8.任务标签

taskBoard.ts 添加标签相关数据结构（任务加标签以及标签筛选）
