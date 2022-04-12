<template>
  <div>
    <!-- 举报 -->
    <el-card style="margin: 10px;">
      <div>
        <template>
          <el-row :gutter="20" style="margin-bottom: 20px;">
            <el-col style="width:450px;">
              <el-radio-group v-model="search.state" @change="applyDeblockingList()">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button label="0">待处理</el-radio-button>
                <el-radio-button label="-1">未通过</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </template>
      </div>
      <el-table :data="reportList" stripe style="width: 100%">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="blockeduin" label="被封锁人id" align="center"></el-table-column>
        <el-table-column prop="blockednick" label="被封锁人昵称" align="center"></el-table-column>
        <el-table-column prop="blockitem" label="被封锁项" align="center"></el-table-column>
        <el-table-column prop="descr" label="被封锁原因" align="center"></el-table-column>
        <el-table-column prop="images" label="图片" align="center">
          <template scope="scope">
            <div v-for="(item,index) in reportList[scope.$index].images" :key="index">
              <el-image :src="item" style="width:100px;height:100px;"
                        :preview-src-list="srcList"
                        @click="addPreview(item)"
              ></el-image>
            </div>
            <!-- <el-image :src="imgurl"
                :preview-src-list="srcList"
                @click="addPreview(imgurl)">
            </el-image> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button
              class="tableBtn"
              type="primary"
              size="small"
              @click="deblocking(scope.row)"
            >解封
            </el-button>
            <el-button
              class="tableBtn"
              type="danger"
              size="small"
              @click="unblockDeblocking(scope.row)"
            >不解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="search.page"
        :page-sizes="[10, 20, 30]"
        :page-size="search.size"
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
import { getDeblockingList, doneDeblocking, unblock } from '@/api/award'
import qs from 'qs'

export default {
  inject: ['reload'],
  data() {
    return {
      // imgurl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [],
      searchState: '',
      select: '',
      reportList: [],
      search: {
        state: '',
        page: 1,
        size: 10
      },
      totle: 0
    }
  },
  created() {
    this.search.state = this.$store.state.cache.deblocking
    this.applyDeblockingList()
  },
  methods: {
    // 大图预览
    addPreview(imgurl) {
      this.srcList = []
      this.srcList.push(imgurl)
      this.$nextTick(() => {
        // 获取遮罩层dom
        let domImageMask = document.querySelector('.el-image-viewer__mask')
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    },
    applyDeblockingList() {
      getDeblockingList(qs.stringify(this.search)).then(res => {
        // console.log(res.data.retData)
        this.reportList = res.data.retData.results
        this.totle = res.data.retData.total
        this.reportList.forEach(item => {
          item.state = item.state == -1 ? '未通过' : '待处理'
          if (typeof (item.images) == 'string' && item.images.indexOf(',') == -1) {
            item.images = [item.images]
          }
          if (item.images !== undefined && item.images.indexOf(',') !== -1) {
            item.images = this.reportList.images.split(',')
          }
        })
      })
    },
    deblocking(row) {
      this.$store.commit('deblocking', this.search.state)
      const data = {
        blockitem: row.blockitem,
        reason: row.descr
      }
      doneDeblocking(qs.stringify(data)).then(res => {
        if (res.data.retData == 0) {
          this.$message.info('更改失败!')
        } else if (res.data.retData == null) {
          this.$message.success('更改成功!')
        }
        this.reload()
      })
    },
    unblockDeblocking(row) {
      this.$store.commit('deblocking', this.search.state)
      const data = {
        pid: 1,
        password: '23651943',
        uin: row.blockeduin
      }
      unblock(qs.stringify(data)).then(res => {
        this.reload()
      })
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.search.size = newSize
      this.applyDeblockingList()
    },
    // 监听 页码值pagenum 改变事件
    handleCurrentChange(newSize) {
      this.search.page = newSize
      this.applyDeblockingList()
    }
  }
}
</script>

<style scoped>
.seachInput {
  width: 400px;
  margin: 0 20px 10px 0;
}

.addItem {
  width: 400px;
}

.searchbtn {
  margin-left: 10px;
}

.tableBtn {
  margin: 3px;
}
</style>
