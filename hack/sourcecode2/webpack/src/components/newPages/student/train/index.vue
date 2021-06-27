<template>
  <div>
    <Header title="培养方案明细" type="0" route="/homeIndex"></Header>
    <div class="trainDetail">
      <van-tabs v-model="active" type="line" sticky animated>
        <van-tab title="培养目标">
          <div class="courseDetails">
            <article v-html="active == 0 ? detailList.target : ''"></article>
          </div>
        </van-tab>
        <van-tab title="详细说明">
          <div class="courseDetails">
            <article v-html="active == 1 ? detailList.explain : ''"></article>
          </div>
        </van-tab>
        <van-tab title="课程设置总表">
          <div class="content">
            <div
              class="content-item"
              v-for="(item, index) in clList"
              :key="index"
              @click="goDetail(item)"
            >
              <p>{{ item.courseName }}</p>
              <van-row>
                <van-col span="12">
                  <ul>
                    <li>总学时：{{ item.totalHours }}</li>
                    <!-- <li>课程属性:{{ item.courseAttribute }}</li> -->
                    <li>课程编号:{{ item.courseCode }}</li>
                  </ul>
                </van-col>
                <van-col span="12">
                  <ul>
                    <li>学分：{{ item.credit }}</li>
                    <li>考核方式：{{ item.evaluationMode }}</li>
                    <!-- <li>是否考试：{{ item.whetherTest }}</li> -->
                    <!-- <li>开设学期：{{ item.openSemester }}</li> -->
                  </ul>
                </van-col>
              </van-row>
              <!-- <van-row>
                <van-col span="24">
                  <ul>
                    <li>开课单位：{{ item.courseUnits }}</li>
                  </ul>
                </van-col>
              </van-row> -->
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Api } from "../../../../utils/axios";

import Vue from "vue";
import { Tab, Tabs } from "vant";

Vue.use(Tab);
Vue.use(Tabs);
export default {
  data() {
    return {
      active: 0,
      detailList: [],
      clList: []
    };
  },
  methods: {
    // 跳转课程详情
    goDetail(item) {
      this.$router.push({
        path: "/train/item",
        query: {
          list: item
        }
      });
    },
    // 获取课程设置总表
    async getClass() {
      const res = await Api.guidanceTeaching();
      this.clList = res.data;
      this.isLoad = true;
    },
    // 获取培养目标和详细说明
    async getList() {
      const res = await Api.targetAndExplain();
      if (res.data[0]) {
        this.detailList = res.data[0];
      }
    }
  },
  watch: {
    active(val) {
      if (val == 2) {
        this.getClass();
      }
    }
  },
  created() {
    // 获取培养目标和详细说明
    this.getList();

    if (this.$route.query.type === "0") {
      this.active = 2;
    }
  }
};
</script>
<style lang="less">
.trainDetail {
  .van-tabs--line .van-tabs__wrap {
    border-bottom: 1px solid #f4f4f4;
    .van-tab--active {
      .van-tab__text--ellipsis {
        color: #212f6e !important;
      }
    }
    .van-tab__text--ellipsis {
      width: 100%;
      height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #8f95b5;
      letter-spacing: 0;
      text-align: center;
    }
    .van-tabs__line {
      background-color: #7469f8 !important;
      width: 25px;
      height: 3px;
      border-radius: 1.5px;
    }
  }
  .courseDetails {
    padding: 1rem 1.25rem;
  }
  .content {
    padding: 1rem 5% 0;
    .content-item {
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
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/student/train/index.vue