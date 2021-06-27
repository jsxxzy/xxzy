<template>
  <div class="historList">
    <Header title="调课申请记录"></Header>
    <van-dropdown-menu active-color="#7469F8">
      <van-dropdown-item
        ref="oid"
        v-model="optionDM"
        :options="option"
        @historList="historList"
      />
    </van-dropdown-menu>
    <div class="list">
      <NOdata
        v-if="this.historList.length == 0"
        title="未查询到调课记录"
      ></NOdata>
      <div
        v-else
        class="list-item"
        v-for="(item, index) of historList"
        :key="index"
        @click="goRecord(item)"
      >
        <p>{{ item.courseName }}</p>
        <ul>
          <li>调课方式：{{ item.changeMode }}</li>
          <li>调课类型：{{ item.changeTypeName }}</li>
        </ul>
        <span :class="item.class">{{ item.auditStateName }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Api } from "../../../../utils/axios";
export default {
  data() {
    return {
      applyList: [],
      allList: [],
      optionDM: "全部",
      option: [
        { text: "全部", value: "全部" },
        { text: "审核中", value: "审核中" },
        { text: "未通过", value: "不通过" },
        { text: "已通过", value: "已通过" },
        { text: "待审核", value: "待审核" }
      ]
    };
  },
  methods: {
    // 申请记录的条件选择
    historList(value) {
      let list = [];
      if (value == "全部") {
        this.applyList = this.allList;
      } else {
        this.allList.forEach(item => {
          if (item.auditStateName == value) {
            list.push(item);
          }
        });
        this.applyList = list;
      }
    },
    // 获取申请记录
    async historList() {
      const params = {
        auditState: ""
      };
      const res = await Api.teachGetJstkxx(params);
      this.applyList = res.data;
      this.allList = res.data;

      for (let item of this.applyList) {
        if (item.auditStateName == "审核中") {
          item.class = "shzClass";
        } else if (item.auditStateName == "不通过") {
          item.class = "btgClass";
        } else if (item.auditStateName == "通过") {
          item.class = "ytgClass";
          item.auditStateName = "已通过";
        } else if (item.auditStateName == "待送审") {
          item.class = "dssClass";
        }
      }
    }
  },
  created() {
    // 获取调课记录
    this.historList();
  }
};
</script>
<style lang="less">
.historList {
  .list {
    padding: 5% 5% 0;
    .list-item {
      background: #f8f8f8;
      border-radius: 5px;
      margin-bottom: 5%;
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
      span {
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
        color: #7469f8;
      }
      .btgClass {
        color: #f86969;
      }
      .ytgClass {
        color: #12ddd6;
      }
      .dssClass {
        color: #757da3;
      }
    }
  }
  .van-ellipsis {
    height: 20px;
    font-family: PingFangSC-Medium;
    font-size: 15px;
    color: #212f6e;
    letter-spacing: 0;
    font-weight: bolder;
  }
  .van-cell {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #212f6e;
    letter-spacing: 0;
  }
  .van-dropdown-menu {
    border-bottom: 1px solid #f4f4f4;

    .van-dropdown-menu__bar {
      box-shadow: none;
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/exchangeK/historyList.vue