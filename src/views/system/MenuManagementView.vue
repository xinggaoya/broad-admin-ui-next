<template>
  <div class="menu-management">
    <n-card title="菜单管理" class="mb-4">
      <template #header-extra>
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增菜单
        </n-button>
      </template>

      <!-- 搜索区域 -->
      <div class="search-area mb-4">
        <n-space>
          <n-input
            v-model:value="searchKeyword"
            placeholder="请输入菜单名称"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <n-icon>
                <SearchOutlined />
              </n-icon>
            </template>
          </n-input>
          <n-button @click="handleSearch">搜索</n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </div>

      <!-- 菜单树表格 -->
      <n-data-table
        :columns="columns"
        :data="filteredMenuData"
        :row-key="(row: MenuItem) => row.id"
        default-expand-all
        :indent="20"
        class="menu-table"
      />
    </n-card>

    <!-- 菜单编辑弹窗 -->
    <n-modal v-model:show="showModal" preset="dialog" style="width: 600px">
      <template #header>
        <div>{{ isEdit ? '编辑菜单' : '新增菜单' }}</div>
      </template>

      <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="100px"
        class="mt-4"
      >
        <n-form-item label="菜单类型" path="type">
          <n-radio-group v-model:value="formData.type">
            <n-radio value="directory">目录</n-radio>
            <n-radio value="menu">菜单</n-radio>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="父级菜单" path="parentId">
          <n-tree-select
            v-model:value="formData.parentId"
            :options="parentMenuOptions"
            clearable
            placeholder="请选择父级菜单"
            :show-path="true"
          />
        </n-form-item>

        <n-form-item label="菜单名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入菜单名称" />
        </n-form-item>

        <n-form-item label="菜单图标" path="icon">
          <n-input v-model:value="formData.icon" placeholder="请输入图标名称">
            <template #suffix>
              <n-button text @click="showIconPicker = true">
                <template #icon>
                  <n-icon>
                    <SearchOutlined />
                  </n-icon>
                </template>
              </n-button>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item v-if="formData.type === 'menu'" label="路由路径" path="path">
          <n-input v-model:value="formData.path" placeholder="请输入路由路径" />
        </n-form-item>

        <n-form-item v-if="formData.type === 'menu'" label="组件路径" path="component">
          <n-input v-model:value="formData.component" placeholder="请输入组件路径" />
        </n-form-item>

        <n-form-item label="排序" path="sort">
          <n-input-number v-model:value="formData.sort" :min="0" placeholder="排序号" />
        </n-form-item>

        <n-form-item label="状态" path="status">
          <n-switch v-model:value="formData.status">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item>

        <n-form-item label="备注" path="remark">
          <n-input
            v-model:value="formData.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 图标选择器弹窗 -->
    <n-modal v-model:show="showIconPicker" preset="dialog" style="width: 800px">
      <template #header>
        <div>选择图标</div>
      </template>

      <div class="icon-picker">
        <div class="icon-search mb-4">
          <n-input v-model:value="iconSearchKeyword" placeholder="搜索图标" clearable>
            <template #prefix>
              <n-icon>
                <SearchOutlined />
              </n-icon>
            </template>
          </n-input>
        </div>

        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.name"
            class="icon-item"
            :class="{ active: formData.icon === icon.name }"
            @click="selectIcon(icon.name)"
          >
            <n-icon size="24">
              <component :is="icon.component" />
            </n-icon>
            <div class="icon-name">{{ icon.name }}</div>
          </div>
        </div>
      </div>

      <template #action>
        <n-space>
          <n-button @click="showIconPicker = false">取消</n-button>
          <n-button type="primary" @click="confirmIconSelect">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, h, nextTick } from 'vue'
import {
  NButton,
  NIcon,
  NPopconfirm,
  useMessage,
  type FormRules,
  type FormInst,
  type TreeSelectOption,
} from 'naive-ui'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FileOutlined,
  LineChartOutlined,
  PieChartOutlined,
  MenuOutlined,
  HomeOutlined,
  FolderOutlined,
} from '@vicons/antd'
import type { DataTableColumns } from 'naive-ui'

defineOptions({
  name: 'MenuManagementView',
})

const message = useMessage()

// 菜单项接口
interface MenuItem {
  id: string
  name: string
  path?: string
  component?: string
  icon?: string
  type: 'directory' | 'menu'
  parentId?: string
  sort: number
  status: boolean
  remark?: string
  children?: MenuItem[]
}

// 表单数据
const formRef = ref<FormInst>()
const showModal = ref(false)
const isEdit = ref(false)
const searchKeyword = ref('')
const showIconPicker = ref(false)
const iconSearchKeyword = ref('')

const formData = reactive<MenuItem>({
  id: '',
  name: '',
  path: '',
  component: '',
  icon: '',
  type: 'menu',
  parentId: '',
  sort: 0,
  status: true,
  remark: '',
})

// 可用图标列表
const availableIcons = [
  { name: 'DashboardOutlined', component: DashboardOutlined },
  { name: 'UserOutlined', component: UserOutlined },
  { name: 'SettingOutlined', component: SettingOutlined },
  { name: 'TableOutlined', component: TableOutlined },
  { name: 'FormOutlined', component: FormOutlined },
  { name: 'BarChartOutlined', component: BarChartOutlined },
  { name: 'UnorderedListOutlined', component: UnorderedListOutlined },
  { name: 'TeamOutlined', component: TeamOutlined },
  { name: 'DatabaseOutlined', component: DatabaseOutlined },
  { name: 'FileOutlined', component: FileOutlined },
  { name: 'LineChartOutlined', component: LineChartOutlined },
  { name: 'PieChartOutlined', component: PieChartOutlined },
  { name: 'MenuOutlined', component: MenuOutlined },
  { name: 'HomeOutlined', component: HomeOutlined },
  { name: 'FolderOutlined', component: FolderOutlined },
]

// 过滤图标
const filteredIcons = computed(() => {
  if (!iconSearchKeyword.value) return availableIcons
  return availableIcons.filter((icon) =>
    icon.name.toLowerCase().includes(iconSearchKeyword.value.toLowerCase()),
  )
})

// 模拟菜单数据
const menuData = ref<MenuItem[]>([
  {
    id: '1',
    name: '仪表盘',
    path: '/dashboard',
    component: 'DashboardView',
    icon: 'DashboardOutlined',
    type: 'menu',
    sort: 1,
    status: true,
    remark: '系统仪表盘页面',
  },
  {
    id: '2',
    name: '用户管理',
    icon: 'UserOutlined',
    type: 'directory',
    sort: 2,
    status: true,
    remark: '用户管理模块',
    children: [
      {
        id: '2-1',
        name: '用户列表',
        path: '/users/list',
        component: 'UserListView',
        icon: 'UnorderedListOutlined',
        type: 'menu',
        parentId: '2',
        sort: 1,
        status: true,
      },
      {
        id: '2-2',
        name: '用户角色',
        path: '/users/roles',
        component: 'UserRolesView',
        icon: 'TeamOutlined',
        type: 'menu',
        parentId: '2',
        sort: 2,
        status: true,
      },
    ],
  },
  {
    id: '3',
    name: '系统管理',
    icon: 'SettingOutlined',
    type: 'directory',
    sort: 3,
    status: true,
    remark: '系统管理模块',
    children: [
      {
        id: '3-1',
        name: '菜单管理',
        path: '/system/menu',
        component: 'MenuManagementView',
        icon: 'UnorderedListOutlined',
        type: 'menu',
        parentId: '3',
        sort: 1,
        status: true,
      },
      {
        id: '3-2',
        name: '系统设置',
        path: '/settings',
        component: 'SettingsView',
        icon: 'SettingOutlined',
        type: 'menu',
        parentId: '3',
        sort: 2,
        status: true,
      },
    ],
  },
])

// 过滤后的菜单数据
const filteredMenuData = computed(() => {
  if (!searchKeyword.value) return menuData.value

  const filterMenu = (menus: MenuItem[]): MenuItem[] => {
    return menus
      .filter((menu) => {
        const matchName = menu.name.includes(searchKeyword.value)
        const matchChildren = menu.children && filterMenu(menu.children).length > 0
        return matchName || matchChildren
      })
      .map((menu) => ({
        ...menu,
        children: menu.children ? filterMenu(menu.children) : undefined,
      }))
  }

  return filterMenu(menuData.value)
})

// 父级菜单选项
const parentMenuOptions = computed((): TreeSelectOption[] => {
  const buildOptions = (menus: MenuItem[]): TreeSelectOption[] => {
    return menus
      .filter((menu) => menu.type === 'directory' && menu.id !== formData.id)
      .map((menu) => ({
        key: menu.id,
        label: menu.name,
        value: menu.id,
        children: menu.children ? buildOptions(menu.children) : undefined,
      }))
  }

  return [{ key: '', label: '根目录', value: '' }, ...buildOptions(menuData.value)]
})

// 表格列配置
const columns: DataTableColumns<MenuItem> = [
  {
    title: '菜单名称',
    key: 'name',
    width: 200,
    render: (row) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        row.icon &&
          h(
            NIcon,
            { size: 16 },
            {
              default: () => {
                const iconComponent = availableIcons.find(
                  (icon) => icon.name === row.icon,
                )?.component
                return iconComponent ? h(iconComponent) : null
              },
            },
          ),
        h('span', row.name),
      ])
    },
  },
  {
    title: '类型',
    key: 'type',
    width: 80,
    render: (row) => {
      return h(
        'n-tag',
        {
          type: row.type === 'directory' ? 'info' : 'default',
          size: 'small',
        },
        row.type === 'directory' ? '目录' : '菜单',
      )
    },
  },
  {
    title: '路由路径',
    key: 'path',
    width: 200,
    render: (row) => row.path || '-',
  },
  {
    title: '组件路径',
    key: 'component',
    width: 200,
    render: (row) => row.component || '-',
  },
  {
    title: '排序',
    key: 'sort',
    width: 80,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render: (row) => {
      return h(
        'n-tag',
        {
          type: row.status ? 'success' : 'error',
          size: 'small',
        },
        row.status ? '启用' : '禁用',
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: () => h(NIcon, {}, { default: () => h(EditOutlined) }) },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(row.id),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  text: true,
                },
                {
                  default: () => '删除',
                  icon: () => h(NIcon, {}, { default: () => h(DeleteOutlined) }),
                },
              ),
            default: () => '确定删除这个菜单吗？',
          },
        ),
      ])
    },
  },
]

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 20, message: '菜单名称长度在2-20个字符', trigger: 'blur' },
  ],
  path: [
    {
      required: true,
      validator: (rule, value) => {
        if (formData.type === 'menu' && !value) {
          return new Error('请输入路由路径')
        }
        if (value && !value.startsWith('/')) {
          return new Error('路由路径必须以/开头')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
  component: [
    {
      required: true,
      validator: (rule, value) => {
        if (formData.type === 'menu' && !value) {
          return new Error('请输入组件路径')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
  sort: [{ required: true, type: 'number', message: '请输入排序号', trigger: 'blur' }],
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: '',
    name: '',
    path: '',
    component: '',
    icon: '',
    type: 'menu',
    parentId: '',
    sort: 0,
    status: true,
    remark: '',
  })
}

// 新增菜单
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
  nextTick(() => {
    formRef.value?.restoreValidation()
  })
}

// 编辑菜单
const handleEdit = (row: MenuItem) => {
  Object.assign(formData, { ...row })
  isEdit.value = true
  showModal.value = true
  nextTick(() => {
    formRef.value?.restoreValidation()
  })
}

// 删除菜单
const handleDelete = (id: string) => {
  const deleteFromMenus = (menus: MenuItem[]): MenuItem[] => {
    return menus
      .filter((menu) => menu.id !== id)
      .map((menu) => ({
        ...menu,
        children: menu.children ? deleteFromMenus(menu.children) : undefined,
      }))
  }

  menuData.value = deleteFromMenus(menuData.value)
  message.success('删除成功')
}

// 搜索
const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (isEdit.value) {
        // 编辑
        updateMenuItem(formData)
        message.success('编辑成功')
      } else {
        // 新增
        const newMenu = { ...formData, id: generateId() }
        addMenuItem(newMenu)
        message.success('新增成功')
      }
      showModal.value = false
    }
  })
}

// 添加菜单项
const addMenuItem = (menu: MenuItem) => {
  if (!menu.parentId) {
    // 添加到根级别
    menuData.value.push(menu)
  } else {
    // 添加到指定父级
    const addToParent = (menus: MenuItem[]): boolean => {
      for (const item of menus) {
        if (item.id === menu.parentId) {
          if (!item.children) item.children = []
          item.children.push(menu)
          return true
        }
        if (item.children && addToParent(item.children)) {
          return true
        }
      }
      return false
    }
    addToParent(menuData.value)
  }
}

// 更新菜单项
const updateMenuItem = (menu: MenuItem) => {
  const updateInMenus = (menus: MenuItem[]): boolean => {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].id === menu.id) {
        menus[i] = { ...menu }
        return true
      }
      if (menus[i].children && updateInMenus(menus[i].children!)) {
        return true
      }
    }
    return false
  }
  updateInMenus(menuData.value)
}

// 选择图标
const selectIcon = (iconName: string) => {
  formData.icon = iconName
}

// 确认选择图标
const confirmIconSelect = () => {
  showIconPicker.value = false
}
</script>

<style scoped>
.menu-management {
  padding: 20px;
}

.search-area {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.menu-table {
  /* 表格样式 */
}

.icon-picker {
  max-height: 500px;
  overflow-y: auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-item:hover {
  border-color: #18a058;
  background: #f0f9f4;
}

.icon-item.active {
  border-color: #18a058;
  background: #18a058;
  color: white;
}

.icon-name {
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
  word-break: break-all;
}

.mb-4 {
  margin-bottom: 16px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 8px;
}

/* 暗黑模式适配 */
html.dark .icon-item {
  border-color: #2c2c32;
  background: #18181c;
}

html.dark .icon-item:hover {
  border-color: #63e2b7;
  background: #2a4a3a;
}

html.dark .icon-item.active {
  border-color: #63e2b7;
  background: #63e2b7;
  color: #000;
}
</style>
