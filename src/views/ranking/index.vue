<template>
  <div class="app-container">
<!--    <el-card>-->
<!--      <el-row type="flex" justify="space-between">-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="queryInfo.blockitem" placeholder="请输入uin/机器码" clearable @keyup.enter.native="getList">-->
<!--            <el-button slot="append" icon="el-icon-search" @click.native="getList" />-->
<!--          </el-input>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-table :data="tableData" highlight-current-row>-->
<!--        <el-table-column type="index" label="#" align="center"></el-table-column>-->
<!--        <el-table-column prop="user" label="用户" align="center"></el-table-column>-->
<!--        <el-table-column prop="addtime" label="封锁时间" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <div>{{ scope.row.operator }}</div>-->
<!--            <div>{{ scope.row.addtime }}</div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="type" label="封锁类型" align="center"></el-table-column>-->
<!--        <el-table-column prop="blackitem" label="封锁主体" align="center"></el-table-column>-->
<!--        <el-table-column prop="hours" label="封锁时长" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <p>{{ scope.row.hours === 0 ? '永久' : scope.row.hours }}</p>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="descr" label="封锁原因" align="center" width="206px">-->
<!--          <template slot-scope="scope">-->
<!--            <p>{{ scope.row.descr }}</p>-->
<!--            <el-image-->
<!--              v-for="(item,index) in scope.row.images"-->
<!--              :key="index"-->
<!--              class="img"-->
<!--              :src="item"-->
<!--              :preview-src-list="srcList"-->
<!--              @click="preview(scope.row.images)"-->
<!--            >-->
<!--            </el-image>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="unlock_desc" label="解封" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <div v-if="scope.row.unlock_user !== null">解封人:{{ scope.row.unlock_user }}</div>-->
<!--            <div>{{ scope.row.unlock_time }}</div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="unlock_desc" label="解封备注" align="center"></el-table-column>-->
<!--        <el-table-column prop="address" label="申诉与操作" align="center" min-width="152px">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button v-if="scope.row.is_delete === 0" type="primary" size="mini" style="margin: 5px;" @click="unblock(scope.row)">解封</el-button>-->
<!--            <el-button v-if="scope.row.state === 0" type="danger" size="mini" style="margin: 5px;" @click="reject(scope.row)">驳回</el-button>-->
<!--            <el-button v-if="scope.row.state === -1" type="danger" size="mini" style="margin: 5px;" disabled @click="reject(scope.row)">已驳回</el-button>-->
<!--            <div v-if="scope.row.created !== ''">申诉时间 <br /> {{ scope.row.created }}</div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      &lt;!&ndash; 分页区域 &ndash;&gt;-->
<!--      <el-pagination-->
<!--        :current-page="queryInfo.page"-->
<!--        :page-sizes="[5, 10, 15, 20, 30]"-->
<!--        :page-size="queryInfo.size"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="totle"-->
<!--        style="margin-top: 20px;"-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--      />-->
<!--    </el-card>-->
    <user-info></user-info>
  </div>
</template>

<script>
import userInfo from '@/views/ranking/components/userInfo'
import { getComplaintList, userUnblock, rejectApply } from '@/api/roomManagement'
import qs from 'qs'

export default {
  components: {
    userInfo
  },
  inject: ['reload'],
  data() {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      name: 'smk',
      queryInfo: {
        blockitem: '',
        page: 1,
        size: 10,
        state: -1
      },
      totle: 0,
      tableData: [],
      unblockFrom: {}
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      getComplaintList(qs.stringify(this.queryInfo)).then(res => {
        console.log(res.data.retData)
        this.tableData = res.data.retData.results
        this.totle = res.data.retData.total
      })
    },
    unblock(row) {
      const { cate, unlock_uin, unlock_desc, blackitem } = row
      const data = { cate, unlock_uin, unlock_desc, blackitem, password: '23651943' }
      userUnblock(qs.stringify(data)).then(res => {
        this.$message.success('解封成功')
        this.reload()
      })
    },
    reject(row) {
      const { cate, unlock_uin, unlock_desc, blackitem } = row
      const data = { cate, unlock_uin, unlock_desc, blackitem, password: '23651943' }
      rejectApply(qs.stringify(data)).then(res => {
        this.$message.success('驳回成功')
        this.reload()
      })
    },
    // 大图预览
    preview(imgUrl) {
      this.srcList = []
      this.srcList = imgUrl
      this.$nextTick(() => {
        // 获取遮罩层dom
        const domImageMask = document.querySelector('.el-image-viewer__mask')
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.getList()
    },
    // 监听 页码值pagenum 改变事件
    handleCurrentChange(newSize) {
      this.queryInfo.page = newSize
      this.getList()
    },
  }
}
</script>

<style>
.help{
  font-size: 30px;
  line-height: 40px;
  color: #999;
}
.img{
  width: 60px;
  height: 60px;
  margin-right: 2px;
}
</style>
































<!--<template>-->
<!--  <div class="app-container">-->
<!--    &lt;!&ndash; 卡片视图 &ndash;&gt;-->
<!--    <el-card>-->
<!--      &lt;!&ndash; 顶部搜索 日期 &ndash;&gt;-->
<!--      <div>-->
<!--        <template>-->
<!--          <el-select v-model="value" filterable multiple clearable collapse-tags placeholder="请选择" @visible-change="search($event)">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </template>-->
<!--        <template>-->
<!--          <div class="block">-->
<!--            <el-date-picker-->
<!--              v-model="dateSearch"-->
<!--              type="daterange"-->
<!--              unlink-panels-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              :picker-options="pickerOptions"-->
<!--              value-format="yyyy-MM-dd"-->
<!--              @change="dateChange"-->
<!--            ></el-date-picker>-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
<!--      &lt;!&ndash; 表格 &ndash;&gt;-->
<!--      <el-table :data="rankList" stripe style="width: 100%" @cell-click="cellClick" :default-sort="{prop: 'nump', order: 'descending'}">-->
<!--        <el-table-column prop="uin" label="渠道" align="center"></el-table-column>-->
<!--        <el-table-column prop="newly_increased" label="总新增人数" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="total_share_amount" label="总分享次数" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="total_charge_amount" label="总充值金额" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="normal_user_avg_charge" label="用户平均付费" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="charged_user_avg_charge" label="每付费用户平均收入" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="charge_rate" label="充值率/%" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="avg_app_time" label="每户每日平均app时长/h" sortable align="center"></el-table-column>-->
<!--        <el-table-column prop="avg_mic_rate" label="七日平均上麦率/%" sortable align="center"></el-table-column>-->
<!--      </el-table>-->

<!--      &lt;!&ndash; 分页区域 &ndash;&gt;-->
<!--      <el-pagination-->
<!--        :current-page="queryInfo.page"-->
<!--        :page-sizes="[10, 20, 30]"-->
<!--        :page-size="queryInfo.size"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="totle"-->
<!--        style="margin-top: 20px;"-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--      />-->
<!--    </el-card>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { getRankList } from '@/api/ranking'-->

<!--export default {-->
<!--  name: 'index',-->
<!--  data() {-->
<!--    return {-->
<!--      pickerOptions: {-->
<!--        shortcuts: [{-->
<!--          text: '最近一周',-->
<!--          onClick(picker) {-->
<!--            const end = new Date()-->
<!--            const start = new Date()-->
<!--            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)-->
<!--            picker.$emit('pick', [start, end])-->
<!--          }-->
<!--        }, {-->
<!--          text: '最近一个月',-->
<!--          onClick(picker) {-->
<!--            const end = new Date()-->
<!--            const start = new Date()-->
<!--            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)-->
<!--            picker.$emit('pick', [start, end])-->
<!--          }-->
<!--        }, {-->
<!--          text: '最近三个月',-->
<!--          onClick(picker) {-->
<!--            const end = new Date()-->
<!--            const start = new Date()-->
<!--            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)-->
<!--            picker.$emit('pick', [start, end])-->
<!--          }-->
<!--        }]-->
<!--      },-->
<!--      dateSearch: '',-->
<!--      options: [{-->
<!--        value: '选项1',-->
<!--        label: '西城广场'-->
<!--      }, {-->
<!--        value: '选项2',-->
<!--        label: '档案馆'-->
<!--      }, {-->
<!--        value: '选项3',-->
<!--        label: '城西银泰'-->
<!--      }, {-->
<!--        value: '选项4',-->
<!--        label: '西湖文化广场'-->
<!--      }, {-->
<!--        value: '选项5',-->
<!--        label: '深圳'-->
<!--      }],-->
<!--      value: '',-->
<!--      // 查询-->
<!--      queryInfo: {-->
<!--        uin: '36130100',-->
<!--        startTime: '2020-07-25',-->
<!--        endTime: '2021-07-26',-->
<!--        passwd: 'taolesoft0571',-->
<!--        size: 10,-->
<!--        page: 1-->
<!--      },-->
<!--      totle: 0,-->
<!--      // 返回数据-->
<!--      rankList: [{-->
<!--        charged_user_amount: 0, // 充值用户数量-->
<!--        newly_increased: 0, // 总新增用户数量`-->
<!--        total_charge_amount: 0, // 总充值金额`-->
<!--        charged_user_avg_charge: 0, // 每付费用户平均收入`-->
<!--        total_share_amount: 0,  // 总分享次数`-->
<!--        charge_rate: 0, // 充值率`-->
<!--        uin: '36137034',-->
<!--        normal_user_avg_charge: 0,  // 用户平均付费`-->
<!--        avg_mic_rate: 0,  // 上麦率`-->
<!--        avg_app_time: '暂无该项数据'  // 用户每日平均app时长-->
<!--      }]-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    // this.getList()-->
<!--  },-->
<!--  methods: {-->
<!--    // 获取表格数据-->
<!--    getList() {-->
<!--      getRankList(this.queryInfo).then(res => {-->
<!--        console.log(res)-->
<!--        this.rankList = res.data.retData.dataList-->
<!--      })-->
<!--    },-->
<!--    // 单元格点击-->
<!--    cellClick(row, column) {-->
<!--      if (column.label == '渠道') {-->
<!--        console.log(row.uin)-->
<!--      }-->
<!--    },-->
<!--    // 左侧搜索-->
<!--    search(ev) {-->
<!--      if (ev) return-->
<!--      console.log(this.value)-->
<!--    },-->
<!--    // 日期搜索-->
<!--    dateChange() {-->
<!--      // console.log(this.dateSearch)-->
<!--      this.queryInfo.startTime = this.dateSearch[0]-->
<!--      this.queryInfo.endTime = this.dateSearch[1]-->
<!--    },-->
<!--    // 监听 pagesize 改变的事件-->
<!--    handleSizeChange(newSize) {-->
<!--      this.queryInfo.size = newSize-->
<!--      this.getList()-->
<!--    },-->
<!--    // 监听 页码值pagenum 改变事件-->
<!--    handleCurrentChange(newSize) {-->
<!--      this.queryInfo.page = newSize-->
<!--      this.getList()-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.block {-->
<!--  float: right;-->
<!--}-->
<!--</style>-->
