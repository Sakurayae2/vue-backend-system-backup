<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email"/>
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="email"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="captcha">
        <span class="svg-container">
          <svg-icon icon-class="captcha" />
        </span>
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="captcha"
          name="captcha"
          type="text"
          tabindex="1"
          auto-complete="on"
          style="width: 60%;"
          @keyup.enter.native="handleLogin"
        />
        <el-button
          type="primary"
          style="width:33%; height:52px; float:right;"
          :disabled="!captchabtnflag"
          @click="sendCaptcha"
        >发送验证码
        </el-button>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Login
      </el-button>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getCaptcha, login } from '@/api/user'
import qs from 'qs'

export default {
  name: 'Login',
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    return {
      captchabtnflag: true,
      loginForm: {
        username: 'admin',
        password: '123456',
        email: '',
        captcha: ''
      },
      loginRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    sendCaptcha(event) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 发送验证码
          const data = {
            email: this.loginForm.email
          }
          getCaptcha(data).then(res => {
            // console.log(res)
          })
          if (this.captchabtnflag === false) { return }
          this.captchabtnflag = false
          const el = event.currentTarget
          let time = 60
          el.innerHTML = '重新获取' + time + 's'
          const timer = setInterval(() => {
            time--
            if (time === 0) {
              el.innerHTML = '重新发送验证码'
              this.captchabtnflag = true
              clearInterval(timer)
            } else {
              el.innerHTML = '重新获取' + time + 's'
            }
          }, 1000)
        } else {
          this.$message.error('请输入正确邮箱,再获取验证码')
        }
      })
    },
    handleLogin() {
      // 邮箱登录
      this.$refs.loginForm.validate(valid => {
        if (valid && this.loginForm.captcha !== '') {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.error('请输入正确邮箱和验证码')
          return false
        }
      })
      // 密码登录
      // this.$refs.loginForm.validate(valid => {
      //   // console.log(valid)
      //   if (valid) {
      //     this.loading = true
      //     var data = { username: this.loginForm.username, password: this.loginForm.password }
      //     // console.log(data)
      //     // login().then(res => { console.log(1) })
      //     this.$store.dispatch('user/login', data).then(() => {
      //       this.$router.push({ path: this.redirect || '/' })
      //       this.loading = false
      //     }).catch(() => {
      //       this.loading = false
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
