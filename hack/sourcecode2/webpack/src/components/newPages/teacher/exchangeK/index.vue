<template>
  <div class="exchange-i">
    <Header title="调课申请" type="0" route="/homeIndex"></Header>
    <NOdata
      v-if="this.exchangeList && this.exchangeList.length == 0"
      title="未查询到课程信息"
    ></NOdata>
    <div class="exchange">
      <div
        class="item"
        v-for="(item, index) of exchangeList"
        :key="index"
        @click="goItem(item)"
      >
        <p>{{ item.courseName }}</p>
        <ul>
          <li>班级：{{ item.className }}</li>
          <li>周次：{{ item.week }}</li>
          <li>时间：{{ item.weekNote }}</li>
        </ul>
      </div>
    </div>
    <div class="bottom-btn">
      <button @click="goItem('')">申请记录</button>
    </div>
  </div>
</template>

<script>
import { Api } from "../../../../utils/axios";
export default {
  data() {
    return {
      exchangeList: []
    };
  },
  methods: {
    // 获取课程列表
    async getList() {
      const res = await Api.teachGetJsskxx();
      this.exchangeList = res.data;
    },
    goItem(item) {
      this.$router.push({
        path: "/exchangeK/item",
        query: {
          i_item: item
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.exchange-i {
  .exchange {
    padding: 5% 5% 0;
    overflow: auto;
    height: 80vh;
    .item {
      background: #f8f8f8;
      border-radius: 5px;
      margin: 0 auto 5%;
      padding: 3% 0 3% 6%;
      box-sizing: border-box;

      p {
        height: 22px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #212f6e;
        letter-spacing: 0;
        font-weight: bolder;
        margin-bottom: 2%;
      }
      ul {
        li {
          height: 16px;
          font-family: PingFangSC-Light;
          font-size: 12px;
          color: #757da3;
          letter-spacing: 0;
          line-height: 16px;
          margin-bottom: 1%;
        }
      }
    }
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    padding-bottom: 10px;
    padding: 0 5%;
    background: #fff;
    box-sizing: border-box;

    button {
      width: 100%;
      height: 44px;
      background: #7469f8;
      border-radius: 3px;
      color: #fff;
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/exchangeK/index.vue