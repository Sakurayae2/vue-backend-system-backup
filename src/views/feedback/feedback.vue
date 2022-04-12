<template>
  <div class="app-container">
    <!-- 卡片视图 -->
    <!--聊天框-->
    <el-card>
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col style="width:450px;">
          <!-- <el-input v-model="search.content" placeholder="请输入" clearable @keyup.enter.native="$event.target.blur" @blur="getList()"> -->
          <el-input v-model="search.content" placeholder="请输入" clearable @keyup.enter.native="getList()">
            <el-select slot="prepend" v-model="search.type" placeholder="请选择" clearable style="width: 110px;">
              <el-option label="用户名" value="nick" style="text-align: center" />
              <el-option label="uin" value="uin" style="text-align: center" />
              <el-option label="消息字段" value="content" style="text-align: center" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="blurflag&&getList()" />
          </el-input>
        </el-col>
      </el-row>
      <template>
        <div class="body">
          <div class="userListLeft">
            <div class="refresh"><i :class="refreshbtn?'el-icon-refresh':'el-icon-loading'" @click="refreshUserList"></i></div>
            <el-table :data="userlist" height="800" border :highlight-current-row="true" @row-click="showChatHistory">
              <el-table-column prop="date" label="用户列表" align="center">
                <template slot-scope="scope">
                  <div>
                    <div class="avatar" @click.stop="toInformation(scope.row)">
                      <el-avatar :size="60" :src="userlist[scope.$index].avatar"></el-avatar>
                    </div>
                    <div class="title">
                      <div class="username">{{ userlist[scope.$index].username }}</div>
                      <div class="uin">uin:{{ userlist[scope.$index].uin }}
                        <i class="el-icon-document-copy" v-clipboard:copy="scope.row.uin" @click.stop="copy(scope.row.uin)"></i>
                      </div>
                    </div>
                    <div class="time">{{ userlist[scope.$index].time }}</div>
                    <i id="tag" :class="userlist[scope.$index].starFlag?'el-icon-star-on':'el-icon-star-off'" @click.stop="starbtn(scope.$index)"></i>
                    <div class="message">
                      <span v-if="userlist[scope.$index].is_read == 1">【我已读】</span>
                      <span v-else-if="userlist[scope.$index].is_read == 2">点击将主动发起聊天</span>
                      <span v-else-if="userlist[scope.$index].is_read===''">我存在{{ userlist[scope.$index].amount }}条数据</span>
                      <span v-else style="color: red">【我未读】</span>
                      {{ userlist[scope.$index].message }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="userChatRight">
            <div id="content" class="content">
              <el-button icon="el-icon-arrow-up" style="width: 100%;margin-bottom: 20px" :disabled="noMore" @click="moreChat">更多消息</el-button>
              <div v-for="(item, index) in chatHistory" :key="index">
                <div v-if="!item.is_manager" class="dialogBox">
                  <!--用户-->
                  <div class="avatar" @click="toInformation">
                    <el-avatar :src="currentUser.avatar"></el-avatar>
                  </div>
                  <div>
                    <div class="title">
                      <p class="username">{{ item.username }}</p>
                      <p class="time">{{ item.time }}</p>
                      <p>{{ currentUser.nobleman || '无贵族信息' }}</p>
                      <p>LV{{ currentUser.level || 0 }}</p>
                      <p>V{{ currentUser.version || '0.0.0' }}</p>
                      <p>{{ currentUser.forbidden || '无封禁记录' }}</p>
                    </div>
                    <div v-if="item.is_img" class="message fl" style="border:none;">
                      <el-image
                        v-if="item.is_img"
                        class="msgImg"
                        :src="item.message"
                        :preview-src-list="srcList"
                        @click="addPreview(item.message)"
                      ></el-image>
                    </div>
                    <div v-else class="message fl">{{ item.message }}</div>
                  </div>
                </div>
                <div v-else>
                  <!--客户端-->
                  <div class="dialogBox" style="float: right">
                    <div>
                      <div class="title" style="justify-content: flex-end;">
                        <i class="readStatus" :class="item.user_read?'el-icon-circle-check':'el-icon-search'"></i>
                        <p class="time">{{ item.time }}</p>
                        <p class="username">随播-{{ item.manager_name }}</p>
                      </div>
                      <div v-if="item.is_img" class="message fr" style="border:none;">
                        <el-image
                          v-if="item.is_img"
                          class="msgImg"
                          :src="item.message"
                          :preview-src-list="srcList"
                          @click="addPreview(item.message)"
                        ></el-image>
                      </div>
                      <div v-else-if="(/<p>.*<\/p>/g).test(item.message)" class="message fr" v-html="item.message"></div>
                      <div v-else class="message fr">{{ item.message }}</div>
                    </div>
                    <div class="avatar">
                      <el-avatar :src="require('@/assets/logo.jpg')"></el-avatar>
                    </div>
                  </div>
                </div>
                <div class="line" style="float: left; width: 100%; height: 20px;"></div>
              </div>
            </div>
            <div class="chatBottom">
              <div class="chatState">
                <!--<el-button class="fl" @click="showQuickRoot">快捷回复</el-button>-->
                <div class="quickTxt">
                  <ul v-show="quickTxtRootFlag" id="quickTxtRoot" class="quickTxtRoot">
                    <li v-for="(item,index) in quickTxtRootList" :key="index" @mouseover="showQuickChild($event, index)">
                      <input
                        v-model="quickTxtRootList[index].name"
                        type="text"
                        :title="quickTxtRootList[index].name"
                        @blur="blurRoot"
                      >
                      <el-popconfirm
                        v-if="quickTxtRootList[index].list.length===0"
                        title="这是一段内容确定删除吗？"
                        :data-i="index"
                        @onConfirm="removeRootThisLi(index)"
                      >
                        <i slot="reference" class="el-icon-close" style="color: #ccc"></i>
                      </el-popconfirm>
                    </li>
                    <li>
                      <input slot="reference" v-model="inputValue" :title="inputValue" type="text" placeholder="添加快捷消息" @blur="addQuickTxtRootList" @keyup.enter="addQuickTxtRootList">
                    </li>
                  </ul>
                  <ul v-show="quickTxtChildFlag" id="quickTxtChild" class="quickTxtChild">
                    <li
                      v-for="(item,index) in quickTxtChildList"
                      :key="index"
                    >
                      <input
                        v-model="quickTxtChildList[index].content"
                        type="text"
                        :title="quickTxtChildList[index].content"
                        @mouseover="mouseOverChild"
                        @click="addQuickMessage"
                      >
                      <el-popconfirm
                        title="这是一段内容确定删除吗？"
                        :data-i="index"
                        @onConfirm="removeChildThisLi(index)"
                      >
                        <i slot="reference" class="el-icon-close" style="color: #ccc"></i>
                      </el-popconfirm>
                    </li>
                    <input
                      slot="reference"
                      v-model="inputValueChild"
                      :title="inputValueChild"
                      placeholder="添加快捷消息"
                      type="text"
                      clearable
                      @blur="addQuickTxtChildList"
                      @keyup.enter="addQuickTxtChildList"
                    >
                  </ul>
                </div>
                <!--<el-button class="fl" style="margin-left: 10px;" @click="showAuto">自动回复</el-button>-->
                <div v-show="showautoFalg" class="auto">
                  <ul>
                    <li v-for="(item,index) in autoList" :key="index">
                      <input v-model="item.logic" :title="item.logic" type="text" @blur="amendAtuoLogic(index)" @keyup.enter="amendAtuoLogic(index)">
                      <input v-model="item.content" :title="item.content" class="active" type="text" @blur="amendAtuoContent(index)" @keyup.enter="amendAtuoContent(index)">
                    </li>
                  </ul>
                </div>
                <!--<el-button class="fl" style="margin-left: 10px;" @click="showAddPhotoFlag=!showAddPhotoFlag;showautoFalg=false;">添加图片</el-button>-->
                <el-button class="fr" :disabled="unableSend" style="border-radius: 0" @click="send">发送</el-button>
              </div>
              <div id="messageInput" ref="MSGInput" class="messageInput"></div>
              <!--<el-input-->
              <!--  v-model="sendMessage.message"-->
              <!--  type="textarea"-->
              <!--  rows="4"-->
              <!--  class="messageInput"-->
              <!--  placeholder="请输入..."-->
              <!--  clearable-->
              <!--  @keyup.enter.native="send"-->
              <!--  @focus="onFocus"-->
              <!--&gt;</el-input>-->
              <div class="uploadPhoto fl">
                <el-upload
                  v-show="showAddPhotoFlag"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="success"
                  :file-list="fileList"
                  :http-request="uploadPdf"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-card>
    <image-viewer v-if="elImageViewerShow" :z-index="10001" :on-close="closeViewer" :url-list="srcList"></image-viewer>
  </div>
</template>

<script>
import { getReadList, getChatHistory, sendMessage, chatReaded, searchReadList, starState, reply, addReply, deleteReply, auto, amendAtuo } from '@/api/feedback'
import qs from 'qs'
import { mapGetters } from 'vuex'
import WangEditor from 'wangeditor'
const { BtnMenu } = WangEditor
import ImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  inject: ['reload'],
  components: {
    ImageViewer
  },
  data() {
    return {
      elImageViewerShow: false,
      oldHtml: '',
      editor: null,
      refreshbtn: true,
      showautoFalg: false,
      autoList: [],
      // 分类ID
      category_id: '',
      showAddPhotoFlag: false,
      // 添加快捷消息
      inputValue: '',
      inputValueChild: '',
      quickTxtRootList: [],
      quickTxtChildList: [],
      quickTxtRootFlag: false,
      quickTxtChildFlag: false,
      dialogImageUrl: '',
      dialogVisible: false,
      blurflag: true,
      search: {
        type: 'uin',
        content: ''
      },
      // 获取用户列表查询参数对象,pagenum:当前页数,pagesize:每页显示多少数据
      queryInfo: {
        // query: '',
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      // 上传图片
      fileList: [],
      // 发送信息
      sendMessage: {
        message: '',
        image: [],
        uin: '',
        is_image: false,
        file: [],
        manager_name: ''
      },
      // 返回信息
      chatHistory: [],
      // chatHistory: [{
      //   is_manager: true,
      //   time: '2021-8-9 12:36',
      //   is_img: true,
      //   message: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
      // }, {
      //   username: 'shamoke',
      //   time: '2021-8-9 12:36',
      //   is_manager: false,
      //   is_img: true,
      //   message: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
      // }],
      // 大图预览
      srcList: [],
      currentUser: {
        uin: '',
        avatar: ''
      },
      suiboClient: {
        logo: './static/img/logo.jpg'
      },
      noMore: false,
      unableSend: true
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  watch: {
    oldHtml(val, oldVal) {
      // console.log(val, oldVal)
      this.unableSend = val === ''
      const _this = this
      document.onkeydown = function(e) {
        if (e.key === 'Enter') {
          _this.send()
        }
      }
    }
  },
  created() {
    this.getList()
    this.sendMessage.manager_name = this.username
  },
  mounted() {
    this.createWangEditor()
    this.imgToBlock()
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy()
    this.editor = null
  },
  methods: {
    // 自定义扩展菜单
    createClass() {
      const that = this
      class quickReply extends BtnMenu {
        constructor(editor) {
          const $elem = WangEditor.$(`<div class="w-e-menu"><el-button style="font-size: 14px;">快捷回复</el-button></div>`)
          super($elem, editor)
        }
        // 菜单点击事件
        clickHandler(e) {
          that.showQuickRoot()
        }
        tryChangeActive() {
          that.quickTxtRootFlag = false
        }
      }
      class autoReply extends BtnMenu {
        constructor(editor) {
          const $elem = WangEditor.$(`<div class="w-e-menu"><el-button style="font-size: 14px;">自动回复</el-button></div>`)
          super($elem, editor)
        }
        // 菜单点击事件
        clickHandler(e) {
          that.showAuto()
        }
        tryChangeActive() {
          that.showautoFalg = false
        }
      }
      // class send extends BtnMenu {
      //   constructor(editor) {
      //     const $elem = WangEditor.$(`<div class="w-e-menu"><el-button>发送</el-button></div>`)
      //     super($elem, editor)
      //   }
      //   // 菜单点击事件
      //   clickHandler(e) {
      //     that.send()
      //   }
      //   tryChangeActive() {}
      // }

      class photos extends BtnMenu {
        constructor(editor) {
          const $elem = WangEditor.$(`<div class="w-e-menu"><el-button  style="font-size: 14px;">上传图片</el-button></div>`)
          super($elem, editor)
        }
        // 菜单点击事件
        clickHandler(e) {
          that.showAddPhotoFlag = true
        }
        tryChangeActive() {}
      }
      WangEditor.registerMenu('photosKey', photos)

      WangEditor.registerMenu('quickReplyKey', quickReply)
      WangEditor.registerMenu('autoReplyKey', autoReply)
      // WangEditor.registerMenu('sendKey', send)
    },
    // 创建富文本编辑器
    createWangEditor() {
      this.createClass()
      this.editor = new WangEditor('#messageInput')
      this.editor.config.uploadImgServer = 'http://www.suibo.tv/api/pwapi/manage/backend/feedback/upload' // 上线时需要改为线上
      // this.editor.config.uploadImgServer = 'http://192.168.2.141:19100/api/pwapi/manage/backend/feedback/upload' // 上线时需要改为线上
      this.editor.config.uploadImgParams = {
        uin: this.currentUser.uin
      }
      this.editor.config.uploadFileName = 'image[]'
      // this.editor.config.uploadImgHooks = {
      //   // 图片上传并返回了结果，图片插入已成功
      //   success: function(xhr) {
      //     console.log('success', xhr)
      //   }
      // }
      this.editor.config.menus = [
        // 'emoticon',
        'image',
        'photos',
        'quickReply',
        'autoReply'
      ]
      this.editor.config.placeholder = '请输入...'
      // 配置全屏功能按钮是否展示
      this.editor.config.showFullScreen = false
      this.editor.config.height = 100
      this.editor.config.zIndex = 101
      const reg = /<p><br\/><\/p>/
      const that = this
      this.editor.config.onchange = function(newHtml) {
        if (reg.test(newHtml)) that.editor.txt.clear() // 直接按enter键清空
        that.sendMessage.message = newHtml
        that.oldHtml = newHtml
      }
      this.editor.create()
    },
    // 大图预览
    addPreview(imgurl) {
      this.srcList = []
      this.srcList.push(imgurl)
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
    uploadPdf(f) {
      this.$http.jsonp('https://jsonplaceholder.typicode.com/posts/', {},
        { headers: {}, emulateJSON: true })
        .then((response) => {
          f.onSuccess()
        })
    },
    // 上传图片部分
    success(response, file, fileList) {
      this.sendMessage.image = []
      this.sendMessage.file = []
      this.fileList = fileList
      fileList.forEach((item, index) => {
        this.sendMessage.image[index] = item.raw
        this.sendMessage.file[index] = item
      })
      this.unableSend = this.sendMessage.file === []
      this.sendMessage.message = ' '
      // console.log(this.fileList)
    },
    handleRemove(file, fileList) {
      this.sendMessage.image = []
      this.sendMessage.file = []
      fileList.forEach((item, index) => {
        this.sendMessage.image[index] = item.raw
        this.sendMessage.file[index] = file
      })
      // console.log(this.sendMessage.image)
    },
    handlePreview(file) {
      console.log(file)
    },
    refreshUserList() {
      if (this.refreshbtn === false) return
      this.refreshbtn = false
      this.getList()
    },
    // 获取未读和已读列表
    getList() {
      const params = {
        passwd: 'taolesoft0571',
        searchType: this.search.type,
        searchContent: this.search.content
      }
      // 存在搜索消息调用搜索接口，否在调用全部列表接口
      if (this.search.content !== '') {
        searchReadList(params).then(res => {
          // console.log(res)
          this.userlist = []
          const data = res.data.retData.dataList
          data.forEach(item => {
            if (item.many) {
              this.userlist.push({
                avatar: item.avatar,
                username: item.nick,
                is_read: '',
                starFlag: Boolean(item.is_star),
                amount: item.amount
              })
            } else {
              this.userlist.push({
                avatar: item.avatar,
                uin: item.uin,
                username: item.nick,
                message: item.content,
                time: item.create_time.slice(5, 10),
                is_read: item.is_read,
                is_img: Boolean(item.is_img),
                starFlag: Boolean(item.is_star)
              })
            }
          })
          this.refreshbtn = true
        })
      } else {
        getReadList(params).then(res => {
          this.userlist = []
          const data = res.data.retData.dataList
          data.forEach(item => {
            this.userlist.push({
              avatar: item.avatar,
              uin: item.uin,
              username: item.nick,
              message: item.content,
              time: item.create_time.slice(5, 10),
              is_read: item.is_read,
              is_img: Boolean(item.is_img),
              starFlag: Boolean(item.is_star)
            })
          })
          this.refreshbtn = true
        })
      }
    },
    // 更改star状态
    starbtn(index) {
      const data = {
        passwd: 'taolesoft0571',
        uin: this.userlist[index].uin
      }
      starState(qs.stringify(data)).then(res => {
        if (res.data.retData.statusCode === 200) {
          this.userlist[index].starFlag = !this.userlist[index].starFlag
        }
      })
    },
    // 展示聊天框
    showChatHistory(row) {
      this.currentUser.uin = row.uin
      this.currentUser.avatar = row.avatar
      // 富文本销毁再创建
      this.editor.destroy()
      this.editor = null
      this.createWangEditor()
      const params = {
        passwd: 'taolesoft0571',
        uin: this.currentUser.uin,
        size: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum
      }
      getChatHistory(params).then(res => {
        // console.log(res.data.retData)
        // 未读状态改变成已读
        const retdata = res.data.retData
        if (res.data.retData.statusCode === 200) {
          const chat = {
            passwd: 'taolesoft0571',
            uin: this.currentUser.uin,
            fromManager: 1
          }
          // 发送请求 未读变已读
          chatReaded(qs.stringify(chat)).then((res) => {
            row.is_read = 1 // 标记当前行已读
          })
          // 渲染聊天记录列表
          Object.assign(this.currentUser, retdata.backData) // 拼接
          this.chatHistory = []
          retdata.dataList.forEach(item => {
            this.chatHistory.push({
              uin: item.uin,
              username: item.nick,
              time: item.create_time,
              message: item.content,
              is_manager: Boolean(item.is_manager),
              is_img: Boolean(Number(item.is_img)),
              manager_name: item.manager_name,
              user_read: Boolean(item.user_read)
            })
          })
          this.sendMessage.uin = this.currentUser.uin
          this.defaultScrollTop()
          this.noMore = false
          this.$nextTick(function() {
            this.imgToBlock()
          })
        }
      })
    },
    // 发送
    send() {
      if (!this.sendMessage.message) return
      var formData = new FormData()
      formData.append('passwd', 'taolesoft0571')
      formData.append('uin', this.sendMessage.uin)
      formData.append('manager', 1)
      formData.append('manager_name', this.username)
      formData.append('content', this.sendMessage.message)
      this.sendMessage.image.forEach(item => {
        formData.append('image[]', item)
      })
      sendMessage(formData).then(res => {
        // 成功
        if (res.data.retData.statusCode === 200) {
          const chat = {
            passwd: 'taolesoft0571',
            uin: this.sendMessage.uin,
            fromManager: 1
          }
          setTimeout(() => {
            // 发送消息成功，未读状态改变成已读
            chatReaded(qs.stringify(chat)).then(res => {
              // console.log(res.data.retData.statusCode)
              if (res.data.retData.statusCode === 200) {
                // 前端添加信息 start---------------
                const thisMessage = this.sendMessage.message
                if (this.sendMessage.image.length > 0) {
                  this.sendMessage.is_image = true
                  this.sendMessage.file.forEach(item => {
                    this.sendMessage.is_image = true
                    this.sendMessage.message = item.url
                    this.chatHistory.push({
                      manager_name: this.username, // 追踪客户端发送人
                      time: '刚刚',
                      is_manager: true,
                      message: this.sendMessage.message,
                      is_img: this.sendMessage.is_image
                    })
                  })
                  this.sendMessage.is_image = false
                  this.sendMessage.image = []
                  this.fileList = []
                }
                if (thisMessage) {
                  this.chatHistory.push({
                    manager_name: this.username, // 追踪客户端发送人
                    time: '刚刚',
                    is_manager: true,
                    message: thisMessage,
                    is_img: this.sendMessage.is_image
                  })
                }
                this.sendMessage.message = ''
                this.defaultScrollTop()
                this.showAddPhotoFlag = false
                this.editor.txt.clear()
                this.$nextTick(function() {
                  this.imgToBlock()
                })
                this.unableSend = true
                // 前端添加信息 end---------------
              }
            })
          }, 100)
        }
      })
    },
    // 聊天记录中的img display:block;
    imgToBlock() {
      const that = this
      const img = document.getElementsByTagName('img')
      for (let i = 0; i < img.length; i++) {
        if (img[i].parentNode.tagName === 'P') {
          img[i].style.display = 'block'
          img[i].style.maxWidth = '200px'
          img[i].style.margin = '5px 0'
          img[i].style.borderRadius = '8px'
          img[i].addEventListener('click', function() {
            that.showImgToBlock(img[i].currentSrc)
          })
        }
      }
    },
    // 富文本图片大图预览和关闭
    closeViewer() {
      this.elImageViewerShow = false
    },
    showImgToBlock(imgUrl) {
      this.addPreview(imgUrl)
      this.elImageViewerShow = true
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
    moreChat() {
      this.queryInfo.pagenum++
      const params = {
        passwd: 'taolesoft0571',
        uin: this.currentUser.uin,
        size: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum
      }
      getChatHistory(params).then(res => {
        const data = res.data.retData.dataList
        if (data.length === this.chatHistory.length) {
          this.noMore = true
        }
        this.chatHistory = []
        data.forEach(item => {
          this.chatHistory.push({
            uin: item.uin,
            username: item.nick,
            time: item.create_time,
            message: item.content,
            is_manager: Boolean(item.is_manager),
            is_img: Boolean(Number(item.is_img))
          })
        })
      })
    },
    //
    // 快捷回复部分 ///
    //
    showQuickRoot() {
      this.showautoFalg = false
      this.quickTxtRootFlag = !this.quickTxtRootFlag
      this.quickTxtChildFlag = false
      // console.log(this.quickTxtRootList)
      if (this.quickTxtRootList.length > 0) { return }
      reply({ passwd: 'taolesoft0571' }).then(res => {
        // console.log(res.data.retData.dataList)
        const data = res.data.retData.dataList
        this.quickTxtRootList = []
        data.forEach(item => {
          this.quickTxtRootList.push(item)
        })
      })
      const ul = document.getElementById('quickTxtRoot')
      for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].classList.remove('active')
      }
    },
    // 显示快捷回复消息子列表
    showQuickChild(event, index) {
      this.category_id = this.quickTxtRootList[index].category_id
      this.quickTxtChildList = this.quickTxtRootList[index].list
      const ul = document.getElementById('quickTxtRoot')
      for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].children[0].classList.remove('active')
      }
      event.target.classList.add('active')
      this.quickTxtChildFlag = true
    },
    // 添加快捷回复消息内容
    addQuickMessage(event) {
      this.sendMessage.message = event.target.value
      this.editor.txt.html('<p>' + event.target.value + '</p>')
      this.quickTxtChildFlag = false
      this.quickTxtRootFlag = false
    },
    // 添加快捷回复
    addQuickTxtRootList() {
      if (this.inputValue) {
        const data = {
          passwd: 'taolesoft0571',
          content: this.inputValue
        }
        // console.log(this.inputValue)
        addReply(qs.stringify(data)).then(res => {
          const cate_id = res.data.retData.cate_id
          this.quickTxtRootList.push({
            category_id: cate_id,
            name: this.inputValue,
            list: []
          })
          this.inputValue = ''
        })
      }
    },
    addQuickTxtChildList() {
      if (this.inputValueChild) {
        const data = {
          passwd: 'taolesoft0571',
          content: this.inputValueChild,
          category: this.category_id
        }
        addReply(qs.stringify(data)).then(res => {
          // console.log(res)
          const cate_id = res.data.retData.cate_id
          if (res.data.retData.statusCode === 200) {
            this.quickTxtChildList.push({
              content: this.inputValueChild,
              id: cate_id
            })
            this.inputValueChild = ''
          }
        })
      }
    },
    mouseOverChild() {
      // console.log(1)
    },
    // root失去焦点修改数据
    blurRoot() {
      console.log(123)
    },
    removeChildThisLi(index) {
      const data = {
        passwd: 'taolesoft0571',
        item: this.quickTxtChildList[index].id,
        is_delete: 1
      }
      deleteReply(qs.stringify(data)).then(res => {
        if (res.data.retData.statusCode === 200) {
          this.quickTxtChildList.splice(index, 1)
        }
      })
    },
    removeRootThisLi(index) {
      const data = {
        passwd: 'taolesoft0571',
        cid: this.quickTxtRootList[index].category_id,
        is_delete: 1
      }
      deleteReply(qs.stringify(data)).then(res => {
        if (res.data.retData.statusCode === 200) {
          this.quickTxtRootList.splice(index, 1)
          if (this.quickTxtRootList.length === 0) {
            this.quickTxtChildFlag = false
          }
        }
      })
    },
    // 自动回复消息
    showAuto() {
      this.quickTxtRootFlag = false
      this.quickTxtChildFlag = false
      this.showautoFalg = !this.showautoFalg
      auto({ passwd: 'taolesoft0571' }).then(res => {
        const data = res.data.retData.dataList
        this.autoList = []
        this.autoList = data
      })
    },
    amendAtuoLogic(index) {
      const data = {
        passwd: 'taolesoft0571',
        rid: this.autoList[index].id,
        logic: this.autoList[index].logic
      }
      amendAtuo(qs.stringify(data)).then(() => {})
    },
    amendAtuoContent(index) {
      const data = {
        passwd: 'taolesoft0571',
        rid: this.autoList[index].id,
        content: this.autoList[index].content
      }
      amendAtuo(qs.stringify(data)).then(() => {})
    },
    onFocus() {
      this.quickTxtChildFlag = false
      this.quickTxtRootFlag = false
      this.showautoFalg = false
    },
    copy(uin) {
      this.$message.success('复制uin:' + uin + '成功')
    },
    // 点击跳转另一个页面  资料页
    toInformation(row) {
      let index = 'https://www.suibo.tv/admin/user/info/uin/' + this.currentUser.uin
      if (row.uin) {
        index = 'https://www.suibo.tv/admin/user/info/uin/' + row.uin
      }
      window.open(index, '_blank') // 在新窗口打开外链接
      // window.location.href = index;  //在本页面打开外部链接
    },
    defaultScrollTop() {
      // 默认滚动条在最底部
      const ul = document.getElementById('content')
      this.$nextTick(() => {
        ul.scrollTop = ul.scrollHeight
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.bgactive{
  background-color: rgba(0,0,0,.1);
}
ul,li{
  margin: 0;
  padding: 0;
}
.fr{
  float: right;
}
.fl{
  float: left;
}
li{
  list-style: none;
}
.body{
  position: relative;
  height: 1000px;
}
.userListLeft{
  position: absolute;
  left: 0;
  width: 300px;
}
.userListLeft .refresh{
  position: absolute;
  top: 15px;
  right: 20px;
  z-index: 1;
  font-size: 20px;
}
.userListLeft .avatar{
  /* position: relative; */
  /* left: -40%; */
  width: 60px;
}
.userListLeft .title{
  position: absolute;
  top: 10px;
  left: 80px;
}
.userListLeft .title .username{
  font-size: 16px;
  text-align: left;
}
.userListLeft .title .uin{
  font-size: 12px;
  text-align: left;
}
.userListLeft .time{
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
}
.userListLeft #tag{
  position: absolute;
  top: 30px;
  right: 20px;
  font-size: 22px;
}
.userListLeft .message{
  position: absolute;
  top: 55px;
  left: 80px;
  width: 190px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  text-align: left;
}
.userListLeft .message span{
  font-size: 10px;
}
.userChatRight{
  position: absolute;
  left: 310px;
}
.content{
  width: 90%;
  min-width: 800px;
  /* width: 1000px; */
  height: 650px;
  min-height: 500px;
  border: 1px solid #ccc;
  padding: 10px;
  /*border-radius: 5px;*/
  overflow-y:scroll;
}
.chatState{
  position: relative;
  /* width: 800px; */
  width: 90%;
  min-width: 800px;
}
/* 快捷回复 */
.chatState .quickTxt{
  width: 150px;
}
.chatState input{
  display: flex;
  /* width: 150px; */
  height: 40px;
  line-height: 40px;
  border: 1px solid #ccc;
  padding: 0 20px;
  font-size: 14px;
  text-align: center;
  text-overflow:ellipsis;
  //white-space: nowrap;
}
.chatState input:focus{
  outline: none;
  border: 1px solid #aaa;
}
.quickTxt ul.quickTxtRoot{
  position: absolute;
  bottom: 0;
}
.quickTxt ul.quickTxtRoot li{
  position: relative;
  width: 100%;
}
.quickTxt ul.quickTxtRoot li input{
  width: 150px;
}
.quickTxt ul.quickTxtChild input{
  /* width: auto; */
  width: 500px;
  max-width: 500px;
}
.quickTxt ul.quickTxtChild{
  position: absolute;
  bottom: 0;
  left: 150px;
  /* width: 350px; */
}
.quickTxt ul.quickTxtChild li{
  position: relative;
  //width: 350px;
  //width: 100%;
}
ul.quickTxtRoot li i{
  position: absolute;
  top: 12px;
  right: 5px;
}
ul.quickTxtChild li i{
  position: absolute;
  top: 12px;
  right: 5px;
}
input.active{
  background-color: #98F5FF;
}
.messageInput{
  min-width: 800px;
  max-width: 1000px;
  /* width: 1000px; */
  width: 90%;
}
.auto{
  position: absolute;
  bottom: 0;
  left: 105px;
}
.auto li{
  display: flex;
  height: 40px;
  line-height: 40px;
  /*border: 1px solid #ccc;*/
  border-bottom: none;
  padding: 0 5px;
}
.auto li input{
  border: 1px solid #ccc;
  width: 120px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  padding: 0 5px;
}
.auto li input.active{
  width: 200px;
  background-color: #fff;
}
.uploadPhoto{
  margin: 0 10px;
}
.dialogBox{
  float: left;
  display: flex;
  color: #333;
  font-size: 14px;
}
.dialogBox .readStatus{
  margin-right: 5px;
  color: #ccc;
  line-height:20px;
}
.dialogBox .title{
  display: flex;
}
.dialogBox .title p{
  margin: 2px 10px 2px 0;
}
.dialogBox .avatar{
  margin: 0 10px;
}
.dialogBox .username,.dialogBox .time{
  margin: 2px 10px 2px 0;
}
.dialogBox .message{
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 400px;
  padding: 8px;
  margin-top: 8px;
  word-wrap:break-word;
  word-break:break-all;
}
.dialogBox .message .msgImg{
  border-radius: 5px;
  max-width: 200px;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: rgba(240, 240, 240, 0.5);
 }
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(200, 200, 200, 0.8);
}

</style>

