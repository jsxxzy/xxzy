<template>
  <div class="headerBox">
    <Header :title="$route.meta.title"></Header>

    <div>
      <div class="mainContent">
        <div class="eva-detail">
          <!-- <p class="eva-num">
            <span>分数整改</span>
          </p> -->
          <ul style="padding-top:50px">
            <li style="padding-left:20px;">
              当前分数：<span>{{ itemList.zpf }}</span>
            </li>
            <li style="padding-left:20px">
              要求区间：<span>{{ itemList.ksfs }}-{{ itemList.jsfs }}</span>
            </li>
            <li style="margin:10% 0 5% 0;padding-left:20px;color:red">
              请在上述区间范围内打一个整数值
            </li>
            <li>
              <input type="text" style="width:90%" autofocus v-model="fs" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="eva-buttons">
      <button class="eva-btn" @click="send()" style="width:100%">
        提交评教
      </button>
    </div>
  </div>
</template>
<script>
import { Api } from "../../../utils/axios";
export default {
  data() {
    return {
      itemList: {},
      fs: ""
    };
  },
  created() {
    this.getZF();
  },
  methods: {
    async getZF() {
      const res = await Api.getpjzf({
        pj0502id: this.getCookie("batchId")
      });
      if (res.code == 0) {
        this.$toast(res.msg);
        this.$router.push({
          path: "/evaluateSerach"
        });
      }
      if (res.data.pj09) {
        this.itemList = res.data.pj09;
        document.cookie = "pj09id=" + this.itemList.pj09id;
      }
    },
    getCookie(cookieName) {
      var cookieStr = document.cookie;
      var arr = cookieStr.split("; ");
      var cookieValue = "";
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].split("=");
        if (temp[0] == cookieName) {
          cookieValue = temp[1];
          break;
        }
      }
      return cookieValue;
    },
    async send() {
      var regular = /^[1-9]\d*|0$/; // 正则 ，正整数校验
      if (
        this.fs.trim() &&
        Number(this.fs.trim()) <= Math.floor(Number(this.itemList.jsfs)) &&
        Number(this.fs.trim()) >= Math.ceil(Number(this.itemList.ksfs)) &&
        regular.test(this.fs)
      ) {
        const res = await Api.savepjzf({
          pj09id: this.itemList.pj09id,
          newzpf: this.fs
        });
        if (res.code == 1) {
          this.$toast.success("提交成功~");
          setTimeout(() => {
            this.$router.push("/evaluate1");
          }, 1500);
        } else {
          const ret = await Api.deletePj({
            pj09id: this.itemList.pj09id
          });
          this.$toast(res.errorMessage);
          this.$router.push({
            path: "/evaluateSerach"
          });
        }
      } else {
        this.$toast.fail("请先在上述区间范围内打一个整数值~");
        return;
      }
    }
  }
};
</script>

<style lang="less">
.eva-detail {
  padding: 0 20px 50px;
}
.eva-detail .eva-num {
  color: @attendance-background-color-1;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 30px;
}
.eva-buttons {
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px 0 20px;
  box-sizing: border-box;
  padding-bottom: 20px;
  background-color: @attendance-color-3;
}
.eva-buttons button {
  border-radius: 3px;
  padding: 11px 0;
  width: 45%;
}
.eva-buttons .eva-btn {
  background-color: @attendance-background-color-1;
  color: @attendance-color-3;
}
.eva-buttons .pre-topic {
  background-color: @attendance-background-color-6;
  color: @attendance-background-color-1;
}
/deep/ .van-popup__close-icon--top-right {
  top: 10px;
  right: 10px;
}
.headerBox input {
  margin-left: 20px;
  height: 34px;
  border: 1px solid @attendance-background-color-1;
}
ul li span {
  font-weight: 700;
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Evaluate1/evaluate3-qz.vue