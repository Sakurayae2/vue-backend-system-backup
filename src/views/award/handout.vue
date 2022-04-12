<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
        <el-form ref="formRule" :rules="formRules" :model="form" label-width="80px">
            <el-form-item label="kind" prop="kind">
                <el-input v-model="form.kind" placeholder="发放奖励类型，如:416(416是广场舞奖励的kind),奖励类型请找麦当询问"></el-input>
            </el-form-item>
            <el-form-item label="memo">
                <el-input v-model="form.memo" placeholder="奖励标签，如:广场舞参与奖"></el-input>
            </el-form-item>
            <el-form-item label="奖券类型">
                <el-radio-group v-model="form.awardType">
                    <el-radio label="ledou">乐豆</el-radio>
                    <el-radio label="lequan">乐券</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="金额" prop="money">
                <el-input v-model="form.money"></el-input>
            </el-form-item>
            <el-form-item label="uins" prop="uins">
                <el-input type="textarea" :rows="5" v-model="form.uins" placeholder="请输入uin,以英文逗号隔开，如:123456,654321"></el-input>
            </el-form-item>
            <el-form-item label="message">
                <el-input v-model="form.msg" placeholder="给用户发送消息的内容,如:某某奖励已经发放成功"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handoutAward">奖励发放</el-button>
            </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import { handout } from '@/api/award'
import qs from 'qs'

export default {
  name: 'Cancel',
  data() {
      // 自定义规则
    var checkMoney = (rule, value, callback) => {
      const regEmail = /^\d+$/
      if (regEmail.test(value)) {
        // 合法
        return callback()
      }
      callback(new Error('请输入整数金额'))
    }
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
        form: {
            memo: '',
            kind: '',
            awardType: 'ledou',
            money: '',
            uins: '',
            msg: ''
        },
        formRules: {
            kind: [
            { required: true, message: '请输入kind', trigger: 'blur' }
            //   { validator: checkKind, trigger: 'blur' }
            ],
            money: [
            { required: true, message: '请输入金额', trigger: 'blur' },
              { validator: checkMoney, trigger: 'blur' }
            ],
            uins: [
            { required: true, message: '请输入uin', trigger: 'blur' },
              { validator: checkUins, trigger: 'blur' }
            ],
      }
    }
  },
  created() {

  },
  methods: {
    handoutAward() {
      this.$refs.formRule.validate(valid => {
        if (valid) {
            this.$confirm('您将给 '+this.form.uins+' 发放 '+this.form.money+' 个 '+this.form.awardType+'', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 奖励发放
                this.$set(this.form, 'passwd', 'taolesoft0571')
                let data = this.form
                handout(qs.stringify(data)).then(res => {
                    // console.log(res)
                    if(res.data.retData.statusCode == 200){
                        this.$message.success(res.data.retData.msg)
                        this.form = {
                                memo: '',
                                kind: '',
                                awardType: this.form.awardType,
                                money: '',
                                uins: '',
                                msg: ''
                            }

                    } else {
                        this.$message.error(res.data.retData.msg)
                    }
                })
            }).catch(() => {
                this.$message.info('奖励发放已取消')
            });
        } else {
          this.$message.error('请填入正确信息！')
        }
      })
    }
  }
}
</script>

<style scoped>
.row{
    margin-bottom: 20px;
    text-align: right;
    display:flex;
    align-items:center;
}
.col{
    text-align: left;
}
</style>

