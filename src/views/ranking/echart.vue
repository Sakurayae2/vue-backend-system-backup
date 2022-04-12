<template>
  <div class="app-container">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 顶部搜索 日期 -->
      <div>
        <el-row :gutter="10" style="margin-bottom: 20px;">
          <el-col :span="12">
            <template>
              <el-select v-model="value" filterable multiple clearable collapse-tags placeholder="渠道对比" @visible-change="search($event)">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="12">
            <template>
              <div class="block">
                <el-date-picker
                  v-model="dateSearch"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  @change="dateChange"
                >
                </el-date-picker>
              </div>
            </template>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 20px;">
          <el-col :span="12">
            <template>
              <el-select v-model="versionVal" filterable multiple clearable collapse-tags placeholder="版本对比" @visible-change="search($event)">
                <el-option
                  v-for="item in versionOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-col>
        </el-row>
      </div>
      <!-- 选项 -->
      <div>
        <el-tabs type="card">
          <el-tab-pane v-for="(item,index) in tabPaneOpt" :key="index" :label="item">{{ item }}</el-tab-pane>
        </el-tabs>
      </div>
      <div id="line1" style="width:80%;height:500px;"></div>
      <template>
        <div class="sliderBlock">
          <el-slider
            v-model="sliderDateVal"
            range
            :max="sliderMax"
            @change="sliderChange"
          ></el-slider>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'echart',
  data() {
    return {
      sliderMax: '',
      sliderDateVal: [0, ''],
      myChart1: '',
      // 折线图配置
      lineOptions: {
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: ['今日', '昨日'],
          // bottom: "0%"
        },
        grid: {
          left: '0%',
          right: '30',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['06-01', '06-02', '06-03', '06-04', '06-05', '06-06', '06-07']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '今日',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '昨日',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      xAxisData: [],
      pickerOptions: {
        shortcuts: [{
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
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateSearch: '',
      options: [{
        value: '选项1',
        label: '西城广场'
      }, {
        value: '选项2',
        label: '档案馆'
      }, {
        value: '选项3',
        label: '城西银泰'
      }, {
        value: '选项4',
        label: '西湖文化广场'
      }, {
        value: '选项5',
        label: '深圳'
      }],
      value: '',
      versionOpt: [{
        value: '4.1.0',
        label: '4.1.0'
      }, {
        value: '4.1.1',
        label: '4.1.1'
      }, {
        value: '4.1.2',
        label: '4.1.2'
      }],
      versionVal: '',
      tabPaneOpt: ['新增人数', '分享次数', '充值人数', '充值金额', '总平均时长', '广场舞平均时长', '聊天室平均时长', '音乐房间平均时长', '直播间平均时长', '上麦率']
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine()
    })
    // window.addEventListener('resize', () => {
    //   // 窗口变化时重绘折线图
    //   this.myChart1.resize()
    // })
  },
  methods: {
    //折线图
    drawLine() {
      // 获取折线图节点
      this.myChart1 = echarts.init(document.getElementById('line1'))
      // 设置图表数据
      this.myChart1.setOption(this.lineOptions)
    },
    sliderChange() {
      console.log(this.sliderDateVal)
      console.log(Math.max.apply(null, this.sliderDateVal))
      this.lineOptions.xAxis.data = this.xAxisData.slice(Math.min.apply(null, this.sliderDateVal), Math.max.apply(null, this.sliderDateVal))
      console.log(this.lineOptions.xAxis.data)
      this.myChart1.dispose()//销毁

      this.$nextTick(() => {
        this.drawLine()
      })
    },
    // 左侧搜索
    search(ev) {
      // this.lineOptions.xAxis.data.shift()
      if (ev) return
      console.log(this.value)
    },
    // 日期搜索
    dateChange() {
      console.log(this.dateSearch)
    },
    init() {
      this.sliderDateVal[1] = this.lineOptions.xAxis.data.length
      this.sliderMax = this.sliderDateVal[1]
      this.xAxisData = this.lineOptions.xAxis.data
      console.log(this.sliderDateVal)
    }
  }
}
</script>

<style scoped>
.block {
  float: right;
}

.sliderBlock {
  width: 80%;
}
</style>
