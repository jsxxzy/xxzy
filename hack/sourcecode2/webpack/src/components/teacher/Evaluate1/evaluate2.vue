<template>
  <div class="content">
    <Header title="教学评价" type="0" route="/evaluateSerach"></Header>
    <NOdata
      title="暂无教学评价~"
      v-if="evaluateList.length == 0 ? isShow3 : ''"
    ></NOdata>
    <div
      class="grey-contain"
      v-for="(item, index) in evaluateList"
      :key="index"
    >
      <div style="width:calc(100% - 80px);">
        <p class="contain-txt">{{ item.teacherName }}</p>
        <span class="contain-txt1">工号：{{ item.teacherNumber }}</span>
        <div class="contain-txt1" v-if="item.institute ? isShow1 : ''">
          院系：{{ item.institute }}
        </div>
        <div class="contain-txt1">
          课程信息：{{
            item.claassRoom[0].kcmc == "" ? "无" : item.claassRoom[0].kcmc
          }}
        </div>
        <div class="contain-txt1">
          教室：{{
            item.claassRoom[0].jsmc == "" ? "无" : item.claassRoom[0].jsmc
          }}
        </div>
      </div>
      <button
        @click="item.isSubmitCode == 0 ? goEvaluate(item) : ''"
        v-text="item.isSubmitCode == 0 ? '评价' : ''"
        v-if="isShow"
      ></button>
      <div
        class="r_box"
        @click="item.isSubmitCode == 1 ? goCheck(item) : ''"
        v-else
      >
        <span class="number">{{ item.overallScore }}</span>
        <span class="grade">总评分</span>
      </div>
    </div>
    <div class="page">
      <van-pagination
        v-model="currentPage"
        :page-count="pagenum"
        mode="simple"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Api } from "../../../utils/axios";
import { Pagination } from "vant";

Vue.use(Pagination);
export default {
  data() {
    return {
      pagenum: 1,
      evaluateList: [],
      isShow: true,
      isShow1: true,
      isShow3: true,
      currentPage: 1
    };
  },
  methods: {
    changePage() {
      this.getList();
    },
    goCheck(e) {
      this.$router.push({
        path: "/gradeDetails",
        query: {
          batchId: e.batchId,
          evaluationCategoriesId: e.evaluationCategoriesId,
          courseId: e.courseId,
          teacherId: e.teacherId,
          noticeId: e.noticeId,
          schoolClassificationId: e.schoolClassificationId,
          teacherName: e.teacherName,
          teacherNumber: e.teacherNumber
        }
      });
    },
    goEvaluate(e) {
      this.$router.push({
        path: "/EvaluatessTkjl",
        query: {
          batchId: this.getCookie("batchId"),
          pj05id: this.getCookie("pj05id"),
          evaluationCategoriesId: e.evaluationCategoriesId,
          courseId: e.courseId,
          teacherId: e.teacherId,
          noticeId: e.noticeId,
          schoolClassificationId: e.schoolClassificationId,
          searchList: this.$route.query.searchList,
          params:e
        }
      });
    },
    getCookie(cookieName) {
      var cookieStr = document.cookie;
      var arr = cookieStr.split("; ");
      var cookieValue = "";
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].split("=");
        if (temp[0] == cookieName) {
          cookieValue = temp[1];
          break;
        }
      }
      return cookieValue;
    },
    async getList() {
      const params = {
        batchId: this.getCookie("batchId"),
        pj05id: this.getCookie("pj05id"),
        yxparam: this.$route.query.searchList.ssyx,
        jcparam: this.$route.query.searchList.jc,
        jsparam: this.$route.query.searchList.js,
        dateparam: this.$route.query.searchList.dqsj,
        jgh: this.$route.query.searchList.jgh,
        page: this.currentPage
      };
      const res = await Api.teachTeachingEvaluationList(params);
      // console.log(res);
      if (res.errorCode == "fail") {
        this.$toast.fail(res.errorMessage);
      } else {
        this.evaluateList = res.data;
        this.currentPage = res.page;
        this.pagenum = res.all;
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.content {
  padding-bottom: 80px;
}
.grey-contain {
  padding: 20px;
}
.grey-contain button {
  background-color: @attendance-background-color-1;
  padding: 11px 19px;
  border-radius: 3px;
  color: @attendance-color-3;
}
.delay-btn {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
.delay-btn button {
  background-color: @attendance-background-color-7;
  color: @attendance-background-color-1;
  padding: 11px 0;
  width: 90%;
  border-radius: 3px;
}
.r_box {
  width: 24%;
  height: 42px;
  float: right;
  background: url(../../../assets/images/bg_icon.png) center center no-repeat;
  background-size: 100%;
  /* margin: 20px 20px 0 0; */
  text-align: center;
}
.contain-txt {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.r_box span {
  display: block;
}
.r_box .number {
  color: @attendance-color-3;
  font-size: 18px;
  margin-top: 3px;
}
.r_box .grade {
  color: @attendance-color-3;
  font-size: 10px;
}
.page {
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
}
.page ul {
  width: 90%;
  margin: 10px auto;
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Evaluate1/evaluate2.vue