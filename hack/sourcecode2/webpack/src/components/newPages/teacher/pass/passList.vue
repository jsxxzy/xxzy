<template>
  <div>
    <div class="passList">
      <van-search
        v-model="value"
        placeholder="请输入关键词"
      />
      <NOdata
        v-if="this.dealList.length == 0"
        title="未查询到处理信息"
      ></NOdata>
      <div v-else class="content">
        <div v-for="(item, index) of dealList" :key="index">
          <p>{{ item.lcmc }}</p>
          <ul>
            <li>申请人：{{ item.shmc }}</li>
            <li>创建时间：{{ item.shsj }}</li>
          </ul>
          <!-- <span class="iconfont icon iconicon-test"></span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";

export default {
  data() {
    return {
      value: "",
      list: []
    };
  },
  methods: {
    // 获取待处理list
    async getDeal() {
      const res = await Api.historyTask({
        lcmc:'成绩录入审核',
        shmc:''
      });
      this.list = res.data;
    }
  },
  created() {
    // 获取待处理list
    this.getDeal();
  },
  computed: {
    dealList: function() {
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
<style lang="less" scoped>
.passList {
  padding: 5% 5% 0;
  .van-search {
    padding: 0;
    height: 44px;
    background: #f4f5ff;
    border-radius: 3px;
    margin-bottom: 7%;
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
  .icon {
    font-size: 12px;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/pass/passList.vue