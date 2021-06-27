<template>
  <div class="note-class">
    <Header title="教室借用"></Header>
    <div class="asids">
      <span class="c_span"
        >{{ this.teachingBuildingName }} {{ this.classroomName }} ({{
          this.classroomNumber
        }})</span
      >
      <span class="c_span">容量：{{ this.seatNumber }}人</span>
    </div>
    <van-field
      v-model="bz"
      rows="4"
      autosize
      label="教室备注"
      type="textarea"
      disabled
      v-if="schoolCode == '10013'"
    />
    <van-field
      v-model="phone"
      label="联系电话"
      input-align="right"
      placeholder="请输入电话号"
    />
    <van-field
      v-model="person"
      label="审核人"
      input-align="right"
      placeholder="请点击选择"
      @click="peoplePop = true"
      readonly
    />
    <van-field
      v-model="jyyt"
      v-if="schoolCode == '10013'"
      label="借用用途"
      input-align="right"
      placeholder="请点击选择"
      @click="showJyyt = true"
      readonly
    />
    <van-field
      v-if="schoolCode == '10013'"
      v-model="sfdmt"
      label="是否多媒体"
      input-align="right"
      placeholder="请点击选择"
      @click="showSfdmt = true"
      readonly
    />
    <van-field
      v-model="hdrs"
      v-if="schoolCode == '10013'"
      type="digit"
      label="活动人数"
      input-align="right"
      placeholder="请点击填写"
      @keyup="numLimit()"
    />
    <van-field
      v-model="remark"
      :label="schoolCode == '10013' ? '活动说明' : '备注'"
      input-align="right"
      placeholder="请点击填写"
      @click="
        note = true;
        textNote = remark;
      "
    />
    <van-field
      name="fileList"
      input-align="right"
      class="upload-line"
      label="上传附件"
    >
      <template #input>
        <van-uploader
          v-model="fileList"
          accept="*"
          :after-read="afterRead"
          :max-size="2 * 1024 * 1024"
          @oversize="onOversize"
          :max-count="1"
        />
      </template>
    </van-field>
    <van-field
      v-if="schoolCode == '11114'"
      v-model="jylcsm"
      label="借用流程说明"
      row="1"
      autosize
      readonly
      type="textarea"
      input-align="right"
      placeholder=""
    />

    <div class="fo">
      <button @click="Sub()">提交申请</button>
    </div>
    <van-popup v-model="note" position="bottom">
      <div class="popNote">
        <div>
          <i class="closeIcon" @click="note = false"></i>备注
          <i class="conIcon" @click="confirmNote()"></i>
        </div>
        <textarea v-model="textNote" placeholder="请填写"></textarea>
      </div>
    </van-popup>
    <van-popup v-model="jylcsmPop" position="bottom">
      <div class="popNote">
        <div>
          <i class="closeIcon" @click="jylcsmPop = false"></i>借用流程说明
          <i class="conIcon" @click="confirmLc()"></i>
        </div>
        <textarea v-model="jylcsmText" placeholder="请填写"></textarea>
      </div>
    </van-popup>
    <van-popup v-model="peoplePop" position="bottom">
      <div class="apply-pop">
        <div class="pop-title popNote">
          <i class="closeIcon" @click="peoplePop = false"></i>
          <p>审核人</p>
          <i class="conIcon" @click="resetCancel()"></i>
        </div>
        <div class="person">
          <button
            class="per-btn"
            ref="person"
            @click="personTap($event, index)"
            v-for="(item, index) in personList"
            :key="item.id"
          >
            {{ item.name }}
          </button>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showJyyt" position="bottom">
      <van-picker
        show-toolbar
        :columns="jyytList"
        @cancel="showJyyt = false"
        @confirm="onJyyt"
        :item-height="35"
      />
    </van-popup>

    <van-popup v-model="showSfdmt" position="bottom">
      <van-picker
        show-toolbar
        :columns="sfdmtList"
        @cancel="showSfdmt = false"
        @confirm="onSfdmt"
        :item-height="35"
      />
    </van-popup>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";
import tApi from "@/utils/teacher";
import Vue from "vue";
import { Uploader } from "vant";

Vue.use(Uploader);

export default {
  data() {
    return {
      bz: "",
      hdrs: "",
      jyyt: "非教学活动",
      jyytCode: "8",
      jyytList: [],
      jyytCodeList: [],
      showJyyt: false,
      sfdmt: "是",
      sfdmtCode: "0",
      sfdmtList: ["是", "否"],
      showSfdmt: false,
      peoplePop: false,
      jylcsmPop: false,
      people: "",
      RoomList: [],
      textNote: "",
      phone: "",
      remark: "",
      schoolCode: sessionStorage.getItem("schoolCode"),
      classroomCapacity: "",
      startNode: "",
      endnode: "",
      xqmc: "",
      teachingBuildingName: "",
      classroomName: "",
      classroomNumber: "",
      seatNumber: "",
      note: false,
      weeknode: "",
      personList: [
        {
          id: "",
          name: "全部",
          isBtn: 0
        }
      ],
      person: "",
      personId: "",
      reset: "",
      resetId: "",
      jylcsm: "",
      jylcsmText: "",
      file: {},
      fileList: [],
      schoolCode: ""
    };
  },
  methods: {
    async getJyyt() {
      const res = await Api.getJyyt();
      res.data.forEach(item => {
        this.jyytList.push(item.DMMC);
        this.jyytCodeList.push(item.DM);
      });
    },
    numLimit() {
      this.hdrs = parseInt(this.hdrs);
      if (this.hdrs < 0) {
        this.hdrs = Math.abs(this.hdrs);
      }
    },
    //借用用途
    onJyyt(value, index) {
      this.jyyt = value;
      this.showJyyt = false;
      this.jyytCode = this.jyytCodeList[index];
    },
    //是否多媒体
    onSfdmt(value, index) {
      this.sfdmt = value;
      this.showSfdmt = false;
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      this.file = file.file;
    },
    onOversize(file) {
      this.$toast.fail("文件大小不能超过2M");
    },
    resetCancel() {
      this.peoplePop = false;
      this.person = this.reset;
      this.personId = this.resetId;
    },
    getJysm() {
      if (this.schoolCode == "11114") {
        tApi.queryRoomBorrowLcsm().then(res => {
          this.jylcsm = res.data.jylcsm;
        });
      }
    },
    personTap(e, res) {
      let strList = [];
      let idList = [];
      if (this.personList[res].isBtn == 0) {
        this.personList[res].isBtn = 1;
        e.target.className = "cur";
      } else if (this.personList[res].isBtn == 1) {
        this.personList[res].isBtn = 0;
        e.target.className = "per-btn";
      }
      for (let i in this.personList) {
        if (this.personList[res].name == "全部") {
          this.personList[i].isBtn = 0;
          this.personList[res].isBtn = 1;
          this.$refs.person[res].className = "cur";
          this.$refs.person[i].className = "per-btn";
        } else {
          this.personList[0].isBtn = 0;
          this.$refs.person[0].className = "per-btn";
        }
        if (this.personList[i].isBtn == 1) {
          strList = strList.concat(this.personList[i].name);
          idList = idList.concat(this.personList[i].id);
        }
      }
      this.reset = strList.toString();
      this.resetId = idList.toString();
    },
    confirmNote() {
      this.remark = this.textNote;
      this.note = false;
      this.textNote = "";
    },
    async Classroom() {
      const params = {
        classroomNumber: this.classroomNumber,
        classroomCapacity: this.classroomCapacity,
        startNode: this.startNode,
        endnode: this.endnode,
        classroomName: this.classroomName,
        xqmc: this.xqmc
      };
      const res = await Api.teachSaveBorrowingClassrooms(params);
      setTimeout(() => {
        if (res.code == "0") {
          this.$toast(res.Msg);
          setTimeout(() => {
            this.$router.replace("/classroom");
          }, 1500);
        } else {
          this.RoomList = res.data;
        }
      }, 500);
    },
    confirmLc() {
      if (this.jylcsmText.length > 300) {
        this.$toast("说明字符长度不能高于300");
        return;
      }
      this.jylcsm = this.jylcsmText;
      this.jylcsmPop = false;
    },
    async Sub() {
      if (this.hdrs == "" && this.schoolCode == "10013") {
        this.$toast("请填写活动人数");
        return;
      }
      let sub_y = new Date().getFullYear();
      let sub_m = new Date().getMonth() + 1;
      let sub_d = new Date().getDate();
      let sub_h = new Date().getHours();
      let sub_f = "";
      if (new Date().getMinutes() < 10) {
        sub_f = "0" + new Date().getMinutes();
      } else {
        sub_f = new Date().getMinutes();
      }
      let subTime =
        sub_y + "-" + sub_m + "-" + sub_d + " " + sub_h + ":" + sub_f;
      let formData = {
        classroomIds: this.$route.query.id,
        // timeModelId: "",
        week: this.weeknode,
        // weekDetail: this.$route.query.week,
        applyReason: this.remark,
        // borrowTypeCode: "",
        nodeNumber: this.startNode + this.endnode,
        weekday: this.$route.query.day,
        // semesterId: "",
        // useCode: "2",
        phone: this.phone,
        // isMultimediaCode: "1",
        // applyTime: subTime,
        // timeFlag: "1",
        userIds: this.person == "全部" ? "" : this.personId,
        // jylcsm: this.jylcsm
        hdrs: this.hdrs,
        jyyt: this.jyytCode,
        sfdmt: this.sfdmtCode
      };
      if (this.phone !== "" && this.remark !== "") {
        let reg = /^1[3456789]\d{9}$/;
        if (this.phone == "") {
          this.$toast("请输入手机号码");
        } else if (!reg.test(this.phone)) {
          this.$toast("手机格式不正确");
        } else {
          if (this.fileList.length > 0) {
            const ret = await Api.jsjysqUpload({
              file: this.file,
              filename: this.file.name
            });
            if (ret.code == "1") {
              const res = await Api.teachSaveBorrowingClassrooms(formData);
              this.state = res.data;
              if (res.code == "0") {
                // this.$toast.fail(res.Msg);
              } else {
                this.$router.push({
                  path: "/classroom5"
                });
              }
            } else {
              this.$toast.fail(ret.msg);
              return;
            }
          }else{
            const res = await Api.teachSaveBorrowingClassrooms(formData);
              this.state = res.data;
              if (res.code == "0") {
              } else {
                this.$router.push({
                  path: "/classroom5"
                });
              }
          }
        }
      } else {
        this.$toast.fail("请填写完整");
        return false;
      }
    },
    async getPeople() {
      const params = {
        ywcode: "007",
        ywid: ""
      };
      const res = await Api.selectReviewerApi(params);
      let concatList = [];
      res.data.forEach((item, index) => {
        concatList[index] = {
          name: item.userrealname,
          id: item.userid,
          isBtn: 0
        };
      });
      this.personList = this.personList.concat(concatList);
    }
  },
  created() {
    this.bz = this.$route.query.bz == "" ? "无" : this.$route.query.bz;
    this.schoolCode = sessionStorage.getItem("schoolCode");
    if (this.schoolCode == "11114") {
      this.getJyyt();
    }
    this.classroomCapacity = this.$route.query.classroomCapacity;
    this.startNode = this.$route.query.startNode;
    this.endnode = this.$route.query.endnode;
    this.xqmc = this.$route.query.xqmc;
    this.teachingBuildingName = this.$route.query.teachingBuildingName;
    this.classroomName = this.$route.query.classroomName;
    this.classroomNumber = this.$route.query.classroomNumber;
    this.seatNumber = this.$route.query.seatNumber;
    this.weeknode = this.$route.query.week;
    // this.Classroom();

    // 审核人
    this.getPeople();
    this.getJysm();
  }
};
</script>

<style lang="less" scoped>
.note-class {
  /deep/.van-field__label {
    color: @attendance-color-1;
  }
}
.pop-title,
.popNote > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.note-class .person {
  padding: 10px 20px;
  margin-top: 51px;
}
.note-class .person button {
  border-radius: 3px;
  padding: 5px 15px;
  margin-right: 12px;
  margin-bottom: 15px;
  background-color: @attendance-background-color-7;
  color: @attendance-background-color-1;
}
.note-class .person button.cur {
  background-color: @attendance-background-color-1;
  color: @attendance-background-color-7;
}
.popNote i {
  width: 25px;
  height: 25px;
  padding: 13px;
}
.popNote textarea {
  height: 110px;
  padding: 16px;
  color: @attendance-color-2;
  width: 100%;
  box-sizing: border-box;
}
.note-class .van-overlay {
  background-color: rgba(0, 0, 0, 0);
}
.note-class .van-popup.van-popup--bottom {
  box-shadow: 0px -2px 2px 0px rgba(223, 223, 223, 0.5);
}
.popNote .closeIcon {
  background: url(../../../../static/img/close.png) center center no-repeat;
  background-size: 25px 25px;
}
.popNote .conIcon {
  background: url(../../../../static/img/confirm.png) center center no-repeat;
  background-size: 25px 25px;
}
.title {
  line-height: 34px;
  width: 90%;
  margin: 10px auto;
}
.title a {
  text-decoration: none;
  color: @attendance-color-4;
  font-size: 18px;
  font-weight: 600;
}
.apply-pop {
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: @attendance-color-3;
  box-sizing: border-box;
  border-radius: 5px 5px 0 0;
  max-height: 40%;
  overflow-y: scroll;
}
.pop-title {
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  background-color: @attendance-color-3;
  box-sizing: border-box;
  border-radius: 5px 5px 0 0;
  z-index: 9;
}
.title a i {
  text-decoration: none;
  color: @attendance-color-4;
  vertical-align: middle;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(../../../assets/images/back_left.png) center center no-repeat;
  background-size: 100%;
  margin-right: 5px;
}
.asids {
  padding: 0 20px;
  margin-top: 20px;
}
.asids .c_span {
  display: block;
  color: @attendance-color-1;
  font-size: 18px;
  font-weight: 600;
}
.asids .c_span:nth-child(2) {
  color: @attendance-color-2;
  font-size: 12px;
  margin-bottom: 30px;
  margin-top: 10px;
}
.asids p {
  color: @attendance-color-1;
  font-size: 16px;
  width: 100%;
  display: inline-block;
  border-bottom: 1px solid @attendance-border-color-6;
  margin-top: 20px;
  padding-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.asids p span {
  color: @attendance-color-1;
  font-size: 16px;
}
.asids p input {
  width: 105px;
  border: none;
  outline: none;
  height: 24px;
  color: @attendance-color-1;
  font-size: 16px;
  text-align: right;
}
.asids p input::-webkit-input-placeholder {
  text-align: center;
}
.fo {
  width: 90%;
  margin-left: 5%;
}
.fo button {
  display: block;
  text-align: center;
  line-height: 44px;
  width: 90%;
  height: 44px;
  background: @attendance-background-color-1;
  color: @attendance-color-3;
  font-size: 16px;
  border-radius: 3px;
  position: fixed;
  bottom: 20px;
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Classroom/classroom3.vue