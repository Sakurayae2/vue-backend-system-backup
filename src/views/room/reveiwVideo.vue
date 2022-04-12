<template>
  <div style="margin: 15px">
    <!-- 视频 & 舞曲 -->
    <div style="margin-bottom:15px">
      <el-tabs v-model="switch_btn" type="border-card">
        <el-tab-pane label="视频" name="video">
          <!-- 查看选择 -->
          <el-radio-group v-model="choose" @change="getTableData()" >
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="待审核"></el-radio-button>
            <el-radio-button label="未通过"></el-radio-button>
          </el-radio-group>

            <!-- 搜索框 -->
            <el-row style="margin-top:15px">
              <el-col :span="8">
                <el-input placeholder="请输入uin" v-model="searchInput" @keyup.enter.native="search()" clearable @clear="getTableData()">
                  <el-button slot="append" icon="el-icon-search" @click.native="search()"></el-button>
                </el-input>
              </el-col>
            </el-row>

            <!-- 表格数据 -->
            <el-table v-loading="loading" :data="tableData" stripe>
              <el-table-column label="视频封面" prop="cover" align="center">
                <template slot-scope="scope"><el-image :src="scope.row.cover" style="width: 120px; height: 80px"></el-image></template>
              </el-table-column>
              <!--        <el-table-column label="视频" prop="url" align="center">-->
              <!--          <template slot-scope="scope"><video controls="true" style="width: 100px;height: 100px"><source :src="scope.row.url" type="video/mp4" /></video></template>-->
              <!--        </el-table-column>-->
              <el-table-column label="上传用户uin" prop="uin" align="center"></el-table-column>
              <el-table-column label="舞曲名称" prop="name" align="center"></el-table-column>
              <el-table-column label="标签" prop="cate" align="center">
                <template slot-scope="scope">{{scope.row.cate}}</template>
              </el-table-column>
              <el-table-column label="上传时间" prop="addtime" align="center"></el-table-column>
              <el-table-column label="审核原因" prop="reason" align="center"></el-table-column>
              <el-table-column label="审核" prop="status" align="center">
                <template slot-scope="scope"><el-button type="text" size="small" @click="scope.row.status == '撤销' ? cancel(scope.row.id) : getVideo(scope.$index, scope.row)">{{ scope.row.status }}</el-button></template>
              </el-table-column>
              <el-table-column label="操作" prop="" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="delete1(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 视频详情 -->
            <el-dialog :visible.sync="dialogVisible" width="75%" @close="closeVideo">
              <el-container>
                <!-- 视频播放区 -->
                <el-aside width="55%">
                  <video controls="true" :key="key" style="width: 95%;height: 450px"><source :src="videoUrl" type="video/mp4" /></video>
                </el-aside>
                <!-- 审核区 -->
                <el-main>
                  <el-form ref="reviewForm" :model="form">
                    <!--              <el-form-item label="视频" prop="url" :label-width="formLabelWidth"><video controls="true" style="width: 95%;height: 450px"><source :src="form.url" type="video/mp4" /></video></el-form-item>-->
                    <el-form-item label="上传用户uin" prop="uin" :label-width="formLabelWidth"><el-input v-model="form.uin" disabled /></el-form-item>
                    <el-form-item label="舞曲名称" prop="name" :label-width="formLabelWidth"><el-input v-model="form.name" disabled /></el-form-item>
                    <el-form-item label="标签" :label-width="formLabelWidth">
                      <el-radio-group v-model="radio">
                        <el-radio :label="8">8步</el-radio>
                        <el-radio :label="16">16步</el-radio>
                        <el-radio :label="32">32步</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="标题" prop="title" :label-width="formLabelWidth"><el-input v-model="form.title" disabled /></el-form-item>
                    <el-form-item label="时间" prop="addtime" :label-width="formLabelWidth"><el-input v-model="form.addtime" disabled /></el-form-item>
                    <el-form-item>
                      <el-row type="flex" justify="space-between">
                        <el-col><el-button type="primary" @click.native="Success()">通过</el-button></el-col>
                        <el-col :span="14"><el-button type="primary" @click="Fail()">不通过</el-button></el-col>
                        <el-col><el-input placeholder="请输入不通过的原因" v-model="inputReason" clearable></el-input></el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item><el-button type="danger" @click.native="deleteVideo()">删除</el-button>
                    </el-form-item>
                  </el-form>
                </el-main>
              </el-container>
              <span slot="footer" class="dialog-footer"><el-button type="primary" @click.native="nextVideo()">下一个</el-button></span>
            </el-dialog>

            <!-- 分页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="queryInfo.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="margin-top: 30px"
            >
            </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="舞曲" name="dance">
           <!-- 查看选择 -->
          <el-radio-group v-model="choose_dance" @change="search_dance()">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="机选通过"></el-radio-button>
            <el-radio-button label="等待人工审核"></el-radio-button>
            <el-radio-button label="未通过"></el-radio-button>
          </el-radio-group>

            <!-- 搜索框 -->
            <el-row style="margin-top:15px">
              <el-col :span="8">
                <el-input placeholder="请输入uin" v-model="searchInput_dance" @keyup.enter.native="search_dance()" clearable @clear="getDanceData()">
                  <el-button slot="append" icon="el-icon-search" @click.native="search_dance()"></el-button>
                </el-input>
              </el-col>
            </el-row>

            <!-- 表格数据 -->
            <el-table v-loading="loading" :data="danceData" stripe>
              <el-table-column label="舞曲名称" prop="title" align="center"></el-table-column>
              <el-table-column label="上传用户uin" prop="uin" align="center"></el-table-column>
              <el-table-column label="上传时间" prop="addtime" align="center"></el-table-column>
              <el-table-column label="审核原因" prop="reason" align="center"></el-table-column>
              <el-table-column label="审核" prop="status" align="center">
                <template slot-scope="scope"><el-button type="text" size="small" @click="scope.row.status == '撤销' ? cancel_dance(scope.row.id) : getVideo_dance(scope.$index, scope.row)">{{ scope.row.status }}</el-button></template>
              </el-table-column>
              <el-table-column label="操作" prop="" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="delete_dance1(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 视频详情 -->
            <el-dialog :visible.sync="dialogVisible_dance" width="75%" @close="closeVideo_dance">
              <el-container>
                <!-- 视频播放区 -->
                <el-header>
                  <audio controls="true" :key="key_dance" style="width: 70%"><source :src="videoUrl_dance" type="audio/mp3" /></audio>
                </el-header>
                <!-- 审核区 -->
                <el-main>
                  <el-form ref="reviewForm_dance" :model="form_dance">
                    <el-form-item label="舞曲名称" prop="title" >
                      <el-input v-model="form_dance.title" style="width:500px"/>
                      <el-button style="margin-left:20px" @click="review_dance">修改标题</el-button>
                      </el-form-item>
                    <el-form-item>
                      <el-row type="flex" justify="space-between">
                        <el-col :span="6"><el-button type="primary" @click.native="Success_dance()">通过</el-button></el-col>
                        <el-col :span="4"><el-button type="primary" @click="Fail_dance()">不通过</el-button></el-col>
                        <el-col><el-input placeholder="请输入不通过原因" v-model="inputReason_dance" clearable style="width:370px"></el-input></el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item><el-button type="danger" @click.native="deleteVideo_dance()">删除</el-button>
                    </el-form-item>
                  </el-form>
                </el-main>
              </el-container>
              <span slot="footer" class="dialog-footer"><el-button type="primary" @click.native="nextVideo_dance()">下一个</el-button></span>
            </el-dialog>

            <!-- 分页 -->
            <el-pagination
              @size-change="handleSizeChange_dance"
              @current-change="handleCurrentChange_dance"
              :current-page="queryInfo_dance.page"
              :page-sizes="[10, 20, 50, 100,500]"
              :page-size="queryInfo_dance.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total_dance"
              style="margin-top: 30px"
            >
            </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>

<script>
import {Choose, Option, getTag, SearchVideo,getDanceList} from '@/api/reviewVideo'

export default {
  data(){
    return{
      tableData:[], //表格数据
      tableDataCache:[], //表格数据缓存

      danceData:[],
      danceDataCache:[],
      //视频信息表单
      form: {
        uin: "",
        id: "",
        name: "",
        cate: "",
        title: "",
        addtime: "",
        status: "",
      },

      form_dance: {
        title: ''
      },

      searchInput: '', //搜索框输入
      searchInput_dance: '',
      inputReason: '鉴黄失败', //不通过的原因
      inputReason_dance: '请上传广场舞版或DJ版',

      //查询参数
      queryInfo: {
        page: 1,
        size: 5,
        status: 1
      },

      queryInfo_dance: {
        uin:this.searchInput_dance,
        page: 1,
        size: 10,
        status: ''
      },

      key:0,  //迭代参数
      key_dance:0,

      index: '',
      index_dance: '',
      imgUrl: '',//封面地址
      videoUrl: '',//视频地址
      videoUrl_dance: '',

      switch_btn: 'video',
      total: 0,
      total_dance: 1000,
      choose: '全部',
      choose_dance: '全部',
      radio: 16,
      formLabelWidth: '89px',
      loading: false,
      dialogVisible: false,
      dialogVisible_dance: false,
      flag:false,
      status: 0
    }
  },
  created() {
    this.getTableData();
  },
  methods:{
    async chooseTable(){
      const res = await Choose(this.queryInfo)
      this.tableData = res.data.retData.results;
      this.tableDataCache = this.tableData;
      this.total = res.data.retData.total;
      console.log('res : ',res);
      res.data.retData.results.forEach(item => {
        if (item.status == 2) {  item.status = '通过';}
        else if (item.status == -1) {  item.status = '未通过';}
        else if (item.status == 0) {  item.status = '待审核';}
        else {  item.status = '默认';}
      })
    },
   
    getTableData() {
      if (this.choose == "全部") {
        this.queryInfo.status = 1;
      } else if (this.choose == "待审核") {
        this.queryInfo.status = 0;
      } else if (this.choose == "未通过") {
        this.queryInfo.status = -1;
      }
      this.chooseTable();
    },

    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      if(this.flag){
        this.search()
      }else{
        this.getTableData();
      }
    },
    handleSizeChange_dance(newSize) {
       this.queryInfo_dance.size = newSize;
       this.search_dance()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      if(this.flag){
        this.search()
      }else{
        this.getTableData();
      }
    },
    handleCurrentChange_dance(newPage) {
      this.queryInfo_dance.page = newPage;
      this.search_dance()
    },

    // 搜索
    async search() {
      if(this.searchInput == ''){
        this.getTableData()
      }else{
        this.flag = true;
        this.tableData = [];
        const params = { uin:this.searchInput,page:this.queryInfo.page,size:this.queryInfo.size,status:this.queryInfo.status};
        const res = await SearchVideo(params);
        this.tableData = res.data.retData.results;
        this.total = res.data.retData.total;
        console.log('search:',res);
        res.data.retData.results.forEach(item => {
          if (item.status == 2) {  item.status = '通过';}
          else if (item.status == -1) {  item.status = '未通过';}
          else if (item.status == 0) {  item.status = '待审核';}
          else {  item.status = '默认';}
        })
      }
    },
    async search_dance() {
       if (this.choose_dance == "机选通过") {
        this.queryInfo_dance.status = 1;
      } else if (this.choose_dance == "等待人工审核") {
        this.queryInfo_dance.status = 0;
      } else if (this.choose_dance == "未通过") {
        this.queryInfo_dance.status = -1;
      } else if (this.choose_dance == "全部") {
        this.queryInfo_dance.status = ""
      }
     if(this.searchInput_dance !== ''){
        this.flag_dance = true;
        this.danceData = [];
        const params = { uin:this.searchInput_dance,page:this.queryInfo_dance.page,size:this.queryInfo_dance.size,status:this.queryInfo_dance.status};
        const res = await this.$http.get('http://www.suibo.tv/api/pwapi/manage/user/music/list',{params:params})
      // const res = await this.$http.get("API/api/pwapi/manage/user/music/list", { params: params })

        this.danceData = res.data.retData;
        this.total = res.data.retData.total;
        console.log('search_dance:',res);
        res.data.retData.forEach(item => {
          if (item.status == 1) {  item.status = '通过';}
          else if (item.status == -1) {  item.status = '未通过';}
          else if (item.status == 0) {  item.status = '待审核';}
          else {  item.status = '默认';}
        })
      }
    },

    // 查看审核
    getVideo(index, row) {
      this.dialogVisible = true;
      this.form.uin = row.uin;
      this.form.name = row.name;
      this.form.cate = row.cate;
      this.form.title = row.title;
      this.form.addtime = row.addtime;
      this.form.id = row.id;
      this.form.index = index;
      this.index = index;
      this.form.status = row.status;

      this.key += 1;
      this.videoUrl = row.url;
      console.log('row.url:',row.url);
      console.log('videoUrl: ',this.videoUrl)
      console.log("form : ",this.form);
      this.$forceUpdate()
    },

    getVideo_dance(index, row) {
      this.dialogVisible_dance = true;
      this.form_dance.title = row.title;
      this.form_dance.id = row.id;
      this.form_dance.index = index;
      this.index_form = index;
      this.form_dance.status = row.status;
      this.key_dance += 1;
      this.videoUrl_dance = row.url;
      console.log('row.url:',row.url);
      console.log('videoUrl: ',this.videoUrl_dance)
      console.log("form_dance : ",this.form_dance);
      this.$forceUpdate()
    },
    // 舞曲审核修改
    async review_dance() {
      const params = {
        id:this.form_dance.id,
        status:this.status,
        reason:this.inputReason_dance,
        title:this.form_dance.title
      }
      const res = await this.$http.post('http://www.suibo.tv/api/pwapi/manage/user/music/modify',params)
      // const res = await this.$http.post('API/api/pwapi/manage/user/music/modify',params)
      this.search_dance()
    },

    // 下一个
    nextVideo() {
      ++this.index;
      if(this.index == this.queryInfo.size){
        this.index = 0
      }
      this.getVideo(this.index,this.tableData[this.index]);
      this.videoUrl = this.tableData[this.index].url;
      this.form.id = this.tableDataCache[this.form.index - 1].id;
      this.form.index = this.form.index + 1;
      this.getVideo(this.index,this.tableData[this.index]);
      console.log('this.index: ',this.index);
      // this.getTableData();
      if(this.index == this.total-1){
        return this.$message.info('只剩这最后一个了！')
      }
      this.getTableData();
    },
    nextVideo_dance() {
      ++this.index_dance;
      if(this.index_dance == this.queryInfo_dance.size){
        this.index_dance = 0
      }
      this.getVideo_dance(this.index_dance,this.danceData[this.index_dance]);
      this.videoUrl_dance = this.danceData[this.index_dance].url;
      this.form_dance.id = this.danceDataCache[this.form_dance.index - 1].id;
      this.form_dance.index = this.form_dance.index + 1;
      this.getVideo_dance(this.index_dance,this.danceData[this.index_dance]);
      console.log('this.index_dance: ',this.index_dance);
      // this.getTableData();
      if(this.index_dance == this.total_dance-1){
        return this.$message.info('只剩这最后一个了！')
      }
      this.getDanceData();
    },

    // 通过
    async Success() {
      const params = { status: 2, uid: this.form.id };
      // const res = await this.$http.get("http://192.168.2.163:19100/api/pwapi/manage/user/dance/status",{ params: { status: 2, uid: this.form.id }}
      const res = await Option(params);
      if (res.data.retData.code == 1) {
        console.log("this.tableData[this.form.index] : ",this.tableData[this.form.index])
        this.tableData[this.form.index].status = "通过";
        this.form.status = this.tableData[this.form.index].status;
        this.form.cate = this.radio;
        this.tableData[this.form.index].cate = this.form.cate;
        this.getTableData();
        this.$message.info('已通过！')
      }
    },
    Success_dance() {
      this.status = 1
      this.$message.info('已通过！')
      this.review_dance()
      this.search_dance()
    },

    // 不通过
    async Fail() {
      // const res  = await this.$http.get("http://192.168.2.163:19100/api/pwapi/manage/user/dance/status", { params: { status: -1, uid: this.form.id, reason: this.inputReason }});
      const params = { status: -1, uid: this.form.id, reason: this.inputReason};
      const res = await Option(params);
      if (res.data.retData.code == 1) {
        this.tableData[this.form.index].status = "未通过";
        this.form.status = this.tableData[this.form.index].status;
        this.form.cate = this.radio;
        this.tableData[this.form.index].cate = this.form.cate;
        this.getTableData();
        this.$message.info('未通过！')
      }
    },
    Fail_dance() {
       this.status = -1
       this.$message.info('未通过！')
      this.review_dance()
      this.search_dance()
    },

    //删除
    async deleteVideo() {
      const params = { status: -2, uid: this.form.id };
      const confirmRusult = await this.$confirm('此操作将永久删除该文件, 是否继续?','永久删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(confirmRusult)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmRusult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await Option(params).then((res) => {
        const { data: response } = res
        console.log(response)
        if (response.retData.code !== 1) {
          return this.$message.error('删除失败')
        }
        this.$message.success('已删除')
        this.getTableData()
      })
    },
    deleteVideo_dance() {

    },

    async delete1(id){
      const params = { status: -2, uid: id };
      const confirmRusult = await this.$confirm('此操作将永久删除该文件, 是否继续?','永久删除该用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(confirmRusult)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      await Option(params).then((res) => {
        const { data: response } = res
        console.log(response)
        if (response.retData.code !== 1) {
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户已经删除')
        this.getTableData()
      })
    },

    delete_dance1() {

    },

    //  关闭视频(修改标签)
    async closeVideo(){
      const params = {uid:this.form.id,new_cate:this.form.cate};

      // const res = await this.$http.get("http://192.168.2.163:19100/api/pwapi/manage/user/dance/tag",{params:{uid:this.form.id,new_cate:this.form.cate}});
      const res = await getTag(params);
      if(res.data.retData.code ==1){
        this.getTableData();
      }
      this.$refs.reviewForm.resetFields();
      this.getTableData();
      this.$forceUpdate()
    },

    closeVideo_dance() {

    },

    // 撤销
    async cancel(id) {
      const params = { status: 0, uid: id};
      // const { data: res } = await this.$http.get("http://192.168.2.163:19100/api/pwapi/manage/user/dance/status", { params: { status: 0, uid: id}}
      const res = await  Option(params);
      if (res.data.retData.code == 1) {
        this.getTableData();
      }
    },

    cancel_dance() {

    },

    async cancelVideo(){
      this.queryInfo.status = '-1';
      // const res = await this.$http.get("http://192.168.2.163:19100/api/pwapi/manage/user/dance/details", { params: this.queryInfo });
      const res = await  Choose(this.queryInfo)
      this.tableData = res.data.retData.results;
      this.tableDataCache = this.tableData;
      this.total = res.data.retData.total;


      console.log('res : ',res);
      res.data.retData.results.forEach(item => {
        item.status = '撤销';
      })
    }
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>
