<template>
  <div class="grade-detail">
    <Header title="等级考试报名" type="0" route="/student/gradeExam"></Header>
    <div class="grade">
      <p class="grade-name">
        {{ this.gradeInfo.examinationType }}({{
          this.gradeInfo.examinationGrade
        }})
      </p>
      <p class="grade-info">课程等级：{{ this.gradeInfo.examinationGrade }}</p>
      <p class="grade-info">考试时间：{{ this.gradeInfo.time }}</p>
    </div>

    <div class="grade-input">
      <!-- <div class="grade-item">
        <p>学生姓名</p>
        <input type="text" v-model="studentName" readonly placeholder="请填写姓名"/>
      </div> -->
      <div class="grade-item">
        <p>身份证号</p>
        <input
          type="text"
          v-model="idNum"
          readonly
          placeholder="请填写身份证号"
        />
      </div>
      <div class="grade-item">
        <p>学生编号</p>
        <input
          type="text"
          v-model="studentNum"
          readonly
          placeholder="请填写编号"
        />
      </div>
      <div class="grade-item">
        <p>院校班级</p>
        <input
          type="text"
          placeholder="请填写院校班级"
          readonly
          v-model="academy"
        />
      </div>
      <div class="grade-item">
        <p>联系电话</p>
        <input type="text" placeholder="请填写联系电话" v-model="telNum" />
      </div>
      <div class="grade-item">
        <p>考试类型</p>
        <input
          type="text"
          placeholder="请点击选择"
          readonly
          v-model="testType"
          @click="onType()"
          style="padding-right:15px;"
        />
        <!-- <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @cancel="onCancel" @select="typeSelect"/> -->
        <i :class="testType == '' ? 'arrow' : 'arrow-act'"></i>
      </div>
      <div
        class="grade-item"
        v-if="this.testType == '补考机试' || this.testType == '补考笔试'"
      >
        <p>上次准考证号</p>
        <input type="text" placeholder="请填写准考证号" v-model="lastNum" />
      </div>
      <van-field
        label="上传附件"
        input-align="right"
        readonly
        class="grade-item"
      >
        <template #input>
          <van-uploader
            v-model="fileList"
            :after-read="afterRead"
            :max-size="10 * 1024 * 1024"
            @oversize="onOversize"
            :max-count="1"
          /> </template
      ></van-field>
    </div>
    <div class="grade-sub" v-if="isFocus">
      <p>请确认身份证信息无误后再提交</p>
      <button @click="submitApply()">提交申请</button>
    </div>
    <van-popup v-model="show" position="bottom">
      <van-picker
        show-toolbar
        :columns="actions"
        @cancel="show = false"
        @confirm="typeSelect"
        :item-height="itemHeight"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
import { ActionSheet } from "vant";
import { baseURL } from "../../utils/baseUrl";
import { Api } from "../../utils/axios";
import { Toast } from "vant";
export default {
  data() {
    return {
      file: {},
      fileList: [],
      lastNum: "",
      gradeInfo: [],
      studentName: "",
      idNum: "",
      isFocus: true,
      studentNum: "",
      academy: "",
      telNum: "",
      testType: "全报",
      cost: "",
      show: false,
      typeNum: "0",
      schoolCode: "",
      itemHeight: 35,
      actions: [
        {
          values: ["全报", "补考机试", "补考笔试"],
          defaultIndex: 0
        }
      ]
    };
  },
  created() {
    this.schoolCode = sessionStorage.getItem("schoolCode");
    this.getMy();

    if (this.schoolCode == "12425") {
      this.testType = "";
      this.actions = [
        {
          values: ["", "全报", "报名费用"],
          defaultIndex: 0
        }
      ];
      this.getOpenid();
    }
    this.gradeInfo = JSON.parse(this.$route.query.info);
    this.cost = this.gradeInfo.cost;
  },
  mounted() {
    window.onresize = function() {
      if (window.innerHeight < 600) {
        this.isFocus = false;
      }
    };
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      this.file = file.file;
    },
    onOversize(file) {
      this.$toast.fail("文件大小不能超过10M");
    },
    getParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    getOpenid() {
      this.code = this.getParam("code");
      if (this.code == sessionStorage.getItem("code")) {
        var str = window.location.href; // str = 'https://localhost:8080/mark'
        var index = str.lastIndexOf("?");
        str = str.replace("code=" + this.code, "");
        window.location.href = str;
        this.code = "";
      }

      if (this.code === null || this.code === "") {
        // 跳转至授权地址，该地址只支持微信浏览器打开
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx750b00e3b4bf2737&redirect_uri=" +
          encodeURIComponent(window.location.href) +
          "&response_type=code&scope=snsapi_base&state=9oJrpQhTVCAzkl2gXZPATSo9kn000002#wechat_redirect";
        var url = window.location.href;
        this.$http.post(url, {});
      } else {
        // 获取openid
        this.$http.post(
          "http://bkjf.hngczy.cn/bzb_njwhd/wxPay/auth?code=" +
            this.code +
            "&state=" +
            this.gradeInfo.gradeid
        );
      }
      sessionStorage.setItem("code", this.code);
    },
    async pay() {
      this.$toast(this.cost);
      const res = await Api.wxpayGrade({
        gradeid: this.gradeInfo.gradeid,
        cost: this.cost,
        examinationType: this.gradeInfo.examinationType
      });
      let that = this;
      // this.weixinList = res.data;
      if (res.code == 1) {
        if (this.code !== null && this.code !== "") {
          function onBridgeReady() {
            WeixinJSBridge.invoke("getBrandWCPayRequest", res.data, function(
              res
            ) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                // this.getWeiXinPayStatus();
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                Toast({
                  message: "支付成功",
                  duration: 1500,
                  forbidClick: true,
                  onClose: function() {
                    that.$router.replace("/student/gradeExam");
                  }
                });
              }
            });
          }
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener(
                "WeixinJSBridgeReady",
                onBridgeReady,
                false
              );
            } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
              document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
          } else {
            onBridgeReady();
            Toast({
              message: "开始,state" + this.state,
              duration: 1500,
              forbidClick
            });
          }
        }
      } else {
        this.$toast.fail(res.msg);
      }
    },
    async getMy() {
      const res = await Api.getStuInfo();
      this.idNum = res.data[0].idno;
      this.studentNum = res.data[0].studentID;
      this.academy = res.data[0].academy + "-" + res.data[0].className;
      this.studentName = res.data[0].name;
      this.telNum = res.data[0].dh;
    },
    async saveTap() {
      let params = {
        trainingType: "",
        examinationType: this.typeNum,
        skdjsjid: this.gradeInfo.gradeid,
        telephone: this.telNum.trim(),
        lastTicketNumber: this.lastNum,
        file:this.file
      };
      if (this.schoolCode === "12425") {
        if (this.typeNum === 1) {
          this.typeNum = 0;
        }
        params = {
          trainingType: "",
          examinationType: this.typeNum,
          skdjsjid: this.gradeInfo.gradeid,
          telephone: this.telNum.trim(),
          lastTicketNumber: this.lastNum
        };
      }
      const res = await Api.gradeExaminationSave(params);
      if (res.code == "1") {
        if (sessionStorage.getItem("schoolCode") == "12425") {
          this.pay();
          return;
        }
        this.$router.push({
          path: "/student/gradeExam"
        });
      } else {
        this.$toast(res.Msg);
      }
    },
    onCancel() {
      this.show = false;
    },
    onType() {
      this.show = true;
    },
    typeSelect(item, index) {
      this.testType = item;
      this.typeNum = Number(index);
      this.show = false;

      if (this.schoolCode == "12425") {
        if (this.typeNum == 0) {
          this.cost = "";
        } else if (this.typeNum == 1) {
          this.cost = this.gradeInfo.cost;
        } else {
          this.cost = this.gradeInfo.bscost;
        }
      } else {
        this.cost = this.gradeInfo.cost;
      }
    },
    submitApply() {
      let reg = /^1[3456789]\d{9}$/;
      if (this.schoolCode == "12425") {
        if (this.telNum == "") {
          this.$toast.fail("请填写完整信息");
        } else if (!reg.test(this.telNum.trim())) {
          this.$toast.fail("请填写有效手机号");
        } else if (this.testType == "") {
          this.$toast.fail("请填写完整信息");
        } else {
          this.saveTap();
        }
        return;
      }

      if (this.telNum == "") {
        this.$toast.fail("请填写完整信息");
      } else if (!reg.test(this.telNum.trim())) {
        this.$toast.fail("请填写有效手机号");
      } else if (this.testType != "全报" && this.lastNum == "") {
        this.$toast.fail("请填写完整信息");
      } else {
        this.saveTap();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.grade {
  padding: 20px 20px 5px;
}
.grade p {
  margin-bottom: 8px;
}
.grade .grade-name {
  color: @attendance-color-1;
  font-size: 18px;
  font-weight: 700;
}
.grade .grade-info {
  color: @attendance-color-2;
  font-size: 14px;
}
.grade-input {
  padding: 10px 20px;
  margin-bottom: 100px;
}
.grade-input .grade-item {
  padding: 0px 0 9px;
  border-bottom: 1px solid @attendance-border-color-6;
  display: flex;
  color: @attendance-color-1;
  margin-top: 20px;
  align-items: center;
}
.grade-input .grade-item input {
  text-align: right;
  flex: 1;
  color: @attendance-color-1;
  font-size: 16px;
  font-weight: 700;
  padding-left: 20px;
}
.grade-input .grade-item input::placeholder {
  color: @attendance-background-color-2;
  font-weight: 400;
}
.grade-sub {
  text-align: center;
  width: 100%;
  padding-bottom: 20px;
  background-color: @attendance-color-3;
  bottom: 0;
  position: fixed;
}
.grade-sub p {
  color: @attendance-color-2;
  margin: 20px 0 2px;
  font-size: 12px;
  line-height: 16px;
}
.grade-sub button {
  padding: 11px 0;
  color: @attendance-color-3;
  background-color: @attendance-background-color-1;
  border-radius: 3px;
  width: 90%;
}
.icon-success {
  background: url(../../../static/img/success.png) no-repeat center;
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  display: block;
}
.grade-item > i {
  width: 15px;
  height: 15px;
}
.arrow {
  background: url(../../../static/img/arrow_r.png) no-repeat center;
  background-size: 15px 15px;
}
.arrow-act {
  background: url(../../../static/img/arrow.png) no-repeat center;
  background-size: 8px 11px;
}
.grade-detail .van-picker-column__item {
  margin: 0 30%;
}
.grade-detail
  .van-ellipsis.van-picker-column__item.van-picker-column__item--selected {
  font-weight: 600;
  color: @attendance-color-1;
  border-top: 1px solid @attendance-background-color-2;
  border-bottom: 1px solid @attendance-background-color-2;
}
</style>
<style lang="less">
.van-cell.van-field .van-cell__title.van-field__label>span {
  color: #212F6E !important;
}
</style>



// WEBPACK FOOTER //
// src/components/student/gradeDetail.vue