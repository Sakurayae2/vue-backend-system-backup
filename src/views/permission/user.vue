<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入ID" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column type="index" label="#" align="center" />
        <el-table-column prop="id" label="ID" width="80px" align="center" />
        <el-table-column prop="username" label="姓名" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="roles_name" label="角色" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              circle
              @click="showEditDialog(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              circle
              @click="removeUserById(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
        style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" />
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="selectRoleId" multiple placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        label-width="90px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" />
        </el-form-item>
        <el-form-item label="当前角色" prop="roles_name">
          {{ editUserForm.roles_name }}
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="selectRoleId" multiple placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, getUserID, add, deleteUser, edit } from '@/api/user'
import { getRole } from '@/api/role'

export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    return {
      // 获取用户列表查询参数对象,pagenum:当前页数,pagesize:每页显示多少数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      totle: 0,
      userlist: [],
      // 添加用户对话框
      addDialogVisible: false,
      // 用户添加
      addUserForm: {
        username: '',
        email: '',
        roles: []
      },
      // 用户添加表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名的长度在2～10个字',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 修改用户
      editDialogVisible: false,
      editUserForm: {},
      // 编辑用户表单验证
      editUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名的长度在2～10个字',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 所有角色数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectRoleId: ''
    }
  },
  created() {
    this.getUserList()
    // this.getRolesList()
  },
  methods: {
    getUserList() {
      this.userlist = []
      // 搜索id
      var id = this.queryInfo.query
      if (id) {
        getUserID(id).then(res => {
          var data = res.data
          this.userlist.push({
            id: data.id,
            username: data.username,
            email: data.email,
            roles: data.roles,
            roles_name: data.roles_name
          })
        })
        return
      }
      // 获取分页列表
      const params = { page: this.queryInfo.pagenum, size: this.queryInfo.pagesize }
      getUser(params).then(res => {
        // console.log(res)
        var data = res.data.results
        this.totle = res.data.count
        for (var i = 0; i < data.length; i++) {
          this.id = data[i].id
          this.userlist.push({
            id: data[i].id,
            username: data[i].username,
            email: data[i].email,
            roles: data[i].roles,
            roles_name: data[i].roles_name + ''
          })
        }
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值pagenum 改变事件
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },
    // 显示添加用户对话框
    showAddDialog() {
      this.getRolesList()
      this.selectRoleId = ''
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.addUserForm.roles = this.selectRoleId
      add(this.addUserForm).then(() => {
        this.$message.success('添加用户成功！')
        this.getUserList()
        // 清空添加用户列表
        this.addUserForm.username = ''
        this.addUserForm.email = ''
        this.addUserForm.roles = []
      })
      // 隐藏添加用户对话框
      this.addDialogVisible = false
    },
    // 删除用户
    removeUserById(index) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        var id = this.userlist[index].id
        deleteUser(id).then(res => {
          this.getUserList()
        })
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 显示编辑用户信息对话框
    showEditDialog(currentRow) {
      this.getRolesList()
      this.$set(this.editUserForm, 'id', currentRow.id)
      this.$set(this.editUserForm, 'username', currentRow.username)
      this.$set(this.editUserForm, 'email', currentRow.email)
      this.$set(this.editUserForm, 'roles_name', currentRow.roles_name)
      // 选择框默认值
      this.selectRoleId = currentRow.roles
      this.editDialogVisible = true
    },
    editUser() {
      const id = this.editUserForm.id
      const data = {
        username: this.editUserForm.username,
        email: this.editUserForm.email,
        roles: this.selectRoleId
      }
      console.log(data)
      edit(id, data).then(res => {
        this.$message.success('修改用户成功！')
        this.getUserList()
      })
      this.editDialogVisible = false
    },
    // 获取角色列表
    getRolesList() {
      if (this.rolesList.length !== 0) { return }
      getRole().then(res => {
        this.rolesList = []
        var data = res.data
        for (var i = 0; i < data.length; i++) {
          this.id = data[i].id
          this.rolesList.push({ id: data[i].id, roleName: data[i].name })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
