<template>
  <div class="bk">
    <Header title="补考报名" type="0" route="/homeIndex"></Header>
    <NOdata
      v-if="this.bkList && this.bkList.length == 0"
      title="未查询到补考数据"
    ></NOdata>
    <div v-else class="content">
      <div class="list-item" v-for="(item, index) in bkList" :key="index">
        <div class="item-top">
          <p>{{ item.kcmc }}</p>
          <van-row>
            <van-col span="15">
              <ul>
                <li>开课学期：{{ item.kkxq }}</li>
                <li>补考报名学期：{{ item.bkbmxq }}</li>
                <li>课程属性：{{ item.kcsx }}</li>
                <li>考试性质：{{ item.ksxz }}</li>
              </ul>
            </van-col>
            <van-col span="7">
              <ul>
                <li>学时：{{ item.xs }}</li>
                <li>学分：{{ item.xf }}</li>
                <li>总成绩：{{ item.zcj }}</li>
              </ul>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">
              <ul>
                <li>课程信息：{{ item.kcxx }}</li>
                <li>报名状态：{{ item.sfkbm == "0" ? "已报名" : "未报名" }}</li>
              </ul>
            </van-col>
          </van-row>
        </div>
        <span
          v-if="item.sfkbm == '0'"
          @click="regist(item.cj0716id, item.sfkbm)"
          class="qxbmClass"
          >取消报名</span
        >
        <span
          v-if="item.sfkbm == '1'"
          @click="regist(item.cj0716id, item.sfkbm)"
          class="bmClass"
          >立即报名</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Api } from "@/utils/axios";

export default {
  data() {
    return {
      bkList: []
    };
  },
  methods: {
    async getBkLlist() {
      const res = await Api.getResit_13104();
      if (res.code == 0) {
        this.$toast.fail(res.msg);
        this.$router.push("/homeIndex");
        return;
      }
      var now = new Date();
      var jssj = new Date(res.data.resitController.jssj);
      var qssj = new Date(res.data.resitController.qssj);
      if (now > jssj || now < qssj) {
        this.bkList = [];
      } else {
        this.bkList = res.data.resitList;
      }
    },
    async regist(id, type) {
      let res = {};
      if (type == "0") {
        res = await Api.qxbmResit_13104({
          cj0716id: id
        });
      } else {
        res = await Api.bmResit_13104({
          cj0716id: id
        });
      }
      if (res.code == 1) {
        this.getBkLlist();
      } else {
        this.$toast.fail(res.msg);
      }
    }
  },
  created() {
    this.getBkLlist();
  }
};
</script>
<style lang="less">
.bk {
  .content {
    padding: 5% 5% 0;
    .list-item {
      background: #f8f8f8;
      border-radius: 5px;
      margin: 0 auto 5%;
      position: relative;
      .item-top {
        padding: 3% 0 3% 6%;
        p {
          height: 42px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #212f6e;
          letter-spacing: 0;
          margin-bottom: 2%;
          font-weight: bolder;
          line-height: 42px;
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
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #212f6e;
      letter-spacing: 0;
      text-align: right;
      border-top: 1px solid #dee1e9;
      display: block;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      font-weight: bold;
    }
    .bmClass {
      color: #212f6e;
    }
    .qxbmClass {
      color: #f86969;
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/student/bkApply/index.vue