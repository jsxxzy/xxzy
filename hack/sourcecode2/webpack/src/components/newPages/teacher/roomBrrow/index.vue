<template>
  <div>
    <div class="research">
      <span @click="showPop('教学时间', 'jxzcXq')">
        <i>时间：{{ jxzcXq }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="showPop('节次', 'jc')">
        <i>节次：{{ jc }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="goMore">
        更多&nbsp;
        <i class="iconfont icongengduo icon"></i>
      </span>
    </div>
    <NOdata
      v-if="this.roomList && this.roomList.length == 0"
      title="未查询到课程信息"
    ></NOdata>
    <div v-else class="content">
      <div v-for="(item, index) of roomList" :key="index" @click="goItem(item)">
        <p>{{ item.classroomName }}</p>
        <ul>
          <li>容量：{{ item.seatNumber }}人</li>
        </ul>
        <span class="iconfont icon iconicon-test"></span>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        :title="valueList.label"
        show-toolbar
        :columns="valueList.item"
        @cancel="show = false"
        @confirm="
          (value, index) => {
            onConfirm(value, index, valueList.value);
          }
        "
      />
    </van-popup>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";

import Vue from "vue";
import { Picker } from "vant";

Vue.use(Picker);
export default {
  data() {
    return {
      param: {},
      show: false,
      zc: "",
      xq: "",
      start: "",
      end: "",
      jc: "",
      jxzcXq: "",
      roomList: [],
      columns: {
        jxzcXq: [],
        jc: []
      },
      valueList: {
        label: "",
        value: "",
        item: []
      }
    };
  },
  methods: {
    // 进入教室详情界面
    goItem(item) {
      let startNode = this.start;
      let endnode = this.end;
      this.$router.push({
        path: "/classroom3",
        query: {
          startNode: startNode, //开始节次
          endnode: endnode, //结束节次
          classroomCapacity: this.jsrl, //教室容量
          teachingBuildingName: item.teachingBuildingName,
          classroomName: item.classroomName,
          classroomNumber: item.classroomNumber,
          seatNumber: item.seatNumber,
          id: item.classroomId,
          week: this.zc,
          day: this.xq,
          bz: item.bz,
          weeknode: this.zc
        }
      });
    },
    // 查询获得教室list
    async getRoom() {
      if (this.param.type != 1) {
        this.param = {
          weekly: this.zc,
          dayweek: this.xq,
          classroomCapacity: "",
          nodeId: this.start + "-" + this.end,
          tchBuilding: "",
          campus: "",
          jslx: ""
        };
      }

      const res = await Api.teachBorrowingClassrooms(this.param);
      this.roomList = res.data;
    },
    // 跳到更多条件界面
    goMore() {
      this.$router.push({
        path: "/moreResearch",
        query: {
          // 周次
          zc: this.zc,
          // 星期
          xq: this.xq,
          // 节次
          start: this.start,
          end: this.end,
          // 教室容量
          jsrl: this.param.classroomCapacity,
          // 校区名称
          xqmc: {
            mc: this.param.campusmc,
            dm: this.param.campus
          },
          // 教学楼
          jxl: {
            mc: this.param.tchBuildingmc,
            dm: this.param.tchBuilding
          },
          // 教师类型
          jslx: {
            mc: this.param.jslxmc,
            dm: this.param.jslx
          }
        }
      });
    },
    // 弹出选择器
    showPop(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];
    },
    onConfirm(value, index, value1) {
      if (value1 === "jxzcXq") {
        this.zc = value[0].value;
        this.xq = Number(index[1]) + 1;
        this[value1] =
          value[0].text + " " + this.columns.jxzcXq[1].values[this.xq - 1];
        this.show = false;

        this.param = {
          weekly: this.zc,
          dayweek: this.xq,
          classroomCapacity: "",
          nodeId: this.start + "-" + this.end,
          tchBuilding: "",
          campus: "",
          jslx: ""
        };
        // 查询当前条件下的教室
        this.getRoom();
        return;
      } else if (value1 == "jc") {
        this.start = value[0].value;
        this.end = value[2].value;
        this[value1] = this.start + "-" + this.end + "节";
        this.show = false;

        this.param = {
          weekly: this.zc,
          dayweek: this.xq,
          classroomCapacity: "",
          nodeId: this.start + "-" + this.end,
          tchBuilding: "",
          campus: "",
          jslx: ""
        };
        // 查询当前条件下的教室
        this.getRoom();
        return;
      }
      this.show = false;
      this[value1] = value;

      // 查询当前条件下的教室
      this.getRoom();
    },
    // 获取教学周次和星期
    async getJxzcXq() {
      let concatList1 = [];
      const params = {
        semester: ""
        // type:'1'
      };
      const res = await Api.getTeachingWeek(params);
      for (let i = 0; i < res.data.length; i++) {
        concatList1 = concatList1.concat({
          text: "第" + res.data[i].week + "周",
          value: res.data[i].week
        });
      }
      this.columns.jxzcXq = [
        // 第一列
        {
          values: concatList1
        },
        // 第二列
        {
          values: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ]
        }
      ];
      // if (JSON.stringify(this.param) != "{}") {
      //   this.zc = this.param.weekly;
      //   this.xq = Number(this.param.dayweek);
      // } else {
      //   this.zc = concatList1[0].value;
      //   this.xq = 1;
      // }
      this.zc = 1;
      this.xq = 1;

      if (this.param.type == 1) {
        this.zc = this.param.weekly;
        this.xq = this.param.dayweek;
      }

      this.jxzcXq =
        "第" + this.zc + "周 " + this.columns.jxzcXq[1].values[this.xq - 1];
    },
    // 获取节次
    async getJc() {
      let mc = [];
      const res = await Api.getNodeList();
      res.data.forEach(item => {
        mc.push({
          text: "第" + item.nodeName + "小节",
          value: item.nodeName
        });
      });
      this.columns.jc = [
        {
          values: mc
        },
        { values: ["至"] },
        {
          values: mc
        }
      ];
      // if (JSON.stringify(this.param) != "{}") {
      //   let arr = this.param.nodeId.split("-");
      //   this.start = arr[0];
      //   this.end = arr[1];
      //   this.jc = this.start + "-" + this.end + "节";
      // } else {
      //   this.start = mc[0].value;
      //   this.end = mc[0].value;
      // }
      this.start = "01";
      this.end = "01";

      if (this.param.type == 1) {
        let arr = this.param.nodeId.split("-");

        this.start = arr[0];
        this.end = arr[1];
      }
      this.jc = this.start + "-" + this.end + "节";

      // 查询当前条件下的教室
      this.getRoom();
    }
  },
  created() {
    // 获取教学周次和星期
    this.getJxzcXq();
    // 获取节次
    this.getJc();

    this.$forceUpdate();
  },
  mounted() {
    this.$nextTick(function() {
      let xqs = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      if (!!this.$route.query.param) {
        this.param = this.$route.query.param;

        this.zc = this.$route.query.weekly;
        this.xq = this.$route.query.dayweek;
        this.start = this.$route.query.start;
        this.end = this.$route.query.end;

        console.log(this.$route.query);
      }
    });
  }
};
</script>
<style lang="less" scoped>
.research {
  z-index: 9999;
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #f4f4f4;
  padding: 5% 5% 3% 5%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #fff;

  span {
    height: 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #757da3;
    letter-spacing: 0;
    text-align: right;
    display: inline-flex;
    align-items: center;
    i {
      font-style: normal;
    }
    b {
      display: inline-block;
      border-right: 3px solid transparent;
      border-left: 3px solid transparent;
      border-top: 3px solid #757da3;
    }
  }
}
.content {
  padding: 80px 5% 0;
  overflow: auto;
  height: 75vh;

  div {
    background: #f8f8f8;
    border-radius: 5px;
    padding: 3% 0 3% 6%;
    margin-bottom: 5%;
    position: relative;

    p {
      height: 22px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #212f6e;
      letter-spacing: 0;
      font-weight: bolder;
      margin-bottom: 2%;
    }

    ul li {
      height: 17px;
      font-family: PingFangSC-Light;
      font-size: 12px;
      color: #757da3;
      letter-spacing: 0;
      margin-bottom: 1%;
    }
    span {
      position: absolute;
      top: calc(50% - 6px);
      right: 5%;
    }
  }
}
.icon {
  font-size: 12px;
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/roomBrrow/index.vue