<template>
  <div class="pp-container">
    <el-card>
      <el-row type="flex" justify="space-between" style="margin-bottom: 15px;">
        <el-col :span="8">
          <el-input v-model="searchInput" placeholder="请输入搜索实验名称" clearable @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
        </el-col>
        <el-col>
          <el-radio-group v-model="radio" style="float: right" @change="daysChange()">
            <el-radio-button label="实时"></el-radio-button>
            <el-radio-button label="昨天"></el-radio-button>
            <el-radio-button label="过去7天"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-left: 10px"
            @click="fn_getLink()"
          >创建实验</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column
          v-for="(item,index) in tableTitleData"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="380"
            >
              <div class="block">
                <el-date-picker
                  v-model="timeBucket"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
                <div class="exportTable">
                  <el-button
                    size="mini"
                    type="primary"
                    :disabled="!timeBucket"
                    @click.native.prevent="handleDownloadData(scope.row)"
                  >导出</el-button>
                </div>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="small"
              >导出</el-button>
            </el-popover>
            <el-button
              type="text"
              size="small"
              style="margin-left: 10px"
              @click.native.prevent="fn_edit(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="fn_delete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  创建实验  -->
    <el-dialog :title="state + '实验页面'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="form" :rules="formRules">
        <el-form-item label="实验名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入实验名称" :disabled="state !== '创建'"></el-input>
        </el-form-item>
        <el-form-item label="实验描述" prop="desc" :label-width="formLabelWidth">
          <el-input v-model="form.desc" type="textarea" placeholder="请输入此次活动的描述" :disabled="state !== '创建'"></el-input>
        </el-form-item>
        <el-form-item label="分享链接1" prop="link" :label-width="formLabelWidth">
          <el-input v-model="form.link" placeholder="该实验的分享链接" disabled></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="linktype" :label-width="formLabelWidth">
          <el-select v-model="form.linktype" placeholder="请选择房间类型" :disabled="state !== '创建'">
            <el-option label="聊天房间" value="0"></el-option>
            <el-option label="唱歌房间" value="1"></el-option>
            <el-option label="舞蹈房间" value="2"></el-option>
            <el-option label="象棋房间" value="3"></el-option>
            <el-option label="直播房间" value="25"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="linkid" prop="linkid" :label-width="formLabelWidth">
          <el-input v-model="form.linkid" placeholder="友盟创建裂变活动对应的linkid" :disabled="state !== '创建'"></el-input>
        </el-form-item>
        <el-form-item label="文案编辑位置1" prop="text1" :label-width="formLabelWidth">
          <div>
            <span>是否获取用户信息：</span>
            <el-radio v-model="radioText1" label="1" @change="radioTextChange('text1')">是</el-radio>
            <el-radio v-model="radioText1" label="2" @change="radioTextChange('text1')">否</el-radio>
          </div>
          <el-input v-model="form.text1" :disabled="state !== '创建' || radioText1==='1'"></el-input>
        </el-form-item>
        <el-form-item label="文案编辑位置2" prop="text2" :label-width="formLabelWidth">
          <div>
            <span>是否获取用户信息：</span>
            <el-radio v-model="radioText2" label="1" @change="radioTextChange('text2')">是</el-radio>
            <el-radio v-model="radioText2" label="2" @change="radioTextChange('text2')">否</el-radio>
          </div>
          <el-input v-model="form.text2" :disabled="state !== '创建' || radioText2==='1'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="fn_create()">{{ state }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getShare, getShareLink, createShare, editOrDeleteShare, exportShare } from '@/api/award'
import qs from 'qs'

export default {
  inject: ['reload'],
  data() {
    return {
      radioText1: '1',
      radioText2: '1',
      customText: {
        text1: '',
        text2: ''
      },
      loading: false,
      searchInput: '',
      radio: '过去7天',
      dialogFormVisible: false,
      // 创建列表 编辑列表
      form: {
        text2: '',
        text1: '',
        linktype: '',
        link: '',
        name: '',
        desc: '',
        linkid: ''
      },
      formRules: {
        name: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
        linktype: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
        link: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
        linkid: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
        text1: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
        text2: [{ required: true, message: '此处不能为空', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      state: '创建',
      timeBucket: '',
      timeExportBtn: true,
      tableData: [],
      tableDataCache: [],
      tableTitleData: [
        { label: '实验名称(链接)', prop: 'name' },
        { label: '分享点击PV', prop: 'shareClickPv' },
        { label: '分享点击UV', prop: 'shareClickUv' },
        { label: '链接触发PV', prop: 'linkClickPv' },
        { label: '链接触发UV', prop: 'linkClickUv' },
        { label: '人均停留时间', prop: 'totalDuration' },
        { label: '链接点击PV', prop: 'downloadPv' },
        { label: '链接点击UV', prop: 'downloadUv' },
        { label: 'APP启动PV', prop: '' },
        { label: 'APP启动UV', prop: '' },
        { label: 'app新增人数', prop: '' },
        { label: '其他活动指标', prop: '' }
      ]
    }
  },
  created() {
    this.daysChange()
  },
  methods: {
    // 获取列表
    daysChange() {
      this.loading = true
      const params = {
        days: ''
      }
      if (this.radio === '实时') {
        params.days = ''
      } else if (this.radio === '昨天') {
        params.days = 1
      } else if (this.radio === '过去7天') {
        params.days = 7
      }
      getShare(params).then((res) => {
        // console.log(res.data.retData)
        this.tableData = res.data.retData.dataDict
        this.tableDataCache = this.tableData
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 搜索
    search() {
      this.tableData = []
      this.tableDataCache.forEach(item => {
        if (item.name.indexOf(this.searchInput) !== -1) {
          this.tableData.push(item)
        }
      })
    },
    // 编辑
    fn_edit(row) {
      this.state = '编辑'
      this.dialogFormVisible = true
      this.form.index = row.index
      this.form.name = row.name
      this.form.desc = row.desc
      this.form.text1 = row.text1
      this.form.text2 = row.text2
      this.form.link = row.link
      this.form.linkid = row.u_link_id
      this.form.linktype = row.linktype
      this.form.cmd = 'edit'
    },
    // 删除
    fn_delete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          cmd: 'delete',
          index: row.index,
          linktype: row.linktype
        }
        console.log(data)
        editOrDeleteShare(qs.stringify(data)).then((res) => {
          // console.log(res.data.retData)
          if (res.data.retData.msg === 200) {
            this.tableDataCache.splice(index, 1)
            this.tableData = this.tableDataCache
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 获取创建链接
    fn_getLink() {
      this.dialogFormVisible = true
      this.state = '创建'
      getShareLink().then(res => {
        // console.log(res.data.retData)
        this.form = res.data.retData.dataDict
        this.radioTextChange('text1')
        this.radioTextChange('text2')
      })
    },
    // 文案编辑单选按钮change
    radioTextChange(textNum) {
      if (this.state !== '创建') {
        return
      }
      if (textNum === 'text1' && this.radioText1 === '1') {
        this.form.text1 = '已获取用户信息，将使用默认方案！'
      } else if (textNum === 'text1') {
        this.form.text1 = this.customText.text1
      }
      if (textNum === 'text2' && this.radioText2 === '1') {
        this.form.text2 = '已获取用户信息，将使用默认方案！'
      } else if (textNum === 'text2') {
        this.form.text2 = this.customText.text2
      }
    },
    // 创建新实验
    fn_create() {
      if (this.state === '创建') {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // 如果选择获取用户信息 传'no',表示选用默认文案
            if (this.radioText1 === '1') {
              this.form.text1 = 'no'
            }
            if (this.radioText2 === '1') {
              this.form.text2 = 'no'
            }
            createShare(qs.stringify(this.form)).then((res) => {
              // console.log(res.data.retData)
              if (res.data.retData.msg === 200) {
                // console.log(res.data.retData)
                this.$message.success('创建成功')
                this.form = {}
                this.customText.text1 = ''
                this.customText.text2 = ''
                this.dialogFormVisible = false
                this.reload()
              }
            })
          }
        })
      } else if (this.state === '编辑') {
        editOrDeleteShare(qs.stringify(this.form)).then((res) => {
          if (res.data.retData.msg === 200) {
            this.$message.success('编辑成功')
            this.form = {}
            this.dialogFormVisible = false
            this.reload()
          }
        })
      }
    },
    // 导出的方法
    handleDownloadData(row) {
      // console.log(this.timeBucket, row.index)
      const params = {
        index: row.index,
        start: this.timeBucket[0],
        end: this.timeBucket[1]
      }
      const table = []
      exportShare(qs.stringify(params)).then((res) => {
        // console.log(res.data.retData.dataDict)
        res.data.retData.dataDict.dataLis.forEach(item => {
          item.name = res.data.retData.dataDict.name
          table.push(item)
        })
        // 导出表格的表头设置
        this.tableTitleData.unshift({ label: '日期', prop: 'date' })
        const allColumns = this.tableTitleData
        var columnNames = []
        var columnValues = []
        for (var i = 0; i < allColumns.length; i++) {
          columnNames[i] = allColumns[i].label
          columnValues[i] = allColumns[i].prop
        }
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/utils/Export2Excel')
          const tHeader = columnNames
          const filterVal = columnValues
          const list = table
          const defaultTitle = res.data.retData.dataDict.name
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, defaultTitle)
        })
        this.tableTitleData.shift()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped lang="scss">
.exportTable{
  float: right;
  margin-top: 10px;
  margin-right: 5px;
}
</style>
