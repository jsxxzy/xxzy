<template>
  <div>
    <Header title="培养方案总纲" type='0' route='/homeIndex'></Header>
    <div class="pyfazgIndex">
      <div class="list-head">
        <p>{{ pyfa.mc }}</p>
        <ul>
          <li>发布人：{{ infoList.publisher }}</li>
          <li>时间：{{ infoList.publishTime }}</li>
          <li>版本：{{ infoList.fosterEdition }}</li>
        </ul>
        <span @click="showPop('培养方案', 'pyfa')">选择</span>
      </div>
      <div class="content">
        <span v-html="infoList.detail"> </span>
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
    /></van-popup>
  </div>
</template>

<script>
import { Api } from "../../../../utils/axios";
export default {
  data() {
    return {
      infoList: {},
      show: false,
      pyfa: { dm: "", mc: "选择" },
      columns: {
        pyfa: []
      },
      valueList: {
        label: "",
        value: "",
        item: ""
      }
    };
  },
  methods: {
    // 弹出选择器
    showPop(label, value) {
      this.show = true;
      this.valueList.label = label;
      this.valueList.value = value;
      this.valueList.item = this.columns[value];
    },
    onConfirm(value, index, value1) {
      this.show = false;
      this[value1].mc = value.text;
      this[value1].dm = value.value;
      // 查询
      this.search();
    },
    // 获取培养方案下拉框
    async getInfo() {
      const res = await Api.teachFosterVertionList();
      for (let item of res.data) {
        this.columns.pyfa.push({
          value: item.versionId,
          text: item.versionName+'培养方案'
        });
      }

      this.pyfa.mc = this.columns.pyfa[0].text;
      this.pyfa.dm = this.columns.pyfa[0].value;

      // 查询
      this.search();
    },
    // 查询
    async search() {
      const params = {
        versionId: this.pyfa.dm
      };
      const res = await Api.teachFosterOutlineDetail(params);
      this.infoList = res.data[0];
    }
  },
  created() {
    // 获取培养方案信息
    this.getInfo();
  }
};
</script>
<style lang="less">
.pyfazgIndex {
  padding: 5% 5% 0;
  .list-head {
    height: 125px;
    background-image: url("../../../../../static/image/head.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    padding: 6% 7%;
    box-sizing: border-box;
    margin-bottom: 10%;
    position: relative;
    flex-direction: column;
    p {
      height: 22px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #fff;
      letter-spacing: 0;
      margin-bottom: 2%;
      font-weight: bold;
    }
    ul li {
      height: 17px;
      font-family: PingFangSC-Light;
      font-size: 12px;
      color: #fff;
      letter-spacing: 0;
      margin-bottom: 1%;
      font-weight: lighter;
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
    p {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #212f6e;
      letter-spacing: 0;
      margin-bottom: 5%;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #757da3;
      letter-spacing: 0;
      text-align: justify;
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/train/pyfazgIndex.vue