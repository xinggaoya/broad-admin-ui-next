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
            <template #prefix>
              <IconRenderer v-if="formData.icon" :icon="formData.icon" :size="16" />
            </template>
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
    <n-modal v-model:show="showIconPicker" preset="dialog" style="width: 900px; height: 700px">
      <template #header>
        <div>选择图标</div>
      </template>

      <IconSelector
        v-model="formData.icon"
        :multiple="false"
        :show-preview="true"
        style="height: 500px"
      />

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
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd'
import IconRenderer from '../../components/icon/IconRenderer.vue'
import IconSelector from '../../components/icon/IconSelector.vue'
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

// 图标相关的响应式数据已移动到新的图标选择器组件中

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
        row.icon && h(IconRenderer, { icon: row.icon, size: 16 }),
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

/* 图标选择器样式已移动到 IconSelector 组件中 */

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

/* 图标组件的暗黑模式样式已移动到对应组件中 */
</style>
