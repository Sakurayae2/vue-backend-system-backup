<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 日期选择 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="6">
          <el-input v-model="queryInfo.roomUin" placeholder="请输入房间ID" clearable @blur="blurGetAwardList">
            <el-button slot="append" icon="el-icon-search" @click="blurflag&&getAwardList()" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <div class="block">
            <el-date-picker
              v-model="currentDate"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @blur="getAwardList"
            >
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#" align="center" />
        <!-- <el-table-column prop="id" label="#" /> -->
        <el-table-column prop="roomLogo" label="头像" align="center">
          <template slot-scope="scope">
            <div>
              <el-avatar :size="60" :src="userlist[scope.$index].roomLogo"></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roomname" label="房间名" align="center" />
        <el-table-column prop="roomUin" label="房间ID" align="center" />
        <el-table-column prop="sdate" label="时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-row> -->
            <el-col v-if="userlist[scope.$index].noRule === false" :span="12">
              <el-button
                type="danger"
                size="medium"
                round
                @click="switchGift(scope.$index, $event)"
              >取消奖励
              </el-button>
            </el-col>
            <el-col v-else :span="12">
              <el-button
                type="info"
                size="medium"
                round
                @click="switchGift(scope.$index, $event)"
              >已取消奖励
              </el-button>
            </el-col>
            <!-- </el-row> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
        style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>

import { getAward, editAward } from '@/api/award'
import qs from 'qs'

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },
      currentDate: '',
      // 获取用户列表查询参数对象,pagenum:当前页数,pagesize:每页显示多少数据
      queryInfo: {
        date: '',
        roomUin: '',
        pagenum: 1,
        pagesize: 20
      },
      totle: 0,
      userlist: [],
      editaward: {
        roomUin: '',
        sdate: ''
      },
      searchflag: false,
      blurflag: true
    }
  },
  created() {
    this.getYesterdayTime()
    this.getAwardList()
  },
  methods: {
    getAwardList() {
      this.userlist = []
      this.queryInfo.date = this.currentDate
      getAward(
        {
          date: this.queryInfo.date,
          roomUin: this.queryInfo.roomUin,
          page: this.queryInfo.pagenum,
          size: this.queryInfo.pagesize
        }).then(res => {
        // console.log(res)
        const data = res.data.retData.dataList
        this.totle = res.data.retData.total
        for (var i = 0; i < data.length; i++) {
          this.userlist.push({
            roomLogo: data[i].roomLogo,
            roomname: data[i].roomName,
            roomUin: data[i].roomUin,
            sdate: data[i].sdate,
            noRule: data[i].noRule
          })
        }
        this.blurflag = true
      })
      // 接口测试
      // this.$http
      //   .get('http://www.suibo.tv/api/pwapi/active/anysing/backend', {
      //     params: {
      //       date: this.queryInfo.date,
      //       roomUin: this.queryInfo.roomUin,
      //       page: this.queryInfo.pagenum,
      //       size: this.queryInfo.pagesize
      //     }
      //   })
      //   .then(
      //     res => {
      //       // console.log(res)
      //       var data = res.data.retData.dataList
      //       this.totle = res.data.retData.total
      //       for (var i = 0; i < data.length; i++) {
      //         this.userlist.push({
      //           roomLogo: data[i].roomLogo,
      //           roomname: data[i].roomName,
      //           roomUin: data[i].roomUin,
      //           sdate: data[i].sdate,
      //           noRule: data[i].noRule
      //         })
      //       }
      //       this.blurflag = true
      //     }
      //   )
    },
    blurGetAwardList() {
      this.blurflag = false
      this.getAwardList()
    },
    // 获取昨天日期
    getYesterdayTime() {
      var now = new Date()
      var year = now.getFullYear()
      var month = now.getMonth()
      var date = now.getDate()
      month = month + 1
      date-- // 获得昨天日期
      if (date < 1) {
        month--
        if (month < 1) {
          year--
          month = 12
        }
        date = new Date(year, month, 0).getDate()
      }
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      this.currentDate = `${year}-${month}-${date}`
      this.queryInfo.date = this.currentDate
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAwardList()
    },
    // 监听 页码值pagenum 改变事件
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getAwardList()
    },
    switchGift(id, event) {
      var inner = event.toElement.innerHTML
      inner = (inner.trim() === '已取消奖励') ? (inner = '添加奖励 ') : inner
      this.$confirm('此操作将' + inner + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 修改奖励
        this.editaward = []
        this.editaward.roomUin = this.userlist[id].roomUin
        this.editaward.sdate = this.userlist[id].sdate
        editAward(qs.stringify(this.editaward.sdate)).then(res => {
          console.log(res)
          // 更改奖励操作
          if (id) {
            this.userlist[id].noRule = !this.userlist[id].noRule
          } else {
            this.userlist[id].noRule = !this.userlist[id].noRule
          }
          this.$message({
            type: 'success',
            message: inner + '操作成功'
          })
        })
        // 接口测试
        // this.$http
        //   .post('http://192.168.2.141:19100/api/pwapi/active/anysing/backend', qs.stringify(this.editaward.sdate))
        //   .then(() => {
        //     // 更改奖励操作
        //     if (id) {
        //       this.userlist[id].noRule = !this.userlist[id].noRule
        //     } else {
        //       this.userlist[id].noRule = !this.userlist[id].noRule
        //     }
        //     this.$message({
        //       type: 'success',
        //       message: inner + '操作成功'
        //     })
        //   })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更改操作'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
