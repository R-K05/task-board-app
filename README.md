# “类 Trello 任务管理看板”
非常适合练手vue3结合最新技术

### 任务管理功能包含：
增删改查
拖拽功能（同列，跨列）
搜索筛选功能（内容筛选，标签筛选）
标签功能（任务管理标签）
### 技术点：
Vue3 + TypeScript 强类型组件开发
拖拽功能（使用 vue3-draggable 库）
自定义 Hooks 封装（如 useTask、useBoard）
动画过渡效果（Vue 内置 transition + CSS 动画）
组件通信（Props + Emits + Pinia

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



# 1. 页面样式以及功能
<img width="529" height="301" alt="image" src="https://github.com/user-attachments/assets/6256d412-65c1-4272-989b-a282b65d659f" />


任务管理功能：增删改查
拖拽功能（同列，跨列）
搜索筛选功能（内容筛选，标签筛选）
标签功能（任务管理标签）

Vue3 + TypeScript 强类型组件开发
拖拽功能（使用 vue3-draggable 库）
自定义 Hooks 封装（如 useTask、useBoard）
动画过渡效果（Vue 内置 transition + CSS 动画）
组件通信（Props + Emits + Pinia

<img width="508" height="226" alt="image" src="https://github.com/user-attachments/assets/8ad7729c-9917-41a7-b1af-002be6351974" />


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
