<template>
  <div class="advice">
    <Header title="课堂反馈"></Header>
    <div class="head">
      <p>
        <span>{{ num }}</span>
        /
        {{ all }}
      </p>
    </div>
    <div class="content">
      <span v-if="flag">
        <div class="title">{{ problem.ZBMC }}</div>
        <div
          :class="item.class"
          v-for="(item, index) in problem.erzblist"
          :key="index"
          @click="choose(item, $event)"
        >
          {{ String.fromCharCode(65 + index) }}. {{ item.ZBMC }}
        </div>
      </span>
      <span v-else>
        <div class="title">{{ problem.FKFL + problem.JYMC }}</div>
        <div class="text">
          <textarea
            name=""
            id=""
            cols="60"
            rows="30"
            autofocus="autofocus"
            placeholder="请点击填写"
            maxlength="140"
            v-model="text"
          ></textarea>
          <p>140</p>
        </div>
      </span>
    </div>
    <div class="bottom-btn">
      <span v-if="num < all">
        <button v-if="!(num == 1)" @click="last">上一题</button>
        <button :class="num == 1 ? 'single' : ''" @click="next">下一题</button>
      </span>
      <span v-else>
        <button class="single" @click="saveData">保存</button>
      </span>
    </div>
  </div>
</template>
<script>
import { Api } from "@/utils/axios";
export default {
  data() {
    return {
      xnxq: {},
      zc: "",
      fkid: "",
      zbList: [],
      jylbList: [],
      all: 0,
      num: 1,
      problem: {},
      flag: true,
      valuList: [],
      text: ""
    };
  },
  methods: {
    // 选中 题目id 答案id 是否多选
    choose(item, e) {
      // 多选
      if (this.problem.ZBPJLX !== "1" && !!this.valuList[this.num - 1]) {
        let arr = e.srcElement.classList;
        for (let c of arr) {
          if (c == "active") {
            let arr1 = this.valuList[this.num - 1].KTJXFKPJ04ID.split("_");

            for (let i = 0; i < arr1.length; i++) {
              if (item.KTJXFKPJ04ID == arr1[i]) {
                if (arr1.length == 1) {
                  return;
                }
                arr1.splice(i, 1);
                arr1 = arr1.splice(i, 1);
              }
            }
            if (arr1.length == 1) {
              this.valuList[this.num - 1].KTJXFKPJ04ID = arr1[0];
            } else {
              this.valuList[this.num - 1].KTJXFKPJ04ID = arr1.join("_");
            }
            this.saveStyle();
            return;
          }
        }
        this.valuList[this.num - 1].KTJXFKPJ04ID =
          this.valuList[this.num - 1].KTJXFKPJ04ID + "_" + item.KTJXFKPJ04ID;
        this.saveStyle();
        return;
      }
      if (this.problem.ZBPJLX === "1" && !!this.valuList[this.num - 1]) {
        this.valuList[this.num - 1] = {};
      }
      this.valuList[this.num - 1] = {
        num: this.num,
        KTJXFKPJ03ID: item.KTJXFKPJ03ID,
        KTJXFKPJ04ID: item.KTJXFKPJ04ID
      };
      this.saveStyle();
    },
    // 上一题
    last() {
      this.num--;
      if (this.num <= this.zbList.length) {
        this.problem = this.zbList[this.num - 1];
        this.flag = true;
      } else {
        this.problem = this.jylbList[this.num - this.zbList.length - 1];
      }
    },
    saveStyle() {
      if (!!this.valuList[this.num - 1]) {
        for (let j of this.zbList[this.num - 1].erzblist) {
          let arr1 = this.valuList[this.num - 1].KTJXFKPJ04ID.split("_");
          for (let i = 0; i < arr1.length; i++) {
            j.class = "num";
          }
          for (let i = 0; i < arr1.length; i++) {
            if (j.KTJXFKPJ04ID == arr1[i]) {
              j.class = "num active";
            }
          }
        }
      }
      this.$forceUpdate();
    },
    // 下一题
    next() {
      if (this.num == this.all) {
        return;
      }
      if (this.text.trim()) {
        this.valuList[this.num - 1] = {
          num: this.num,
          ktjxfkpj02id: this.problem.KTJXFKPJ02ID,
          text: this.text
        };
      }
      if (!!this.valuList[this.num - 1]) {
      } else {
        this.$toast("请先填写反馈");
        return;
      }

      this.num++;
      if (this.num > this.valuList.length) {
        let childs = document.getElementsByClassName("num");
        for (let i = 0; i < childs.length; i++) {
          childs[i].setAttribute("class", "num");
        }
      }

      if (!!this.zbList[this.num - 1]) {
        this.problem = this.zbList[this.num - 1];
      } else {
        this.flag = false;
        this.problem = {};

        this.problem = this.jylbList[this.num - this.zbList.length - 1];
      }
      this.text = "";
    },
    // 获取题目
    async getData() {
      const res = await Api.getJxfktmda({
        xnxq01id: this.xnxq.value,
        zc: this.zc,
        tkjx_fkid: this.fkid
      });
      if (!!res.data.zblist) {
        this.zbList = res.data.zblist;
        this.zbList.forEach(item => {
          item.erzblist.forEach(val => {
            val.class = "num";
          });
        });
      }
      if (!!res.data.jylblist) {
        this.jylbList = res.data.jylblist;
      }
      this.all = this.zbList.length + this.jylbList.length;
      if (this.zbList.length > 0) {
        this.problem = this.zbList[0];
      } else {
        this.flag = false;
        this.problem = this.jylbList[0];
      }
    },
    // 保存题目
    async saveData() {
      if (this.text.trim()) {
        this.valuList[this.num - 1] = {
          num: this.num,
          ktjxfkpj02id: this.problem.KTJXFKPJ02ID,
          text: this.text
        };
      }
      if (!!this.valuList[this.num - 1]) {
      } else {
        this.$toast("请先填写反馈");
        return;
      }
      let fkpj0304 = [];
      let fkpj02 = [];
      for (let i = 0; i < this.valuList.length; i++) {
        if (i < this.zbList.length) {
          fkpj0304.push(
            this.valuList[i].KTJXFKPJ03ID + "_" + this.valuList[i].KTJXFKPJ04ID
          );
        } else {
          fkpj02.push(
            this.valuList[i].ktjxfkpj02id + "_" + this.valuList[i].text
          );
        }
      }

      fkpj0304 = fkpj0304.join("=") + "";
      fkpj02 = fkpj02.join("=") + "";
      let param = {
        jx0408id: this.$route.query.jx0408id,
        zc: this.zc,
        tkjx_fkid: this.fkid == null ? "" : this.fkid,
        ktjxfkpjxsid: this.$route.query.num,
        fkpj0304: fkpj0304,
        fkpj02: fkpj02
      };
      const res = await Api.xsjxfkSave(param);
      if (res.code == "0") {
        setTimeout(() => {
          this.$router.push({
            path: "/teachAdvice/index"
          });
        }, 1500);
      }else{
        this.$toast.fail('反馈保存失败');
        setTimeout(() => {
          this.$router.push({
            path: "/teachAdvice/index"
          });
        }, 1500);
      }
    }
  },
  created() {
    this.xnxq = this.$route.query.xnxq;
    this.zc = this.$route.query.zc;
    this.fkid = this.$route.query.id;

    this.getData();
  }
};
</script>
<style lang="less" scoped>
.advice {
  padding: 0 5% 0 5%;
  .head p {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #b3b9d0;
    line-height: 25px;
    span {
      font-size: 48px;
      color: #7469f8;
      line-height: 67px;
    }
  }
  .content {
    .title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #757da3;
      line-height: 25px;
      font-weight: 600;
      margin-bottom: 5%;
    }
    .num {
      background: #f8f8f8;
      border-radius: 5px;
      padding: 5%;
      margin-bottom: 5%;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #212f6e;
      line-height: 22px;
      font-weight: 600;
    }
    .active {
      background: #12ddd6;
      border-radius: 5px;
      color: #fff;
    }
    .text {
      background: #f4f5ff;
      textarea {
        background: #f4f5ff;
        border-radius: 3px 3px 0 0;
        resize: none;
        width: 90%;
        height: 300px;
        padding: 5%;
      }
      p {
        background: #f4f5ff;
        text-align: right;
        border-radius: 0 0 3px 3px;
        padding: 5%;
        font-size: 16px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #757da3;
        line-height: 22px;
      }
    }
  }
  .bottom-btn {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    padding: 0 5% 10px 5%;
    background: #fff;

    span {
      display: inline-flex;
      justify-content: space-between;
      width: 100%;
      button:first-child {
        width: 45%;
        height: 44px;
        background: #ecedfd;
        border-radius: 3px;
        color: #7469f8;
      }
      button:last-child {
        width: 45%;
        height: 44px;
        background: #7469f8;
        border-radius: 3px;
        color: #fff;
      }
      .single {
        width: 100% !important;
      }
    }
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/student/classTeachAdvice/content.vue