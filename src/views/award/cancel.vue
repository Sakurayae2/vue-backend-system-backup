<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 日期选择 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="8">
          <el-input v-model="roomUin" placeholder="请输入ID" @blur="blurGetCancelList">
            <el-select slot="prepend" v-model="select" placeholder="请选择" clearable style="width: 100px;">
              <el-option label="用户ID" value="user" />
              <el-option label="房间ID" value="room" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="blurflag&&getCancelList()" />
          </el-input>
        </el-col>
        <el-col style="width: 200px">
          <el-input type="text" placeholder="tips:勾选代表取消奖励" disabled />
        </el-col>
      </el-row>
      <!-- 取消奖励列表区域 -->
      <el-table :data="cancellist" border stripe>
        <el-table-column type="index" label="#" align="center" />
        <!--<el-table-column prop="uin" label="uin" width="120px" align="center" />-->
        <el-table-column prop="awardType" label="奖励类型" width="120px" align="center" />
        <el-table-column prop="status" label="操作" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-col>
                <el-checkbox
                  v-for="(item, index) in oneWeek"
                  :key="index"
                  v-model="cancellist[scope.$index].status[index]"
                  :checked="cancellist[scope.$index].status[index]"
                  border
                  style="margin: 5px"
                  @change="cancelAward(scope.$index, index)"
                >{{ item }}</el-checkbox>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getCancel, cancelAwa } from '@/api/award'
import qs from 'qs'

export default {
  name: 'Cancel',
  data() {
    return {
      currentDate: '',
      select: 'user',
      roomUin: '',
      cancellist: [],
      oneWeek: [],
      blurflag: true
    }
  },
  created() {
    this.getYesterdayTime()
    // this.getCancelList()
  },
  methods: {
    getCancelList() {
      // console.log(this.select)
      this.cancellist = []
      getCancel({ idtype: this.select, uin: this.roomUin }).then(res => {
        // console.log(res)
        const data = res.data.retData.dataList
        const resType = res.data.retData.statusCode === 401 ? 'warning' : 'success'
        this.$message({
          type: resType,
          message: res.data.retData.msg
        })
        for (var i = 0; i < data.length; i++) {
          this.cancellist.push({
            uin: data[i].uin,
            awardType: data[i].type,
            status: data[i].date
          })
          // 0,1转换为false,true
          for (var j = 0; j < this.cancellist[i].status.length; j++) {
            this.cancellist[i].status[j] = Boolean(this.cancellist[i].status[j])
          }
        }
        this.blurflag = true
      })
      // this.$http
      //   .get('http://192.168.2.141:19100/api/pwapi/active/backend/cancelaward', { params: { idtype: this.select, uin: this.roomUin }})
      //   .then(res => {
      //     // console.log(res)
      //     const data = res.data.retData.dataList
      //     const resType = res.data.retData.statusCode === 401 ? 'warning' : 'success'
      //     this.$message({
      //       type: resType,
      //       message: res.data.retData.msg
      //     })
      //     for (var i = 0; i < data.length; i++) {
      //       this.cancellist.push({
      //         uin: data[i].uin,
      //         awardType: data[i].type,
      //         status: data[i].date
      //       })
      //       // 0,1转换为false,true
      //       for (var j = 0; j < this.cancellist[i].status.length; j++) {
      //         this.cancellist[i].status[j] = Boolean(this.cancellist[i].status[j])
      //       }
      //     }
      //     this.blurflag = true
      //   })
    },
    cancelAward(scopeIndex, index) {
      const data = {
        uin: this.cancellist[scopeIndex].uin,
        type: this.cancellist[scopeIndex].awardType,
        date: this.oneWeek[index],
        idtype: this.select
      }
      // console.log(data)
      cancelAwa(qs.stringify(data)).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
      // this.$http
      //   .post('http://192.168.2.141:19100/api/pwapi/active/backend/cancelaward', qs.stringify(data))
      //   .then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功'
      //     })
      //   })
    },
    // 控制搜索中blur、click不被同时触发
    blurGetCancelList() {
      this.blurflag = false
      this.getCancelList()
    },
    // 获取日期
    getYesterdayTime() {
      var now = new Date()
      var year = now.getFullYear()
      var month = now.getMonth()
      var date = now.getDate()
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      this.currentDate = `${year}-${month}-${date}`
      // 递减周
      // for (var i = 0; i < 7; i++, date--) {
      //   if (date < 10) { date = date.toString().padStart(2, '0') }
      //   if (date <= 0) {
      //     month = (--month).toString().padStart(2, '0')
      //     date = new Date(year, month, 0).getDate()
      //   }
      //   if (month <= 0) { year--; month = 12 }
      //   this.oneWeek.push(`${year}-${month}-${date}`)
      // }
      // 递增周
      for (var i = 0; i < 7; i++, date++) {
        if (date > new Date(year, month, 0).getDate()) {
          date = 1
          month = (++month).toString().padStart(2, '0')
        }
        if (month > 12) { year++ }
        date = date.toString().padStart(2, '0')
        this.oneWeek.push(`${year}-${month}-${date}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>

