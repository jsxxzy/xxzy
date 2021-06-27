<template>
  <div>
    <Header title="专业教学进程" type="0" route="/homeIndex"></Header>
    <div class="teachingProcess">
      <div class="list-head">
        <p>专业名称</p>
        <i>{{ zy }}</i>
        <span @click="showMorePop()">选择</span>
      </div>
      <NOdata
        title="暂无搜索结果~"
        v-if="this.pageData && this.pageData.length == 0"
      ></NOdata>
      <div class="content" v-if="this.type == '0'">
        <div v-for="(item, index) in pageData" :key="index" @click="goItem(item)">
          <p>{{ item.semester }}</p>
          <ul>
            <li>{{ item.classname }}</li>
          </ul>
        </div>
      </div>
      <div class="content" v-else-if="this.type == '1'"></div>
      <div class="content" v-else></div>
    </div>
    <van-popup
      class="more"
      v-model="show1"
      closeable
      @close="close"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <p>{{ title }}</p>
      <van-tabs v-model="active">
        <van-tab
          :title="item.value"
          v-for="(item, index) of valueList1"
          :key="index"
        >
          <ul>
            <li
              v-for="(value, num) of item.item"
              :key="num"
              @click="choose(item, value, index)"
              :class="value.class"
            >
              {{ value.mc }}
              <van-icon :name="value.success" />
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
import { Api } from "../../../../utils/axios";
export default {
  data() {
    return {
      pageData: [],
      type: "0",
      zy: "",
      show1: false,
      active: 0,
      title: "",
      show: false,
      xymc: "",
      sznj: "",
      zymc: "",
      valueList1: [
        {
          label: "学院名称",
          label1: "xymc",
          value: "请选择",
          item: []
        },
        {
          label: "所在年级",
          label1: "sznj",
          value: "",
          item: []
        },
        {
          label: "专业名称",
          label1: "zymc",
          value: "",
          item: []
        }
      ]
    };
  },
  methods: {
    goItem(item) {
      // 跳转教学进度界面
      this.$router.push({
        path: "/speed",
        query: {
          semester: item.semester,
          classId: item.classId,
          academyId: this.xymc,// 院系id
          majorId: this.zymc,// 专业id
          gardeId: this.sznj// 年级id
        }
      });
    },
    // 联动框选择值
    choose(item, value, index) {
      item.value = value.mc;
      item.item.forEach(i => {
        i.class = "";
        i.success = "";
      });
      value.success = "success";
      value.class = "choose";

      this[item.label1] = value.dm;
      this.zy =
        this.valueList1[0].value +
        "-" +
        this.valueList1[1].value +
        "-" +
        this.valueList1[2].value;

      if (this.xymc != "" && this.sznj != "") {
        this.getZymc();
      }
      if (index + 1 == this.valueList1.length) {
        this.show1 = false;
        return;
      }

      this.valueList1[index + 1].value = "请选择";
      this.title = this.valueList1[index + 1].label;
      this.active = index + 1;
    },
    // 关闭联动框
    close() {
      this.active = 0;
    },
    // 弹出选择器
    showMorePop() {
      if (this.valueList1[0].item && this.valueList1[0].item.length > 0) {
        this.title = this.valueList1[0].label;
        this.show1 = true;
      } else {
        this.$toast("暂无数据");
        return;
      }
    },
    // 获取专业名称
    async getZymc() {
      const params = {
        academyId: this.xymc,
        grade: this.sznj
      };
      const res = await Api.getAnnualMajorList(params);
      let list = res.data.map(item => {
        return {
          mc: item.annumajorName,
          dm: item.annumajorId
        };
      });
      this.valueList1[2].item = list;

      if (this.type == "0") {
        this.getZypyfa();
      } else if (this.type == "1") {
        this.getZypyfa();
      } else {
        this.getZypyfa();
      }
    },
    // 获取所在年级
    async getSznJ() {
      const params = {
        semester: ""
      };
      const res = await Api.getGradeList(params);
      let list = res.data.map(item => {
        return {
          mc: item.gradeName,
          dm: item.gradeId
        };
      });
      this.valueList1[1].item = list;
    },
    // 获取学院名称
    async getXymc() {
      const res = await Api.getAcademyList();
      let list = res.data.map(item => {
        return {
          mc: item.academyName,
          dm: item.academyId
        };
      });
      this.valueList1[0].item = list;
    },
    async getZypyfa() {
      const params = {
        academyId: this.xymc,
        majorId: this.zymc,
        gardeId: this.sznj
      };
      const res = await Api.teachTeachingProcess(params);
      this.pageData = res.data;
    }
  },
  created() {
    // 获取所在年级
    this.getSznJ();
    // 获取学院名称
    this.getXymc();
  }
};
</script>
<style lang="less">
.teachingProcess {
  padding: 5% 5% 0;
  .list-head {
    height: 80px;
    background-image: url("../../../../../static/image/head.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    padding: 6% 7%;
    box-sizing: border-box;
    margin-bottom: 5%;
    position: relative;
    flex-direction: column;
    p {
      height: 12px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #fff;
      letter-spacing: 0;
      font-size: 12px;
      color: #fff;
      font-weight: lighter;
      margin-bottom: 2%;
    }
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

    span {
      position: absolute;
      top: 15%;
      right: 7%;
      color: #fff;
      border-radius: 40%;
      font-size: 14px;
      padding: 1% 3%;
      background-color: #8f87f9;
    }
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
}
.more.van-popup.van-popup--bottom {
  border-radius: 0 !important ;
}
.more {
  padding: 5% 0 5% 0;
  box-sizing: border-box;
  overflow: hidden;
  .van-tabs__content--animated {
    height: 75vh;
    overflow: auto;
  }
  .van-tabs--line .van-tabs__wrap {
    border-bottom: 1px solid #f4f4f4;
    .van-tab--active {
      .van-tab__text--ellipsis {
        color: #212f6e !important;
      }
    }
    .van-tab__text--ellipsis {
      height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #8f95b5;
      text-align: center;
      letter-spacing: 0;
    }
    .van-tabs__line {
      background-color: #7469f8 !important;
      width: 25px;
      height: 3px;
      border-radius: 1.5px;
    }
  }
  & > p {
    width: 64px;
    font-weight: bolder;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
    padding-left: 7%;
  }
  ul {
    overflow: auto;
    height: 36vh;
    .choose {
      background-color: #f8f8f8;
    }
    li {
      height: 40px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #212f6e;
      font-weight: bold;
      display: flex;
      align-items: center;
      padding-right: 5%;
      padding-left: 7%;
      justify-content: space-between;
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/train/teachingProcess.vue