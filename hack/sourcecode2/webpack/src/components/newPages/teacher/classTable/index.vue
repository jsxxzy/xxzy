<template>
  <div>
    <Header title="班级课表"></Header>
    <div class="classTable">
      <van-field
        v-model="xnxq.mc"
        label="学年学期"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="showPop('学年学期', 'xnxq')"
        readonly
      />
      <van-field
        v-model="sjms.mc"
        label="时间模式"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="showPop('时间模式', 'sjms')"
        readonly
      />
      <van-field
        v-model="skbj"
        rows="1"
        type="textarea"
        maxlength="200"
        autosize
        label="上课班级"
        right-icon="arrow"
        input-align="right"
        placeholder="请点击选择"
        @click="showMorePop()"
        readonly
      />
    </div>
    <div class="bottom-btn" @click="search">
      <button>查询</button>
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
    <van-popup v-model="show" round position="bottom">
      <van-picker
        :title="valueList.label"
        show-toolbar
        :columns="valueList.item"
        @cancel="show = false"
        @confirm="
          (value, index) => {
            onConfirm(value, index);
          }
        "
    /></van-popup>
  </div>
</template>

<script>
import { Api } from "../../../../utils/axios";

export default {
  data() {
    return {
      active: 0,
      title: "",
      show: false,
      show1: false,
      sjms: {},
      xnxq: {},
      yxmc: "",
      sknj: "",
      sszy: "",
      ssbj: "",
      skbj: "",
      columns: {
        sjms: [],
        xnxq: []
      },
      valueList: {
        label: "",
        value: "",
        item: ""
      },
      valueList1: [
        {
          label: "学院名称",
          label1: "yxmc",
          value: "请选择",
          item: []
        },
        {
          label: "上课年级",
          label1: "sknj",
          value: "",
          item: []
        },
        {
          label: "所属专业",
          label1: "sszy",
          value: "",
          item: []
        },
        {
          label: "所属班级",
          label1: "ssbj",
          value: "",
          item: []
        }
      ]
    };
  },
  methods: {
    search() {
      if (this.ssbj == "") {
        this.$toast("请选择上课班级");
        return;
      }
      const params = {
        xnxqId: this.xnxq,
        sjmsId: this.sjms,
        skbjId: this.ssbj
      };
      this.$router.push({
        name: "stuClassTimeTableDetail",
        params: {
          route_params: encodeURI(JSON.stringify(params))
        }
      });
    },
    // 关闭联动框
    close() {
      this.active = 0;
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

      this.skbj =
        this.valueList1[0].value +
        "-" +
        this.valueList1[1].value +
        "-" +
        this.valueList1[2].value +
        "-" +
        this.valueList1[3].value;

      if (!!this.yxmc && !!this.sknj && !!this.sszy) {
        this.getClass();
      } else if (!!this.yxmc && !!this.sknj) {
        this.getNdzy();
      }
      if (index + 1 == this.valueList1.length) {
        this.show1 = false;
        console.log(this.valueList1);
        return;
      }

      this.valueList1[index + 1].value = "请选择";
      this.title = this.valueList1[index + 1].label;
      this.active = index + 1;
    },
    async getList() {
      const res = await Api.classcxtjList();
      // 获取学年学期
      this.getXnxq(res.xnxqdata);
      // 获取时间模式
      this.getSjms(res.sjmsdata);
      // 班级获取联动数据
      this.getMore(res.yxdata, res.njdata);
    },
    //获取班级
    async getClass() {
      const params = {
        academyId: this.yxmc,
        gradeId: this.sknj,
        majorId: this.sszy
      };
      const res = await Api.getClassList(params);

      let skbj = [];
      res.data.forEach(item => {
        let value = {
          mc: item.className,
          dm: item.calssId,
          success: "",
          class: ""
        };
        skbj.push(value);
      });
      this.valueList1[3].item = skbj;

      this.valueList1[3].item.unshift({
        mc: "全部",
        dm: "",
        success: "",
        class: ""
      });
    },
    //获取年度专业
    async getNdzy() {
      const params = {
        academyId: this.yxmc,
        grade: this.sknj
      };
      const res = await Api.getAnnualMajorList(params);

      let ndzy = [];
      res.data.forEach(item => {
        let value = {
          mc: item.annumajorName,
          dm: item.annumajorId,
          success: "",
          class: ""
        };
        ndzy.push(value);
      });
      this.valueList1[2].item = ndzy;
      this.valueList1[2].item.unshift({
        mc: "全部",
        dm: "",
        success: "",
        class: ""
      });
    },
    // 获取学年学期
    getXnxq(data) {
      this.columns.xnxq = data.map(item => {
        return {
          text: item.semestername,
          value: item.semesterid
        };
      });
      this.columns.xnxq.unshift({
        text: "空",
        value: ""
      });
    },
    // 获取时间模式
    getSjms(data) {
      this.columns.sjms = data.map(item => {
        return {
          text: item.kbjcmsmc,
          value: item.kbjcmsid
        };
      });
      this.columns.sjms.unshift({
        text: "空",
        value: ""
      });
    },
    // 获取上课班级
    getMore(yxdata, njdata) {
      let yx = [];
      yxdata.forEach(item => {
        let value = {
          mc: item.academyname,
          dm: item.academyid,
          success: "",
          class: ""
        };
        yx.push(value);
      });
      this.valueList1[0].item = yx;

      let nj = [];
      njdata.forEach(item => {
        let value = {
          mc: item.gradename,
          dm: item.gradeid,
          success: "",
          class: ""
        };
        nj.push(value);
      });
      this.valueList1[1].item = nj;
    },
    // 弹出选择器
    showMorePop() {
      if (this.valueList1[0].item.length <= 0) {
        this.$toast("暂无班级数据");
        return;
      }
      this.title = this.valueList1[0].label;
      this.show1 = true;
    },
    showPop(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];
    },
    onConfirm(value) {
      let value1 = this.valueList.value;
      this.show = false;
      this[value1].mc = value.text;
      this[value1].dm = value.value;
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less">
.classTable {
  padding: 5% 5% 0;

  .van-cell {
    padding: 10px 0;
    border-bottom: 1px solid #f4f4f4;
  }
  .van-cell::after {
    display: none;
  }
  .van-field__label {
    width: 7.2em;
  }
  .van-cell.van-field .van-cell__title.van-field__label > span {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #212f6e;
    letter-spacing: 0;
  }
  .van-field__control::-webkit-input-placeholder {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #dfe0e6 !important;
    letter-spacing: 0;
    font-weight: normal;
    text-align: right;
  }
  .van-field__control::-moz-input-placeholder {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #dfe0e6 !important;
    font-weight: normal;
    letter-spacing: 0;
    text-align: right;
  }
  .van-field__control::-ms-input-placeholder {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #dfe0e6 !important;
    letter-spacing: 0;
    font-weight: normal;
    text-align: right;
  }
  .van-field__control {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #212f6e;
    letter-spacing: 0;
    text-align: right;
    font-weight: bolder;
  }
  .van-icon-arrow {
    color: #dfe0e6;
    font-weight: bolder;
    font-size: 14px;
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
// src/components/newPages/teacher/classTable/index.vue