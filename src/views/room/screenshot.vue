<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col style="min-width: 300px;">
          <el-input v-model="search.uin" placeholder="请输入uin" clearable @keyup.enter.native="getList()">
            <el-select slot="prepend" v-model="search.type" placeholder="请选择" clearable style="width: 110px;">
              <el-option label="聊天室" value="0" style="text-align: center" />
              <el-option label="音乐房间" value="1" style="text-align: center" />
              <el-option label="广场舞" value="2" style="text-align: center" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getList()" />
          </el-input>
        </el-col>
        <el-col>
          <el-date-picker
            v-model="search.timeQuantum"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH '时'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-checkbox-group v-model="checkList" @change="onChange" @click="getList">
            <el-checkbox label="0">显示左上角信息</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col>
          <el-row>
            <el-col>屏宽：<el-input-number v-model="percent" size="mini" :step="10" :min="50" :max="100" step-strictly /></el-col>
            <el-col>列数：<el-input-number v-model="rowNum" size="mini" :min="3" :max="15" @change="rowNumChange" /></el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="photoWall">
        <el-scrollbar ref="el_scrollbar" style="overflow-x: hidden;" :style="{ width: percent+'%', height: clientHeight+'px' }">
          <ul>
            <li v-for="(item,index) in imgList" :key="index" :style="{ width: percentLi+'%' }">
              <el-image
                class="img"
                lazy
                :scroll-container="scrollContainer"
                :src="item.url"
                :fit="curIndex === index ? 'cover' : 'cover'"
                :preview-src-list="urls"
                @mouseenter="curIndex = index"
                @mouseleave="curIndex = ''"
                @click="preview"
              ></el-image>
              <div v-show="showTitleFlag" id="text" class="text">{{ item.date }} {{ item.room_id }} {{ item.room_type }}</div>
            </li>
          </ul>
        </el-scrollbar>
<!--        <ul id="photoWall" :style="{ width: percent+'%', height: clientHeight+'px' }">-->
<!--          <li v-for="(item,index) in imgList" :key="index" :style="{ width: percentLi+'%' }">-->
<!--            <el-image-->
<!--              class="img"-->
<!--              lazy-->
<!--              :src="item.url"-->
<!--              :fit="curIndex === index ? 'cover' : 'cover'"-->
<!--              :preview-src-list="urls"-->
<!--              @mouseenter="curIndex = index"-->
<!--              @mouseleave="curIndex = ''"-->
<!--              @click="preview"-->
<!--            ></el-image>-->
<!--            <div v-show="showTitleFlag" id="text" class="text">{{ item.date }} {{ item.room_id }} {{ item.room_type }}</div>-->
<!--          </li>-->
<!--        </ul>-->
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRoomImg } from '@/api/roomManagement'

export default {
  inject: ['reload'],
  data() {
    return {
      rowNum: 10,
      clientHeight: '',
      percentLi: 9.7,
      percent: 100,
      curIndex: '',
      checkList: ['0'],
      showTitleFlag: true,
      imgList: [
        // {
        //   url: 'https://s.5dktv.com/multiple_room/image_cache/2021/08/25/36026995_838a06d856615ae9601193d999d83f7d.jpg'
        // }, {
        //   url: 'https://s.5dktv.com/multiple_room/image_cache/2021/08/25/36026995_838a06d856615ae9601193d999d83f7d.jpg'
        // }, {
        //   url: 'https://s.5dktv.com/multiple_room/image_cache/2021/08/25/36026995_838a06d856615ae9601193d999d83f7d.jpg'
        // },
      ],
      urls: [
        // 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      ],
      search: {
        uin: '',
        type: '0',
        timeQuantum: ['', '']
      },
      searchType: {
        chat: '聊天室',
        music: '音乐房间',
        square: '广场舞'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      scrollContainer: HTMLElement
    }
  },
  created() {
    this.formatDate(this.search.timeQuantum)
    this.getList()
  },
  mounted() {
    this.scrollContainer = this.$refs.el_scrollbar.wrap
    this.clientHeight = document.documentElement.clientHeight - 200
    window.onresize = () => {
      return (() => {
        this.$nextTick(() => {
          this.clientHeight = document.documentElement.clientHeight - 200
        })
      })()
    }
  },
  methods: {
    getList() {
      const data = {
        start: this.search.timeQuantum[0],
        end: this.search.timeQuantum[1],
        roomType: this.search.type,
        uin: this.search.uin
      }
      getRoomImg(data).then(res => {
        // console.log(res.data.retData.dataList)
        this.imgList = res.data.retData.dataList
        if (this.imgList !== []) {
          this.imgList.forEach(item => {
            this.urls.push(item.url)
          })
        }
      })
    },
    // 多选框选择
    onChange(e) {
      this.showTitleFlag = e.indexOf('0') !== -1
    },
    rowNumChange() {
      switch (this.rowNum) {
        case 3: this.percentLi = 32.5; break
        case 4: this.percentLi = 24.3; break
        case 5: this.percentLi = 19.5; break
        case 6: this.percentLi = 16; break
        case 7: this.percentLi = 13.5; break
        case 8: this.percentLi = 12.2; break
        case 9: this.percentLi = 10.7; break
        case 10: this.percentLi = 9.7; break
        case 11: this.percentLi = 8.7; break
        case 12: this.percentLi = 8; break
        case 13: this.percentLi = 7.3; break
        case 14: this.percentLi = 6.8; break
        case 15: this.percentLi = 6.3; break
        default: this.percentLi = 19.5; break
      }
    },
    // 大图预览
    preview() {
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
    formatDate(date) {
      const newDate = new Date()
      this.search.timeQuantum[0] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() - 1, 23)
      this.search.timeQuantum[1] = newDate
      date.forEach((item, index) => {
        const y = item.getFullYear()
        const m = (item.getMonth() + 1).toString().padStart(2, '0')
        const d = (item.getDate()).toString().padStart(2, '0')
        const h = (item.getHours()).toString().padStart(2, '0')
        this.search.timeQuantum[index] = y + '-' + m + '-' + d + ' ' + h + ':00:00'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.photoWall{
  margin-top: 20px;
  border-radius: 5px;
  ul{
    //&::-webkit-scrollbar{
    //  width: 3px;
    //  background-color: #fff;
    //}
    //&::-webkit-scrollbar-thumb{
    //  border-radius: 5px;
    //  background-color: rgba(100, 100, 100, .3);
    //}
    min-width: 750px;
    display: flex;
    flex-wrap: wrap;
    //overflow: scroll;
    //overflow-x: hidden;
    li{
      position: relative;
      max-width: 33%;
      margin: 0 0.3% 0.3% 0;
      .img{
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .text{
        position: absolute;
        top: 0;
        color: white;
        font-size: 14px;
        background-color: rgb(0,0,0,0.5);
        border-radius: 0 5px 5px 5px;
        padding: 2px;
      }
    }
  }
}
</style>
