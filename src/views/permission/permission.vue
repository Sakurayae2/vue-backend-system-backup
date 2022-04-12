<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入ID" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getPermissionList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加权限</el-button>
        </el-col>
      </el-row>
      <el-table :data="permissionList" border stripe>
        <el-table-column type="index" label="#" align="center" />
        <el-table-column label="ID" prop="id" width="80px" align="center" />
        <el-table-column label="权限名称" prop="authName" align="center" />
        <el-table-column label="请求方法" prop="method" align="center" />
        <el-table-column label="路径" prop="path" align="center" />
        <el-table-column label="是否在白名单" prop="is_white" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_white === false" type="info">否</el-tag>
            <el-tag v-else>是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id, scope.$index)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deletePermission(scope.row.id)"
            >删除</el-button>
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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form
        :model="addPermissionForm"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="authName">
          <el-input v-model="addPermissionForm.authName" />
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-input v-model="addPermissionForm.method" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="addPermissionForm.path" />
        </el-form-item>
        <el-form-item label="是否在白名单" prop="is_white">
          <el-checkbox v-model="addPermissionForm.is_white" size="medium" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPermission">确 定</el-button>
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
        :model="editPermissionForm"
        label-width="100px"
      >
        <el-form-item label="ID">
          <el-input v-model="editPermissionForm.id" disabled />
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="editPermissionForm.authName" />
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-input v-model="editPermissionForm.method" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="editPermissionForm.path" />
        </el-form-item>
        <el-form-item label="是否在白名单" prop="is_white">
          <el-checkbox v-model="editPermissionForm.is_white" size="medium" />
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
import { getPermission, getPermissionID, add, deletePer, edit } from '@/api/permission'

export default {
  data() {
    return {
      // 权限列表
      permissionList: [],
      // 获取用户列表查询参数对象,pagenum:当前页数,pagesize:每页显示多少数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 15
      },
      totle: 0,
      // 添加权限对话框
      addDialogVisible: false,
      // 权限添加
      addPermissionForm: {
        authName: '',
        method: '',
        path: '',
        is_white: false
      },
      method: ['post', 'get', 'put', 'patch', 'delete'],
      // 修改权限
      editDialogVisible: false,
      editPermissionForm: {}
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    getPermissionList() {
      this.permissionList = []
      // 搜索id
      var id = this.queryInfo.query
      if (id) {
        getPermissionID(id).then(res => {
          console.log(res)
          var data = res.data
          this.permissionList.push({
            id: data.id,
            authName: data.name,
            method: data.method,
            path: data.path,
            is_white: data.is_white
          })
        })
        return
      }
      // 分页
      const params = {
        page: this.queryInfo.pagenum,
        size: this.queryInfo.pagesize
      }
      getPermission(params).then(res => {
        // console.log(res)
        const data = res.data.results
        this.totle = res.data.count
        for (var i = 0; i < data.length; i++) {
          this.permissionList.push({
            id: data[i].id,
            authName: data[i].name,
            method: data[i].method,
            path: data[i].path,
            is_white: data[i].is_white
          })
        }
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getPermissionList()
    },
    // 监听 页码值pagenum 改变事件
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getPermissionList()
    },
    // 显示添加权限对话框
    showAddDialog() {
      // this.getPermissionList()
      this.addDialogVisible = true
    },
    // 添加权限
    addPermission() {
      const data = {
        name: this.addPermissionForm.authName,
        method: this.addPermissionForm.method,
        path: this.addPermissionForm.path,
        is_white: this.addPermissionForm.is_white
      }
      add(data).then(() => {
        this.addPermissionForm.authName = ''
        this.addPermissionForm.method = ''
        this.addPermissionForm.path = ''
        this.addPermissionForm.is_white = false
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        this.getPermissionList()
      })
    },
    deletePermission(id) {
      console.log(id)
      deletePer(id).then(() => {
        this.getPermissionList()
      })
    },
    // 显示编辑权限对话框
    showEditDialog(id, index) {
      this.editPermissionForm.id = id
      this.$set(this.editPermissionForm, "is_white", this.permissionList[index].is_white)
      this.editDialogVisible = true
    },
    editUser() {
      const id = this.editPermissionForm.id
      const data = {
        name: this.editPermissionForm.authName,
        method: this.editPermissionForm.method,
        path: this.editPermissionForm.path,
        is_white: this.editPermissionForm.is_white
      }
      edit(id, data).then(res => {
        this.editPermissionForm = {}
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        this.getPermissionList()
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
