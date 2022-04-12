<template>
  <div class="pp-container">
    <el-card>
      <el-row type="flex" justify="space-between" style="margin-bottom: 15px;">
        <el-col :span="12">
          <el-input v-model="query.uin_list" placeholder="请输入uin,多uin格式如:123,456" clearable @keyup.enter.native="fnAddUser">
            <el-button slot="append" icon="el-icon-plus" @click.native="fnAddUser" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchInput" placeholder="请输入本地搜索的ID" clearable @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <p>官方认证用户:</p>
          <div class="TestContent">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              class="tags"
              :disable-transitions="false"
              @close="fnRemoveUser(tag)"
            >{{ tag }}
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getOfficialUser, addOfficialUser, removeOfficialUser } from '@/api/award'
import qs from 'qs'

export default {
  data() {
    return {
      query: {
        uin_list: ''
      },
      dynamicTags: [],
      searchInput: ''
    }
  },
  created() {
    this.fnGetList()
  },
  methods: {
    // 获取
    fnGetList() {
      getOfficialUser().then(res => {
        this.dynamicTags = res.data.retData.dataList
      })
    },
    // 添加
    fnAddUser() {
      // 去重
      if (this.dynamicTags.indexOf(Number(this.query.uin_list)) !== -1) {
        this.$message.warning('存在重复uin')
        return
      }
      const reg = /^(\d*)(,\d+)*$/
      if (reg.test(this.query.uin_list)) {
        // console.log(reg.test(this.query.uin_list))
        addOfficialUser(qs.stringify(this.query)).then(res => {
          if (res.data.retData.statusCode === 200) {
            this.$message.success('添加用户官方认证成功')
            this.query.uin_list = ''
            this.fnGetList()
          }
        })
      } else {
        this.$message.success('输入格式不满足，请检查，逗号以英文隔开,末尾不能为逗号')
      }
    },
    // 移除
    fnRemoveUser(tag) {
      const data = { uin: tag }
      removeOfficialUser(qs.stringify(data)).then(res => {
        // console.log(res.data.retData.statusCode)
        if (res.data.retData.statusCode === 200) {
          this.$message.success('取消用户' + tag + '官方认证成功')
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
          this.fnGetList()
        }
      })
    },
    // 搜索已有用户
    search() {
      var index = this.dynamicTags.indexOf(Number(this.searchInput))
      if (index === -1) {
        this.$message.warning('不存在该用户')
        return
      }
      const tags = document.getElementsByClassName('tags')
      tags[index].style.color = 'red'
      tags[index].style.borderColor = 'red'
      setTimeout(() => {
        tags[index].style.color = '#409EFF'
        tags[index].style.borderColor = '#d9ecff'
      }, 10000)
      this.searchInput = ''
    }
  }
}
</script>

<style scoped lang="scss">
.TestContent{
  width: 90%;
  min-height: 200px;
  border: 1px solid #ccc;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
}
.el-tag + .el-tag {
  margin-top: 5px;
  margin-left: 10px;
}
</style>
