<template>
  <div>
    <Header title="辅修报名" type="0" route="/homeIndex"></Header>
    <div class="research">
      <span @click="onShow('学年学期', 'xnxq')">
        <i>学年学期：{{ xnxq.mc }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="onShow('院系', 'yx')">
        <i>院系：{{ yx.mc }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <!-- <span @click="goMore">
        更多&nbsp;
        <i class="iconfont icongengduo icon"></i>
      </span> -->
    </div>
    <NOdata
      v-if="this.fxList && this.fxList.length == 0"
      title="未查询到辅修数据"
    ></NOdata>
    <div v-else class="content">
      <div class="list">
        <div
          class="list-item update"
          v-for="(item, index) of fxList"
          :key="index"
        >
          <p>{{ item.zymc }}</p>
          <ul>
            <li>院系：{{ item.dwmc }}</li>
            <li>说明：{{ item.bmsm }}</li>
            <li v-if="item.value != '报名'" :class="item.class">
              状态：{{ item.text }}
            </li>
          </ul>
          <span :class="item.class1" @click="operate(item.value)">{{
            item.value
          }}</span>
        </div>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        :title="valueList.label"
        show-toolbar
        :columns="valueList.item"
        @confirm="
          (value, index) => {
            onConfirm(value, index, valueList.value);
          }
        "
        @cancel="show = false"
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
      fxList: [],
      xnxq: { mc: "", dm: "" },
      yx: {},
      show: false,
      valueList: {
        label: "",
        value: "",
        item: []
      },
      list: {},
      columns: {}
    };
  },
  methods: {
    operate(val) {
      if (val === "报名") {
        if (this.list.sfqyzybm) {
          // this.peoplePop = true
          this.onlyReplayBm();
        } else {
          //报名
          this.replayBm();
        }
      } else {
        this.canceBm();
      }
    },
    // 取消报名
    async canceBm() {
      const params = {
        yxid: this.list.yxid,
        xnxqid: this.list.xnxqid,
        jx01ndid: this.list.otherData[0].jx01ndid
      };
      const res = await Api.qxFxbmOper(params);
      this.$toast(res.Msg);
      setTimeout(() => {
        this.getList();
      }, 1000);
    },
    //报名
    async onlyReplayBm() {
      const params = {
        yxid: this.list.yxid,
        xnxqid: this.list.xnxqid,
        jx01ndid: this.list.otherData[0].jx01ndid,
        // zy: this.list.otherData[0].ZY,
        zy: "1",
        sfqyzybm: this.list.sfqyzybm,
        xx0301id: this.list.otherData[0].xx0301id,
        zdbmzy: this.list.zdbmzy
      };
      const res = await Api.fxbmOper(params);
      this.$toast(res.Msg);
      setTimeout(() => {
        this.getList();
      }, 1000);
    },
    //报名 和送审
    async replayBm() {
      const params = {
        yxid: this.list.yxid,
        xnxqid: this.list.xnxqid,
        jx01ndid: this.list.otherData[0].jx01ndid,
        // zy: this.list.otherData[0].ZY,
        zy: "1",
        sfqyzybm: this.list.sfqyzybm,
        xx0301id: this.list.otherData[0].xx0301id,
        zdbmzy: this.list.zdbmzy
      };
      const res = await Api.fxbmOper(params);
      if (res.code == 1) {
        if (res.data[0].ywid != "" || res.data[0].ywid != undefined) {
          this.list.ywid = res.data[0].ywid;
          this.peoplePop = true;
        } else {
          this.$toast(res.Msg);
        }
      }
    },
    async getInfo() {
      const params = {
        // xnxqid: this.xnxq.dm,
        // yxid: this.yx.dm,
        xnxqid: "2020-2021-1",
        yxid: "5BF54230EA404DF3B89552ECA68DAF6E"
      };
      const res = await Api.showFxxsInfo(params);
      if (res.data.length == 0) {
        this.$toast(res.Msg);
      }
      if (!!res.data[0].otherData) {
        this.fxList = res.data[0].otherData;
        this.list = res.data[0];

        for (let item of this.fxList) {
          if (
            (item.iswfmes == null || item.iswfmes == "") &&
            item.sfytg != "1"
          ) {
            item.class1 = "bmClass";
            item.value = "报名";
          } else if (
            ((item.iswfmes == "2" &&
              item.sfsh == "" &&
              (item.issh == "2" || item.issh == "")) ||
              (item.iswfmes == "0" && item.sfytg != "1")) &&
            res.data[0].sfqyzybm
          ) {
            item.class1 = "qxbmClass";
            item.value = "取消报名";
          } else if (
            (item.iswfmes == "0" || item.iswfmes == "3") &&
            item.sfytg != "1" &&
            !res.data[0].sfqyzybm
          ) {
            item.class1 = "qxbmClass";
            item.value = "取消报名";
          }

          if (item.iswfmes == "2") {
            item.class = "shzClass";
            item.text = "审核中";
          } else if (item.iswfmes == "1") {
            item.class = "ytgClass";
            item.text = "通过";
          } else if (item.iswfmes == "0") {
            item.class = "btgClass";
            item.text = " 未通过";
          }
        }
      }
    },
    onShow(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];
    },
    onConfirm(value, index, value1) {
      this.show = false;
      this[value1].mc = value.text;
      this[value1].dm = value.value;
      this.getInfo();
    },
    // 获取学年学期和院系下拉值
    getList() {
      Api.queryByStudentFuxiu().then(res => {
        if (res.data.length == 0) {
          return;
        }
        this.columns.xnxq = res.data[0].map(v => {
          return {
            text: v.XQMC,
            value: v.XNXQ01ID
          };
        });
        this.columns.yx = res.data[1].map(v => {
          return {
            text: v.YXMC,
            value: v.YXID
          };
        });
        this.xnxq.mc = res.data[0][0].XQMC;
        this.xnxq.dm = res.data[0][0].XNXQ01ID;
        this.yx.mc = res.data[1][0].YXMC;
        this.yx.dm = res.data[1][0].YXID;

        this.getInfo();
      });
    }
  },
  created() {
    // 获取学年学期和院系下拉值
    this.getList();
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
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 10rem;
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
  .list {
    .list-item {
      background: #f8f8f8;
      border-radius: 5px;
      margin: 0 auto 5%;
      padding: 3% 0 3% 6%;
      position: relative;
      p {
        height: 22px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #212f6e;
        letter-spacing: 0;
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
    }

    .update span {
      height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      letter-spacing: 0;
      position: absolute;
      top: calc(50% - 10px);
      right: 5%;
      font-weight: bolder;
    }
    .shzClass {
      color: #7469f8 !important;
    }
    .btgClass {
      color: #5e4242 !important;
    }
    .ytgClass {
      color: #12ddd6 !important;
    }
    .dssClass {
      color: #757da3 !important;
    }
    .bmClass {
      width: 70px;
      height: 42px !important;
      top: calc(50% - 21px) !important;
      background: #7469f8;
      border-radius: 3px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
    }
    .qxbmClass {
      width: 70px;
      height: 42px !important;
      top: calc(50% - 21px) !important;
      background: #F7E3E3;
      border-radius: 3px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #F86969;
    }
  }
}

.icon {
  font-size: 12px;
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/student/fxApply/index.vue