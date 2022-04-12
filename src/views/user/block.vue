<template>
  <div class="app-container">
    <el-card>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-input v-model="queryInfo.blockitem" placeholder="请输入uin/机器码" clearable @keyup.enter.native="queryInfo.page = 1;getList()">
            <el-button slot="append" icon="el-icon-search" @click.native="queryInfo.page = 1;getList()" />
          </el-input>
        </el-col>
      </el-row>
      <!--   表格区域   -->
      <el-table :data="tableData">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="date" label="头像" align="center">
          <template slot-scope="scope">
            <div class="avatar">
              <el-avatar :size="60" :src="tableData[scope.$index].head"></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uin" label="uin" align="center" min-width="160">
          <template slot-scope="scope">
            <div>
              <p
                style="white-space: nowrap;"
                :class="{ 'active' : activeIndex === scope.$index }"
                @mouseenter="activeIndex=scope.$index"
                @mouseleave="activeIndex=''"
                @click="toUserInfo(scope.row)"
              >{{ scope.row.uin }}
                <i class="el-icon-document-copy" v-clipboard:copy="scope.row.uin" @click.stop="copy(scope.row.uin)"></i>
              </p>
              <p>{{ '(' + scope.row.nickname + ')' }}</p>
              <p>{{ scope.row.mac }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="封锁时间" align="center" width="100">
          <template slot-scope="scope">
            <p>{{ scope.row.operator === '10000' ? '系统' : scope.row.operator }}</p>
            <p>{{ scope.row.addtime }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="封锁类型" align="center">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.type" :key="index">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="blackitem" label="封锁主体" align="center" min-width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.blackitem" :key="index" style="white-space: nowrap;">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hours" label="封锁时长" align="center"></el-table-column>
        <el-table-column prop="descr" label="封锁原因" align="center" width="206px">
          <template slot-scope="scope">
            <p>{{ scope.row.descr }}</p>
            <el-image
              v-for="(item,index) in scope.row.images.slice(0, 3)"
              :key="index"
              class="img"
              :src="item"
              :preview-src-list="srcList"
              @click="preview(scope.row.images)"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="unlock_desc" label="解封" align="center" min-width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.unlock_user !== '' && scope.row.unlock_user !== null">解封人:{{ scope.row.unlock_user }}</div>
            <div>{{ scope.row.unlock_time }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="unlock_desc" label="解封备注" align="center"></el-table-column>
        <el-table-column prop="address" label="申诉与操作" align="center" min-width="176px">
          <template slot-scope="scope">
            <div v-if="scope.row.is_delete === 0">
              <el-button type="primary" size="mini" style="margin: 5px;" @click="unblock(scope.row)">解封</el-button>
              <el-button v-if="scope.row.state === 0" type="danger" size="mini" style="margin: 5px;" @click="reject(scope.row)">驳回</el-button>
              <el-button v-else-if="scope.row.state === -1" type="danger" size="mini" style="margin: 5px;" disabled @click="reject(scope.row)">已驳回</el-button>
              <div v-if="scope.row.created !== null && scope.row.created !== ''">申诉时间 <br /> {{ scope.row.created }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="queryInfo.size"
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
import { getComplaintList, userUnblock, rejectApply } from '@/api/userManagement'
import { mapGetters } from 'vuex'
import qs from 'qs'

export default {
  inject: ['reload'],
  data() {
    return {
      activeIndex: '',
      mouseoverFlag: false,
      srcList: [
        // 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      ],
      name: 'smk',
      queryInfo: {
        blockitem: '',
        page: 1,
        size: 30
      },
      totle: 0,
      tableData: [],
      unblockFrom: {}
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getComplaintList(qs.stringify(this.queryInfo)).then(res => {
        // console.log(res.data.retData)
        this.tableData = res.data.retData.results
        this.totle = res.data.retData.total
        if (!this.tableData) {
          this.$message.success('该用户或机器码暂无数据')
        }
      })
    },
    // 解封
    unblock(row) {
      this.$confirm('用户:' + row.uin + '(' + row.nickname + ') 封锁原因:' + row.descr, '解封确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(row)
        const data = {
          cate: row.cate.join(','),
          blackitem: row.blackitem.join(','),
          unlock_desc: row.unlock_desc,
          blockeduin: row.uin,
          password: '23651943',
          unlock_uin: this.username,
          block_id: row.block_id
        }
        userUnblock(qs.stringify(data)).then(() => {
          this.$message.success('解封成功')
          row.is_delete = 1
          row.unlock_user = this.username
          row.unlock_time = this.getTime()
        })
      }).catch(() => {
      })
    },
    // 申诉申请驳回
    reject(row) {
      this.$confirm('你将驳回申诉申请' + row.uin + '(' + row.nickname + ') 封锁原因:' + row.descr, '申诉驳回确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          cate: row.cate.join(','),
          blackitem: row.blackitem.join(','),
          unlock_desc: row.unlock_desc,
          blockeduin: row.uin,
          password: '23651943',
          block_id: row.block_id,
          unlock_uin: this.username
        }
        rejectApply(qs.stringify(data)).then(() => {
          this.$message.success('驳回成功')
          row.state = -1
        })
      }).catch(() => {
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
    copy(uin) {
      this.$message.success('复制uin:' + uin + '成功')
    },
    toUserInfo(row) {
      const params = { uin: row.uin }
      const routeData = this.$router.resolve({
        name: 'userInfo',
        query: params
      })
      window.open(routeData.href, '_blank')
    },
    // 获取当前时间 yyyy-mm-dd hh:mm:ss
    getTime() {
      const now = new Date()
      return now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
        now.getDate().toString().padStart(2, '0') + ' ' + now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0')
    }
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
.uinContent{
  border-radius: 10px;
  cursor: pointer;
}
.active{
  text-decoration: underline;
  color: rgba(255,0,0,.8);
  cursor: pointer;
}
</style>

