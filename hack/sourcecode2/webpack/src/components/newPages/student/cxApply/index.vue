<template>
  <div class="cx">
    <Header title="重修报名" type="0" route="/homeIndex"></Header>
    <NOdata
      v-if="this.cxList && this.cxList.length == 0"
      title="未查询到重修数据"
    ></NOdata>
    <div class="content">
      <div class="list-item" v-for="(item, index) in cxList" :key="index">
        <div class="item-top">
          <p>{{ item.kcmc }}</p>
          <van-row>
            <van-col span="14">
              <ul>
                <li>
                  是否报名：{{ item.sfbm ? (item.sfbm == 0 ? "×" : "√") : "-" }}
                </li>
                <li>开课院审：{{ item.kkysxs }}</li>
                <li>学年学期：{{ item.xqmc }}</li>
                <li>课程名称：{{ item.kcmc }}</li>
                <li>最好成绩：{{ item.zhcj }}</li>
                <li>
                  替代课程：{{
                    item.tdkch == "" ? "" : "[" + item.tdkch + "]" + item.tdkcmc
                  }}
                </li>
              </ul>
            </van-col>
            <van-col span="8">
              <ul>
                <li>取得资格：{{ item.qdzg ? item.qdzg : "-" }}</li>
                <li>上课院审：{{ item.skysxs }}</li>
                <li>学时：{{ item.zxs }}</li>
                <li>学分：{{ item.xf }}</li>
                <li>替代课程学时：{{ item.tdkczxs }}</li>
                <li>替代课程学分：{{ item.tdkcxf }}</li>
              </ul>
            </van-col>
          </van-row>
        </div>
        <span
          class="bmClass"
          v-if="item.sfbm == '0' && sfkbm == true"
          @click="bm(item)"
        >
          立即报名
        </span>
        <span
          class="qxbmClass"
          v-if="
            item.sfbm == '1' &&
              sfkbm == true &&
              item.sfjf == '0' &&
              item.skys == '0' &&
              item.kkys == '0' &&
              item.sfxk == '0'
          "
          @click="cancelBm(item)"
        >
          取消报名
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { Api } from "@/utils/axios";

export default {
  data() {
    return {
      cxList: {},
      sfkbm: ""
    };
  },
  methods: {
    async getRelearn() {
      const res = await Api.cxbmxk_query();
      if (res.code == "1") {
        this.cxList = res.data[0].dataList;
        this.sfkbm = res.data[0].sfkbm;
      } else {
        this.$toast(res.Msg);
      }
    },
    async cancelBm(item) {
      const params = {
        operate: "qx",
        id: item.cj0721id,
        sfbm: item.sfbm,
        xnxq01id: item.shxq,
        kcid: item.kcid,
        jx0404id: item.jx0404id,
        sfnbm: ""
      };
      const res = await Api.cxbmxk_bm_save(params);
      this.getRelearn();
    },
    async bm(item) {
      const params = {
        operate: "bm",
        id: item.cj0721id,
        sfbm: item.sfbm,
        xnxq01id: item.shxq,
        kcid: item.kcid,
        jx0404id: item.jx0404id,
        sfnbm: ""
      };
      let _this = this;
      const res = await Api.cxbmxk_bm_save(params);
      this.$toast(res.Msg);
      setTimeout(function() {
        if (res.code == "1") {
          _this.getRelearn();
        }
      }, 300);
    }
  },
  created() {
    this.getRelearn();
  }
};
</script>
<style lang="less">
.cx {
  .content {
    padding: 5% 5% 0;
    .list-item {
      background: #f8f8f8;
      border-radius: 5px;
      margin: 0 auto 5%;
      position: relative;
      .item-top {
        padding: 3% 0 3% 6%;

        p {
          height: 42px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #212f6e;
          letter-spacing: 0;
          margin-bottom: 2%;
          font-weight: bolder;
          line-height: 42px;
        }
        ul li {
          font-family: PingFangSC-Light;
          font-size: 12px;
          color: #757da3;
          letter-spacing: 0;
          margin-bottom: 1%;
        }
      }
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #212f6e;
      letter-spacing: 0;
      text-align: right;
      border-top: 1px solid #dee1e9;
      display: block;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      font-weight: bold;
    }
    .bmClass {
      color: #212f6e;
    }
    .qxbmClass {
      color: #f86969;
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/student/cxApply/index.vue