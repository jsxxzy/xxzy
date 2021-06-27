<template>
  <div>
    <Header title="更多筛选"></Header>
    <div class="more">
      <van-field
        v-model="xnxq.text"
        label="学年学期"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="showPicker = true"
        readonly
      />
      <van-field
        v-model="zc"
        label="教学周次"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="showPicker1 = true"
        readonly
      />
      <van-field
        v-model="kcmc"
        label="课程名称"
        input-align="right"
        placeholder="非必填"
      />
      <van-field
        v-model="kcbh"
        label="课程编号"
        input-align="right"
        placeholder="非必填"
      />
    </div>
    <div class="bottom-btn">
      <button @click="reSet">重置</button>
      <button @click="search">查询</button>
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
export default {
  data() {
    return {
      kcbh: "",
      kcmc: "",
      showPicker: false,
      xnxq: {},
      xnxqList: {
        values: [],
        defaultIndex: ""
      },
      showPicker1: false,
      zc: "",
      zcList: []
    };
  },
  methods: {
    // 查询
    search() {
      if (this.zc == "" || JSON.stringify(this.xnxq) == "{}") {
        this.$toast.fail("请选择学年学期和周次");
        return;
      }
    },
    // 重置
    reSet() {
      this.kcbh = "";
      this.kcmc = "";
      this.xnxq = {};
      this.zc = "";
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
    },
    // 选择周次
    onConfirm2(value) {
      this.zc = value;
      this.showPicker1 = false;
    },
    async getXnxqZC() {
      const res = await Api.getJxfkxnxq();
      res.data.forEach((item, index) => {
        this.xnxqList.values.push({
          text: item.XQMC,
          value: item.XNXQ01ID,
          value1: item.zcs
        });
      });
    }
  },
  created() {
    // 获取学年学期list和周次list
    this.getXnxqZC();
    // 初始化学年学期和周次
    this.xnxq = this.$route.query.xnxq;
    this.zc = this.$route.query.zc;
    this.zcList = this.$route.query.zcList;
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
// src/components/newPages/student/classTeachAdvice/more.vue