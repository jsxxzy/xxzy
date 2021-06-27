<template>
  <div>
    <Header :title="$route.meta.title" type="0" route="/evaluate1"></Header>

    <div class="main">
      <van-cell
        class="title"
        title="当前时间"
        is-link
        :value="dqsj"
        icon="label-o"
        @click="show = true"
      />
      <van-popup v-model="show" position="bottom"
        ><van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="
            (value, index) => {
              onConfirm(value, index, 'dqsj');
            }
          "
          @cancel="show = false"
      /></van-popup>
      <van-field
        left-icon="label-o"
        v-model="ssyx"
        label="所属院系"
        input-align="right"
        placeholder="选填项"
        right-icon="arrow"
        readonly
        @click="showssyx = true"
      />
      <van-popup v-model="showssyx" position="bottom"
        ><van-picker
          show-toolbar
          :columns="ssyxList"
          @confirm="
            (value, index) => {
              onConfirm(value, index, 'ssyx');
            }
          "
          @cancel="showssyx = false"
      /></van-popup>
      <van-cell
        class="title"
        title="节次"
        id="1"
        is-link
        :value="jc"
        icon="label-o"
        @click="show1 = true"
      />
      <van-popup v-model="show1" position="bottom"
        ><van-picker
          show-toolbar
          :columns="columns"
          @confirm="
            (value, index) => {
              onConfirm(value, index, 'jc');
            }
          "
          @cancel="show1 = false"
      /></van-popup>
      <van-field
        left-icon="label-o"
        v-model="js"
        label="教室"
        input-align="right"
        placeholder="选填项"
      />
      <van-field
        left-icon="label-o"
        v-model="jgh"
        label="教师/工号"
        input-align="right"
        placeholder="选填项"
      />
      <van-button
        color="#7469F8"
        class="btn"
        type="primary"
        size="large"
        @click="search"
        >查询</van-button
      >
    </div>
  </div>
</template>
<script>
import { Api } from "../../../utils/axios";
import Vue from "vue";
import { Field } from "vant";
import { DatetimePicker } from "vant";
import { Picker } from "vant";
import { Popup } from "vant";

Vue.use(Popup);
Vue.use(Picker);
Vue.use(DatetimePicker);
Vue.use(Field);
export default {
  data() {
    return {
      ssyx: "",
      jc: "",
      js: "",
      dqsj: "",
      jgh: "",
      show: false,
      show1: false,
      showssyx: false,
      ssyxList: ["全部"],
      columns: [],
      jcList: [],
      itemList: {},
      searchList: {},
      start: "",
      end: "",

      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    };
  },
  methods: {
    async getNode() {
      let concatList = [];
      const res = await Api.getNodeList();

      if (res.data) {
        res.data.forEach(item => {
          concatList.push({
            text: "第" + item.nodeName + "小节",
            value: item.nodeName
          });
        });
      }
      this.columns = [
        {
          values: concatList
        }
        // { values: ["至"] },
        // {
        //   values: concatList,
        //   defaultIndex: 1
        // }
      ];
      this.start = concatList[0].value;
      // this.end = concatList[1].value;
      this.jc = "第" + this.start + "" + this.end + "节";
      this.searchList.jc = this.start + "" + this.end;
    },
    async getSsyx() {
      const res = await Api.getAcademyList({
        yxparam: this.$route.query.yxparam
      });

      res.data.forEach(item => {
        this.ssyxList.push(item.academyName);
      });
    },
    search() {
      if (this.ssyx == "全部") {
        this.searchList.ssyx = "";
      } else {
        this.searchList.ssyx = this.ssyx;
      }
      this.searchList.js = this.js;
      this.searchList.jgh = this.jgh;
      this.$router.push({
        path: "/evaluate21",
        query: {
          searchList: this.searchList
        }
      });
    },
    // 选择器确认
    onConfirm(value, index, name) {
      this.show = false;
      this.show1 = false;
      this.showssyx = false;
      if (name == "dqsj") {
        this[name] =
          value.getFullYear() +
          "-" +
          (value.getMonth() + 1 < 10
            ? "0" + (value.getMonth() + 1)
            : value.getMonth() + 1) +
          "-" +
          (value.getDate() < 10 ? "0" + value.getDate() : value.getDate());

        this.itemList[name] = this[name];
        this.searchList[name] = this[name];
      } else if (name == "jc") {
        this.start = value[0].value;
        // this.end = value[2].value;
        // if(Number(this.end)<=Number(this.start)){
        //   this.$toast('截止节次需要大于起始节次！')
        //   return
        // }
        this.jc = "第" + this.start + "" + this.end + "节";
        this.searchList.jc = this.start + "" + this.end;
      } else if (name == "ssyx") {
        this.ssyx = value;
      } else {
        index += 1;
        this[name] = value;
        this.searchList[name] = "0" + (2 * index - 1) + "0" + 2 * index;
      }
    }
  },
  created() {
    // 获取时间
    this.getNode();
    let day = new Date();
    this.dqsj =
      day.getFullYear() +
      "-" +
      (day.getMonth() + 1 < 10
        ? "0" + (day.getMonth() + 1)
        : day.getMonth() + 1) +
      "-" +
      (day.getDate() < 10 ? "0" + day.getDate() : day.getDate());
    this.searchList.dqsj = this.dqsj;
    this.searchList.jc = "";
    // 获取所属院校列表
    this.getSsyx();
  }
};
</script>
<style lang="less" scoped>
.title {
  line-height: 24px;
  width: 100%;
  color: @attendance-color-1;
}
.btn {
  width: ~"calc(100% - 40px)";
  position: fixed;
  bottom: 20px;
  left: 20px;
}
.van-field {
  font-size: 16px;
}
/deep/ .van-cell.van-field .van-cell__title.van-field__label > span,
.van-cell span {
  color: @attendance-color-1 !important;
}
.main .van-field__label {
  color: @attendance-color-1 !important;
}
.van-cell__value {
  color: @attendance-color-7 !important;
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Evaluate1/evaluate2-serach.vue