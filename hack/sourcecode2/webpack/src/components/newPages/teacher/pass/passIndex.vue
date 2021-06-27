<template>
  <div>
    <div class="passIndex">
      <van-search
        v-model="value"
        placeholder="请输入关键词"
      />
      <div class="list-head">
        <div>
          <p>学年学期</p>
          <span @click="showPop('学年学期', 'xnxq')">
            <i>{{ xnxq }}</i>
            <b></b>
          </span>
        </div>
        <div>
          <p>活动名称</p>
          <span @click="showPop('活动名称', 'hdmc')">
            <i>{{ hdmc.mc }}</i>
            <b></b>
          </span>
        </div>
      </div>
      <NOdata
        v-if="this.passList.length == 0"
        title="未查询到审核信息"
      ></NOdata>
      <div class="list">
        <div class="list-item" v-for="(item, index) of passList" :key="index">
          <p>{{ item.wfexname }}</p>
          <ul>
            <li>开课院系：{{ item.kkdwmc }}</li>
            <li>课堂名称：{{ item.ktmc }}</li>
            <li>录入人：{{ item.v_cjr }}</li>
            <li>录入时间：{{ item.cjsj }}</li>
          </ul>
          <span @click="goPass(item)">审核</span>
        </div>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        :title="valueList.label"
        show-toolbar
        :default-index="index"
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
      index: "0",
      value: "",
      xnxq: "",
      hdmc: {},
      xnxqList: [],
      hdmcList: [],
      columns: {},
      valueList: {
        label: "",
        value: "",
        item: ""
      },
      xnxq01id: "",
      list: []
    };
  },
  watch: {
    xnxq: {
      handler(n) {
        if (n) {
          let list = [];
          this.hdmcList.forEach(item => {
            if (n == item.xnxq01id) {
              list.push({
                text: item.cjlrmc,
                value: item.cj0701id
              });
            }
          });
          list.unshift({ text: "全部", value: "" });
          this.hdmcList = list;
          this.columns.hdmc = this.hdmcList;
          if (n !== this.xnxq01id) {
            this.hdmc.mc = this.hdmcList[0].text;
            this.hdmc.dm = this.hdmcList[0].value;
          }

          // 获取审核list
          this.getPassList();
        }
      },
      deep: true
    }
  },
  methods: {
    // 跳转界面
    goPass(item) {
      // 成绩录入审核
      item.route = "/pass/passIndex?label=成绩录入审核";
      this.$router.push({
        path: "/teacher/examine/scoreListDetail",
        query: {
          i_item: item
        }
      });
    },
    // 获取审核list
    async getPassList() {
      console.log(this.hdmc);
      const params = {
        xnxq: this.xnxq,
        cj0701id: this.hdmc.dm,
        wfexname: "",
        lrr: "",
        Kkyx: "",
        iswfmes: "new"
      };
      const res = await Api.getcjFind(params);
      this.list = res.data;
    },
    // 获取学年学期
    async getXnxq() {
      const res = await Api.getcjMaxlr();

      // 学年学期
      res.xnxq.forEach(item => {
        this.xnxqList.push(item.mc);
      });
      this.xnxqList.unshift("全部");
      this.columns.xnxq = this.xnxqList;

      // 赋初始值
      this.xnxq = res.data[0].xnxq01id;
      this.xnxq01id = res.data[0].xnxq01id;
      // 活动名称
      let arr = [];

      this.hdmc.dm = res.data[0].cj0701id;
      res.xn.forEach(item => {
        if (item.cj0701id === this.hdmc.dm) {
          this.hdmc.mc = item.cjlrmc;
        }
        if (item.xnxq01id == res.data[0].xnxq01id) {
          arr.push(item);
        }
      });

      this.hdmcList = arr;

      // 获取审核list
      this.getPassList();
    },
    // 弹出选择器
    showPop(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];

      if (value == "xnxq") {
        this.xnxqList.forEach((item, index) => {
          if (item == this.xnxq) {
            this.index = index;
          }
        });
      } else if (value == "hdmc") {
        this.hdmcList.forEach((item, index) => {
          if (item.value == this.hdmc.dm) {
            this.index = index;
          }
        });
      }
    },
    onConfirm(value, index, value1) {
      if (value1 == "hdmc") {
        this.show = false;
        this.hdmc.mc = value.text;
        this.hdmc.dm = value.value;
        // 获取审核list
        this.getPassList();
        return;
      }
      this.show = false;
      this[value1] = value;
    }
  },
  computed: {
    passList: function() {
      var value = this.value;
      if (value) {
        return this.list.filter(function(product) {
          return Object.keys(product).some(function(key) {
            return (
              String(product[key])
                .toLowerCase()
                .indexOf(value) > -1
            );
          });
        });
      }
      return this.list;
    }
  },
  created() {
    // 获取学年学期
    this.getXnxq();
  }
};
</script>
<style lang="less">
.passIndex {
  padding: 5% 5% 0;
  .van-search {
    padding: 0;
    height: 44px;
    background: #f4f5ff;
    border-radius: 3px;
    margin-bottom: 5%;
  }
  .van-search .van-cell,
  .van-search__content,
  .van-field__control {
    background: #f4f5ff;
  }

  .van-field__control::-webkit-input-placeholder {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #757da3 !important;
    letter-spacing: 0;
  }
  .van-field__control::-moz-input-placeholder {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #757da3 !important;
    letter-spacing: 0;
  }
  .van-field__control::-ms-input-placeholder {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #757da3 !important;
    letter-spacing: 0;
  }

  .list-head {
    height: 80px;
    background-image: url("../../../../../static/image/head.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    padding: 6% 7%;
    box-sizing: border-box;
    margin-bottom: 5%;

    div {
      width: 50%;
      height: 100%;
      p {
        font-size: 12px;
        color: #fff;
        font-weight: lighter;
        margin-bottom: 2%;
      }
      span {
        display: flex;
        align-items: center;
        i {
          font-style: normal;
          font-size: 14px;
          color: #fff;
          margin-right: 5%;
        }
        b {
          display: inline-block;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-top: 3px solid #fff;
        }
      }
    }
  }
  .list {
    .list-item {
      background: #f8f8f8;
      border-radius: 5px;
      margin: 0 auto 5%;
      padding: 3% 0 3% 6%;
      position: relative;
      p {
        width: 75%;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #212f6e;
        letter-spacing: 0;
        font-weight: bolder;
        margin-bottom: 2%;
      }
      ul li {
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #757da3;
        letter-spacing: 0;
        margin-bottom: 1%;
      }
      span {
        width: 70px;
        height: 42px;
        background: #7469f8;
        border-radius: 3px;
        position: absolute;
        top: 10%;
        right: 3%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/pass/passIndex.vue