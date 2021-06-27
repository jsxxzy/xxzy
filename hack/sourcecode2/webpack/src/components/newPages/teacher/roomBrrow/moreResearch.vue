<template>
  <div>
    <Header title="更多筛选"></Header>
    <div class="more">
      <van-field
        v-model="jxzcXq"
        label="教学时间"
        left-icon="eye"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="onShow('教学时间', 'jxzcXq')"
        readonly
      />
      <van-field
        v-model="jc"
        label="起止节次"
        left-icon="eye-o"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="onShow('起止节次', 'jc')"
        readonly
      />
      <van-field
        v-model="jsrl"
        label="教室容量"
        left-icon="like-o"
        input-align="right"
        type="digit"
        @keyup="format"
        placeholder="请点击填写"
      />
      <van-field
        v-model="xqmc.mc"
        label="校区"
        left-icon="smile"
        right-icon="arrow"
        input-align="right"
        placeholder="非必选"
        @click="onShow('校区', 'xqmc')"
        readonly
      />
      <van-field
        v-model="jxl.mc"
        label="教学楼"
        left-icon="smile-o"
        right-icon="arrow"
        input-align="right"
        placeholder="非必选"
        @click="onShow('教学楼', 'jxl')"
        readonly
      />
      <van-field
        v-model="jslx.mc"
        label="教室类型"
        left-icon="like"
        right-icon="arrow"
        input-align="right"
        placeholder="非必选"
        @click="onShow('教室类型', 'jslx')"
        readonly
      />
    </div>
    <div class="bottom-btn">
      <button @click="reSet">重置</button>
      <button @click="getRoom">查询</button>
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
export default {
  data() {
    return {
      show: false,
      zc: "",
      xq: "",
      start: "",
      end: "",
      jc: "",
      jxzcXq: "",
      jsrl: "",
      xqmc: {},
      jxl: {},
      jslx: {},
      columns: {
        jxzcXq: [],
        jc: [],
        jsrl: [],
        xqmc: [],
        jxl: [],
        jslx: []
      },
      valueList: {
        label: "",
        value: "",
        item: []
      }
    };
  },
  methods: {
    //重置
    reSet() {
      this.zc = "";
      this.xq = "";
      this.start = "";
      this.end = "";
      this.jc = "";
      this.jxzcXq = "";
      this.jsrl = "";
      this.xqmc = {};
      this.jxl = {};
      this.jslx = {};
      this.columns.jxzcXq[0].defaultIndex = 0;
      this.columns.jxzcXq[1].defaultIndex = 0;
      this.columns.jc[0].defaultIndex = 0;
      this.columns.jc[2].defaultIndex = 0;
    },
    // 格式化输入的教室容量
    format() {
      if (this.jsrl == 0) {
        this.jsrl = "";
      } else {
        this.jsrl = Number(this.jsrl);
      }
    },
    // 查询
    async getRoom() {
      if (this.zc == "") {
        this.$toast("请点击选择教学时间");
        return;
      }
      if (this.start == "") {
        this.$toast("请点击选择起止节次");
        return;
      }

      const params = {
        // 周次
        weekly: this.zc,
        // 星期几
        dayweek: this.xq,
        // 教室容量
        classroomCapacity: this.jsrl,
        // 教学楼
        tchBuilding: this.jxl.dm,
        tchBuildingmc: this.jxl.mc,
        // 校区
        campus: this.xqmc.dm,
        campusmc: this.xqmc.mc,
        // 教室类型
        jslx: this.jslx.dm,
        jslxmc: this.jslx.mc,
        // 节次
        start: this.start,
        end: this.end,
        nodeId: this.start + "-" + this.end,
        // 类型
        type: 1
      };
      this.$router.push({
        path: "/bindex",
        query: {
          param: params
        }
      });
    },
    // 弹出选择器
    onShow(label, value) {
      if (label == "教学楼" && JSON.stringify(this.xqmc) == "{}") {
        this.$toast("请先选择校区");
        return;
      }
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
        return;
      } else if (value1 == "jc") {
        this.start = value[0].value;
        this.end = value[2].value;
        this[value1] = this.start + "-" + this.end + "节";
        this.show = false;
        return;
      } else if (value1 == "xqmc" || value1 == "jxl" || value1 == "jslx") {
        this[value1].mc = value.text;
        this[value1].dm = value.value;
        if (value1 == "xqmc") {
          // 获取教学楼
          this.getJxl();
        }
        this.show = false;
        return;
      }
      this.show = false;
      this[value1] = value;
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
          className: "c1",
          values: mc,
          defaultIndex: Number(this.$route.query.start) - 1
        },
        { values: ["至"] },
        {
          className: "c2",
          values: mc,
          defaultIndex: Number(this.$route.query.end) - 1
        }
      ];
      this.start = this.$route.query.start;
      this.end = this.$route.query.end;
      this.jc = this.$route.query.start + "-" + this.$route.query.end + "节";
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
          className: "column1",
          values: concatList1,
          defaultIndex: Number(this.$route.query.zc) - 1
        },
        // 第二列
        {
          className: "column2",
          values: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ],
          defaultIndex: Number(this.$route.query.xq) - 1
        }
      ];
      this.jxzcXq =
        this.columns.jxzcXq[0].values[this.$route.query.zc - 1].text +
        " " +
        this.columns.jxzcXq[1].values[this.$route.query.xq - 1];
      this.zc = this.$route.query.zc;
      this.xq = this.$route.query.xq;
    },
    // 获取校区
    async getXqmc() {
      const res = await Api.getCampusList();
      this.columns.xqmc = res.data.map(item => {
        return {
          value: item.campusId,
          text: item.campusName
        };
      });
    },
    // 获取教学楼
    async getJxl() {
      var params = {};
      if (!!this.xqmc.dm) {
        params = {
          xqid: this.xqmc.dm
        };
      }
      const res = await Api.getTchBuildingList(params);
      this.columns.jxl = res.data.map(item => {
        return {
          text: item.buildingName,
          value: item.buildingId
        };
      });
    },
    // 获取教室类型
    async getJxlx() {
      const params = {
        table: "zzdjslx"
      };
      const res = await Api.getRoomType(params);
      this.columns.jslx = res.data.map(item => {
        return {
          text: item.dmmc,
          value: item.dm
        };
      });

      if (this.schoolCode == "10013") {
        this.jslx.mc = this.columns.jslx[0].text;
        this.jslx.dm = this.columns.jslx[0].value;
        return;
      }
    }
  },
  created() {
    console.log(this.$route.query);
    this.jsrl = this.$route.query.jsrl;
    this.xqmc.mc = this.$route.query.xqmc.mc;
    this.xqmc.dm = this.$route.query.xqmc.dm;
    if (this.xqmc.mc) {
      this.getJxl();
    }
    this.jxl.mc = this.$route.query.jxl.mc;
    this.jxl.dm = this.$route.query.jxl.dm;
    this.jslx.mc = this.$route.query.jslx.mc;
    this.jslx.dm = this.$route.query.jslx.dm;

    // 获取教学周次和星期
    this.getJxzcXq();
    // 获取节次
    this.getJc();
    // 获取校区
    this.getXqmc();
    // 获取教师类型
    this.getJxlx();
  }
};
</script>
<style lang="less" scoped>
.more {
  padding-bottom: 60px;
}
.bottom-btn {
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0 5% 10px 5%;
  background: #fff;
  display: flex;
  justify-content: space-between;

  // button {
  //   width: 100%;
  //   height: 44px;
  //   background: #7469f8;
  //   border-radius: 3px;
  //   color: #fff;
  // }
  button:first-child {
    width: 47.5%;
    height: 44px;
    background: #ecedfd;
    border-radius: 3px;
    color: #7469f8;
  }
  button:last-child {
    width: 47.5%;
    height: 44px;
    background: #7469f8;
    border-radius: 3px;
    color: #fff;
  }
}
</style>
<style lang="less">
.more {
  .van-cell__title,
  .van-cell.van-field .van-cell__title.van-field__label > span {
    width: 64px;
    height: 22px;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #212f6e;
    letter-spacing: 0;
  }
  .van-icon-eye-o,
  .van-icon-eye,
  .van-icon-smile-o,
  .van-icon-smile,
  .van-icon-like,
  .van-icon-like-o {
    font-family: "iconfont" !important;
    font-size: 22px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #212f6e;
  }
  .van-icon-eye-o::before {
    content: "\e6bb";
  }
  .van-icon-eye::before {
    content: "\e6be";
  }
  .van-icon-smile-o::before {
    content: "\e6bc";
  }
  .van-icon-smile::before {
    content: "\e6b4";
  }
  .van-icon-like::before {
    content: "\e6b8";
  }
  .van-icon-like-o::before {
    content: "\e6dd";
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/roomBrrow/moreResearch.vue