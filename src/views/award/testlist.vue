<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="uin" placeholder="请输入一个或多个ID,如:1,2,3" @keyup.enter.native="addTestUser" clearable>
            <el-button slot="append" icon="el-icon-plus" @click="addTestUser" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchInput" placeholder="请输入本地搜索的ID" @keyup.enter.native="search" @blur="search" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <p>测试用户名单:</p>
          <div class="TestContent">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              class="tags"
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getTest, addTest, deleteTest } from '@/api/award'
import qs from 'qs'

export default {
  data() {
    return {
      searchInput: '',
      uin: '',
      testList: '',
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getTestList()
  },
  methods: {
    search(){
      var index = this.dynamicTags.indexOf(this.searchInput)
      // console.log(index)
      console.log(this.dynamicTags[index])
      const tags = document.getElementsByClassName('tags')
      tags[index].style.color = "red"
      tags[index].style.borderColor = "red"
      setTimeout(() => {
        tags[index].style.color = "#409EFF"
        tags[index].style.borderColor = "#d9ecff"
      }, 10000)
      this.searchInput = ''
    },
    getTestList() {
      getTest().then(res => {
        this.testList = res.data.retData.dataList
        this.dynamicTags = res.data.retData.dataList
      })
    },
    // 添加多个
    addTestUser() {
      const data = { new_list: this.uin }
      addTest(qs.stringify(data)).then(res => {
        this.$message.success('添加新用户：' + res.data.retData.dataList + ' 成功')
        this.getTestList()
      })
    },
    // 删除用户
    handleClose(tag) {
      const data = { new_list: tag }
      deleteTest(qs.stringify(data)).then(res => {
        this.$message.success('成功删除' + res.data.retData.dataList)
        // this.getTestList()
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      })
    },
    // 显示New Tag输入框
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // New Tag 添加新用户
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        const data = { new_list: inputValue }
        const index = this.dynamicTags.indexOf(this.inputValue)
        if(index >= 0){
          this.$message.warning('重复添加新用户：' + this.inputValue + ' ')
          const tags = document.getElementsByClassName('tags')
          tags[index].style.borderColor = "red"
          setTimeout(() => {
            tags[index].style.borderColor = "#d9ecff"
          }, 3000)
          this.inputValue = ''
          return
        }
        getTest(qs.stringify(data)).then(res => {
          this.$message.success('添加新用户：' + this.inputValue + ' 成功')
          // this.getTestList()
          this.dynamicTags.push(inputValue)
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
.TestContent{
  width: 80%;
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
.button-new-tag {
  margin-top: 5px;
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
