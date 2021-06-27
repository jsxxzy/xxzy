<template>
  <div>
    <div class="box">
      <p class="box-title">
        <i @click="backApp()" v-if="!isNeedLogout"></i>工具箱
      </p>
      <div :class="userType == '0' ? 'box-imgS box-img' : 'box-imgT box-img'">
        <span>欢迎使用教务系统</span>
      </div>
      <van-collapse
        v-model="activeNames"
        class="box-content"
        v-for="(menu, index1) of menuList"
        :key="index1"
      >
        <van-collapse-item
          :title="menu.name"
          :name="menu.i_id"
          v-if="menu.child.length > 0"
          :icon="menu.icon"
        >
          <van-grid :column-num="3">
            <van-grid-item
              v-for="(item, index2) of menu.child"
              :key="index2"
              @click="goMenu(item)"
            >
              <span :class="item.icon.class" :style="item.icon.style"></span>
              <span class="item-value">{{ item.name }}</span>
            </van-grid-item>
          </van-grid>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";

import Vue from "vue";
import { Collapse, CollapseItem } from "vant";
import { Grid, GridItem } from "vant";

Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
export default {
  data() {
    return {
      activeNames: [],
      menuList: [],
      itemList: [],
      userType: false,
      i_id: "",
      resetList: [],
      Identity: sessionStorage.getItem("Identity"),
      isNeedLogout: sessionStorage.getItem("isNeedLogout"),
      teacherList: [
        {
          name: "学生缓考审核",
          path: "/teacher/bookIndex?id=6",
          icon: { class: "iconshouye9 iconfont", style: "color:#00C897" }
        },
        {
          name: "成绩查卷审核",
          path: "/teacher/bookIndex?id=8",
          icon: { class: "iconshouye12 iconfont", style: "color:#FF8080" }
        },
        {
          name: "成绩修改审核",
          path: "/teacher/bookIndex?id=10",
          icon: { class: "iconshouye21 iconfont", style: "color:#865FC1" }
        },
        {
          name: "调课审核",
          path: "/teacher/examine/adjustList?path=/pass/index",
          icon: { class: "iconshouye10 iconfont", style: "color:#5E73FF" }
        },
        {
          name: "教室借用审核",
          path: "/teacher/examine/borrowingList?path=/pass/index",
          icon: { class: "iconshouye25 iconfont", style: "color:#865FC1" }
        },
        {
          name: "监考查询",
          path: "/invigilate",
          icon: { class: "iconfont iconshouye1", style: "color:#FFC327" }
        },
        {
          name: "监考调代",
          path: "/teacher/examSearch",
          icon: { class: "iconfont iconshouye2", style: "color:#5E73FF" }
        },
        {
          name: "随堂考试",
          path: "/teacher/classList",
          icon: { class: "iconfont iconshouye3", style: "color:#865FC1" }
        },
        {
          name: "考场信息查询",
          path: "/teacher/examRoom",
          icon: { class: "iconfont iconshouye4", style: "color:#5E73FF" }
        },
        {
          name: "教学评价",
          path: "/evaluate",
          icon: { class: "iconfont iconshouye4", style: "color:#5E73FF" }
        },
        {
          name: "工作量查询",
          path: "/workNum/index",
          icon: { class: "iconfont iconshouye13", style: "color:#5E73FF" }
        },
        {
          name: "教学学风评测",
          path: "/teacher/learnHome",
          icon: { class: "iconfont iconshouye5", style: "color:#00C998" }
        },
        {
          name: "成绩修改",
          path: "/grade/update/index",
          icon: { class: "iconfont iconshouye14", style: "color:#865FC1" }
        },
        {
          name: "成绩查询",
          path: "/grade/search/index",
          icon: { class: "iconfont iconchengjichaxun2", style: "color:#865FC1" }
        },
        {
          name: "培养方案总纲",
          path: "/train/indpyfazgIndexex",
          icon: { class: "iconfont iconshouye6", style: "color:#FF8080" }
        },
        {
          name: "专业培养方案",
          path: "/train/commonIndex",
          icon: { class: "iconfont iconshouye7", style: "color:#865FC1" }
        },
        {
          name: "专业教学进程",
          path: "/train/teachingProcess",
          icon: { class: "iconfont iconshouye8", style: "color:#00C998" }
        },
        {
          name: "教学计划 ",
          path: "/train/teachingPlan",
          icon: { class: "iconfont iconshouye9", style: "color:#00C998" }
        },
        {
          name: "学生选题情况",
          path: "selected",
          icon: { class: "iconfont iconshouye8", style: "color:#00C998" }
        },
        {
          name: "调课申请",
          path: "/exchangeK/index",
          icon: { class: "iconfont iconshouye10", style: "color:#5E73FF" }
        },
        {
          name: "调课申请记录",
          path: "/exchangeK/historList",
          icon: { class: "iconfont iconshouye10", style: "color:#5E73FF" }
        },
        {
          name: "教材",
          path: "/teacher/textbook",
          icon: { class: "iconfont iconshouye11", style: "color:#FF8080" }
        },
        {
          name: "教室借用",
          path: "/bindex",
          icon: { class: "iconfont iconshouye12", style: "color:#FF8080" }
        },
        {
          name: "教室借用记录",
          path: "/roomBorrow/historyList",
          icon: { class: "iconfont iconshouye12", style: "color:#FF8080" }
        },
        {
          name: "考勤",
          path: "/teacher/attendance",
          icon: { class: "iconfont iconshouye23", style: "color:#865FC1" }
        },
        {
          name: "课程表",
          path: "/surfaces",
          icon: { class: "iconfont iconshouye17", style: "color:#00C998" }
        },
        {
          name: "我的课堂",
          path: "/teacher/create",
          icon: { class: "iconfont iconshouye19", style: "color:#FFC327" }
        },
        {
          name: "班级课表",
          // path: "/teacher/searchCondition?id=0",
          path: "/classTable/index",
          icon: { class: "iconfont iconshouye17", style: "color:#5E73FF" }
        },
        {
          name: "教师课表",
          path: "/teacher/searchCondition?id=1",
          icon: { class: "iconfont iconshouye17", style: "color:#00C998" }
        },
        {
          name: "课程课表",
          path: "/teacher/searchCondition?id=2",
          icon: { class: "iconfont iconshouye17", style: "color:#00C998" }
        },
        {
          name: "教室课表",
          path: "/teacher/searchCondition?id=3",
          icon: { class: "iconfont iconshouye8", style: "color:#00C998" }
        },
        {
          name: "审核",
          path: "/pass/index",
          icon: { class: "iconfont iconshouye18", style: "color:#FFC327" }
        },
        {
          name: "毕业设计",
          path: "/design",
          icon: { class: "iconfont iconshouye15", style: "color:#5E73FF" }
        },
        {
          name: "空闲教室",
          path: "/restRooms/index",
          icon: { class: "iconfont iconshouye15", style: "color:#5E73FF" }
        },
        {
          name: "今日空闲教室",
          path: "/restClassroom",
          icon: { class: "iconfont iconshouye25", style: "color:#00C897" }
        }
      ],
      // 学生端
      studentList: [
        {
          name: "学业进度",
          path: "/student/studyStatu",
          icon: { class: "iconfont iconshouye12", style: "color:#FF8080" }
        },
        {
          name: "学生教室借用",
          path: "/roomBrrow/index",
          icon: { class: "iconfont iconshouye12", style: "color:#FF8080" }
        },
        {
          name: "学籍异动审核",
          path: "/teacher/bookIndex?id=4",
          icon: { class: "iconfont iconshouye15", style: "color:#5E73FF" }
        },
        {
          name: "学籍异动 ",
          path: "/student/change",
          icon: { class: "iconfont iconshouye2", style: "color:#5E73FF" }
        },
        {
          name: "学籍预警",
          path: "/student/warning",
          icon: { class: "iconfont iconshouye15", style: "color:#FF8080" }
        },
        {
          name: "等级考试成绩 ",
          path: "/student/grades_score",
          icon: { class: "iconfont iconshouye22", style: "color:#FFC327" }
        },
        {
          name: "学期考试成绩 ",
          path: "/student/semester_Score",
          icon: { class: "iconfont iconshouye14", style: "color:#865FC1" }
        },
        {
          name: "成绩认定 ",
          path: "/student/score_Affirmation",
          icon: { class: "iconfont iconshouye21", style: "color:#865FC1" }
        },
        {
          name: "教学进度 ",
          path: "/student/syllabus",
          icon: { class: "iconfont iconshouye8", style: "color:#00C897" }
        },
        {
          name: "执行计划 ",
          path: "/student/executePlan",
          icon: { class: "iconfont iconshouye7", style: "color:#865FC1" }
        },
        {
          name: "培养方案明细 ",
          path: "/train/index",
          icon: { class: "iconfont iconshouye6", style: "color:#FF8080" }
        },
        {
          name: "期末考试安排",
          path: "/student/exam",
          icon: { class: "iconfont iconshouye16", style: "color:#FF8080" }
        },
        {
          name: "考试安排",
          path: "/student/exam",
          icon: { class: "iconfont iconshouye16", style: "color:#FF8080" }
        },
        {
          name: "学生评教",
          path: "/student/evaluate",
          icon: { class: "iconfont iconshouye5", style: "color:#00C897" }
        },
        {
          name: "选课",
          path: "/student/pickClass",
          icon: { class: "iconfont iconxuanke", style: "color:#5E73FF" }
        },
        {
          name: "课程表",
          path: "/student/timetable",
          icon: { class: "iconfont iconshouye17", style: "color:#00C897" }
        },
        {
          name: "教材",
          path: "/student/textbook",
          icon: { class: "iconfont iconshouye11", style: "color:#FF8080" }
        },
        {
          name: "课堂签到",
          path: "/student/attendanceAdd",
          icon: { class: "iconfont iconketangqiandao", style: "color:#FFC327" }
        },
        {
          name: "等级考试报名",
          path: "/student/gradeExam",
          icon: { class: "iconfont iconshouye1", style: "color:#FFC327" }
        },
        {
          name: "空闲教室",
          path: "/restRooms/index",
          icon: { class: "iconfont iconshouye25", style: "color:#865FC1" }
        },
        {
          name: "缓考",
          path: "/student/delayedExam",
          icon: { class: "iconfont iconshouye27", style: "color:#00C897" }
        },
        {
          name: "辅修报名",
          path: "/fxApply/index",
          icon: { class: "iconfont iconshouye27", style: "color:#00C897" }
        },
        {
          name: "实习签到",
          path: "/sign/location",
          icon: { class: "iconfont iconshixiqiandao", style: "color:#5E73FF" }
        },
        {
          name: "班级课表",
          path: "/student/class-timetable-search",
          icon: { class: "iconfont iconbanjikebiao", style: "color:#5E73FF" }
        },
        {
          name: "毕业状态查询",
          path: "/student/SelectGraduationStatus-index",
          icon: {
            class: "iconfont iconbiyezhuangtaichaxun1",
            style: "color:#00C897"
          }
        },
        {
          name: "重修查询",
          path: "/student/searchRetest",
          icon: {
            class: "iconfont iconzhongxiubaoming",
            style: "color:#FF8080"
          }
        },
        {
          name: "重修报名",
          path: "/student/retouchList",
          icon: {
            class: "iconfont iconzhongxiubaoming",
            style: "color:#FF8080"
          }
        },
        {
          name: "补考报名",
          path: "/student/registRetest",
          code: "xs_bkbm",
          icon: {
            class: "iconfont iconzhongxiubaoming",
            style: "color:#FF8080"
          }
        },
        {
          name: "补考查询",
          path: "/student/supplementExam",
          icon: { class: "iconfont iconbukaochaxun", style: "color:#00C897" }
        },
        {
          name: "今日空闲教室",
          path: "/restClassroom",
          icon: { class: "iconfont iconshouye25", style: "color:#00C897" }
        },
        {
          name: "教学课堂反馈",
          path: "/teachAdvice/index",
          icon: {
            class: "iconfont iconketangjiaoxuefankui",
            style: "color:#00C897"
          }
        }
      ],
      pathList: [],
      iconList: [
        {
          name: "我的查询",
          icon: "search"
        },
        {
          name: "我的申请",
          icon: "underway-o"
        },
        {
          name: "我的审核",
          icon: "warning-o"
        },
        {
          name: "我的课程",
          icon: "shop-o"
        }
      ]
    };
  },
  methods: {
    backApp() {
      this.$router.go(-2);
    },
    // 个性化的菜单
    personMenu() {
      if (sessionStorage.getItem("schoolCode") === "10548") {
        this.pathList.forEach(item => {
          if (item.name.trim() == "教学评价") {
            item.path = "/evaluate1";
          }
        });
      }
      if (sessionStorage.getItem("schoolCode") === "13104") {
        this.pathList.forEach(item => {
          if (item.name.trim() == "重修报名") {
            item.path = "/cxApply/index";
          } else if (item.name.trim() == "补考报名") {
            item.path = "/bkApply/index";
          }
        });
      }
    },
    goMenu(i_item) {
      const arr = i_item.url.split("_");
      const val = arr[0] + "_" + arr[1];
      this.Change(val);

      this.$router.push({
        path: i_item.path
      });
    },
    async Change(val) {
      const params = {
        xx0101id: sessionStorage.getItem("schoolCode"),
        type: this.Identity == "2" ? "0" : "",
        isqy: "",
        key: "qzkj"
      };
      const res = await Api.getHomeMenuApi(params);
      if (res.data.length > 0) {
        res.data.forEach(item => {
          if (item.url == val) {
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
      this.resetList = res.data;
      if (res.data.length > 0) {
        this.resetList.forEach(item => {
          this.pathList.forEach(list => {
            if (item.url == list.url) {
              item.path = list.path;
            }
          });
        });
      }
    },
    async getMenu() {
      this.$forceUpdate();

      const params = {
        xx0101id: sessionStorage.getItem("schoolCode") || "",
        key: "qzkj",
        is_home: "1",
        type: this.Identity == "2" ? "0" : ""
      };
      // 判断是否存储了菜单
      if (sessionStorage.getItem("menuSave") == "1") {
        this.menuList = JSON.parse(sessionStorage.getItem("homeMenuList"));
      } else {
        // 第一次获取菜单
        const res = await Api.getHomeMenuApi(params);
        this.menuList = res.data;
        sessionStorage.setItem("homeMenuList", JSON.stringify(res.data));
        sessionStorage.setItem("menuSave", "1");
      }

      try {
        if (!!this.menuList) {
          for (let i = 0; i < this.menuList.length; i++) {
            this.activeNames.push(this.menuList[i].i_id);
            let arr = [];
            this.menuList[i].child.forEach(item1 => {
              if (
                item1.url != "js_zsbm" &&
                item1.url != "js_bmqk" &&
                item1.url != "xs_bjkb"
              ) {
                arr.push(item1);
              }
            });
            this.menuList[i].child = arr;
          }

          this.menuList.forEach(item => {
            this.iconList.forEach(item3 => {
              if (item.name.trim() == item3.name.trim()) {
                item.icon = item3.icon;
              }
            });
            item.child.forEach(item1 => {
              this.pathList.forEach(item2 => {
                if (item1.name.trim() == item2.name.trim()) {
                  item1.icon = item2.icon;
                  item1.path = item2.path;
                }
              });
            });
          });
        }
      } catch (e) {
        this.menuList = [];
      }
      if (this.userType == "2") {
        if (sessionStorage.getItem("schoolCode") == "10013") {
          this.menuList[this.menuList.length - 2].child.push({
            is_home: "0",
            i_id: "A79EC55C55F75657E0530100007F9B61",
            url: "js_sh_tk",
            name: "成绩查卷",
            icon: {
              class: "iconshouye25 iconfont",
              style: "color:#865FC1"
            },
            path: "/nod?title=成绩查卷"
          });
          this.menuList[this.menuList.length - 2].child.push({
            is_home: "0",
            i_id: "A79EC55C55F75657E0530100007F9B61",
            url: "js_sh_tk",
            name: "免听申请",
            icon: {
              class: "iconshouye15 iconfont",
              style: "color:#5E73FF"
            },
            path: "/nod?title=免听申请"
          });
          this.menuList[this.menuList.length - 1].child.push({
            is_home: "0",
            i_id: "A79EC55C55F75657E0530100007F9B61",
            url: "js_sh_tk",
            name: "课程作业",
            icon: {
              class: "iconshouye1 iconfont",
              style: "color:#FFC327"
            },
            path: "/nod?title=课程作业"
          });
          this.menuList[this.menuList.length - 1].child.push({
            is_home: "0",
            i_id: "A79EC55C55F75657E0530100007F9B61",
            url: "js_sh_tk",
            name: "课程测试",
            icon: {
              class: "iconshouye9 iconfont",
              style: "color:#00C897"
            },
            path: "/nod?title=课程测试"
          });
          this.menuList[this.menuList.length - 1].child.push({
            is_home: "0",
            i_id: "A79EC55C55F75657E0530100007F9B61",
            url: "js_sh_tk",
            name: "课程讨论",
            icon: {
              class: "iconshouye10 iconfont",
              style: "color:#5E73FF"
            },
            path: "/nod?title=课程讨论"
          });
        }
      } else {
        if (sessionStorage.getItem("schoolCode") == "10013") {
          this.menuList[this.menuList.length - 1].child.push({
            is_home: "0",
            i_id: "A79EC55C55F75657E0530100007F9B61",
            url: "js_sh_tk",
            name: "免听审批",
            icon: {
              class: "iconshouye1 iconfont",
              style: "color:#FFC327"
            },
            path: "/nod?title=免听审批"
          });
        }
      }
      console.log(this.menuList);
    },
    // 判断用户类型更改设置
    userConfig() {
      this.userType = sessionStorage.getItem("Identity");
      if (this.userType == "2") {
        this.pathList = this.studentList;
      } else {
        this.pathList = this.teacherList;
      }
      // 个性化的菜单
      this.personMenu();
      // 获取菜单
      this.getMenu();
    }
  },
  created() {
    // 判断用户类型更改设置
    this.userConfig();
  },
  beforeCreate() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#f7f7f7");
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  }
};
</script>
<style lang="less" scoped>
.box {
  padding: 4% 20px 49px;

  .box-title {
    width: 60px;
    height: 28px;
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #272727;
    letter-spacing: 0;
    font-weight: bolder;
    position: absolute;
    top: 24px;
    left: 20px;

    i {
      background: url("../../../../static/img/back.png") no-repeat center;
      width: 30px;
      height: auto;
      background-size: 10px;
    }
  }
  .box-imgS {
    display: inline-flex;
    width: 100%;
    height: 110px;
    background: #8076fc;
    border-radius: 8px;
    margin-bottom: 4%;
    background-image: url("../../../../static/image/headS.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .box-imgT {
    display: inline-flex;
    width: 100%;
    height: 110px;
    background: #8076fc;
    border-radius: 8px;
    margin-bottom: 4%;
    background-image: url("../../../../static/image/headT.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .box-img {
    padding-left: 1.5rem;
    font-family: SourceHanSansCN-Medium;
    font-size: 22px;
    color: #ffffff;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.09);
    box-sizing: border-box;
  }
  .box-img > span {
    line-height: 110px;
  }
  .box-content,
  .van-collapse-item {
    width: 100%;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-bottom: 4%;
    .item-value {
      width: 100%;
      height: 17px;
      font-family: PingFangSC-Light;
      font-size: 12px;
      color: #212f6e;
      letter-spacing: 0;
      text-align: center;
    }
  }
}
</style>
<style lang="less">
.box-content {
  .van-grid-item__content {
    background-color: transparent;
  }
  .van-collapse-item__title--expanded::after {
    display: none;
  }
  .van-collapse-item__content {
    padding: 0;
  }
  .van-cell__title {
    width: 56px;
    height: 20px;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    letter-spacing: 0;
    font-weight: bolder;
  }
  .van-cell,
  .van-collapse-item__content {
    border-radius: 8px !important;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/Home/Home.vue