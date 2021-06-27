<template>
  <div>
    <Header title="待处理" type="0" route="/pass/index"></Header>
    <div class="unDeal">
      <van-search
        v-model="value"
        placeholder="请输入关键词"
      />
      <NOdata
        v-if="this.unDealList.length == 0"
        title="未查询到处理信息"
      ></NOdata>
      <div v-else class="content">
        <div
          v-for="(item, index) of unDealList"
          :key="index"
          @click="goPass(item)"
        >
          <p>{{ item.dmmc }}</p>
          <ul>
            <li>申请人：{{ item.cjr }}</li>
            <li>创建时间：{{ item.cjsj }}</li>
          </ul>
          <span class="iconfont icon iconicon-test"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";

export default {
  data() {
    return {
      value: "",
      list: []
    };
  },
  methods: {
    goPass(item) {
      item.route = "/pass/unDeal";

      // 跳转到成绩审核界面
      if (item.ywcode == "001") {
        this.$router.push({
          path: "/teacher/guideMain",
          query: {
            i_item: item
          }
        });
      } else if (item.ywcode == "002") {
      } else if (item.ywcode == "003") {
        // 新增课程审核
        this.$router.push({
          path: "/teacher/courseAuditMain",
          query: {
            id: item.key1,
            audit: item.id,
            type: 0
          }
        });
      } else if (item.ywcode == "004") {
      } else if (item.ywcode == "005") {
        // 通选课审核
        this.$router.push({
          path: "/teacher/courseAuditMain",
          query: {
            id: item.key1,
            audit: item.key2,
            type: 1
          }
        });
      } else if (item.ywcode == "006") {
        let id = {
          id: item.key2,
          sId: item.key3,
          jId: item.key1 //JX02ID
        };
        this.$router.push({
          path: "/teacher/verifyDetail",
          query: {
            id: encodeURIComponent(JSON.stringify(id)),
            i_item: item
          }
        });
      } else if (item.ywcode == "007") {
        this.$router.push({
          name: "borrowingListDetail",
          params: { route_params: encodeURI(JSON.stringify(item)) }
        });
      } else if (item.ywcode == "008") {
        // 成绩录入审核
        this.$router.push({
          path: "/teacher/examine/scoreListDetail",
          query: {
            i_item: item
          }
        });
      } else if (item.ywcode == "009") {
        // 教师调课申请
        item.kcmc = item.key1;
        item.ktmc = item.key2;
        item.tkfs = item.key3;
        item.tklx = item.key3;
        this.$router.push({
          name: "adjustListDetail",
          params: { route_params: encodeURI(JSON.stringify(item)) }
        });
      } else if (item.ywcode == "011") {
        let ids = {
          id: item.ywinstanceid,
          sId: item.id || "",
          type: 9,
          cjr: item.cjr || ""
        };
        this.$router.push({
          path: "/teacher/bookDetail",
          query: {
            id: encodeURIComponent(JSON.stringify(ids))
          }
        });
      }
    },
    // 获取待处理list
    async getUnDeal() {
      const res = await Api.getNotShenHeMsg();
      this.list = res.data;
    }
  },
  created() {
    // 获取待处理list
    this.getUnDeal();
  },
  computed: {
    unDealList: function() {
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
  }
};
</script>
<style lang="less" scoped>
.unDeal {
  padding: 5% 5% 0;
  .van-search {
    padding: 0;
    height: 44px;
    background: #f4f5ff;
    border-radius: 3px;
    margin-bottom: 7%;
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
  .content {
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
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/pass/unDeal.vue