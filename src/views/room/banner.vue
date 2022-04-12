<template>
  <div>
    <!-- 添加按钮 -->
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-radio-group v-model="choose" @change="getTableData">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="推荐"></el-radio-button>
          <el-radio-button label="关注"></el-radio-button>
          <el-radio-button label="附近"></el-radio-button>
          <el-radio-button label="音乐"></el-radio-button>
          <el-radio-button label="聊天室"></el-radio-button>
          <el-radio-button label="广场舞"></el-radio-button>
          <el-radio-button label="象棋"></el-radio-button>
          <el-radio-button label="直播"></el-radio-button>
        </el-radio-group>
      </div>
      <el-button type="primary" @click="add">+</el-button>
    </div>
    <el-card class="box-card">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="bannerId" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="bannerType" label="类型" width="100" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" width="150" align="center"></el-table-column>
        <el-table-column prop="imgUrl" label="图片url" width="500" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.imgUrl" style="width: 320px;height: 100px"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center"></el-table-column>
        <el-table-column prop="oprTime" label="时间" align="center"></el-table-column>
        <el-table-column prop="" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" icon="el-icon-edit"
                       @click="scope.row.bannerType != '全部' ? editSort(scope.$index,scope.row) : edit(scope.$index,scope.row)">
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="scope.row.bannerType != '全部' ? deleteBannerType(scope.$index,scope.row) : deleteBanner(scope.$index,scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="param.page"
        :page-sizes="[10,20,50,100]"
        :page-size="param.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 30px"
      ></el-pagination>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="类型:" prop="bannerType">
          <div style="display: flex;justify-content: space-between;width: 500px">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="标题:" prop="title"><el-input v-model="form.title" style="width: 500px" clearable></el-input></el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model="form.content" style="width: 500px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="上传图片:">
          <div style="display: flex">
            <div>
              <input type="file" id="file_btn" ref="fileBtn" @change="uploadImg" accept="image/*" />
            </div>
            <div>
              <el-image :src="image_load" style="width: 100px;margin-right: 30px"></el-image>
            </div>
            <div>
              <el-button type="primary" @click="upload()">上传</el-button>
            </div>
          </div>
        </el-form-item>
        <!--        <el-form-item label="排序:" prop="sort">-->
        <!--          <el-input v-model="form.sort" style="width: 500px;" clearable></el-input>-->
        <!--        </el-form-item>-->
        <el-button type="primary" style="margin-left: 80px" @click="flag_add ? addBanner() : updateBanner()">保 存</el-button>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改sort"
      :visible.sync="dialogVisible_sort"
      width="20%"
    >
      <div style="display: flex">
        <el-input v-model="sort_input" style="width: 100px"></el-input>
        <el-button type="primary" @click="upgradeSort">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, addB, updateB, deleteBType, deleteB, updateSt, uploadImg } from '@/api/banner'
import { mapGetters } from 'vuex'
const cityOptions = ['推荐', '关注', '附近', '音乐', '聊天室', '广场舞', '象棋', '直播']
export default {
  data() {
    return {
      dialogTitle: '添加banner',
      sort_input: '',
      flag_add: true,
      choose: '全部',
      param: {
        status: -1,
        page: 1,
        size: 10
      },
      total: 0,
      tableData: [],
      form: {
        bannerType: '',
        imgUrl: '',
        content: '',
        title: '',
        sort: '',
        oprUser: ''
      },
      dialogVisible: false,
      dialogVisible_sort: false,
      checkAll: true,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      formData: '',
      image01: '',
      imgUrl: '',
      image_load: ''
    }
  },
  created() {
    this.getTableData()
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  methods: {
    async uploadImg(e) {
      const that = this
      console.log(e.target.files[0])
      var reader = new FileReader()
      reader.readAsDataURL(e.currentTarget.files[0])
      // 获取base64
      reader.onload = function() {
        console.log(reader.result)
        that.image_load = reader.result
      }
      const formData = new FormData()
      formData.append('passwd', 'taolesoft0571')
      formData.append('image01', e.target.files[0])
      this.formData = formData
    },
    // upload
    async upload() {
      // const res = await uploadImg(this.formData)
      const res = await this.$http.post('http://www.suibo.tv/api/pwapi/user/image/banner/tourl', this.formData)
      // const res = await this.$http.post('API/api/pwapi/user/image/banner/tourl', this.formData)
      console.log(res)
      this.imgUrl = res.data.retData.url

      console.log(this.imgUrl)
    },
    // 获取banner
    async getTableData() {
      if (this.choose === '全部') {
        this.param.status = -1
      } else if (this.choose === '推荐') {
        this.param.status = 0
      } else if (this.choose === '关注') {
        this.param.status = 1
      } else if (this.choose === '附近') {
        this.param.status = 2
      } else if (this.choose === '音乐') {
        this.param.status = 3
      } else if (this.choose === '聊天室') {
        this.param.status = 4
      } else if (this.choose === '广场舞') {
        this.param.status = 5
      } else if (this.choose === '象棋') {
        this.param.status = 6
      } else if (this.choose === '直播') {
        this.param.status = 10
      }
      const res = await getBanner(this.param)
      console.log(res)
      this.total = res.data.retData.total
      this.tableData = res.data.retData.bannerInfo
      this.tableData.forEach((i) => {
        if (i.bannerType == -1) {
          i.bannerType = '全部'
        } else if (i.bannerType == 0) {
          i.bannerType = '推荐'
        } else if (i.bannerType == 1) {
          i.bannerType = '关注'
        } else if (i.bannerType == 2) {
          i.bannerType = '附近'
        } else if (i.bannerType == 3) {
          i.bannerType = '音乐'
        } else if (i.bannerType == 4) {
          i.bannerType = '聊天室'
        } else if (i.bannerType == 5) {
          i.bannerType = '广场舞'
        } else if (i.bannerType == 6) {
          i.bannerType = '象棋'
        } else if (i.bannerType == 10) {
          i.bannerType = '直播'
        }
      })
    },
    add() {
      this.dialogTitle = '添加banner'
      this.flag_add = true
      this.dialogVisible = true
      this.form.bannerType = ''
      this.checkedCities = []
      this.form.content = ''
      this.form.title = ''
      this.form.sort = ''
      this.form.imgUrl = ''
      this.image_load = ''
      var file = document.getElementById('file_btn')
      if (file != null) {
        file.value = ''
      }
    },

    // 添加banner
    async addBanner() {
      const param = {
        bannerType: '',
        imgUrl: this.imgUrl,
        content: '',
        title: '',
        oprUser: this.username,
        ItPid: 1,
        expireTime: '0000-00-00 00:00:00'
      }
      let p = param.bannerType
      console.log(this.checkedCities)
      this.checkedCities.forEach(item => {
        if (item == '推荐') {
          param.bannerType += ',0'
        }
        if (item == '关注') {
          param.bannerType += ',1'
        }
        if (item == '附近') {
          param.bannerType += ',2'
        }
        if (item == '音乐') {
          param.bannerType += ',3'
        }
        if (item == '聊天室') {
          param.bannerType += ',4'
        }
        if (item == '广场舞') {
          param.bannerType += ',5'
        }
        if (item == '象棋') {
          param.bannerType += ',6'
        }
        if (item == '直播') {
          param.bannerType += ',10'
        }
      })
      param.bannerType = param.bannerType.slice(1,)
      console.log('type:', param.bannerType)
      param.content = this.form.content
      param.title = this.form.title
      param.oprUser = this.username
      const res = await addB(param)
      console.log(res)
      if (res.data.retCode === 0) {
        this.$message.info(res.data.retData.msg)
      }
      this.$refs.form.resetFields()
      this.dialogVisible = false
      this.getTableData()
    },

    // 点击编辑
    edit(index, row) {
      this.dialogTitle = '编辑banner'
      console.log(this.checkedCities)
      this.flag_add = false
      console.log(index, row)
      this.form.bannerType = row.bannerType
      this.form.content = row.content
      this.form.title = row.title
      this.form.sort = row.sort
      this.form.oprUser = this.username
      this.form.id = row.bannerId
      this.form.imgUrl = row.imgUrl
      this.image_load = ''
      var file = document.getElementById('file_btn')
      if (file != null) {
        file.value = ''
      }
      this.dialogVisible = true
      console.log(this.form)
    },
    // 更新sort
    async editSort(index, row) {
      this.dialogVisible_sort = true
      this.form.bannerType = row.bannerType
      this.form.content = row.content
      this.form.title = row.title
      this.form.sort = row.sort
      this.form.oprUser = this.username
      this.form.id = row.bannerId
      this.form.imgUrl = row.imgUrl
      console.log(this.form)
    },
    // 更新sort
    async upgradeSort() {
      console.log(this.form)
      const param = {
        id: 100,
        type: 1,
        sort: 1000
      }
      console.log(this.form)
      if (this.form.bannerType == '推荐') {
        param.type = 0
      } else if (this.form.bannerType == '关注') {
        param.type = 1
      } else if (this.form.bannerType == '附近') {
        param.type = 2
      } else if (this.form.bannerType == '音乐') {
        param.type = 3
      } else if (this.form.bannerType == '聊天室') {
        param.type = 4
      } else if (this.form.bannerType == '广场舞') {
        param.type = 5
      } else if (this.form.bannerType == '象棋') {
        param.type = 6
      } else if (this.form.bannerType == '直播') {
        param.type = 10
      }
      param.id = this.form.id
      param.sort = this.sort_input
      const res = await updateSt(param)
      console.log(res)
      if (res.data.retCode === 0) {
        this.$message.info(res.data.retData.msg)
      }
      this.dialogVisible_sort = false
      this.getTableData()
    },
    // 更新banner
    async updateBanner() {
      const param = {
        id: 100,
        bannerType: '',
        imgUrl: this.form.imgUrl,
        content: 'ccc',
        title: 'cc',
        oprUser: this.username
      }
      this.checkedCities.forEach(item => {
        if (item == '推荐') {
          param.bannerType += ',0'
        }
        if (item == '关注') {
          param.bannerType += ',1'
        }
        if (item == '附近') {
          param.bannerType += ',2'
        }
        if (item == '音乐') {
          param.bannerType += ',3'
        }
        if (item == '聊天室') {
          param.bannerType += ',4'
        }
        if (item == '广场舞') {
          param.bannerType += ',5'
        }
        if (item == '象棋') {
          param.bannerType += ',6'
        }
        if (item == '直播') {
          param.bannerType += ',10'
        }
      })

      if (this.imgUrl !== '') {
        param.imgUrl = this.imgUrl
      } else {
        this.form.imgUrl.slice(49)
        param.imgUrl = this.form.imgUrl
        console.log('url:', this.form.imgUrl)
      }
      param.id = this.form.id
      param.content = this.form.content
      param.title = this.form.title
      const res = await updateB(param)
      console.log(res)
      if (res.data.retCode === 0) {
        this.$message.info(res.data.retData.msg)
      }
      this.dialogVisible = false
      this.getTableData()
    },
    // 删除banner指定分类
    async deleteBannerType(index, row) {
      const param = {
        id: row.bannerId,
        type: 1
      }
      if (row.bannerType === '全部') {
        param.type = -1
      } else if (row.bannerType === '推荐') {
        param.type = 0
      } else if (row.bannerType === '关注') {
        param.type = 1
      } else if (row.bannerType === '附近') {
        param.type = 2
      } else if (row.bannerType === '音乐') {
        param.type = 3
      } else if (row.bannerType === '聊天室') {
        param.type = 4
      } else if (row.bannerType === '广场舞') {
        param.type = 5
      } else if (row.bannerType === '象棋') {
        param.type = 6
      } else if (row.bannerType === '直播') {
        param.type = 10
      }
      const res = await deleteBType(param)
      console.log(res)
      if (res.data.retCode === 0) {
        this.$message.info(res.data.retData.msg)
      }
      this.getTableData()
    },
    // 删除banner
    async deleteBanner(index, row) {
      const param = {
        id: row.bannerId
      }
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '永久删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteB(param).then((res) => {
        const { data: response } = res
        console.log(response)
        if (response.retData.code === 0) {
          return this.$message.error(response.retData.msg)
        }
        this.getTableData()
      })
    },
    handleSizeChange(newSize) {
      this.param.size = newSize
      this.getTableData()
    },
    handlePageChange(newPage) {
      this.param.page = newPage
      this.getTableData()
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style>

</style>
