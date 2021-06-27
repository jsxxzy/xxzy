<template>
  <div>
    <Header title="成绩详情"></Header>
    <div class="gradeSearch">
      <div class="list-head">
        <p>{{ gradeInfo.studentName }}</p>
        <span style="width:50%">
          <span>学号：{{ gradeInfo.studentNumber }}</span
          ><br />
          <span>考试性质：{{ examProperty }}</span>
        </span>
        <ul>
          <li>
            {{ gradeInfo.score }}
            <i>总成绩</i>
          </li>
        </ul>
      </div>
      <ul class="item">
        <li v-if="gradeItem[0]">
          <span>{{
            gradeItem[0].projectName + "" + gradeItem[0].proportion
          }}</span>
          <span>{{ gradeItem[0].projectScore }}</span>
        </li>
        <li v-if="gradeItem[1]">
          <span>{{
            gradeItem[1].projectName + "" + gradeItem[1].proportion
          }}</span>
          <span>{{ gradeItem[1].projectScore }}</span>
        </li>
        <li v-if="gradeItem[2]">
          <span>{{
            gradeItem[2].projectName + "" + gradeItem[2].proportion
          }}</span>
          <span>{{ gradeItem[2].projectScore }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Api } from "../../../../../utils/axios";
export default {
  data() {
    return {
      pscj: "无数据",
      qzcj: "无数据",
      qmcj: "无数据",
      scoreId: "",
      examProperty: "",
      studentName: "",
      studentNumber: "",
      gradeInfo: {},
      gradeItem: {}
    };
  },
  methods: {
    // 获取成绩信息
    async getGradeInfo() {
      const params = {
        scoreId: this.scoreId
      };
      const res = await Api.teachGetCjxgxx(params);
      if (res.code == "0") {
        this.$toast(res.Msg);
        this.$router.replace("/grade/index");
      }
      this.gradeInfo = res.data[0];
      this.gradeItem = this.gradeInfo.scoreData;
    }
  },
  created() {
    this.scoreId = this.$route.query.i_item.scoreId;
    this.score = this.$route.query.i_item.score;
    this.examProperty = this.$route.query.i_item.examProperty;
    this.studentNumber = this.$route.query.i_item.studentNumber;
    this.studentName = this.$route.query.i_item.studentName;
  },
  mounted() {
    this.getGradeInfo();
  }
};
</script>
<style lang="less" scoped>
// 内容
.gradeSearch {
  padding: 5% 5% 0;
  p {
    height: 33px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    font-weight: bolder;
    margin-bottom: 5%;
  }
  .list-head {
    background-image: url("../../../../../../static/image/head1.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    padding: 6% 4%;
    box-sizing: border-box;
    margin-bottom: 5%;
    position: relative;

    p {
      height: 22px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #fff;
      letter-spacing: 0;
      margin-bottom: 2%;
      font-weight: bolder;
    }
    span {
      font-style: normal;
      font-family: PingFangSC-Light;
      font-size: 10px;
      color: #fff;
      letter-spacing: 0;
      font-weight: lighter;
    }

    ul {
      position: absolute;
      right: 4%;
      height: 50px;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      li:first-child {
        width: 80px;
        height: 60px;
        background: #ecedfd;
        color: #7469f8;
        i {
          color: #7469f8;
        }
      }
      li {
        border-radius: 5px;
        font-weight: bold;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #fff;
        letter-spacing: 0;
        line-height: 17px;
        i {
          font-style: normal;
          font-family: PingFangSC-Light;
          font-size: 10px;
          color: #fff;
          letter-spacing: 0;
          font-weight: lighter;
        }
      }
    }
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
  .item li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    height: 50px;
    align-items: center;
    span {
      &:first-child {
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #212f6e;
        letter-spacing: 0;
      }
      &:last-child {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #212f6e;
        letter-spacing: 0;
        text-align: right;
        font-weight: bolder;
      }
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/grade/search/gradeItem.vue