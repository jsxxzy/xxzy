<template>
  <div class="teach-advice">
    <Header title="课堂教学反馈" type="0" route="/homeIndex"></Header>
    <div class="search">
      <span @click="showPicker = true">
        <i>学年学期：{{ xnxq.text }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="showPicker1 = true">
        <i>周次：{{ zc }}</i>
        &nbsp;&nbsp;
        <b></b>
      </span>
      <span @click="goMore">
        更多&nbsp;
        <i class="iconfont icongengduo icon"></i>
      </span>
    </div>
    <!-- <NOdata
      v-if="this.classroomList && this.classroomList.length == 0"
      title="未查询到课堂"
    ></NOdata> -->
    <div class="content">
      <span v-for="(item, index) in itemList" :key="index">
        <div
          @click="goAdvice(item1.TKJX_FKID, item1.JX0408ID)"
          v-for="item1 in item.kbxx"
          :key="item1.TKJX_FKID"
        >
          <p>{{ item.KCMC }}</p>
          <ul>
            <li>
              上课周次：<span>{{ item1.KKZC }}周</span>
            </li>
            <li>
              上课节次：<span>{{ item1.KCSJ }}节</span>
            </li>
            <li>
              上课教师：<span>{{ item1.JG0101MC }}</span>
            </li>
            <li>
              反馈状态：<span>{{ item1.FKZT }}</span>
            </li>
          </ul>
          <span class="iconfont icon iconicon-test"></span></div
      ></span>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="xnxqList.values"
        @cancel="showPicker = false"
        @confirm="onConfirm1"
        :default-index="xnxqList.defaultIndex"
      />
    </van-popup>
    <van-popup v-model="showPicker1" position="bottom">
      <van-picker
        show-toolbar
        :columns="zcList"
        @cancel="showPicker1 = false"
        @confirm="onConfirm2"
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
      showPicker: false,
      xnxq: {},
      xnxqList: {
        values: [],
        defaultIndex: ""
      },
      showPicker1: false,
      zc: "",
      zcList: [],
      itemList: [],
      num: ""
    };
  },
  methods: {
    // 获取课程
    goAdvice(i_id, id) {
      this.$router.push({
        path: "/teachAdvice/content",
        query: {
          xnxq: this.xnxq,
          zc: this.zc,
          id: i_id,
          jx0408id: id,
          num: this.num
        }
      });
    },
    // 跳转到更多界面
    goMore() {
      this.$router.push({
        path: "/teachAdvice/more",
        query: {
          xnxq: this.xnxq,
          zc: this.zc,
          zcList: this.zcList
        }
      });
    },
    // 选择学年学期
    onConfirm1(value) {
      this.xnxq.text = value.text;
      this.xnxq.value = value.value;
      this.showPicker = false;
      let arr = [];
      value.value1.forEach(val => {
        arr.push(val.ZC);
      });
      this.zcList = arr;
      this.getClass();
    },
    // 选择周次
    onConfirm2(value) {
      this.zc = value;
      this.showPicker1 = false;
      this.getClass();
    },
    // 获取学年学期list和周次list
    async getXnxqZC() {
      const res = await Api.getJxfkxnxq();
      res.data.forEach((item, index) => {
        if (item.ISDQXQ == "1") {
          this.xnxqList.defaultIndex = index;
          this.xnxq.text = item.XQMC;
          this.xnxq.value = item.XNXQ01ID;

          this.zc = item.zcs[0].ZC;
          item.zcs.forEach(val => {
            this.zcList.push(val.ZC);
          });
          this.getClass();
        }
        this.xnxqList.values.push({
          text: item.XQMC,
          value: item.XNXQ01ID,
          value1: item.zcs
        });
      });
    },
    // 获取课堂list
    async getClass() {
      const ret = await Api.getJxfkkc({
        xnxq01id: this.xnxq.value,
        zc: this.zc
      });
      if (ret.data) {
        this.itemList = ret.data;
        this.num = ret.ktjxfkpjxsid;
      }
    }
  },

  created() {
    // 获取学年学期list和周次list
    this.getXnxqZC();
  }
};
</script>
<style lang="less" scoped>
.teach-advice {
  .search {
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
      padding: 3% 6% 3% 6%;
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
      & > span {
        position: absolute;
        top: calc(50% - 6px);
        right: 5%;
      }
    }
  }
  .icon {
    font-size: 12px;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/student/classTeachAdvice/index.vue