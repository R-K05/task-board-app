<template>
  <div id="app">
    <!-- 页面标题 -->
    <header class="header">
      <h1>📋 任务管理看板</h1>
      <button
        @click="toggleSearch"
        class="search-toggle-btn"
        :class="{ active: showSearchPanel }"
        title="搜索任务 (Ctrl+F)"
      >
        🔍
      </button>
      <!-- 🆕 显示动态统计 -->
      <div class="header-stats">
        <span style="margin-right: 10px">总任务: {{ taskStore.tasks.length }}</span>
        <span>已完成: {{ taskStore.doneTasks.length }}</span>
      </div>
    </header>

    <!-- 🆕 搜索面板 -->
    <div v-if="showSearchPanel" class="search-panel">
      <div class="search-container">
        <div class="search-input-group">
          <input
            ref="searchInput"
            :value="taskStore.searchQuery"
            @input="handleSearchInput"
            type="text"
            placeholder="搜索任务标题或描述..."
            class="search-input"
          />
          <button @click="clearSearch" class="clear-search-btn" title="清除搜索">❌</button>
        </div>

        <!-- 状态筛选器 -->
        <div class="filter-buttons">
          <button
            @click="setStatusFilter('all')"
            :class="['filter-btn', { active: taskStore.statusFilter === 'all' }]"
          >
            🗂️ 全部
          </button>
          <button
            @click="setStatusFilter('todo')"
            :class="['filter-btn', { active: taskStore.statusFilter === 'todo' }]"
          >
            📝 待办
          </button>
          <button
            @click="setStatusFilter('in-progress')"
            :class="['filter-btn', { active: taskStore.statusFilter === 'in-progress' }]"
          >
            🔄 进行中
          </button>
          <button
            @click="setStatusFilter('done')"
            :class="['filter-btn', { active: taskStore.statusFilter === 'done' }]"
          >
            ✅ 已完成
          </button>
        </div>

        <!-- 🆕 标签筛选器 -->
        <div class="filter-section">
          <h4>🏷️ 标签筛选</h4>
          <div class="label-filters">
            <button
              v-for="label in taskStore.labels"
              :key="label.id"
              @click="toggleLabelFilter(label.id)"
              :class="['label-filter-btn', { active: taskStore.labelFilter.includes(label.id) }]"
              :style="{
                backgroundColor: taskStore.labelFilter.includes(label.id)
                  ? label.backgroundColor
                  : 'transparent',
                color: taskStore.labelFilter.includes(label.id)
                  ? label.color
                  : label.backgroundColor,
                borderColor: label.backgroundColor,
              }"
            >
              {{ label.name }}
            </button>
          </div>
        </div>

        <!-- 🆕 搜索结果统计 -->
        <div v-if="taskStore.searchStats" class="search-stats">
          <span class="stats-text"> 找到 {{ taskStore.searchStats.total }} 个任务 </span>
          <div class="stats-breakdown">
            <span>待办: {{ taskStore.searchStats.byStatus.todo }}</span>
            <span>进行中: {{ taskStore.searchStats.byStatus['in-progress'] }}</span>
            <span>已完成: {{ taskStore.searchStats.byStatus.done }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务看板主体 -->
    <main class="board-container">
      <div class="board">
        <!-- 待办事项列 -->
        <div class="column">
          <div class="column-header">
            <h2>📝 待办事项</h2>
            <span class="task-count">{{ taskStore.todoTasks.length }}</span>
          </div>
          <div class="task-list">
            <!-- 🆕 使用 draggable 包装任务列表 -->
            <draggable
              :list="taskStore.todoTasks"
              group="tasks"
              item-key="id"
              class="drag-area"
              ghost-class="ghost-card"
              chosen-class="chosen-card"
              drag-class="drag-card"
              @end="(event) => onDragEnd(event, 'todo')"
            >
              <template #item="{ element }">
                <div
                  class="task-card"
                  :data-task-id="element.id"
                  @dblclick="startEdit(element)"
                  :title="'双击编辑任务'"
                >
                  <button
                    class="delete-btn"
                    @click="deleteTask(element.id, element.title)"
                    title="删除任务"
                  >
                    ❌
                  </button>
                  <!-- 任务标签显示 -->
                  <div v-if="element.labels.length > 0" class="task-labels">
                    <span
                      v-for="labelId in element.labels"
                      :key="labelId"
                      class="task-label"
                      :style="{
                        backgroundColor: taskStore.getLabelById(labelId)?.backgroundColor,
                        color: taskStore.getLabelById(labelId)?.color,
                      }"
                    >
                      {{ taskStore.getLabelById(labelId)?.name }}
                    </span>
                  </div>

                  <h3>{{ element.title }}</h3>
                  <p>{{ element.description }}</p>

                  <!-- 标签管理按钮 -->
                  <button class="label-btn" @click="openLabelSelector(element)" title="管理标签">
                    🏷️
                  </button>
                  <small class="task-order">顺序: {{ element.order }}</small>
                </div>
              </template>
            </draggable>

            <button class="add-card-btn" @click="addTask('todo')">➕ 添加卡片</button>
          </div>
        </div>

        <!-- 进行中列 -->
        <div class="column">
          <div class="column-header">
            <h2>🔄 进行中</h2>
            <span class="task-count">{{ taskStore.inProgressTasks.length }}</span>
          </div>
          <div class="task-list">
            <draggable
              :list="taskStore.inProgressTasks"
              group="tasks"
              item-key="id"
              class="drag-area"
              ghost-class="ghost-card"
              chosen-class="chosen-card"
              drag-class="drag-card"
              @end="(event) => onDragEnd(event, 'in-progress')"
            >
              <template #item="{ element }">
                <div
                  class="task-card"
                  :data-task-id="element.id"
                  @dblclick="startEdit(element)"
                  :title="'双击编辑任务'"
                >
                  <button
                    class="delete-btn"
                    @click="deleteTask(element.id, element.title)"
                    title="删除任务"
                  >
                    ❌
                  </button>
                  <div v-if="element.labels.length > 0" class="task-labels">
                    <span
                      v-for="labelId in element.labels"
                      :key="labelId"
                      class="task-label"
                      :style="{
                        backgroundColor: taskStore.getLabelById(labelId)?.backgroundColor,
                        color: taskStore.getLabelById(labelId)?.color,
                      }"
                    >
                      {{ taskStore.getLabelById(labelId)?.name }}
                    </span>
                  </div>

                  <h3>{{ element.title }}</h3>
                  <p>{{ element.description }}</p>

                  <button class="label-btn" @click="openLabelSelector(element)" title="管理标签">
                    🏷️
                  </button>
                  <small class="task-order">顺序: {{ element.order }}</small>
                </div>
              </template>
            </draggable>

            <button class="add-card-btn" @click="addTask('in-progress')">➕ 添加卡片</button>
          </div>
        </div>

        <!-- 已完成列 -->
        <div class="column">
          <div class="column-header">
            <h2>✅ 已完成</h2>
            <span class="task-count">{{ taskStore.doneTasks.length }}</span>
          </div>
          <div class="task-list">
            <draggable
              :list="taskStore.doneTasks"
              group="tasks"
              item-key="id"
              class="drag-area"
              ghost-class="ghost-card"
              chosen-class="chosen-card"
              drag-class="drag-card"
              @end="(event) => onDragEnd(event, 'done')"
            >
              <template #item="{ element }">
                <div
                  class="task-card"
                  :data-task-id="element.id"
                  @dblclick="startEdit(element)"
                  :title="'双击编辑任务'"
                >
                  <button
                    class="delete-btn"
                    @click="deleteTask(element.id, element.title)"
                    title="删除任务"
                  >
                    ❌
                  </button>
                  <div v-if="element.labels.length > 0" class="task-labels">
                    <span
                      v-for="labelId in element.labels"
                      :key="labelId"
                      class="task-label"
                      :style="{
                        backgroundColor: taskStore.getLabelById(labelId)?.backgroundColor,
                        color: taskStore.getLabelById(labelId)?.color,
                      }"
                    >
                      {{ taskStore.getLabelById(labelId)?.name }}
                    </span>
                  </div>

                  <h3>{{ element.title }}</h3>
                  <p>{{ element.description }}</p>

                  <button class="label-btn" @click="openLabelSelector(element)" title="管理标签">
                    🏷️
                  </button>
                  <small class="task-order">顺序: {{ element.order }}</small>
                </div>
              </template>
            </draggable>

            <button class="add-card-btn" @click="addTask('done')">➕ 添加卡片</button>
          </div>
        </div>
      </div>
    </main>

    <!-- 标签选择器弹窗 -->
    <div
      v-if="showLabelSelector && labelSelectorTask"
      class="label-overlay"
      @click="closeLabelSelector"
    >
      <div class="label-modal" @click.stop>
        <h3>🏷️ 管理任务标签</h3>
        <p class="task-info">任务: {{ labelSelectorTask.title }}</p>

        <div class="label-grid">
          <button
            v-for="label in taskStore.labels"
            :key="label.id"
            @click="toggleTaskLabel(labelSelectorTask.id, label.id)"
            :class="['label-option', { selected: labelSelectorTask.labels.includes(label.id) }]"
            :style="{
              backgroundColor: labelSelectorTask.labels.includes(label.id)
                ? label.backgroundColor
                : 'transparent',
              color: labelSelectorTask.labels.includes(label.id)
                ? label.color
                : label.backgroundColor,
              borderColor: label.backgroundColor,
            }"
          >
            <span v-if="labelSelectorTask.labels.includes(label.id)">✓</span>
            {{ label.name }}
          </button>
        </div>

        <div class="label-actions">
          <button @click="closeLabelSelector" class="btn btn-primary">完成</button>
        </div>
      </div>
    </div>

    <!-- 编辑任务弹窗 -->
    <div v-if="editingTask" class="edit-overlay" @click="cancelEdit">
      <div class="edit-modal" @click.stop>
        <h3>📝 编辑任务</h3>
        <div class="edit-form">
          <div class="form-group">
            <label>任务标题:</label>
            <input
              v-model="editTitle"
              type="text"
              placeholder="请输入任务标题"
              @keydown="handleKeydown"
              ref="titleInput"
              class="edit-input"
            />
          </div>
          <div class="form-group">
            <label>任务描述:</label>
            <textarea
              v-model="editDescription"
              placeholder="请输入任务描述（可选）"
              @keydown="handleKeydown"
              class="edit-textarea"
              rows="3"
            ></textarea>
          </div>
          <!-- 编辑模式下的标签选择 -->
          <div class="form-group">
            <label>任务标签:</label>
            <div class="edit-label-grid">
              <button
                v-for="label in taskStore.labels"
                :key="label.id"
                @click="toggleEditLabel(label.id)"
                :class="['edit-label-option', { selected: editLabels.includes(label.id) }]"
                :style="{
                  backgroundColor: editLabels.includes(label.id)
                    ? label.backgroundColor
                    : 'transparent',
                  color: editLabels.includes(label.id) ? label.color : label.backgroundColor,
                  borderColor: label.backgroundColor,
                }"
                type="button"
              >
                <span v-if="editLabels.includes(label.id)">✓</span>
                {{ label.name }}
              </button>
            </div>
          </div>

          <div class="edit-actions">
            <button @click="saveEdit" class="btn btn-primary" :disabled="!editTitle.trim()">
              💾 保存
            </button>
            <button @click="cancelEdit" class="btn btn-secondary">❌ 取消</button>
          </div>
          <div class="edit-tips">
            <small>💡 提示: Ctrl+Enter 保存，Esc 取消</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入状态管理
import { ref, nextTick } from 'vue'
import { useTaskBoardStore } from './stores/taskBoard'
import draggable from 'vuedraggable'
import type { Task, Label } from './stores/taskBoard'

const taskStore = useTaskBoardStore()

// 编辑相关状态
const editingTask = ref<Task | null>(null)
const editTitle = ref('')
const editDescription = ref('')
const editLabels = ref<string[]>([])

// 搜索相关状态
const searchInput = ref<HTMLInputElement>()
const showSearchPanel = ref(false)

// 标签相关状态
const showLabelSelector = ref(false)
const labelSelectorTask = ref<Task | null>(null)

// 添加卡片 接收 字符串类型
function addTask(status: 'todo' | 'in-progress' | 'done') {
  const title = prompt(`在"${getColumnName(status)}"中添加新任务\n\n请输入任务标题：`)
  if (title && title.trim()) {
    const description = prompt('请输入任务描述（可选）：') || ''
    taskStore.addTask(title.trim(), description.trim(), status)
  }
}

// 删除按钮
function deleteTask(id: string, title: string) {
  const confirmed = confirm(`确认删除该项吗？\n\n任务：${title}\n\n删除后无法恢复！`)
  if (confirmed) {
    taskStore.deleteTask(id)
  }
}

// 拖拽功能
function onDragEnd(event: any, targetStatus: 'todo' | 'in-progress' | 'done') {
  // 搜索模式下禁用拖拽
  if (taskStore.isSearchActive) {
    return
  }
  // 当任务在同一列内拖拽时，vuedraggable会自动处理顺序
  // 当任务跨列拖拽时，需要更新任务状态
  const { from, to, oldIndex, newIndex } = event

  if (from === to) {
    // 同列拖拽 - 更新任务顺序
    const currentList = getCurrentTaskList(targetStatus)
    const orderedTaskIds = currentList.map((task) => task.id)
    taskStore.updateTaskOrder(targetStatus, orderedTaskIds)
  } else {
    // 跨列拖拽 - 更新任务状态和所有列的顺序
    taskStore.syncTaskStatuses()
  }
}

// 获取当前状态的任务列表
function getCurrentTaskList(status: 'todo' | 'in-progress' | 'done') {
  switch (status) {
    case 'todo':
      return taskStore.todoTasks
    case 'in-progress':
      return taskStore.inProgressTasks
    case 'done':
      return taskStore.doneTasks
    default:
      return []
  }
}

// 转换为对应的中文
function getColumnName(status: string) {
  const names = {
    todo: '待办事项',
    'in-progress': '进行中',
    done: '已完成',
  }

  /*
  typeof  获取变量/对象的类型
  type NamesType = typeof names:
  type NamesType = {
    todo: string;
    'in-progress': string;
    done: string;
  }
  */

  /*
   keyof  用于获取一个对象类型的所有键
   type PersonKeys = keyof NamesType
   type PersonKeys = "done" | "todo" | "in-progress"
  */

  return names[status as keyof typeof names] || status
}

// 开始编辑任务
function startEdit(task: Task) {
  editingTask.value = task
  editTitle.value = task.title
  editDescription.value = task.description
  editLabels.value = [...task.labels]
}

// 保存编辑任务
function saveEdit() {
  if (editingTask.value && editTitle.value.trim()) {
    taskStore.editTask(
      editingTask.value.id,
      editTitle.value.trim(),
      editDescription.value.trim(),
      editLabels.value,
    )
    cancelEdit()
  }
}

// 取消编辑
function cancelEdit() {
  editingTask.value = null
  editTitle.value = ''
  editDescription.value = ''
  editLabels.value = []
}

// 处理键盘事件
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.ctrlKey) {
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}

function toggleSearch() {
  // 展开搜索面板
  showSearchPanel.value = !showSearchPanel.value
  // 展示时聚焦输入框
  if (showSearchPanel.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    taskStore.clearSearch()
  }
}

// 进行搜索
function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  taskStore.setSearchQuery(target.value)
}

function setStatusFilter(status: 'all' | 'todo' | 'in-progress' | 'done') {
  taskStore.setStatusFilter(status)
}

// 关闭面板并恢复初始样子
function clearSearch() {
  taskStore.clearSearch()
  showSearchPanel.value = false
}

// 搜索快捷键
function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === 'f') {
    event.preventDefault()
    toggleSearch()
  } else if (event.key === 'Escape' && showSearchPanel.value) {
    clearSearch()
  }
}
document.addEventListener('keydown', handleGlobalKeydown)

// 打开标签管理
function openLabelSelector(task: Task) {
  labelSelectorTask.value = task
  showLabelSelector.value = true
}

// 关闭标签管理
function closeLabelSelector() {
  labelSelectorTask.value = null
  showLabelSelector.value = false
}

// 点击某个标签
function toggleTaskLabel(taskId: string, labelId: string) {
  const task = taskStore.tasks.find((t) => t.id === taskId)
  if (task) {
    if (task.labels.includes(labelId)) {
      taskStore.removeTaskLabel(taskId, labelId)
    } else {
      taskStore.addTaskLabel(taskId, labelId)
    }
  }
}

// 编辑模式下的标签操作
function toggleEditLabel(labelId: string) {
  const index = editLabels.value.indexOf(labelId)
  if (index > -1) {
    editLabels.value.splice(index, 1)
  } else {
    editLabels.value.push(labelId)
  }
}

// 标签筛选方法
function toggleLabelFilter(labelId: string) {
  taskStore.toggleLabelFilter(labelId)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f0f2f5;
  /* 强制设置文字方向为水平 */
  writing-mode: horizontal-tb;
  direction: ltr;
}

#app {
  min-height: 100vh;
  /* 确保应用容器也是水平文字 */
  writing-mode: horizontal-tb;
  direction: ltr;
}

/* 页面头部 */
.header {
  background: linear-gradient(135deg, #0079bf 0%, #005a8b 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  /* 确保标题文字水平显示 */
  writing-mode: horizontal-tb;
  direction: ltr;
}

/* 看板容器 */
.board-container {
  padding: 2rem;
}

.board {
  display: flex;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 列样式 */
.column {
  flex: 1;
  background: #ebecf0;
  border-radius: 8px;
  padding: 1rem;
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ddd;
}

.column-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #172b4d;
  /* 确保列标题水平显示 */
  writing-mode: horizontal-tb;
  direction: ltr;
}

.task-count {
  background: #ddd;
  color: #5e6c84;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 任务卡片 - 重点修复区域 */

.task-card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.task-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #172b4d;
  margin-bottom: 0.5rem;

  /* 确保任务标题水平显示 */
  writing-mode: horizontal-tb !important;
  direction: ltr !important;
  text-orientation: mixed !important;
  display: block;
  width: 100%;
}

.task-card p {
  font-size: 0.85rem;
  color: #5e6c84;
  line-height: 1.4;

  /* 确保任务描述水平显示 */
  writing-mode: horizontal-tb !important;
  direction: ltr !important;
  text-orientation: mixed !important;
  display: block;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .board {
    flex-direction: column;
  }

  .board-container {
    padding: 1rem;
  }

  .header {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }
}

.add-card-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed #bbb;
  border-radius: 6px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.add-card-btn:hover {
  background: rgba(255, 255, 255, 0.7);
  border-color: #0079bf;
  color: #0079bf;
  transform: translateY(-1px);
}

.add-card-btn:active {
  transform: translateY(0);
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: 0.2rem;
  border-radius: 3px;
}

/* 🆕 鼠标悬停时显示删除按钮 */
.task-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

/* 🆕 头部统计样式 */
.header-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 响应式：移动端隐藏删除按钮悬停效果 */
@media (max-width: 768px) {
  .delete-btn {
    opacity: 1; /* 移动端始终显示 */
  }

  .header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

/* 🆕 拖拽相关样式 */
.drag-area {
  min-height: 50px;
  width: 100%;
}

/* 拖拽时的幽灵效果 */
.ghost-card {
  opacity: 0.5;
  background: #f0f8ff;
  border: 2px dashed #0079bf;
}

/* 被选中的卡片样式 */
.chosen-card {
  transform: rotate(5deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 拖拽中的卡片样式 */
.drag-card {
  transform: rotate(5deg);
  opacity: 0.9;
}

/* 任务卡片拖拽时的光标 */
.task-card {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e4e8;
  cursor: grab; /* 🆕 拖拽光标 */
  transition: all 0.2s ease;
  writing-mode: horizontal-tb !important;
  direction: ltr !important;
  position: relative;
  margin-bottom: 0.75rem;
}

.task-card:active {
  cursor: grabbing; /* 🆕 拖拽时的光标 */
}

.task-card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

/* 拖拽区域悬停效果 */
.column:hover {
  background: #e4e6ea;
}

.column.drag-over {
  background: #d4edda;
  border: 2px dashed #28a745;
}

/* 🆕 编辑弹窗样式 */
.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.edit-modal {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.edit-modal h3 {
  margin: 0 0 1rem 0;
  color: #172b4d;
  font-size: 1.2rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #5e6c84;
  font-size: 0.9rem;
}

.edit-input,
.edit-textarea {
  padding: 0.75rem;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
  resize: vertical;
}

.edit-input:focus,
.edit-textarea:focus {
  outline: none;
  border-color: #0079bf;
  box-shadow: 0 0 0 3px rgba(0, 121, 191, 0.1);
}

.edit-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-primary {
  background: #0079bf;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #005a8b;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.edit-tips {
  text-align: center;
  margin-top: 0.5rem;
  color: #666;
}

/* 任务卡片编辑提示 */
.task-card {
  cursor: grab;
  position: relative;
}

.task-card:hover::after {
  content: '双击编辑';
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  opacity: 0;
  animation: fadeIn 0.3s ease 0.5s forwards;
  pointer-events: none;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .edit-modal {
    width: 95%;
    padding: 1rem;
  }

  .edit-actions {
    flex-direction: column;
  }
}

/* 🆕 搜索相关样式 */
.header {
  background: linear-gradient(135deg, #0079bf 0%, #005a8b 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.search-toggle-btn:hover,
.search-toggle-btn.active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.search-panel {
  background: #f8fafc;
  border-bottom: 1px solid #e1e4e8;
  padding: 1rem 2rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e4e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0079bf;
  box-shadow: 0 0 0 3px rgba(0, 121, 191, 0.1);
}

.clear-search-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: #c0392b;
  transform: scale(1.05);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e4e8;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #0079bf;
  background: #f0f8ff;
}

.filter-btn.active {
  background: #0079bf;
  color: white;
  border-color: #0079bf;
}

.search-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
}

.stats-text {
  font-weight: 600;
  color: #172b4d;
}

.stats-breakdown {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #5e6c84;
}

/* 搜索模式下禁用拖拽的样式 */
.search-disabled {
  cursor: default !important;
  opacity: 0.8;
}

.add-card-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .search-panel {
    padding: 1rem;
  }

  .filter-buttons {
    justify-content: center;
  }

  .search-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .stats-breakdown {
    flex-wrap: wrap;
  }
}
/* 标签相关样式 */
.task-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.task-label {
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.label-btn {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: 0.2rem;
  border-radius: 3px;
}

.task-card:hover .label-btn {
  opacity: 1;
}

.label-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 搜索面板中的标签筛选 */
.filter-section {
  margin-bottom: 1rem;
}

.filter-section h4 {
  margin-bottom: 0.5rem;
  color: #172b4d;
  font-size: 0.9rem;
}

.label-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.label-filter-btn {
  padding: 0.4rem 0.8rem;
  border: 2px solid;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;
}

.label-filter-btn:hover {
  transform: scale(1.05);
}

.label-filter-btn.active {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 标签选择器弹窗 */
.label-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.label-modal {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.3s ease;
}

.task-info {
  color: #5e6c84;
  margin-bottom: 1rem;
  font-style: italic;
}

.label-grid,
.edit-label-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.label-option,
.edit-label-option {
  padding: 0.5rem 0.75rem;
  border: 2px solid;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: center;
}

.label-option:hover,
.edit-label-option:hover {
  transform: scale(1.05);
}

.label-option.selected,
.edit-label-option.selected {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.label-actions {
  display: flex;
  justify-content: center;
}

/* 任务卡片调整 */
.task-card {
  padding-bottom: 2rem;
}
</style>
