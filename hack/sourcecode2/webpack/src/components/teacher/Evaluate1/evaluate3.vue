<template>
  <div>
    <Header title="教学评价" type="0" route="/evaluateSerach"></Header>
    <div class="eva-detail">
      <p class="eva-num">
        <span>{{ evaluateIndex + 1 }}</span>
        /{{ this.total }}
      </p>
      <!-- 选项评价 -->
      <div v-for="(item, index) in radioEvaluate" :key="index">
        <template>
          <p class="eva-topic">
            {{ evaluateIndex == index ? item.targetName : "" }}
          </p>
        </template>
        <div class="eva-rate" v-if="evaluateIndex == index">
          <ul>
            <div
              v-for="(oItem, index) in item.optionData"
              :key="oItem.optionId"
            >
              <li
                :class="{ checked: index == isCheck }"
                @click="pickOpt(oItem.optionId, index)"
              >
                {{ index + 1 }}.{{ oItem.optionName }}
              </li>
            </div>
          </ul>
        </div>
      </div>
      <!-- 建议textarea评价 -->
      <template v-if="evaluateIndex >= textIndex">
        <div v-for="(item, index) in textEvaluate" :key="item.suggestTypeId">
          <p class="eva-topic" v-if="evaluateIndex == index + textIndex">
            {{ item.suggestTypeName }}
          </p>
          <div class="eva-rate" v-if="evaluateIndex == index + textIndex">
            <textarea
              name
              placeholder="请点击填写"
              v-model="evaText"
            ></textarea>
            <span>{{ calcNum() }}</span>
          </div>
        </div>
      </template>
    </div>

    <div class="eva-buttons">
      <button class="pre-topic" @click="preTopic()">上一题</button>
      <button
        class="eva-btn"
        @click="nextTopic()"
        v-text="evaluateIndex + 1 == total ? '下一步' : '下一题'"
      ></button>
    </div>
    <!-- <van-popup  
    class="myPop"
    v-model="show"
    closeable
    :style="this.class"
    >
      <ul>
        <li style="padding-left:20px">当前分数：95.33</li>
        <li style="padding-left:20px">符合区间：90-100</li>
        <li style="margin:10% 0 5% 0;padding-left:20px">请在上述区间范围内打一个整数值</li>
        <li><input type="text" style="width:90%" autofocus></li>
      </ul>
    <div class="eva-buttons">
      <button class="eva-btn" style="width:90%">
        确定
      </button>
    </div>
    </van-popup> -->
  </div>
</template>

<script>
import { Api } from "../../../utils/axios";
import Vue from "vue";
import { Popup } from "vant";

Vue.use(Popup);
export default {
  data() {
    return {
      evaluateIndex: 0,
      evaluateList: [],
      textEvaluate: [],
      radioEvaluate: [],
      evaText: "",
      total: "",
      optionList: [],
      pickOptVal: [],
      textVal: [],
      isCheck: null,
      textIndex: "",
      maxNum: "140",
      show: false,
      class: { height: "40%", width: "80%" }
    };
  },
  created() {
    // if (this.$store.state.evaOptCheck[0] != 0) {
    //   this.isCheck = this.$store.state.evaOptCheck[0]
    // } else {
    //   this.isCheck = null;
    // }
    this.getIndex();
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    calcNum() {
      this.maxNum = 140 - this.evaText.length;
      return this.maxNum;
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
    async getIndex() {
      const params = {
        batchId: this.getCookie("batchId"),
        evaluationCategoriesId: this.$route.query.evaluationCategoriesId,
        courseId: this.$route.query.courseId,
        teacherId: this.$route.query.teacherId,
        noticeId: this.$route.query.noticeId,
        schoolClassificationId: this.$route.query.schoolClassificationId
      };
      const res = await Api.teachEvaluationIndex(params);

      this.textEvaluate = res.data.suggestData;
      for (let i = 0; i < res.data.targetData.length; i++) {
        if (res.data.targetData[i].optionData) {
          this.radioEvaluate = this.radioEvaluate.concat(
            res.data.targetData[i]
          );
        }
      }
      this.textIndex = this.radioEvaluate.length;
      this.total = this.textEvaluate.length + this.radioEvaluate.length;
    },
    pickOpt(val, index) {
      this.isCheck = index;
    },
    preTopic() {
      if (this.evaluateIndex == 0) {
        this.$router.go(-1); //返回上一层
      }
      if (this.evaluateIndex > 0) {
        this.evaluateIndex--;
        this.isCheck = this.$store.state.evaOptCheck[this.evaluateIndex];
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
    async evaTap(e) {
      const data = e;
      const res = await Api.teachSaveEvaluate(data);
      if (res.code == "1") {
        this.$toast.success("填写成功~");
        setTimeout(() => {
          this.$router.push("/evaluatessQz");
        }, 1500);
      } else {
        this.$toast(res.errorMessage);
        this.$router.push({
          path: "/evaluateSerach"
        });
      }
      this.show = true;
    },
    nextTopic() {
      this.$store.state.evaOptCheck[this.evaluateIndex] = this.isCheck;
      //无主观评价
      if (this.textEvaluate.length == 0) {
        this.pickOptVal.push({
          targetid: this.radioEvaluate[this.evaluateIndex].targetId,
          targetval: this.radioEvaluate[this.evaluateIndex].optionData[
            this.isCheck
          ].optionId
        });
        if (this.evaluateIndex + 1 < this.total) {
          this.evaluateIndex += 1;
          if (this.$store.state.evaOptCheck[this.evaluateIndex] != 0) {
            this.isCheck = this.$store.state.evaOptCheck[this.evaluateIndex];
          } else {
            this.isCheck = 0;
          }
        } else {
          let formData = {
            evaluationCategoriesId: this.$route.query.evaluationCategoriesId,
            target: this.pickOptVal,
            batchId: this.getCookie("batchId"),
            teacherId: this.$route.query.teacherId,
            noticeId: this.$route.query.noticeId,
            schoolClassificationId: this.$route.query.schoolClassificationId,
            courseId: this.$route.query.courseId,
            suggest: []
          };
          this.evaTap(formData);
        }
        //有主观评价
      } else {
        if (this.evaluateIndex < this.total - this.textEvaluate.length) {
          if (this.isCheck == null) {
            this.$toast.fail("请选择");
          } else {
            this.pickOptVal.push({
              targetid: this.radioEvaluate[this.evaluateIndex].targetId,
              targetval: this.radioEvaluate[this.evaluateIndex].optionData[
                this.isCheck
              ].optionId
            });
            this.evaluateIndex += 1;
            if (this.$store.state.evaOptCheck[this.evaluateIndex] != 0) {
              this.isCheck = this.$store.state.evaOptCheck[this.evaluateIndex];
            } else {
              this.isCheck = 0;
            }
          }
        } else {
          this.textVal.push({
            suggestid: this.textEvaluate[this.evaluateIndex - this.textIndex]
              .suggestTypeId,
            suggestval: this.evaText // this.$store.state.evaTextList[this.textIndex - this.evaluateIndex]
          });
          this.evaText = "";
          let formData = {
            evaluationCategoriesId: this.$route.query.evaluationCategoriesId,
            target: this.pickOptVal,
            batchId: this.getCookie("batchId"),
            teacherId: this.$route.query.teacherId,
            noticeId: this.$route.query.noticeId,
            schoolClassificationId: this.$route.query.schoolClassificationId,
            courseId: this.$route.query.courseId,
            suggest: this.textVal
          };
          if (this.evaluateIndex + 1 < this.total) {
            this.evaluateIndex += 1;
          } else {
            this.evaTap(formData);
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.eva-detail {
  padding: 0 20px 50px;
}
.eva-detail .eva-num {
  color: @attendance-background-color-2;
  font-size: 18px;
}
.eva-detail .eva-num span {
  color: @attendance-background-color-1;
  font-size: 48px;
  font-weight: 600;
}
.eva-detail .eva-topic {
  color: @attendance-color-2;
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
}
.eva-detail .eva-rate {
  margin-top: 20px;
}
.eva-detail .eva-rate ul li {
  padding: 20px;
  font-weight: 600;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: @attendance-background-color-10;
  color: @attendance-color-1;
}
.eva-detail .eva-rate ul li.checked {
  padding: 20px;
  font-weight: 600;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: @attendance-background-color-12;
  color: @attendance-color-3;
}
.eva-detail .eva-rate textarea {
  width: 100%;
  padding: 20px;
  background-color: @attendance-background-color-6;
  border-radius: 3px;
  box-sizing: border-box;
  color: @attendance-color-1;
  height: 350px;
}
.eva-detail .eva-rate textarea::placeholder {
  color: @attendance-color-2;
}
.eva-detail .eva-rate {
  position: relative;
}
.eva-detail .eva-rate span {
  color: @attendance-color-2;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.eva-buttons {
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
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
.myPop {
  border-radius: 10px;
  padding: 50px 20px 0;

  /deep/ .van-popup__close-icon--top-right {
    top: 10px;
    right: 10px;
  }
  input {
    margin-left: 20px;
    height: 34px;
    border: 1px solid @attendance-background-color-1;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Evaluate1/evaluate3.vue