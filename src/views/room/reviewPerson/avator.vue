<template>
  <div class="main">
    <!-- 左列表 -->
    <div class="left">
      <div style="padding: 10px 0 20px 0;text-align: center">
        {{ mainname }}
        {{ mainuin }}
      </div>
      <!-- 图片列表，每5张一行 -->
      <table>
        <tr v-for="(item,index) in avatorList1" :key="index" v-if="index%5==0">
          <td>
            <el-image :src="avatorList1[index]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList1[index+1]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList1[index+2]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList1[index+3]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList1[index+4]" style="width: 150px;height: 200px;"></el-image>
          </td>
        </tr>
      </table>
    </div>
    <!-- 右列表 -->
    <div class="right">
      <div style="padding: 10px 0 20px 0;text-align: center">
        {{ ownname }}
        {{ ownuin }}
      </div>
      <!-- 图片列表，每5张一行 -->
      <table>
        <tr v-for="(item,index) in avatorList2" :key="index" v-if="index%5==0">
          <td>
            <el-image :src="avatorList2[index]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList2[index+1]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList2[index+2]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList2[index+3]" style="width: 150px;height: 200px;"></el-image>
          </td>
          <td>
            <el-image :src="avatorList2[index+4]" style="width: 150px;height: 200px;"></el-image>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getFace } from '@/api/reviewPerson'
export default {
  name: 'avator',
  data() {
    return {
      avatorList1: [],
      avatorList2: [],
      mainuin: '',
      mainname: '',
      ownuin: '',
      ownname: ''
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 获取人脸图片
    async getInfo() {
      this.mainuin = this.$route.query.mainuin
      this.mainname = this.$route.query.mainname
      this.ownuin = this.$route.query.ownuin
      this.ownname = this.$route.query.ownname

      const params = {
        pid: 1,
        uin: this.mainuin
      }
      const params2 = {
        pid: 1,
        uin: this.ownuin
      }
      const r = await getFace(params)
      const r2 = await getFace(params2)
      // Promise.all 不同参数请求同一接口
      Promise.all([r, r2]).then((res) => {
        // console.log(res)
        res.map((item) => {
          this.avatorList1 = res[0].data.retData
          this.avatorList2 = res[1].data.retData
        })
      })
    }
  }
}
</script>

<style>
.main {
  display: flex;
  justify-content: space-between;
}

.left {
  border: 1px solid #ccc;
  padding: 0 20px 20px 20px;
}

.right {
  border: 1px solid #ccc;
  padding: 0 20px 20px 20px;
}
</style>
