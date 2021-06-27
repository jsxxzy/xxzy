<template>
  <div>
    <Header title="空闲教室查询" type="0" route="/homeIndex"></Header>
    <div class="research">
      <span @click="timePicker = true">
        <i>时间：{{ date }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="showPicker = true">
        <i>节次：{{ qsjc }}节</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="goMore">
        更多&nbsp;
        <i class="iconfont icongengduo icon"></i>
      </span>
    </div>
    <NOdata
      v-if="this.classroomList && this.classroomList.length == 0"
      title="未查询到空闲教室"
    ></NOdata>
    <div v-else class="content">
      <span v-for="(item, index) in classroomList" :key="index">
        <div v-for="cItem in item.classroomList" :key="cItem.classroomId">
          <p>
            {{ item.teachingBuildingName }} {{ cItem.classroomname }}
            {{ cItem.classroomnumber }}
          </p>
          <ul>
            <li>容量：{{ cItem.seatnumber }}人</li>
          </ul>
          <!-- <span class="iconfont icon iconicon-test"></span> -->
        </div>
      </span>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="qsjcList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-popup v-model="timePicker" position="bottom" class="date-pick-item">
      <van-datetime-picker
        show-toolbar
        v-model="currentDate"
        type="date"
        :min-date="startDate"
        :max-date="endDate"
        @cancel="timePicker = false"
        @confirm="timeConfirm"
        :swipe-duration="100"
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
      start: "01",
      end: "02",
      qsjc: "",
      date: "",
      qsjcList: [
        {
          values: [],
          className: "column1"
        },
        {
          values: [],
          className: "column2",
          defaultIndex: 1
        }
      ],
      showPicker: false,
      timePicker: false,
      currentDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      classroomList: []
    };
  },
  methods: {
    goMore() {
      this.$router.push({
        path: "/restRooms/roomMore",
        query: {
          s_start: this.start,
          e_end: this.end,
          d_date: this.date,
          // 教学楼
          jxl:{
            mc:this.$route.query.bName,
            dm:this.$route.query.build
          },
          // 校区
          xq:{
            mc:this.$route.query.cName,
            dm:this.$route.query.campus
          },
          // 教室类型
          jslx:{
            mc:this.$route.query.jslx,
            dm:this.$route.query.rType
          }
        }
      });
    },
    // 查询教室
    async researchRoom() {
      let type = this.$route.query.type;
      let params = {};
      if (type !== "1") {
        params = {
          date: this.$route.query.date,
          nodeId: this.start + this.end,
          buildingId: this.$route.query.build,
          campusId: this.$route.query.campus,
          jslx: this.$route.query.rType
        };
      } else {
        params = {
          date: this.$route.query.date,
          nodeId: this.$route.query.time,
          buildingId: this.$route.query.build,
          campusId: this.$route.query.campus
        };
      }
      // console.log(params);
      const res = await Api.getIdleClassroom(params);
      this.classroomList = res.data;
      if (res.data.length == 0) {
        this.$toast("未查询到空闲教室~");
      }
    },
    // 获取起始节次列表
    async getNode() {
      const res = await Api.getNodeList();
      let concatList = [];
      for (let i = 0; i < res.data.length; i++) {
        concatList = concatList.concat("第" + res.data[i].nodeName + "小节");
        this.qsjcList[0].values = concatList;
        this.qsjcList[1].values = concatList;
      }
      this.qsjc = this.start + "-" + this.end;
      this.researchRoom();
    },
    // 选择节次时间
    onConfirm(value) {
      this.start = value[0].substr(1, value[0].length - 3);
      this.end = value[1].substr(1, value[0].length - 3);
      let begin = Number(this.start);
      let over = Number(this.end);
      if (begin > over) {
        this.$toast.fail("开始节次不能大于结束节次");
      } else {
        this.showPicker = false;
        this.qsjc = this.start + "-" + this.end;
      }
      this.researchRoom();
    },
    // 获取最大最小时间
    async getMinMaxDate() {
      const res = await Api.getGgjxzlDate();
      let end = res.data[0].endDate.match(/\d?(.\d+)/gi);
      this.endDate = new Date(
        end[0] +
          "/" +
          Number(end[1].substr(1, end[1].length)) +
          "/" +
          Number(end[2].substr(1, end[1].length))
      );
      if (this.endDate < new Date()) {
        this.startDate = this.endDate;
      }
      this.date =
        this.startDate.getFullYear() +
        "-" +
        (this.startDate.getMonth() + 1 < 10
          ? "0" + (this.startDate.getMonth() + 1)
          : this.startDate.getMonth() + 1) +
        "-" +
        (this.startDate.getDate() < 10
          ? "0" + this.startDate.getDate()
          : this.startDate.getDate());
    },
    // 选择时间
    timeConfirm(res) {
      let calDate = res.getDate();
      if (res.getDate() < 10) {
        calDate = "0" + res.getDate();
      }
      this.date =
        res.getFullYear() +
        "-" +
        (res.getMonth() + 1 < 10
          ? "0" + (res.getMonth() + 1)
          : res.getMonth() + 1) +
        "-" +
        calDate;
      this.timePicker = false;
      this.researchRoom();
    }
  },
  created() {
    // 获取最大最小时间
    this.getMinMaxDate();
    // 获取起始节次列表
    this.getNode();

    let type = this.$route.query.type;
    if (type == "0") {
      this.start = this.$route.query.start;
      this.end = this.$route.query.end;
      this.date = this.$route.query.end;
      this.qsjc = this.start + "-" + this.end;
      
    }
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
  padding: 60px 5% 0;

  div {
    background: #f8f8f8;
    border-radius: 5px;
    padding: 3% 0 3% 6%;
    margin-bottom: 5%;
    position: relative;

    p {
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
// src/components/newPages/student/restRooms/index.vue