// 引入相关依赖
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 标签接口
export interface Label {
  id: string
  name: string
  color: string
  backgroundColor: string
}

//定义类型接口
export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  order: number // 添加顺序字段
  labels: string[] // 标签ID数组
}

// 定义 Pinia 仓库（useTaskBoardStore）
export const useTaskBoardStore = defineStore('taskBoard', () => {
  // 创建响应式的数组 初始化数据

  // 预定义标签
  const labels = ref<Label[]>([
    {
      id: 'urgent',
      name: '紧急',
      color: '#ffffff',
      backgroundColor: '#e74c3c',
    },
    {
      id: 'important',
      name: '重要',
      color: '#ffffff',
      backgroundColor: '#f39c12',
    },
    {
      id: 'normal',
      name: '普通',
      color: '#ffffff',
      backgroundColor: '#3498db',
    },
    {
      id: 'low',
      name: '低优先级',
      color: '#ffffff',
      backgroundColor: '#95a5a6',
    },
    {
      id: 'bug',
      name: 'Bug修复',
      color: '#ffffff',
      backgroundColor: '#8e44ad',
    },
    {
      id: 'feature',
      name: '新功能',
      color: '#ffffff',
      backgroundColor: '#27ae60',
    },
    {
      id: 'design',
      name: '设计',
      color: '#ffffff',
      backgroundColor: '#e91e63',
    },
    {
      id: 'review',
      name: '待审核',
      color: '#ffffff',
      backgroundColor: '#ff9800',
    },
  ])

  // 任务数据
  const tasks = ref<Task[]>([
    {
      id: '1',
      title: '设计用户界面',
      description: '创建任务管理看板的UI设计稿',
      status: 'todo',
      order: 1,
      labels: ['important', 'design'],
    },
    {
      id: '2',
      title: '编写API接口',
      description: '开发后端任务管理相关接口',
      status: 'todo',
      order: 2,
      labels: ['feature', 'urgent'],
    },
    {
      id: '3',
      title: '数据库设计',
      description: '设计任务和用户相关的数据表结构',
      status: 'todo',
      order: 3,
      labels: ['important'],
    },
    {
      id: '4',
      title: '前端组件开发',
      description: '开发Vue组件和页面逻辑',
      status: 'in-progress',
      order: 1,
      labels: ['feature', 'normal'],
    },
    {
      id: '5',
      title: '用户认证功能',
      description: '实现登录注册和权限管理',
      status: 'in-progress',
      order: 2,
      labels: ['feature', 'important'],
    },
    {
      id: '6',
      title: '项目初始化',
      description: '创建Vue项目并配置开发环境',
      status: 'done',
      order: 1,
      labels: ['normal'],
    },
  ])

  // 根据ID获取标签信息
  const getLabelById = (id: string) => labels.value.find((label) => label.id === id)

  // 计算属性：按状态分组

  // 待办任务（status 为 'todo' 的任务）
  const todoTasks = computed(() => {
    if (isSearchActive.value) {
      return filteredTasks.value.filter((task) => task.status === 'todo')
    }
    return tasks.value.filter((task) => task.status === 'todo').sort((a, b) => a.order - b.order)
  })

  // 进行中任务（status 为 'in-progress' 的任务）
  const inProgressTasks = computed(() => {
    if (isSearchActive.value) {
      return filteredTasks.value.filter((task) => task.status === 'in-progress')
    }
    return tasks.value
      .filter((task) => task.status === 'in-progress')
      .sort((a, b) => a.order - b.order)
  })

  // 已完成任务（status 为 'done' 的任务）
  const doneTasks = computed(() => {
    if (isSearchActive.value) {
      return filteredTasks.value.filter((task) => task.status === 'done')
    }
    return tasks.value.filter((task) => task.status === 'done').sort((a, b) => a.order - b.order)
  })

  // 添加任务
  function addTask(
    title: string,
    description: string,
    status: Task['status'],
    labels: string[] = [],
  ) {
    const maxOrder = tasks.value
      .filter((task) => task.status === status)
      .reduce((max, task) => Math.max(max, task.order), 0)

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status,
      order: maxOrder + 1,
      labels,
    }
    tasks.value.push(newTask)
  }

  // 删除任务
  function deleteTask(taskId: string) {
    const index = tasks.value.findIndex((task) => task.id === taskId)
    if (index > -1) {
      tasks.value.splice(index, 1)
    }
  }

  // 编辑任务
  function editTask(
    taskId: string,
    newTitle: string,
    newDescription: string,
    newLabels: string[] = [],
  ) {
    const task = tasks.value.find((t) => t.id == taskId)
    if (task) {
      task.title = newTitle
      task.description = newDescription
      task.labels = newLabels
    }
  }

  // 移动任务到新状态
  function moveTask(taskId: string, newStatus: Task['status']) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task && task.status !== newStatus) {
      // 计算新状态下的最大order
      const maxOrder = tasks.value
        .filter((task) => task.status === newStatus)
        .reduce((max, task) => Math.max(max, task.order), 0)

      task.status = newStatus
      task.order = maxOrder + 1
    }
  }

  // 添加标签
  function addTaskLabel(taskId: string, labelId: string) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task && !task.labels.includes(labelId)) {
      task.labels.push(labelId)
    }
  }

  // 移除标签
  function removeTaskLabel(taskId: string, labelId: string) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) {
      const index = task.labels.indexOf(labelId)
      if (index > -1) {
        task.labels.splice(index, 1)
      }
    }
  }

  // 创建自定义标签
  function createLabel(name: string, backgroundColor: string, color: string = '#ffffff') {
    const newLabel: Label = {
      id: `custom-${Date.now()}`,
      name,
      color,
      backgroundColor,
    }
    labels.value.push(newLabel)
    return newLabel
  }

  // 更新同列任务顺序
  function updateTaskOrder(status: Task['status'], orderedTaskIds: string[]) {
    orderedTaskIds.forEach((taskId, index) => {
      const task = tasks.value.find((t) => t.id === taskId)
      if (task && task.status === status) {
        task.order = index + 1
      }
    })
  }

  // 同步任务状态（确保计算属性和实际数组一致）
  function syncTaskStatuses() {
    // 根据任务在各个计算属性数组中的位置，同步更新任务状态
    todoTasks.value.forEach((task) => {
      if (task.status !== 'todo') {
        task.status = 'todo'
      }
    })

    inProgressTasks.value.forEach((task) => {
      if (task.status !== 'in-progress') {
        task.status = 'in-progress'
      }
    })

    doneTasks.value.forEach((task) => {
      if (task.status !== 'done') {
        task.status = 'done'
      }
    })
  }

  // 搜索和筛选状态
  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const isSearchActive = ref(false)

  // 真正搜索筛选逻辑
  const filteredTasks = computed(() => {
    let filtered = tasks.value

    // 按状态筛选
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter.value)
    }

    // 按标签筛选
    if (labelFilter.value.length > 0) {
      filtered = filtered.filter((task) =>
        labelFilter.value.some((labelId) => task.labels.includes(labelId)),
      )
    }

    // 按搜索关键词筛选
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter((task) => {
        // 搜索标题和描述
        const textMatch =
          task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)

        // 🆕 搜索标签名称
        const labelMatch = task.labels.some((labelId) => {
          const label = getLabelById(labelId)
          return label?.name.toLowerCase().includes(query)
        })

        return textMatch || labelMatch
      })
    }

    return filtered.sort((a, b) => a.order - b.order)
  })

  // 搜索相关方法
  function setSearchQuery(query: string) {
    searchQuery.value = query
    isSearchActive.value = query.trim().length > 0 || statusFilter.value !== 'all'
  }

  function setStatusFilter(status: 'all' | 'todo' | 'in-progress' | 'done') {
    statusFilter.value = status
    // 激活项
    isSearchActive.value = searchQuery.value.trim().length > 0 || status !== 'all'
  }

  function clearSearch() {
    searchQuery.value = ''
    statusFilter.value = 'all'
    isSearchActive.value = false
  }

  // 搜索统计
  const searchStats = computed(() => {
    if (!isSearchActive.value) return null

    const total = filteredTasks.value.length
    const byStatus = {
      todo: filteredTasks.value.filter((t) => t.status === 'todo').length,
      'in-progress': filteredTasks.value.filter((t) => t.status === 'in-progress').length,
      done: filteredTasks.value.filter((t) => t.status === 'done').length,
    }

    return { total, byStatus }
  })

  const labelFilter = ref<string[]>([]) // 标签筛选

  // 标签筛选方法
  function setLabelFilter(labelIds: string[]) {
    labelFilter.value = labelIds
    updateSearchActiveState()
  }

  function toggleLabelFilter(labelId: string) {
    const index = labelFilter.value.indexOf(labelId)
    if (index > -1) {
      labelFilter.value.splice(index, 1)
    } else {
      labelFilter.value.push(labelId)
    }
    updateSearchActiveState()
  }

  // 更新搜索激活状态判断
  function updateSearchActiveState() {
    isSearchActive.value =
      searchQuery.value.trim().length > 0 ||
      statusFilter.value !== 'all' ||
      labelFilter.value.length > 0
  }

  return {
    tasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    addTask,
    deleteTask,
    editTask,
    moveTask,
    syncTaskStatuses,
    updateTaskOrder,
    searchStats,
    clearSearch,
    setStatusFilter,
    setSearchQuery,
    filteredTasks,
    searchQuery,
    statusFilter,
    isSearchActive,
    getLabelById,
    addTaskLabel,
    removeTaskLabel,
    labels,
    toggleLabelFilter,
    setLabelFilter,
    createLabel,
    labelFilter,
  }
})
