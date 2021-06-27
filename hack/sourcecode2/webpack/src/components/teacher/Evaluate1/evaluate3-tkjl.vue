<template>
  <div class="headerBox">
    <Header
      :title="$route.meta.title"
      type="0"
      route="/evaluateSerach"
    ></Header>

    <div>
      <div class="mainContent">
        <div class="eva-detail">
          <p class="eva-num">
            <span>听课记录</span>
          </p>
          <div>
            <div class="text">
              课程号/课程：<span>{{
                (info.kch == "" ? "无" : info.kch) +
                  " / " +
                  (info.kcmc == "" ? "无" : info.kcmc)
              }}</span>
            </div>
            <div class="info">
              <ul>
                <li>
                  被评教师：<span>{{ info.teacherName }}</span>
                </li>
                <li>
                  工号：<span>{{ info.teacherId }}</span>
                </li>
                <li>
                  日期：<span>{{ search.dqsj }}</span>
                </li>
              </ul>
              <ul>
                <li>
                  节次：<span>{{ search.jc }}</span>
                </li>
                <li>
                  教室：<span>{{
                    info.claassRoom[0].jsmc == ""
                      ? "无"
                      : info.claassRoom[0].jsmc
                  }}</span>
                </li>
              </ul>
            </div>
            <!-- 书面申请内容 -->
            <van-field
              class="msg"
              v-model="sqs"
              placeholder="请点击填写"
              rows="14"
              autosize
              type="textarea"
              maxlength="2000"
              show-word-limit
            />
          </div>
        </div>
      </div>
    </div>

    <div class="eva-buttons">
      <button class="pre-topic" @click="savenotes(0)">
        暂存
      </button>
      <button @click="savenotes(1)" class="eva-btn">下一步</button>
    </div>
  </div>
</template>
<script>
import { Api } from "../../../utils/axios";

export default {
  data() {
    return {
      itemList: {},
      sqs: "",
      pj09notesid: "",
      info: {},
      search: {}
    };
  },
  created() {
    this.getInfo();
    console.log(this.$route.query);
    this.info = this.$route.query.params;
    this.search = this.$route.query.searchList;
  },
  methods: {
    // 获取听课记录
    async getInfo() {
      const res = await Api.getnotes();
      if (res.data) {
        this.sqs = res.data.note;
        this.pj09notesid = res.data.pj09notesid;
      }
    },
    // 暂存听课记录
    async savenotes(index) {
      let params = "";
      if (this.sqs) {
        params = {
          pj09notesid: this.pj09notesid,
          note: this.sqs
        };
      } else {
        params = {
          note: this.sqs
        };
      }
      const res = await Api.savenotes(params);
      if (res.code == 1 && index == 0) {
        this.$toast.success("暂存成功~");
      }
      if ((res.code == 1 && index == 1) || !this.sqs) {
        this.send();
      }
    },
    send() {
      this.$router.push({
        path: "/EvaluatessScfj",
        query: {
          evaluationCategoriesId: this.$route.query.evaluationCategoriesId,
          courseId: this.$route.query.courseId,
          teacherId: this.$route.query.teacherId,
          noticeId: this.$route.query.noticeId,
          schoolClassificationId: this.$route.query.schoolClassificationId
        }
      });
    }
  }
};
</script>

<style lang="less">
.eva-detail {
  padding: 0 20px 50px;
  .eva-num {
    color: @attendance-background-color-1;
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .text {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #757da3;
    letter-spacing: 0;
  }
  .info {
    display: flex;
    ul {
      width: 50%;
      font-family: PingFangSC-Light;
      font-size: 14px;
      color: #757da3;
      letter-spacing: 0;
    }
  }
  .van-cell {
    color: @attendance-color-1;
    font-family: PingFangSC;
    font-size: 16px;
    padding: 10px 0;
  }
}
.headerBox {
  /deep/.msg.van-cell.van-field {
    background-color: @attendance-background-color-6;
    .van-field__control {
      &::placeholder {
        color: @attendance-color-2 !important;
      }
    }
  }
}

#text {
  border: 1px solid black;
  margin-top: 10px;
  height: 300px;
}
.mainInfo .van-field__label {
  color: @attendance-color-1 !important;
}
.headerBox {
  width: 90%;
  margin: 0 auto;
}

.item {
  display: block;
  margin-top: 4px;
  color: @attendance-color-2;
  font-size: 14px;
  margin-top: 8px;
}

.one {
  color: @attendance-color-1;
  font-size: 18px;
  font-weight: 600;
}

.btn {
  width: ~"calc(100% - 40px)";
  position: fixed;
  bottom: 20px;
  left: 20px;
}

.headerBox .van-row {
  margin-bottom: 10px;
}

.van-cell {
  .van-field__label {
    flex: 2;
  }
  .van-cell__value {
    flex: 1;
  }
}
.eva-buttons {
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 40px !important;
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
.eva-detail textarea {
  width: 100%;
  padding: 20px;
  background-color: @attendance-background-color-6;
  border-radius: 3px;
  box-sizing: border-box;
  color: @attendance-color-1;
  height: 350px;
}
.eva-detail textarea::placeholder {
  color: @attendance-color-2 !important;
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Evaluate1/evaluate3-tkjl.vue