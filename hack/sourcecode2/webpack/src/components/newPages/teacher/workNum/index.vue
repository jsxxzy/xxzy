<template>
  <div>
    <Header title="工作量查询"></Header>
    <div class="work">
      <div class="work-head">
        <div>
          <p>学年学期</p>
          <span @click="showPop('学年学期', 'xnxq')">
            <i>{{ xnxq }}</i>
            <b></b>
          </span>
        </div>
        <div>
          <p>计算范围</p>
          <span @click="showPop('计算范围', 'jsfw')">
            <i>{{ jsfw }}</i>
            <b></b>
          </span>
        </div>
      </div>
      <div class="work-content">
        <span>总工作量：{{ zgzl }}</span>
        <NOdata title="暂无数据" v-if="workList.length == 0"></NOdata>
        <div class="work-item" v-for="(item, index) of workList" :key="index">
          <p>{{ item.kcmc }}</p>
          <div class="work-main">
            <div>
              <ul>
                <li>工作量：{{ item.gzl }}</li>
                <li>总学时：{{ item.zxs }}</li>
                <li>周学时：{{ item.zhxs }}</li>
                <li>上课周数：{{ item.skzs }}</li>
                <li>学生数：{{ item.xss }}</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>学时分类：{{ item.xsfl }}</li>
                <li>课程分类：{{ item.kcfl }}</li>
                <li>班级数：{{ item.bjs }}</li>
                <li>班级名称：{{ item.bjmc }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
import Vue from "vue";
import { Picker } from "vant";
import { Api } from "@/utils/axios";

Vue.use(Picker);
export default {
  data() {
    return {
      show: false,
      xnxq: "",
      jsfw: "",
      jsfwid: "",
      zgzl: "240",
      workList: [],
      columns: {
        xnxq: [],
        jsfw: []
      },
      valueList: {
        label: "",
        value: "",
        item: []
      }
    };
  },
  created() {
    // 查询条件和列表
    this.getSearchData();
  },
  methods: {
    // 查询学年学期和计算范围
    getSearchData() {
      Api.getQueryCriteria().then(res => {
        this.dataList = res.data;
        this.columns.xnxq = [];
        this.columns.jsfw = [];

        const data = res.data.filter((r, i) => i == 0);

        this.xnxq = data[0].xnxqh;
        this.jsfw = data[0].jsfws[0].jsfwmc;
        this.jsfwid = data[0].jsfws[0].jsfwdm;

        res.data.length > 0 &&
          res.data.forEach((item, index) => {
            this.columns.xnxq.push(item.xnxqh);

            if (item.xnxqh == this.xnxq) {
              item.jsfws.forEach(list => {
                this.columns.jsfw.push({
                  text: list.jsfwmc,
                  value: list.jsfwdm
                });
              });
            }
          });

        this.getWorkList();
      });
    },
    // 获取工作量记录
    getWorkList() {
      const params = {
        xnxqh: this.xnxq,
        jsfwdm: this.jsfwid
      };
      Api.getWorkloadList(params).then(res => {
        this.zgzl = res.Topdata.zgzl;
        this.workList = res.data;
      });
    },
    // 弹出选择器
    showPop(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];
    },
    onConfirm(value, index, value1) {
      if (value1 == "jsfw") {
        this.jsfw = value.text;
        this.jsfwid = value.value;
      } else if (value1 == "xnxq") {
        this.xnxq = value;
        let column = [];

        this.dataList.forEach((item, index) => {
          if (item.xnxqh == value) {
            item.jsfws.forEach(list => {
              column.push({
                text: list.jsfwmc,
                value: list.jsfwdm
              });
            });
          }
        });
        this.columns.jsfw = column;

        this.jsfw = this.columns.jsfw[0].text;
        this.jsfwid = this.columns.jsfw[0].value;
      }
      this.getWorkList();
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.work {
  padding: 4% 5% 0;
  .work-head {
    height: 80px;
    background-image: url("../../../../../static/image/head.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    padding: 6% 7%;
    box-sizing: border-box;
    margin-bottom: 8%;

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
  .work-content {
    span {
      height: 25px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #212f6e;
      letter-spacing: 0;
      font-weight: bolder;
      margin-bottom: 6%;
      display: inline-block;
    }
    .work-item {
      background: #f8f8f8;
      border-radius: 5px;
      padding: 3% 0 3% 6%;
      margin-bottom: 5%;
      p {
        height: 22px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #212f6e;
        letter-spacing: 0;
        font-weight: bolder;
        margin-bottom: 2%;
      }
      .work-main {
        display: flex;
        div {
          width: 50%;
          display: flex;
          ul li {
            margin: 0;
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
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/workNum/index.vue