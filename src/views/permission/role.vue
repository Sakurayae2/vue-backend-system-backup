<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入ID" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getRolesList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" style="margin-bottom: 10px;" @click="AddRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="index" label="#" align="center" />
        <el-table-column label="角色ID" prop="id" align="center" />
        <el-table-column label="角色名称" prop="roleName" align="center" />
        <el-table-column label="唯一标识key" prop="key" align="center" />
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row,scope.$index)"
            >编辑
            </el-button>
            <el-button
              v-if="scope.row.id !== 1"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配菜单
            </el-button>
<!--            <el-button-->
<!--              v-if="scope.row.id === 1"-->
<!--              type="info"-->
<!--              size="small"-->
<!--              disabled-->
<!--            >无法对管理员进行操作-->
<!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
        style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="menu"
        :props="defaultProps"
        show-checkbox
        check-strictly
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        @check="handleCheckChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%">
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="110px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"/>
        </el-form-item>
        <el-form-item label="唯一标识key" prop="key">
          <el-input v-model="addRoleForm.key"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%">
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRoleForm.name"/>
        </el-form-item>
        <el-form-item label="唯一标识" prop="key">
          <el-input v-model="editRoleForm.key"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getRole, getRoleID, addRole, deleteRole, editRole } from '@/api/role'
import { getmenu } from '@/api/permission'

export default {
  data() {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      // 获取用户列表查询参数对象,pagenum:当前页数,pagesize:每页显示多少数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 15
      },
      totle: 0,
      // 所有角色列表
      rolesList: [],
      // 分配权限框
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      //  树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //   默认选中节点ID值
      defKeys: [],
      // 当前选中节点ID值
      currentNodeKey: [],
      //   添加角色对话框
      AddRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {},
      //   添加角色表单验证
      addRoleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色的长度在2～10个字', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' },
          { min: 1, max: 10, message: '角色的长度在1～10个字', trigger: 'blur' }
        ]
      },
      // 编辑角色信息
      editRoleForm: {},
      editRoleDialogVisible: false,
      editIndex: '',
      editRoleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色的长度在2～10个字', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' }
        ]
      },
      // 当前即将分配权限的Id
      roleId: 0,
      menu: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      this.rolesList = []
      // 搜索id
      var id = this.queryInfo.query
      if (id) {
        getRoleID(id).then(res => {
          var data = res.data
          this.rolesList.push({
            id: data.id,
            key: data.key,
            roleName: data.name
          })
          this.$message.success('查询成功！')
        })
        return
      }
      // 页码
      const params = { page: this.queryInfo.pagenum, size: this.queryInfo.pagesize }
      getRole(params).then(res => {
        // console.log(res)
        var data = res.data
        for (var i = 0; i < data.length; i++) {
          this.id = data[i].id
          this.rolesList.push({
            id: data[i].id,
            key: data[i].key,
            roleName: data[i].name,
            menus: data[i].menus
          })
        }
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getRolesList()
    },
    // 监听 页码值pagenum 改变事件
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getRolesList()
    },
    // 权限对话框关闭事件
    setRightDialogClosed() {
      // console.log(this.defKeys)
      // this.defKeys = []
    },
    // 添加角色
    addRoles() {
      const data = {
        name: this.addRoleForm.name,
        key: this.addRoleForm.key
      }
      addRole(data).then(() => {
        this.$message.success('添加角色成功！')
        this.getRolesList()
      })
      this.AddRoleDialogVisible = false
    },
    // 删除角色
    removeRoleById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色
        deleteRole(id).then(() => {
          this.getRolesList()
          this.$message.success('删除成功！')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 编辑角色
    showEditDialog(currentRow, index) {
      this.editIndex = index
      this.editRoleForm.id = currentRow.id
      this.$set(this.editRoleForm, 'name', currentRow.roleName)
      this.$set(this.editRoleForm, 'key', currentRow.key)
      this.editRoleDialogVisible = true
    },
    editRoles() {
      const id = this.editRoleForm.id
      const data = {
        name: this.editRoleForm.name,
        key: this.editRoleForm.key
      }
      console.log(data)
      editRole(id, data).then(() => {
        // this.getRolesList()
        this.rolesList[this.editIndex].roleName = data.name
        this.rolesList[this.editIndex].key = data.key
        this.$message.success('修改角色信息成功！')
      })
      // 隐藏编辑角色对话框
      this.editRoleDialogVisible = false
    },
    // 分配权限菜单
    getMenu() {
      const data = { drop: true, tree: true, level: 1 }
      getmenu(data).then(res => {
        this.menu = res.data
      })
    },
    showSetRightDialog(role) {
      this.roleId = role.id
      if (!this.menu.length) { this.getMenu() }
      if (!this.defKeys.length) { this.defKeys = role.menus }
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys(role.menus)
      })
      this.setRightDialogVisible = true
    },
    // 分配权限菜单
    allotRights() {
      editRole(this.roleId, { menus: this.currentNodeKey }).then(() => {
        this.$message.success('分配菜单成功！')
        this.defKeys = []
        this.getRolesList()
      })
      this.setRightDialogVisible = false
    },
    handleCheckChange() {
      this.currentNodeKey = []
      const res = this.$refs.treeRef.getCheckedNodes(false, true)
      res.forEach(item => {
        this.currentNodeKey.push(item.id)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
