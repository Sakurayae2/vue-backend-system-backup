<template>
  <div>
    <!-- 卡片视图 -->
    <el-card style="margin: 10px;">
      <el-input
        v-model="queryInfo.uin"
        class="seachInput"
        placeholder="请输入uin"
        clearable
        @keyup.enter.native="getList()"
      >
        <el-button slot="append" icon="el-icon-search" @click.native="getList()"/>
      </el-input>
      <el-radio-group v-model="roomType" class="roomType" @change="getList()">
        <el-radio-button label="sing">唱歌房间</el-radio-button>
        <el-radio-button label="dance">广场舞房间</el-radio-button>
        <el-radio-button label="chess">象棋房间</el-radio-button>
      </el-radio-group>
      <transition name="fade" mode="out-in">
        <el-form
          v-if="addPunishFalg"
          ref="addPunishForm"
          style="width:500px;margin: 0;"
          :rules="addPunishFormRules"
          :model="addPunishForm"
          label-width="100px"
        >
          <el-form-item label="房间类型" prop="type">
            <el-select v-model="addPunishForm.type" placeholder="请选择房间类型">
              <el-option label="唱歌房间" value="sing"></el-option>
              <el-option label="广场舞房间" value="dance"></el-option>
              <el-option label="象棋房间" value="chess"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="addItem" label="处罚uin" prop="uin">
            <el-input
              v-model="addPunishForm.uin"
              placeholder="请输入uin,如:123或123,456,仅广场舞房间可输入房间号"
              @keyup.enter.native="addPunishment"
            ></el-input>
          </el-form-item>
          <el-form-item class="addItem" label="处罚原因" prop="reason">
            <el-autocomplete
              v-model="addPunishForm.reason"
              :fetch-suggestions="querySearch"
              style="width:100%"
              placeholder="请输入处罚原因"
              @keyup.enter.native="addPunishment"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item class="addItem" label="处罚" prop="result">
            <el-autocomplete
              v-model="addPunishForm.result"
              :fetch-suggestions="querySearch"
              style="width:100%"
              placeholder="请输入处罚"
              @keyup.enter.native="addPunishment"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addPunishment">添加处罚</el-button>
            <el-button @click="addPunishFalg=false">取消</el-button>
            <el-button @click="resetForm('addPunishForm')">重置</el-button>
          </el-form-item>
        </el-form>

        <el-button v-else type="primary" @click="loadAll">添加处罚</el-button>
      </transition>

      <!-- 表格 -->
      <el-table :data="punishList" stripe style="width: 100%">
        <el-table-column label="房间类型" align="center">
          {{ roomTypeName[roomType] }}
        </el-table-column>
        <el-table-column prop="date" label="日期" align="center"></el-table-column>
        <el-table-column prop="uin" label="uin/roomid" align="center"></el-table-column>
        <el-table-column prop="nick" label="昵称" align="center"></el-table-column>
        <el-table-column prop="reason" label="处罚原因" align="center"></el-table-column>
        <el-table-column prop="result" label="惩罚" align="center"></el-table-column>
        <el-table-column prop="handle" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click.native.prevent="deleteRow(scope.row,scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :current-page="show.page"
        :page-sizes="[20, 30, 50]"
        :page-size="show.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="show.totle"
        style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-card>
  </div>
</template>

<script>
import { getPunish, addPunish, removePunish } from '@/api/award'
import qs from 'qs'

export default {
  data() {
    // 自定义规则
    var checkUins = (rule, value, callback) => {
      const regEmail = /^(\d*)(,\d*)*$/
      if (regEmail.test(value)) {
        // 合法
        return callback()
      }
      callback(new Error('请输入正确格式，如:123,456'))
    }
    return {
      roomTypeName: {
        sing: '唱歌房间',
        dance: '广场舞房间',
        chess: '象棋房间'
      },
      reasonAdvice: [],
      addPunishFalg: false,
      roomType: 'sing',
      addPunishForm: {
        type: 'sing',
        // date: '',
        uin: '',
        reason: '',
        result: '',
        passwd: 'taolesoft0571'
      },
      // 查询
      queryInfo: {
        uin: '',
        passwd: 'taolesoft0571'
      },
      show: {
        page: 1,
        size: 20,
        totle: 0
      },
      punishListCache: [],
      punishList: [],
      addPunishFormRules: {
        uin: [
          { required: true, message: '请输入uin', trigger: 'blur' },
          { validator: checkUins, trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入处罚原因', trigger: 'change' }
        ],
        result: [
          { required: true, message: '请输入处罚', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  beforeDestroy() {
    localStorage.removeItem('reasonAdvice')
  },
  methods: {
    roomSwitch() {
      console.log(this.addPunishForm.type, this.roomType)
    },
    // 处罚原因和处罚建议
    querySearch(queryString, cb) {
      var reasonAdvice = this.reasonAdvice
      var results = queryString ? reasonAdvice.filter(this.createFilter(queryString)) : reasonAdvice
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      this.addPunishFalg = true
      if (JSON.parse(localStorage.getItem('reasonAdvice') !== null)) {
        this.reasonAdvice = JSON.parse(localStorage.getItem('reasonAdvice'))
      } else {
        this.reasonAdvice = [
          { value: '假唱' }
        ]
      }
    },
    // 获取处罚列表
    getList() {
      this.queryInfo.type = this.roomType
      getPunish(this.queryInfo).then(res => {
        this.punishListCache = res.data.retData.dataList
        this.punishList = this.punishListCache.slice((this.show.page - 1) *
          this.show.size, this.show.page * this.show.size)
        this.show.totle = this.punishListCache.length
      })
    },
    // 添加处罚
    addPunishment() {
      this.$refs.addPunishForm.validate(valid => {
        if (valid) {
          addPunish(qs.stringify(this.addPunishForm)).then(res => {
            //   console.log(res)
            if (res.data.retData.statusCode === 200) {
              this.reasonAdvice.push({ value: this.addPunishForm.reason })
              this.reasonAdvice.push({ value: this.addPunishForm.result })
              localStorage.setItem('reasonAdvice', JSON.stringify(this.reasonAdvice))
              this.reasonAdvice = JSON.parse(localStorage.getItem('reasonAdvice'))
              this.getList()
              this.resetForm('addPunishForm')
              this.$message.success('添加处罚成功')
            } else {
              this.$message.error(res.data.retData.msg)
            }
          })
        }
      })
    },
    // 移除处罚
    deleteRow(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          passwd: 'taolesoft0571',
          uin: row.uin,
          date: row.date
        }
        removePunish(qs.stringify(data)).then(res => {
          if (res.data.retData.statusCode === 200) {
            this.punishList.splice(index, 1)
            this.$message.success('移除处罚成功')
          } else {
            this.$message.error('移除处罚失败')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 监听 pagesize 改变的事件
    async handleSizeChange(newSize) {
      this.show.size = newSize
      this.punishList = this.punishListCache.slice((this.show.page - 1) *
        this.show.size, this.show.page * this.show.size)
    },
    // 监听 页码值pagenum 改变事件
    async handleCurrentChange(newSize) {
      this.show.page = newSize
      this.punishList = this.punishListCache.slice((this.show.page - 1) *
        this.show.size, this.show.page * this.show.size)
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
  width: 500px;
}
.roomType {
  margin-right: 20px;
}
</style>
