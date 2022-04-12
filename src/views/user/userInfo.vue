<template>
  <div class="pp-container">
    <el-card>
      <el-row type="flex" justify="space-between" style="margin-bottom: 15px;">
        <el-col :span="8">
          <el-input v-model="queryInfo.uin" placeholder="请输入uin/机器码" clearable @keyup.enter.native="getList">
            <el-button slot="append" icon="el-icon-search" @click.native="getList" />
          </el-input>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in userInfoList" :key="index" class="margin10" :label="item.info.uin" :name="index+''">
          <div class="userInfo">
            <div class="avatar">
              <div class="one">
                <el-avatar shape="square" :size="150" :src="item.user_singinfo.imageUrl"></el-avatar>
                <div class="avatarBtn">
                  <el-button type="danger" @click="showDialogFormVisible()">封锁</el-button>
                  <!--<el-button type="danger">默认</el-button>-->
                </div>
              </div>
              <div class="face">
                <el-image style="width: 100%; height: 100%; border-radius: 5px;" :src="item.src1" fit="cover"></el-image>
                <div class="faceTxt">第一张人脸</div>
              </div>
              <div class="face">
                <el-image style="width: 100%; height: 100%; border-radius: 5px;" :src="item.src2" fit="cover"></el-image>
                <div class="faceTxt">最后一张人脸</div>
              </div>
            </div>
            <div class="info">
              <el-descriptions title="用户信息" :column="2">
                <el-descriptions-item label="昵称">{{ item.info.onlynick }}
                <!--<el-tag type="danger" effect="dark" size="small" style="margin-left: 10px;">清除</el-tag>-->
                </el-descriptions-item>
                <el-descriptions-item label="注册日期">{{ item.info.regtime }}</el-descriptions-item>
                <el-descriptions-item label="ID号">{{ item.info.uin }}
                  <el-tag v-if="item.nice_id !== ''" type="danger" effect="dark" size="small" style="margin-left: 10px;">无靓号</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="登录方式">{{ item.loginType[item.info.login_type] }}</el-descriptions-item>
                <el-descriptions-item label="乐豆">{{ item.info.money }}</el-descriptions-item>
                <el-descriptions-item label="机型">{{ item.info.terminal_type }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ item.info.mobile }}</el-descriptions-item>
                <el-descriptions-item label="身份证">{{ item.info.cert_id }}</el-descriptions-item>
                <el-descriptions-item label="乐券">{{ item.info.received }}</el-descriptions-item>
                <el-descriptions-item label="等级">{{ item.info.award_flag || 0 }}级</el-descriptions-item>
                <el-descriptions-item label="收入">{{ item.info.income || 0 }}元</el-descriptions-item>
                <el-descriptions-item label="充值">{{ item.info.charge_money || 0 }}元</el-descriptions-item>
                <el-descriptions-item label="提现">{{ item.info.cash_money || 0 }}元/{{ item.info.cash_num || 0 }}次</el-descriptions-item>
                <el-descriptions-item label="送礼"></el-descriptions-item>
                <el-descriptions-item label="开播">{{ item.info.v_duration || 0 }}分钟/{{ item.info.v_duration_days || 0 }}天</el-descriptions-item>
                <el-descriptions-item label="版本">{{ item.info.version }}</el-descriptions-item>
                <el-descriptions-item label=""></el-descriptions-item>
                <el-descriptions-item label="收徒收益">{{ item.disciples || 0 }}人 总共{{ item.total_ld || 0 }}豆</el-descriptions-item>
                <el-descriptions-item label="最近登录时间">{{ item.updated }}</el-descriptions-item>
                <el-descriptions-item label="贵族">{{ item.nobleman }}</el-descriptions-item>
                <el-descriptions-item label="机器码">{{ item.mac }}
                  <el-popover
                    placement="bottom"
                    trigger="hover">
                    <el-table :data="gridData.machineCode" :show-header="false" :cell-style="{ padding:'0px' }" @row-click="rowClick">
                      <el-table-column width="200" align="center" property="machineCode"></el-table-column>
                    </el-table>
                    <el-tag slot="reference" type="info" effect="dark" size="small" style="margin-left: 10px;">同机号码</el-tag>
                  </el-popover>
                </el-descriptions-item>
                <el-descriptions-item label="IP">({{ item.city }}){{ item.ip }}
                  <el-popover
                    placement="bottom"
                    trigger="hover">
                    <el-table :data="gridData.ip" :show-header="false" :cell-style="{ padding:'0px' }" @row-click="rowClick">
                      <el-table-column width="150" align="center" property="ip"></el-table-column>
                    </el-table>
                    <el-tag slot="reference" type="info" effect="dark" size="small" style="margin-left: 10px;">同IP号码</el-tag>
                  </el-popover>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div class="earnings">
            <div class="block">
              <el-date-picker
                v-model="earningsDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :default-value="new Date()"
                @change="timeSearch"
              ></el-date-picker>
            </div>
            <!--     转化table       -->
            <el-table :data="item.transData" border style="margin-top: 20px;">
              <el-table-column v-for="(childItem, childIndex) in item.transTitle" :key="childIndex" :label="childItem" align="center">
                <template slot-scope="scope">
                  {{ scope.row[childIndex] }}
                  <i
                    v-if="childIndex >= 1 && (scope.$index === 2 && item.transData[scope.$index][childIndex]<120) || (scope.$index === 3 && item.transData[scope.$index][childIndex]<2)"
                    class="el-icon-close"
                    style="color: red;font-weight: bold;"
                  ></i>
                </template>
              </el-table-column>
            </el-table>

            <el-table :data="item.award" stripe border style="margin-top: 20px;">
              <el-table-column prop="date" label="时间"></el-table-column>
              <el-table-column prop="money" label="数量"></el-table-column>
              <el-table-column prop="reason" label="兑换途径"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--  封锁弹窗  -->
    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <el-form :model="blockForm">
        <el-form-item label="用户昵称" :label-width="blockFormLabelWidth">{{ blockForm.name }}</el-form-item>
        <el-form-item label="用户uin" :label-width="blockFormLabelWidth">
          {{ currentUser.uin }}
        </el-form-item>
        <el-form-item label="登录mac" :label-width="blockFormLabelWidth">
          {{ currentUser.mac }}
        </el-form-item>
        <el-form-item label="封锁分类" :label-width="blockFormLabelWidth">
          <el-checkbox v-model="blockNotes.checkedLogin" true-label="1,2" false-label="" label="登录封锁" @change="showDialogFormVisible"></el-checkbox>
          <el-checkbox v-model="blockNotes.checkedRoom" true-label="4" false-label="" label="房间封锁" checked @change="showDialogFormVisible"></el-checkbox>
        </el-form-item>
        <el-form-item label="封锁时长" :label-width="blockFormLabelWidth">
          <el-select v-model="blockNotes.duration" placeholder="请选择封锁时长">
            <el-option
              v-for="(item,index) in blockNotes.hoursList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span class="tips" style="margin-left: 10px;">已被封禁{{ blockNotes.blockCount }}次</span>
        </el-form-item>
        <el-form-item label="封锁理由" :label-width="blockFormLabelWidth">
          <el-checkbox-group v-model="blockNotes.checkList">
            <el-checkbox v-for="(item, index) in blockNotes.checkLabelList" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="理由补充" :label-width="blockFormLabelWidth">
          <el-input
            v-model="blockNotes.textarea"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;">取 消</el-button>
        <el-button type="danger" @click="block">封 锁</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userBlock, getInfoList, getRelationList, getManag, getBlockCount } from '@/api/userManagement'
import { mapGetters } from 'vuex'
import qs from 'qs'

export default {
  name: 'UserInfo',
  data() {
    return {
      // 数量/兑换途径table
      earningsTable: [],
      // 星级/排名table
      tableData: [],
      originTitle: ['星级/排名', '流水(乐豆)', '有效时长(分钟)', '分享(次)'], // 转后的列表头title,原始的行表头
      transTitle: ['', '今天', '昨天'], // 转后的行表头title
      transData: [], // 转化 星级/排名table 为纵向
      // 收益搜索默认时间
      earningsDate: '',
      earningsYesterdayDate: '',
      // 封锁弹窗部分
      dialogFormVisible: false,
      blockForm: {
        password: '23651943',
        operator: '', // 操作人
        name: '',
        uin: '',
        mac: '',
        cate: '', // 1：uin封锁 2：mac封锁 3：ip封锁 4:房间封锁
        hours: 4,
        descr: ''
      },
      blockNotes: {
        checkedLogin: '', // 登录封锁
        checkedRoom: '', // 房间封锁
        duration: '4h',
        hoursList: ['4h', '8h', '16h', '32h', '72h', '永久'],
        blockCount: 0, // 当前用户某项封锁分类封锁次数
        checkList: [],
        checkLabelList: ['涉黄', '擦边', '广告/拉人', '昵称/头像违规', '谩骂', '多账号直播', '刷收益', '双开', '保护祖国花朵'],
        textarea: ''
      },
      blockFormLabelWidth: '120px',
      gridData: {
        machineCode: [],
        ip: []
      },
      // url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      activeName: '0',
      queryInfo: {
        // uin: '30101097',
        // uin: 'FD5F66FA706EBC75',
        uin: '',
        pid: 1,
        mode: 1,
        time: ''
      },
      userInfoList: [
        {
          info: {
            uin: '',
            login_type: 0
          },
          src1: 'https://s.5dktv.com/avator/noone.gif',
          src2: 'https://s.5dktv.com/avator/noone.gif',
          loginType: [''],
          user_singinfo: {
            imageUrl: 'https://s.5dktv.com/avator/noone.gif'
          },
          nice_id: ''
        }
      ],
      currentUser: {
        uin: '',
        mac: ''
      },
      currentIndex: 0,
      count: 0,
      userInfoListIndex: [],
      is_clear_userInfoList: true
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.init()
    if (this.$route.query.uin) {
      this.queryInfo.uin = this.$route.query.uin
      this.getList()
    }
  },
  methods: {
    async getList(e, DataUin) {
      this.queryInfo.mode = 1
      this.queryInfo.time = ''
      const data = {
        uin: DataUin || this.queryInfo.uin,
        pid: this.queryInfo.pid,
        mode: this.queryInfo.mode
      }
      // mac机器码搜索
      if (/[A-Za-z]+/g.test(this.queryInfo.uin) && this.is_clear_userInfoList) {
        if (this.is_clear_userInfoList) this.userInfoList = [] // 清空用户信息列表
        const resMac = await getRelationList(data)
        // 循环获取同机器码的uin账号
        const arr = resMac.data.retData.slice(0, 5)
        for (let i = 0; i < arr.length; i++) {
          // this.queryInfo.uin = arr[i].uin
          this.is_clear_userInfoList = false
          await this.getList(e, arr[i].uin)
          this.count++
        }
        this.is_clear_userInfoList = true
        this.count = 0
        return
      }
      // 请求用户信息
      const res1 = await getInfoList(data)
      const res2 = await getManag(qs.stringify(data))
      // const res1 = await this.$http.get('https://www.suibo.tv/api/pwapi/manage/user/info', { params: data })
      // const res2 = await this.$http.post('https://www.suibo.tv/api/pwapi/manage/backsage_manag/index', qs.stringify(data),
      //   { headers: { 'content-type': 'application/x-www-form-urlencoded' }
      //   })
      this.userInfoListIndex.push(this.queryInfo.uin)
      // console.log(this.userInfoListIndex)
      res1.data.retData.info.uin = res1.data.retData.info.uin + '' // num->string
      const res = Object.assign(res1.data.retData, res2.data.retData)
      if (this.is_clear_userInfoList) this.userInfoList = [] // 清空用户信息列表
      this.userInfoList.push(res)
      // console.log(this.userInfoList[this.currentIndex])
      this.blockForm.name = this.userInfoList[this.currentIndex].info.onlynick
      this.currentUser.uin = this.userInfoList[this.currentIndex].info.uin
      this.currentUser.mac = this.userInfoList[this.currentIndex].mac
      this.transTitle[1] = this.earningsDate
      this.transTitle[2] = this.earningsYesterdayDate
      this.tableData = []
      this.tableData.push({
        rank: this.userInfoList[this.count].user_singinfo.rank,
        score: this.userInfoList[this.count].user_singinfo.score,
        duration: this.userInfoList[this.count].user_singinfo.duration,
        shareNum: this.userInfoList[this.count].user_singinfo.shareNum
      })
      this.tableData.push({
        rank: this.userInfoList[this.count].user_yesterday_singinfo.rank,
        score: this.userInfoList[this.count].user_yesterday_singinfo.score,
        duration: this.userInfoList[this.count].user_yesterday_singinfo.duration,
        shareNum: this.userInfoList[this.count].user_yesterday_singinfo.shareNum
      })
      this.transData = this.table(this.tableData, this.originTitle)
      this.gridData.machineCode = []
      for (const key in this.userInfoList[this.count].other_mac) {
        this.gridData.machineCode.push({ machineCode: key })
      }
      this.gridData.ip = []
      for (const key in this.userInfoList[this.count].other_ip) {
        this.gridData.ip.push({ ip: key })
      }
      // this.userInfoList[this.count]
      this.$set(this.userInfoList[this.count], 'transData', this.transData)
      this.$set(this.userInfoList[this.count], 'transTitle', this.transTitle)
      // this.activeName = this.count + ''
      this.currentIndex = this.count
    },
    // 时间搜索
    async timeSearch() {
      const data = this.queryInfo
      data.mode = 2
      data.time = this.earningsDate
      const res = await getManag(qs.stringify(data))
      // const res = await this.$http.post('https://www.suibo.tv/api/pwapi/manage/backsage_manag/index', qs.stringify(data),
      //   { headers: { 'content-type': 'application/x-www-form-urlencoded' }
      //   })
      this.init(this.earningsDate)
      this.transTitle[1] = this.earningsDate
      this.transTitle[2] = this.earningsYesterdayDate
      this.tableData = []
      this.tableData.push({
        rank: res.data.retData.other_singinfo.rank,
        score: res.data.retData.other_singinfo.score,
        duration: res.data.retData.other_singinfo.duration,
        shareNum: res.data.retData.other_singinfo.shareNum
      })
      this.tableData.push({
        rank: res.data.retData.other_yesterday_singinfo.rank,
        score: res.data.retData.other_yesterday_singinfo.score,
        duration: res.data.retData.other_yesterday_singinfo.duration,
        shareNum: res.data.retData.other_yesterday_singinfo.shareNum
      })
      this.transData = this.table(this.tableData, this.originTitle)
      this.userInfoList[this.currentIndex].transData = this.transData
      this.userInfoList[this.currentIndex].transTitle = this.transTitle
      // console.log(this.userInfoList)
    },
    // 封锁用户
    block() {
      this.blockForm.uin = this.currentUser.uin
      this.blockForm.mac = this.currentUser.mac
      this.blockForm.operator = this.username
      this.blockForm.descr = this.blockNotes.checkList.join(' ') + ' ' + this.blockNotes.textarea
      this.blockForm.cate = this.blockNotes.checkedLogin + ',' + this.blockNotes.checkedRoom
      this.blockForm.hours = this.blockNotes.duration
      // console.log(this.blockForm)
      this.blockForm.hours = this.blockForm.hours === '永久' ? '永久' : parseInt(this.blockForm.hours)
      this.$confirm('你将封锁用户 ' + this.blockForm.uin + '（' + this.blockForm.name + '）', '封锁确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userBlock(qs.stringify(this.blockForm)).then(res => {
          this.$message.success('封锁成功')
          this.dialogFormVisible = false
        })
      }).catch(() => {
      })
    },
    // 点击同机号码 跳转新页面
    rowClick(row, column, event) {
      const params = { uin: event.target.innerHTML }
      const routeData = this.$router.resolve({
        name: 'userInfo',
        query: params
      })
      window.open(routeData.href, '_blank')
    },
    // 切换顶部用户
    handleClick(tab, event) {
      this.currentIndex = Number(tab.index)
      // console.log(this.currentIndex)
      this.blockForm.name = this.userInfoList[this.currentIndex].info.onlynick
      this.blockForm.uin = this.userInfoList[this.currentIndex].info.uin
      this.blockForm.mac = this.userInfoList[this.currentIndex].mac
      this.currentUser.uin = this.userInfoList[this.currentIndex].info.uin
      this.currentUser.mac = this.userInfoList[this.currentIndex].mac
      // this.queryInfo.uin = this.currentUser.uin
      this.gridData.machineCode = []
      for (const key in this.userInfoList[this.currentIndex].other_mac) {
        this.gridData.machineCode.push({ machineCode: key })
      }
      this.gridData.ip = []
      for (const key in this.userInfoList[this.currentIndex].other_ip) {
        this.gridData.ip.push({ ip: key })
      }
      this.timeSearch()
    },
    // 纵向table
    table(tableData, originTitle) {
      // 数组按矩阵思路, 变成转置矩阵
      const matrixData = tableData.map((row) => {
        const arr = []
        for (const key in row) {
          arr.push(row[key])
        }
        return arr
      })
      // 返回拼接最终的数据
      return matrixData[0].map((col, i) => {
        return [originTitle[i], ...matrixData.map((row) => {
          return row[i]
        })]
      })
    },
    // 展示封锁弹窗
    showDialogFormVisible() {
      this.dialogFormVisible = true
      setTimeout(() => {
        this.blockRegion()
      }, 100)
    },
    // 封锁分类切换获取封锁次数
    async blockRegion() {
      this.blockForm.cate = this.blockNotes.checkedLogin + ',' + this.blockNotes.checkedRoom
      // console.log(this.blockForm.cate)
      const data = {
        uin: this.currentUser.uin,
        cate: this.blockForm.cate
      }
      const res = await getBlockCount(qs.stringify(data))
      // console.log(res.data.retData)
      this.blockNotes.blockCount = res.data.retData
      if (this.blockNotes.blockCount >= 5) {
        this.blockNotes.duration = '永久'
      } else {
        this.blockNotes.duration = this.blockNotes.hoursList[this.blockNotes.blockCount]
      }
    },
    // 初始化
    init(date) {
      if (!date) {
        const now = new Date()
        this.earningsDate = now.getFullYear() + '-' +
          (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
          (now.getDate()).toString().padStart(2, '0')
      } else {
        this.earningsDate = date
      }
      const yes = new Date(new Date(this.earningsDate).getTime() - 3600 * 1000 * 24)
      // const yes = new Date(now.setTime(now.getTime() - 3600 * 1000 * 24))
      this.earningsYesterdayDate = yes.getFullYear() + '-' +
        (yes.getMonth() + 1).toString().padStart(2, '0') + '-' +
        (yes.getDate()).toString().padStart(2, '0')
    }
  }
}
</script>

<style scoped lang="scss">
.margin10{
  margin: 10px;
}
.userInfo{
  display: flex;
  .avatar{
    display: flex;
    .avatarBtn{
      margin-top: 10px;
    }
    .face{
      width: 150px;
      height: 200px;
      margin-left: 15px;
      .faceTxt{
        text-align: center;
        margin-top: 10px;
      }
    }
  }
  .info{
    margin-left: 30px;
  }
}
</style>
