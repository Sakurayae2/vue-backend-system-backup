<template>
  <div style="padding: 20px;">
    <!-- 顶部选择栏 -->
    <div>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        @change="changeDate"
      >
      </el-date-picker>
      <el-radio v-model="radio" label="1" style="padding-left: 20px">按时间</el-radio>
      <el-radio v-model="radio" label="2">按相似度</el-radio>
    </div>

    <!-- 列表数据 -->
    <div style="margin: 30px 0 20px 0">
      <table border="1px solid #ccc" cellspacing="0" cellpadding="10"
             style="border: 1px solid #ccc;border-collapse: collapse;">
        <th width="120">时间</th>
        <th width="190">用户</th>
        <th width="200">状态/操作</th>
        <th width="1000">{{ msg }}</th>
        <tr v-for="(item,index) in tableData" :key="index">
          <td style="text-align: center">{{ item.finishedCollectTime }}</td>
          <td>
            <ul class="ul" style="text-align: center;line-height: 27px">
              <li>
                <el-image :src="item.own.url" class="Avatar" @click="getImag(index,-1)"></el-image>
              </li>
              <li>{{ item.own.nick }}</li>
              <li style="color: #1482f0" @click="openUin">({{ item.own.uin }})</li>
              <li>{{ '(' + item.own.uin + ')' }}</li>
              <li>({{ item.own.mac }})</li>
              <li>{{ item.own.address }}</li>
            </ul>
          </td>
          <td style="text-align: center;">
            {{ item.status }}
            <div style="padding: 20px">
              <button class="btn" @click="review(1,index)">审核为新</button>
              <button class="btn" @click="review(0,index)">审核为旧</button>
              <button class="btn" @click="review(3,index)">年龄不符</button>
            </div>
          </td>
          <td style="text-align: center;line-height: 27px">
            <ul v-for="(itemChild,indexChild) in tableData[index].commonList" :key="indexChild" class="ul"
                style="padding-right: 50px">
              <li>
                <el-image :src="itemChild.url" class="Avatar" @click="getImag(index,indexChild)"></el-image>
              </li>
              <li>{{ itemChild.nick }}</li>
              <li style="color: #1482f0" @click="openUin">({{ itemChild.uin }})</li>
              <li>({{ itemChild.score }})</li>
              <li>({{ itemChild.mac }})</li>
              <li>{{ itemChild.address }}</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.pageNub"
      :page-sizes="[40, 80, 100, 200]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 30px"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getTable, getReview } from '@/api/reviewPerson'
export default {
  data() {
    return {
      date: '',
      radio: '1',
      muin: '',
      mdst: '',
      total: 0,
      msg: '总共:6 新人:5 待审核:0 旧人:1',
      tableData: [],
      params: {
        pid: 1,
        pageSize: 40,
        tjdate: '',
        type: 1,
        pageNub: 1
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始默认获取当前时间的列表数据
    init() {
      this.date = new Date().Format('yyyy-MM-dd')
      this.params.tjdate = this.date
      this.getTableList()
    },

    // 选择日期
    changeDate() {
      this.params.tjdate = this.date.Format('yyyy-MM-dd')
      this.getTableList()
    },

    // 获取列表数据
    async getTableList() {
      const res = await getTable(this.params)
      // console.log('res:', res)
      this.tableData = res.data.retData.dataList
      this.total = res.data.retData.total
    },

    // 跳转页面并传参
    // getImag(index, indexChild) {
    //   if (indexChild === -1) {
    //     this.$router.push({
    //       name: 'avator',
    //       query: {
    //         mainname: this.tableData[index].own.nick,
    //         mainuin: this.tableData[index].own.uin,
    //         ownname: 'undefined',
    //         ownuin: 'undefined'
    //       }
    //     })
    //   } else {
    //     this.$router.push({
    //       name: 'avator',
    //       query: {
    //         mainname: this.tableData[index].own.nick,
    //         mainuin: this.tableData[index].own.uin,
    //         ownname: this.tableData[index].commonList[indexChild].nick,
    //         ownuin: this.tableData[index].commonList[indexChild].uin
    //       }
    //     })
    //   }
    // },

    getImag(index,indexChild) {
      if(indexChild === -1) {
        let newPage = this.$router.resolve({
          name:'avator',
          query: {
            mainname: this.tableData[index].own.nick,
            mainuin: this.tableData[index].own.uin,
            ownname: 'undefined',
            ownuin: 'undefined'
          }
        })
        window.open(newPage.href, 'avator');
      }else {
        let newPage = this.$router.resolve({
          name: 'avator',
          query: {
            mainname: this.tableData[index].own.nick,
            mainuin: this.tableData[index].own.uin,
            ownname: this.tableData[index].commonList[indexChild].nick,
            ownuin: this.tableData[index].commonList[indexChild].uin
          }
        })
        window.open(newPage.href, 'avator');
      }

    },

    // 审核新旧人
    async review(num, index) {
      const params = {
        pid: 1,
        uin: this.tableData[index].own.uin,
        dst: this.tableData[index].commonList[0].uin,
        isNew: 0
      }
      if (num === 1) {
        params.isNew = 1
      } else if (num === 0) {
        params.isNew = 1
      } else if (num === 3) {
        params.isNew = 1
      }
      const res = await getReview(params)
      console.log(res)
    },

    // 跳转登陆
    openUin() {
      window.open('https://www.suibo.tv/admin/login/index')
    },

    handleSizeChange(newSize) {
      this.params.pageSize = newSize
      this.getTableList()
    },
    handleCurrentChange(newPage) {
      this.params.pageNub = newPage
      this.getTableList()
    }
  }
}
</script>

<style>
.li {
  display: block;
  display: flex;
}

.ul {
  display: inline-block;
}

.btn {
  display: inline-block;
  border: 1px solid #1d1b12;
  width: 80px;
  height: 40px;
  line-height: 30px;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: #cee6ff;
  color: #1482f0;
}

.Avatar {
  width: 110px;
  border-radius: 5px;
}
</style>
