<template>
  <div>
    <Header title="成绩查询" type="0" route="/homeIndex"></Header>
    <div class="grade">
      <van-tabs v-model="active" type="line" sticky animated>
        <van-tab title="成绩列表">
          <div class="gradeList">
            <van-search v-model="value" placeholder="搜索学生姓名/学号" />
            <div class="list-head">
              <div>
                <p>课程名称</p>
                <span @click="showPop('课程名称', 'kcmc')">
                  <i>{{ kcmc.mc }}</i>
                  <b></b>
                </span>
              </div>
              <div>
                <p>上课班级</p>
                <span @click="showPop('上课班级', 'skbj')">
                  <i>{{ skbj.mc }}</i>
                  <b></b>
                </span>
              </div>
            </div>
            <NOdata
              v-if="this.gradeList && this.gradeList.length == 0"
              title="未查询到成绩信息"
            ></NOdata>
            <div v-else class="list">
              <div
                class="list-item info"
                v-for="(item, index) of gradeList"
                :key="index"
                @click="goItem(item)"
              >
                <p>{{ item.studentName }}</p>
                <ul>
                  <li>学号：{{ item.studentNumber }}</li>
                  <li>考试性质：{{ item.examProperty }}</li>
                </ul>
                <span>
                  {{ item.score }}
                  <i>总成绩</i>
                </span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        :title="valueList.label"
        show-toolbar
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
import { Api } from "../../../../../utils/axios";

import Vue from "vue";
import { Tab, Tabs } from "vant";
import { Search } from "vant";
import { Picker } from "vant";

Vue.use(Picker);
Vue.use(Search);
Vue.use(Tab);
Vue.use(Tabs);
export default {
  data() {
    return {
      show: false,
      value: "",
      active: 0,
      kcmc: { mc: "", dm: "" },
      skbj: {},
      columns: {
        kcmc: [],
        skbj: []
      },
      valueList: {
        label: "",
        value: "",
        item: ""
      },
      list: []
    };
  },
  methods: {
    //跳转到成绩详情界面
    goItem(item) {
      if (this.isEnable == true) {
        this.$toast.fail("暂未启用该功能");
      } else {
        this.$router.push({
          path: "/grade/item",
          query: {
            i_item: item
          }
        });
      }
    },
    async Change() {
      const params = {
        xx0101id: sessionStorage.getItem("schoolCode"),
        type: this.Identity == "2" ? "0" : "",
        isqy: "",
        key: "qzkj"
      };
      const res = await Api.getHomeMenuApi(params);
      if (res.data.length > 0) {
        res.data.forEach(item => {
          if (item.url == "js_cjgl") {
            this.i_id = item.i_id;
          }
        });
      }
      this.getAuth();
    },
    async getAuth() {
      const params = {
        I_ID: this.i_id
      };
      const res = await Api.getSubMenu(params);
      if (res.data.length > 0) {
        res.data.forEach(item => {
          if (item.url == "/teacher/getCjxgxx") {
            this.isEnable = false;
          }
        });
      }
    },
    async getEnableApi() {
      const params = {
        xx0101id: sessionStorage.getItem("schoolCode"),
        type: sessionStorage.getItem("Identity") == 2 ? "0" : "1"
      };
      const res = await Api.getHomeMenuApi(params);
      res.data.forEach((item, index) => {
        if (item.url == "/teacher/getCjxgxx") {
          this.isEnable = false;
        }
      });
    },

    //获取成绩列表
    async getGrade() {
      // for (let item of this.gradeList) {
      //   let flag = {
      //     text: "",
      //     class: ""
      //   };
      //   if (item.state == "0") {
      //     flag.text = "审核中";
      //     flag.class = "shzClass";
      //     item.state = flag;
      //   } else if (item.state == "1") {
      //     flag.text = "不通过";
      //     flag.class = "btgClass";
      //     item.state = flag;
      //   } else if (item.state == "2") {
      //     flag.text = "已通过";
      //     flag.class = "ytgClass";
      //     item.state = flag;
      //   } else if (item.state == "3") {
      //     flag.text = "待送审";
      //     flag.class = "dssClass";
      //     item.state = flag;
      //   }
      // }
      const params = {
        classId: this.skbj.dm,
        courseId: this.kcmc.dm
      };
      const res = await Api.teachClassScoreList(params);
      this.list = res.data;
    },
    // 获取课程名称
    async getkcmc() {
      const res = await Api.teachGetCjcxByjs();
      
      this.columns.kcmc = res.data.map(item => {
        return {
          text: item.courseName,
          value: item.courseId,
          child: item.classList
        };
      });
      this.kcmc.mc = this.columns.kcmc[0].text;
      this.kcmc.dm = this.columns.kcmc[0].value;
      this.columns.skbj = this.columns.kcmc[0].child.map(i => {
        return {
          text: i.className,
          value: i.classId
        };
      });
      this.skbj.mc = this.columns.skbj[0].text;
      this.skbj.dm = this.columns.skbj[0].value;

      //获取成绩列表
      this.getGrade();
    },
    // 弹出选择器
    showPop(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];
    },
    onConfirm(value, index, value1) {
      if (value1 == "kcmc") {
        this.columns.skbj = value.child.map(i => {
          return {
            text: i.className,
            value: i.classId
          };
        });
        this.skbj.mc = this.columns.skbj[0].text;
        this.skbj.dm = this.columns.skbj[0].value;
      }
      this.show = false;
      this[value1].mc = value.text;
      this[value1].dm = value.value;
      
      this.getGrade();
    }
  },
  created() {
    // 获取课程名称
    this.getkcmc();
    this.Change();
  },
  computed: {
    gradeList: function() {
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
<style lang="less">
.grade {
  .van-tabs--line .van-tabs__wrap {
    border-bottom: 1px solid #f4f4f4;
    .van-tab--active {
      .van-tab__text--ellipsis {
        color: #212f6e !important;
      }
    }
    .van-tab__text--ellipsis {
      width: 56px;
      height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #8f95b5;
      letter-spacing: 0;
    }
    .van-tabs__line {
      background-color: #7469f8 !important;
      width: 25px;
      height: 3px;
      border-radius: 1.5px;
    }
  }
  .gradeList {
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
      background-image: url("../../../../../../static/image/head.png");
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
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 70%;
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
      }
    }
  }
  .info {
    span {
      width: 70px;
      height: 42px;
      background: #ecedfd;
      border-radius: 5px;
      position: absolute;
      top: calc(50% - 21px);
      right: 5%;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #7469f8;
      letter-spacing: 0;
      line-height: 15px;
      i {
        font-style: normal;
        font-family: PingFangSC-Light;
        font-size: 10px;
        color: #7469f8;
        letter-spacing: 0;
        font-weight: lighter;
      }
    }
  }
  .update span {
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
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/grade/search/index.vue