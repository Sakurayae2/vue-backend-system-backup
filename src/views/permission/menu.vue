<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row :gutter="20" style="margin-bottom: 30px;">
        <el-col :span="4">
          <el-button type="primary" @click="showHandleAddDialog">手动添加根菜单</el-button>
        </el-col>
      </el-row>
      <div class="custom-tree-container">
        <div class="block">
          <p>权限菜单</p>
          <el-tree
            :data="menu"
            node-key="id"
            default-expand-all
            :props="defaultProps"
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-if="data.id !== 1"
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)"
                >
                  删除
                </el-button>
                <el-button
                  v-if="data.id !== 1"
                  type="text"
                  size="mini"
                  @click="showEditDialog(data)"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="showAddDialog(data)"
                >
                  添加
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-card>

    <!-- 添加菜单对话框 -->
    <el-dialog title="添加菜单" :visible.sync="AddMenuDialogVisible" width="40%">
      <el-form
        ref="addMenuFormRef"
        :model="addMenuForm"
        :rules="addMenuFormRules"
        label-width="110px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addMenuForm.name" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="addMenuForm.path" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddMenuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenus">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改菜单对话框 -->
    <el-dialog title="添加菜单" :visible.sync="editMenuDialogVisible" width="40%">
      <el-form
        ref="editMenuFormRef"
        :model="editMenuForm"
        :rules="editMenuFormRules"
        label-width="110px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editMenuForm.name" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="editMenuForm.path" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMenuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenus">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 手动添加菜单对话框 -->
    <el-dialog title="添加菜单" :visible.sync="handleAddMenuDialogVisible" width="40%">
      <el-form
        ref="handleEditMenuFormRef"
        :model="addMenuForm"
        :rules="addMenuFormRules"
        label-width="110px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addMenuForm.name" />
        </el-form-item>
        <el-form-item label="前端路由" prop="path">
          <el-input v-model="addMenuForm.path" />
        </el-form-item>
        <el-form-item label="菜单级别" prop="level">
          <el-input v-model="addMenuForm.level" />
        </el-form-item>
        <el-form-item label="父菜单" prop="parent">
          <el-input v-model="addMenuForm.parent" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddMenuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getmenu, deletemenu, editmenu, addmenu } from '@/api/permission'

export default {
  data() {
    return {
      // 菜单列表
      menu: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      menuId: 100,
      //   添加角色对话框
      AddMenuDialogVisible: false,
      //   手动添加对话框
      handleAddMenuDialogVisible: false,
      // 添加角色表单
      addMenuForm: {},
      //   添加角色表单验证
      addMenuFormRules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 10, message: '菜单名称的长度在2～10个字', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路径', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入菜单级别', trigger: 'blur' }
        ],
        parent: [
          { required: true, message: '请输入父菜单id', trigger: 'blur' }
        ]
      },
      //   修改角色对话框
      editMenuDialogVisible: false,
      // 修改角色表单
      editMenuForm: {},
      currentEditId: '',
      //   添加角色表单验证
      editMenuFormRules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 10, message: '菜单名称的长度在2～10个字', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路径', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getMenu()
  },
  methods: {
    getMenu() {
      const data = { drop: true, tree: true, level: 1 }
      getmenu(data).then(res => {
        this.menu = res.data
      })
    },
    // 显示添加菜单
    showAddDialog(data) {
      this.$set(this.addMenuForm, 'parent', data.id)
      this.$set(this.addMenuForm, 'level', (data.level + 1))
      this.AddMenuDialogVisible = true
    },
    showHandleAddDialog() {
      this.handleAddMenuDialogVisible = true
    },
    // 添加菜单
    addMenus() {
      console.log(this.addMenuForm)
      addmenu(this.addMenuForm).then(() => {
        this.$message.success('添加菜单成功！')
        this.addMenuForm = {}
        this.getMenu()
      })
      this.handleAddMenuDialogVisible = false
      this.AddMenuDialogVisible = false
    },

    // 删除菜单节点
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.child || parent.data
      const index = children.findIndex(d => d.id === data.id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        children.splice(index, 1)
        // 接口后台删除
        deletemenu(data.id).then(() => {
        })

        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    // 编辑菜单
    showEditDialog(data) {
      console.log(data)
      this.currentEditId = data.id
      this.editMenuDialogVisible = true
    },
    editMenus() {
      editmenu(this.currentEditId, this.editMenuForm).then(() => {
        this.$message.success('编辑菜单成功！')
        this.editMenuForm = {}
        this.getMenu()
      })
      this.editMenuDialogVisible = false
    }
  }
}
</script>

<style scoped>
.custom-tree-container {
  width: 500px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
