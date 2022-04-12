<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('@/assets/user.gif')" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="dialogVisible = true">
            <span style="display:block;">私信</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
<!--    <PrivateLetter v-show="dialogVisible" :showdialog="dialogVisible"></PrivateLetter>-->
    <el-dialog
      title="私信"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form
        ref="privateLetterForm"
        label-width="90px"
        :model="privateLetterForm"
        :rules="privateLetterFormRules"
      >
        <el-form-item label="Uin" prop="Uin">
          <el-input
            v-model="privateLetterForm.Uin"
            placeholder="请输入Uin，如：123,456,789。（0：表示发送给所有人）"
          />
        </el-form-item>
        <el-form-item label="message" prop="message">
          <el-input v-model="privateLetterForm.message" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendPrivateLetter()">发 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sendLetter } from '@/api/award'
import { mapGetters } from 'vuex'
import qs from 'qs'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import PrivateLetter from '@/components/PrivateLetter'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    PrivateLetter
  },
  data() {
    // 自定义Uin规则
    var checkUin = (rule, value, callback) => {
      const regExp = /^([0-9]+)(,[0-9]+)*$/
      if (regExp.test(value)) {
        // 合法
        return callback()
      }
      callback(new Error('输入不和法,多个以英文逗号分隔,如:123,456,789'))
    }
    // 自定义message规则
    var checkMessage = (rule, value, callback) => {
      if (value !== '') {
        // 合法邮箱
        return callback()
      }
      callback(new Error('消息不能为空'))
    }
    return {
      dialogVisible: false, // 私信的显示和隐藏
      privateLetterForm: {
        Uin: '',
        message: ''
      },
      privateLetterFormRules: {
        Uin: [
          { required: true, message: '请输入Uin', trigger: 'blur' },
          { validator: checkUin, trigger: 'blur' }
        ],
        message: [
          { required: true, message: 'message不能为空', trigger: 'blur' },
          { validator: checkMessage, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    sendPrivateLetter() {
      const data = {
        uin: this.privateLetterForm.Uin,
        msg: this.privateLetterForm.message
      }
      this.$refs.privateLetterForm.validate(valid => {
        if (valid) {
          // 发送私信
          sendLetter(qs.stringify(data)).then(res => {
            if (res.data.retData.statusCode === 200) {
              this.$message.success(res.data.retData.msg + res.data.retData.dataList)
              this.dialogVisible = false
              this.privateLetterForm.Uin = ''
              this.privateLetterForm.message = ''
            } else {
              this.$message.error(res.data.retData.msg)
            }
          })
        } else {
          this.$message.error('请输入正确的表单内容！')
        }
      })
      // this.$http
      //   .post('http://192.168.2.141:19100/api/pwapi/active/backend?pid=1', qs.stringify(data),
      //     {
      //       headers: {
      //         // 'content-type': 'application/json; charset=UTF-8'
      //         'content-type': 'application/x-www-form-urlencoded'
      //         // 'content-type': 'multipart/form-data'
      //       }
      //     }
      //   )
      //   .then(res => {
      //     // console.log(res)
      //     if (res.data.retData.statusCode === 200) {
      //       this.$message({
      //         type: 'success',
      //         duration: 5000,
      //         offset: 100,
      //         message: res.data.retData.msg + res.data.retData.dataList
      //       })
      //       this.dialogVisible = false
      //       this.privateLetterForm.Uin = ''
      //       this.privateLetterForm.message = ''
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         duration: 5000,
      //         offset: 100,
      //         message: res.data.retData.msg
      //       })
      //     }
      //   })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
