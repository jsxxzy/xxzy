<template>
  <div>
    <Header title="调课申请"></Header>
    <div class="exchangeI">
      <van-tabs v-model="active" type="line" sticky animated>
        <van-tab title="调课申请" :disabled="isAble">
          <div class="applyInfo">
            <p>{{ itemList.courseName }}</p>
            <ul>
              <li>
                周次：<span>{{ itemList.week }}</span>
              </li>
              <li>
                时间：<span>{{ itemList.weekNote }}</span>
              </li>
              <li>
                地点：<span>{{ itemList.classRoom }}</span>
              </li>
              <li>
                班级：<span>{{ itemList.className }}</span>
              </li>
            </ul>
          </div>
          <div class="apply">
            <van-field
              v-model="tkfs.mc"
              label="调课方式"
              left-icon="eye-o"
              right-icon="arrow"
              input-align="right"
              placeholder="请点击选择"
              @click="onShow('调课方式', 'tkfs')"
              readonly
            />
            <van-field
              v-model="tklx"
              label="调课类型"
              left-icon="eye"
              right-icon="arrow"
              input-align="right"
              placeholder="请点击选择"
              @click="onShow('调课类型', 'tklx')"
              readonly
            />
            <!-- 调课类型转换 -->

            <span v-if="showType">
              <van-field
                v-model="jxbgzc"
                :label="tkType[3] ? '停课周次' : '教学变更周次'"
                left-icon="like"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="
                  onShow(tkType[3] ? '停课周次' : '教学变更周次', 'jxbgzc')
                "
                v-if="tkType[1] || tkType[2] || tkType[3] || tkType[4]"
                readonly
              />
              <van-field
                v-model="bgls.mc"
                :label="tkType[4] ? '可选老师' : '变更老师'"
                left-icon="fire"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="onShow1"
                v-if="tkType[2] || tkType[4]"
                readonly
              />
              <van-field
                v-model="ddkb.mc"
                label="对调课表"
                left-icon="fire-o"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="onShow('对调课表', 'ddkb')"
                v-if="tkType[4]"
                readonly
              />
              <van-field
                v-model="xq.mc"
                label="星期几"
                left-icon="like-o"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="onShow('星期几', 'xq')"
                v-if="!tkType[3] && !tkType[4]"
                readonly
              />
              <van-field
                v-model="qzjc.mc"
                label="起止节次"
                left-icon="location-o"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="onShow('起止节次', 'qzjc')"
                v-if="!tkType[3] && !tkType[4]"
                readonly
              />
              <van-field
                v-model="dd.mc"
                label="地点"
                left-icon="location"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="onShow('地点', 'dd')"
                v-if="!tkType[3] && !tkType[4]"
                readonly
              />
              <van-field
                v-model="shr.mc"
                label="审核人"
                left-icon="smile"
                right-icon="arrow"
                input-align="right"
                placeholder="请点击选择"
                @click="show1 = true"
                readonly
              />
              <van-field
                v-model="tkyy"
                rows="1"
                autosize
                left-icon="smile-o"
                label="调课原因"
                type="textarea"
                maxlength="200"
                placeholder="请点击填写"
              />
              <van-field
                label="上传附件"
                left-icon="setting"
                input-align="right"
                readonly
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
            </span>
          </div>
        </van-tab>
        <van-tab title="申请记录">
          <div class="applyList">
            <van-dropdown-menu active-color="#7469F8">
              <van-dropdown-item
                ref="oid"
                v-model="optionDM"
                :options="option"
                @change="change"
              />
            </van-dropdown-menu>
            <div class="list">
              <NOdata
                v-if="this.applyList.length == 0"
                title="未查询到调课记录"
              ></NOdata>
              <div
                v-else
                class="list-item"
                v-for="(item, index) of applyList"
                :key="index"
                @click="goRecord(item)"
              >
                <p>{{ item.courseName }}</p>
                <ul>
                  <li>调课方式：{{ item.changeMode }}</li>
                  <li>调课类型：{{ item.changeTypeName }}</li>
                </ul>
                <span :class="item.class">{{ item.auditStateName }}</span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>

      <div class="bottom-btn" v-if="active == 0">
        <button @click="preSub">提交申请</button>
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        :title="valueList.label"
        show-toolbar
        :columns="valueList.item"
        @confirm="
          (value, index) => {
            onConfirm(value, index, valueList.value);
          }
        "
        @cancel="show = false"
      />
    </van-popup>
    <van-popup v-model="show1" position="bottom">
      <div class="apply-pop">
        <div class="pop-title">
          <i class="close-icon" @click="show1 = false"></i>
          <p>审核人</p>
          <i class="confirm-icon" @click="resetCancel()"></i>
        </div>
        <div class="person">
          <button
            class="per-btn"
            ref="person"
            v-for="(item, index) in shrList"
            @click="personTap($event, index)"
            :key="item.id"
          >
            {{ item.name }}
          </button>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="show3"
      position="bottom"
      class="alter-pop"
      style="min-height:100%"
    >
      <alterTeacher @closePop="closeBgls" :isRadio="false"></alterTeacher>
    </van-popup>
  </div>
</template>

<script>
import { Api } from "../../../../utils/axios";
import alterTeacher from "../../../common/alterTeacher";
import Vue from "vue";
import {
  Tab,
  Tabs,
  Cell,
  CellGroup,
  DropdownMenu,
  DropdownItem,
  Popup,
  Picker,
  Field
} from "vant";

Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Field);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Tab);
Vue.use(Tabs);
export default {
  data() {
    return {
      file: {},
      fileList: [],
      isAble: false,
      showType: false,
      tkType: [false, false, false, false, false],
      active: 0,
      itemList: {},
      show: false,
      show1: false,
      show3: false,
      tkfs: { mc: "", dm: "" },
      tklx: "",
      jxbgzc: "",
      bgzc: [],
      xq: {},
      qzjc: {},
      dd: {},
      shr: {},
      ddkb: {},
      reset: "",
      resetId: "",
      tkyy: "",
      bgls: { mc: "", dm: "" },

      tkfsList: { dm: [], mc: [] },
      tklxList: [],
      jxbgzcList: [
        {
          values: [],
          className: "column1"
        },
        {
          values: [],
          className: "column2",
          defaultIndex: 1
        }
      ],
      xqList: [],
      qzjcList: { dm: [], mc: [] },
      ddList: { dm: [], mc: [] },
      shrList: [
        {
          id: "",
          name: "全部",
          isBtn: 0
        }
      ],
      valueList: {
        label: "",
        value: "",
        item: []
      },
      columns: {
        tkfs: [],
        tklx: [],
        jxbgzc: [],
        xq: [],
        qzjc: [],
        dd: [],
        shr: [],
        ddkb: []
      },
      optionDM: "全部",
      option: [
        { text: "全部", value: "全部" },
        { text: "审核中", value: "审核中" },
        { text: "未通过", value: "不通过" },
        { text: "已通过", value: "已通过" },
        { text: "待审核", value: "待审核" }
      ],
      applyList: [],
      allList: [],
      schoolCode: ""
    };
  },
  watch: {
    active(val) {
      if (val == 1) {
        // 获取调课记录
        this.getApply();
      }
    },
    "tkfs.mc": {
      handler(val, oldVal) {
        if (val != oldVal && oldVal != "") {
          this.tklx = "";
          this.tkType = [false, false, false, false, false];
          this.showType = false;
        }
      },
      deep: true
    },
    tklx(val, oldVal) {
      if (val != oldVal) {
        this.jxbgzc = "";
        this.bgls = {};
        this.bgzc = [];
        this.xq = {};
        this.qzjc = {};
        this.dd = {};
        this.shr = {};
        this.ddkb = {};
      }
    }
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      this.file = file.file;
    },
    onOversize(file) {
      this.$toast.fail("文件大小不能超过10M");
    },
    // 跳转到记录详情界面
    goRecord(item) {
      this.$router.push({
        path: "/noStop",
        query: {
          changeId: item.changeId
        }
      });
    },
    // 提交申请前判断是否有附件上传
    async preSub() {
      let formData = {};
      if (this.tklx == "") {
        this.$toast("请先选择调课类型");
        return false;
      }

      if (this.tklx == "整体调课") {
        if (JSON.stringify(this.xq) == "{}") {
          this.$toast("请选择星期");
          return false;
        }
        if (JSON.stringify(this.qzjc) == "{}") {
          this.$toast("请选择起止节次");
          return false;
        }
        if (JSON.stringify(this.dd) == "{}") {
          this.$toast("请选择地点");
          return false;
        }
        if (this.tkyy == "") {
          this.$toast("请填写调课原因");
          return false;
        }
        formData = {
          coursePlanId: this.itemList.coursePlanId,
          changeType: this.$route.query.isEx ? "6" : "0",
          classroomId: this.dd.dm,
          weekNote: this.qzjc.dm,
          week: "",
          teacherId: "",
          changeMode: this.tkfs.dm,
          applyReason: this.tkyy,
          oldWeek: this.itemList.week,
          userIds: this.shr.dm
        };
      } else if (this.tklx == "部分调课") {
        if (JSON.stringify(this.xq) == "{}") {
          this.$toast("请选择星期");
          return false;
        }
        if (JSON.stringify(this.qzjc) == "{}") {
          this.$toast("请选择起止节次");
          return false;
        }
        if (JSON.stringify(this.dd) == "{}") {
          this.$toast("请选择地点");
          return false;
        }
        if (this.tkyy == "") {
          this.$toast("请填写调课原因");
          return false;
        }
        formData = {
          coursePlanId: this.itemList.coursePlanId,
          changeType: "1",
          classroomId: this.dd.dm,
          weekNote: this.qzjc.dm,
          week: this.bgzc[1],
          teacherId: "",
          changeMode: this.tkfs.dm,
          applyReason: this.tkyy,
          oldWeek: this.bgzc[0],
          userIds: this.shr.dm
        };
      } else if (this.tklx == "变更老师") {
        if (JSON.stringify(this.bgls) == "{}") {
          this.$toast("请选择变更老师");
          return false;
        }
        if (JSON.stringify(this.xq) == "{}") {
          this.$toast("请选择星期");
          return false;
        }
        if (JSON.stringify(this.qzjc) == "{}") {
          this.$toast("请选择起止节次");
          return false;
        }
        if (JSON.stringify(this.dd) == "{}") {
          this.$toast("请选择地点");
          return false;
        }
        if (this.tkyy == "") {
          this.$toast("请填写调课原因");
          return false;
        }

        formData = {
          coursePlanId: this.itemList.coursePlanId,
          changeType: "5",
          classroomId: this.dd.dm,
          weekNote: this.qzjc.dm,
          week: this.bgzc[1],
          teacherId: this.bgls.dm,
          changeMode: this.tkfs.dm,
          applyReason: this.tkyy,
          oldWeek: this.bgzc[0],
          userIds: this.shr.dm
        };
      } else if (this.tklx == "停课") {
        if (this.bgzc == "") {
          this.$toast("请选择停课周次");
          return false;
        }
        if (this.tkyy == "") {
          this.$toast("请填写调课原因");
          return false;
        }
        formData.coursePlanId = this.itemList.coursePlanId; //课表id
        formData.changeType = "2"; //调课类型
        formData.weekNote = this.itemList.weekNote; //星期节次
        formData.week = this.bgzc[0]; //周次
        formData.changeMode = this.tkfs.dm; //调课方式
        formData.oldWeek = this.itemList.week; //原周次
        formData.userIds = this.shr.dm; //审核人IDS
        formData.applyReason = this.tkyy; //调课原因
      } else if (this.tklx == "课程对调") {
        if (this.bgzc == "") {
          this.$toast("请填写教学变更周次");
          return false;
        }
        if (JSON.stringify(this.bgls) == "{}") {
          this.$toast("请选择可选老师");
          return false;
        }
        if (JSON.stringify(this.ddkb) == "{}") {
          this.$toast("请选择对调课表");
          return;
        }

        formData = {
          coursePlanId: this.itemList.coursePlanId,
          changeType: "6",
          // classroomId:this.classRoomId,
          // weekNote:this.nodeId,
          week: this.bgzc[0],
          teacherId: this.bgls.dm,
          changeMode: this.tkfs.dm,
          // applyReason:this.textarea,
          oldWeek: this.itemList.week,
          userIds: this.shr.dm,
          ddCoursePlanId: this.ddkb.dm
        };
      }
      if (JSON.stringify(this.shr) == "{}") {
        this.$toast("请选择审核人");
        return;
      }

      if (this.fileList.length > 0) {
        const ret = await Api.jsjysqUpload({
          file: this.file,
          filename: this.file.name
        });
        if (ret.code == 1) {
          this.sub(formData);
        } else {
          this.$toast.fail(msg);
          setTimeout(function() {
            this.$router.go(-2);
          }, 1500);
        }
      } else {
        this.sub(formData);
      }
    },
    // 提交申请
    async sub(formData) {
      const data = {
        formData: formData
      };
      const res = await Api.saveTransferApplication(data);
      if (res.errorCode == "fail") {
        this.$toast(res.errorMessage);
        setTimeout(function() {
          this.$router.go(-2);
        }, 1500);
        return;
      } else if (res.errorCode == "success") {
        setTimeout(() => {
          this.$toast.success(res.errorMessage);
        }, 1500);
        this.active = 1;
        this.isAble = true;
      }
    },
    onShow1() {
      // 显示可选老师
      if (this.tkType[4] && this.jxbgzc.trim() == "") {
        this.$toast("请先点击选择教学变更周次");
        return;
        return;
      }
      this.show3 = true;
    },
    // 弹出弹框
    onShow(label, value) {
      // 显示对调课程
      if (
        value + "" == "ddkb" &&
        (JSON.stringify(this.bgls) == "{}" || this.jxbgzc.trim() == "")
      ) {
        this.$toast("请先点击选择可选老师和教学变更周次");
        return;
      }
      // 显示地点
      if (
        value + "" == "dd" &&
        (JSON.stringify(this.xq) == "{}" || JSON.stringify(this.qzjc) == "{}")
      ) {
        this.$toast("请先点击选择星期几和起止节次");
        return;
      }
      // 显示起止节次
      if (value == "qzjc" && JSON.stringify(this.xq) == "{}") {
        this.$toast("请先点击选择星期几");
        return;
      }
      // 显示调课类型
      if (value + "" != "tkfs" && this.tkfs.mc == "") {
        this.$toast("请先点击选择调课方式");
        return;
      }
      this.valueList.value = "" + value;
      this.valueList.item = this.columns["" + value];
      this.valueList.label = label;

      if (this.valueList.item.length == 0) {
        this.$toast("暂无合适的" + label);
      } else {
        this.show = true;
      }
    },
    onConfirm(value, index, value1) {
      // 控制调课类型的申请条件
      if (value1 + "" === "tklx") {
        this.showType = true;
        if (value === "整体调课") {
          this.tkType = [false, false, false, false, false];
          this.tkType[0] = true;
          // 获取星期列表
          this.getXq();
          // 获取审核人列表
          this.getShr();
        } else if (value === "部分调课") {
          this.tkType = [false, false, false, false, false];
          this.tkType[1] = true;
          // 获取教学变更周次列表
          this.getJxbgzc();
          // 获取星期列表
          this.getXq();
          // 获取审核人列表
          this.getShr();
        } else if (value === "变更老师") {
          this.tkType = [false, false, false, false, false];
          this.tkType[2] = true;
          // 获取教学变更周次列表
          this.getJxbgzc();
          // 获取星期列表
          this.getXq();
          // 获取审核人列表
          this.getShr();
        } else if (value === "课程对调") {
          this.tkType = [false, false, false, false, false];
          this.tkType[4] = true;
          // 获取教学变更周次列表
          this.getJxbgzc();
          // 获取审核人列表
          this.getShr();
        } else {
          this.tkType = [false, false, false, false, false];
          this.tkType[3] = true;
          // 获取教学变更周次列表
          this.getJxbgzc();
          // 获取审核人列表
          this.getShr();
        }
      }
      if (value1 == "xq") {
        this[value1].mc = value;
        this[value1].dm = index + 1;
        this.qzjc = {};
        this.dd = {};
        // 获取起止节次列表
        this.getQzjc();
      } else if (value1 == "qzjc") {
        this[value1].mc = value;
        this[value1].dm = this.qzjcList.dm[index];
        this.dd = {};
        // 获取地点列表
        this.getDd();
      } else if (value1 == "jxbgzc") {
        if (this.tkType[3] || this.tkType[4]) {
          this.jxbgzc = "第" + value[0] + "周";
          if (this.tkType[4]) {
            this.bgls = {
              mc: "",
              dm: ""
            };
            this.ddkb = {
              mc: "",
              dm: ""
            };
          }
        } else {
          this.jxbgzc = "第" + value[0] + "周变更为第" + value[1] + "周";
        }
        this.bgzc = value;
      } else if (value1 == "bgls") {
        if (this.tkType[4]) {
          this.ddkb = {
            mc: "",
            dm: ""
          };
        }
      } else if (value1 == "tkfs") {
        this[value1].mc = value;
        this[value1].dm = this.tkfsList.dm[index];
      } else if (value1 == "dd") {
        this.dd = {
          mc: value,
          dm: this.ddList.dm[index]
        };
      } else if (value1 == "ddkb") {
        this.ddkb = {
          mc: value.text,
          dm: value.value
        };
      } else {
        this[value1] = value;
      }
      this.show = false;
    },
    // 获取对调课程
    async getAlterCourse() {
      this.alterCourseList = [];
      const params = {
        week: this.bgzc || "",
        jgh: this.bgls.dm
      };
      const res = await Api.exchangeQuery(params);
      if (res.code == "1") {
        if (!this.bgzc) {
          this.week = "第" + res.data[0].topInfo[0].week + "周";
        }
        if (res.data[0].courses.length > 0) {
          this.columns.ddkb = res.data[0].courses.map(item => {
            return {
              text: item.courseName,
              value: item.coursePlanId
            };
          });
        } else {
          this.$toast(res.Msg);
        }
      }
    },
    // 获取调课方式列表
    async getTkfs() {
      let mc = [];
      let dm = [];
      const res = await Api.teachChangeModeList();
      res.data.forEach(item => {
        mc.push(item.studentNumber);
        dm.push(item.dm);
      });
      this.tkfsList.dm = dm;
      this.tkfsList.mc = mc;
      this.columns.tkfs = this.tkfsList.mc;
    },
    // 获取调课类型列表
    getTklx() {
      this.tklxList = ["整体调课", "部分调课", "变更老师", "停课"];

      if (
        this.schoolCode == "14073" ||
        this.schoolCode == "66666" ||
        this.schoolCode == "51717"
      ) {
        this.tklxList = [
          "整体调课",
          "部分调课",
          "变更老师",
          "停课",
          "课程对调"
        ];
      }
      this.columns.tklx = this.tklxList;
    },
    // 获取教学变更周次列表
    async getJxbgzc() {
      this.jxbgzcList = [
        {
          values: [],
          className: "column1"
        },
        {
          values: [],
          className: "column2",
          defaultIndex: 1
        }
      ];
      // 停课周次
      if (this.tkType[3]) {
        let range = this.itemList.weekDetail.split(",");
        let arr = [];
        for (let j = 0; j < range.length; j++) {
          if (range[j] != "") {
            arr.push(range[j]);
          }
        }
        this.jxbgzcList[0].values = arr;
        this.columns.jxbgzc = this.jxbgzcList[0].values;
        return;
      }

      //周次次列表（下拉框）
      const res = await Api.getTeachingWeek();
      let range = this.itemList.weekDetail.split(",");
      let arr1 = [];
      for (let j = 0; j < range.length; j++) {
        if (range[j] != "") {
          arr1.push(range[j]);
        }
      }
      this.jxbgzcList[0].values = arr1;
      res.data.forEach(item => {
        this.jxbgzcList[1].values.push(item.week);
      });
      this.columns.jxbgzc = this.jxbgzcList;

      // 对调课程周次
      if (this.tkType[4]) {
        this.columns.jxbgzc = this.jxbgzcList[1].values;
      }
    },
    // 获取星期列表
    getXq() {
      this.xqList = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期天"
      ];
      this.columns.xq = this.xqList;
    },
    // 获取起止节次列表
    async getQzjc() {
      let params = {};
      if (this.tkType[0]) {
        params = {
          coursePlanId: this.itemList.coursePlanId,
          weekNote: this.itemList.weekNote,
          noticeId: this.itemList.noticeId,
          week: this.itemList.week,
          timeFlag: this.itemList.timeFlag,
          oldWeek: this.itemList.week,
          changeType: this.$route.query.isEx ? "6" : "0"
        };
      } else if (this.tkType[1]) {
        params = {
          coursePlanId: this.itemList.coursePlanId,
          weekNote: this.itemList.weekNote,
          noticeId: this.itemList.noticeId,
          week: this.bgzc[1],
          timeFlag: this.itemList.timeFlag,
          oldWeek: this.bgzc[0],
          changeType: "1"
        };
      } else if (this.tkType[2]) {
        params = {
          coursePlanId: this.itemList.coursePlanId,
          weekNote: "",
          noticeId: this.itemList.noticeId,
          week: this.xq.dm,
          timeFlag: this.itemList.timeFlag,
          oldWeek: this.bgzc[0],
          changeType: "5"
        };
      }
      let dm = [];
      let mc = [];
      const res = await Api.getTeachGetkysj(params);
      res.data.forEach(item => {
        if (this.xq.dm == item.weekDay) {
          mc.push(item.bigNode);
          dm.push(item.nodes);
        }
      });

      this.qzjcList.mc = mc;
      this.qzjcList.dm = dm;
      this.columns.qzjc = this.qzjcList.mc;
    },
    // 获取地点列表
    async getDd() {
      this.columns.dd = this.ddList;

      const params = {
        noticeId: this.itemList.noticeId,
        semesterId: this.itemList.semesterId,
        weekNote: this.qzjc.dm,
        week: this.itemList.week,
        timeFlag: this.itemList.timeFlag,
        campusId: "",
        teachingBuildingId: "",
        validSeat: "",
        domainId: "",
        classroomName: "",
        changeType: "0",
        coursePlainId: this.itemList.coursePlanId
      };
      let dm = [];
      let mc = [];
      const res = await Api.getTeachGetkyjs(params);
      res.data.forEach(item => {
        dm.push(item.classroomIds);
        mc.push(item.classroomName);
      });
      this.ddList.dm = dm;
      this.ddList.mc = mc;
      this.columns.dd = this.ddList.mc;
    },
    // 获取审核人列表
    async getShr() {
      let concatList2 = [];
      let concatList3 = [];
      const params = {
        ywcode: "009",
        ywid: this.itemList.noticeId
      };
      const res = await Api.selectReviewerApi(params);
      res.data.forEach((item, index) => {
        concatList2[index] = {
          name: item.userrealname,
          id: item.userid,
          isBtn: 0
        };
      });
      this.shrList = this.shrList.concat(concatList2);
    },
    // 审核人弹框中的按钮选择
    personTap(e, res) {
      let strList = [];
      let idList = [];
      if (this.shrList[res].isBtn == 0) {
        this.shrList[res].isBtn = 1;
        e.target.className = "cur";
      } else if (this.shrList[res].isBtn == 1) {
        this.shrList[res].isBtn = 0;
        e.target.className = "per-btn";
      }
      for (let i in this.shrList) {
        if (this.shrList[res].name == "全部") {
          this.shrList[i].isBtn = 0;
          this.shrList[res].isBtn = 1;
          this.$refs.person[res].className = "cur";
          this.$refs.person[i].className = "per-btn";
        } else {
          this.shrList[0].isBtn = 0;
          this.$refs.person[0].className = "per-btn";
        }
        if (this.shrList[i].isBtn == 1) {
          strList = strList.concat(this.shrList[i].name);
          idList = idList.concat(this.shrList[i].id);
        }
      }
      this.reset = strList.toString();
      this.resetId = idList.toString();
    },
    // 审核人选择完后点击确认
    resetCancel() {
      this.show1 = false;
      this.shr.mc = this.reset;
      this.shr.dm = this.resetId;
    },
    // 关闭变更老师的pop
    closeBgls(res, id, name) {
      this.show3 = res;
      if (!name) {
        this.bgls.mc = "";
      } else {
        this.bgls.mc = name;
      }
      this.bgls.dm = id;

      this.getAlterCourse();
    },
    // 获取调课得课程信息
    getItem() {
      this.itemList = this.$route.query.i_item;
      if (!!this.itemList.coursePlanId) {
      } else {
        this.active = 1;
        this.isAble = true;
      }
    },
    // 获取申请记录
    async getApply() {
      const params = {
        auditState: ""
      };
      const res = await Api.teachGetJstkxx(params);
      this.applyList = res.data;
      this.allList = res.data;

      for (let item of this.applyList) {
        if (item.auditStateName == "审核中") {
          item.class = "shzClass";
        } else if (item.auditStateName == "不通过") {
          item.class = "btgClass";
        } else if (item.auditStateName == "通过") {
          item.class = "ytgClass";
          item.auditStateName = "已通过";
        } else if (item.auditStateName == "待送审") {
          item.class = "dssClass";
        }
      }
    },
    // 申请记录的条件选择
    change(value) {
      let list = [];
      if (value == "全部") {
        this.applyList = this.allList;
      } else {
        this.allList.forEach(item => {
          if (item.auditStateName == value) {
            list.push(item);
          }
        });
        this.applyList = list;
      }
    }
  },
  created() {
    this.schoolCode = sessionStorage.getItem("schoolCode");
    // 获取调课得课程信息
    this.getItem();
    // 获取调课类型列表
    this.getTklx();
    // 获取调课方式列表
    this.getTkfs();
  },
  components: {
    alterTeacher
  }
};
</script>
<style lang="less">
.exchangeI {
  .van-tabs__content--animated {
    height: 75vh;
    overflow: auto;
  }
  .van-tabs--line .van-tabs__wrap {
    border-bottom: 1px solid #f4f4f4;
    .van-tab--active {
      .van-tab__text--ellipsis {
        color: #212f6e !important;
      }
    }
    .van-tab__text--ellipsis {
      width: 56px;
      height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #8f95b5;
      letter-spacing: 0;
    }
    .van-tabs__line {
      background-color: #7469f8 !important;
      width: 25px;
      height: 3px;
      border-radius: 1.5px;
    }
  }
  .applyInfo {
    width: 100%;
    height: 100%;
    padding: 7% 5% 0 5%;
    p {
      height: 25px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #212f6e;
      letter-spacing: 0;
      margin-bottom: 2%;
      font-weight: bolder;
      margin-bottom: 8px;
    }
    ul li {
      font-family: PingFangSC-Light;
      font-size: 14px;
      color: #757da3;
      letter-spacing: 0;
      margin-bottom: 2%;

      span {
        font-weight: bolder;
        word-wrap: break-word;
        display: inline-block;
        width: 80%;
      }
    }
    ul li:last-child {
      display: flex;
      align-items: stretch;
    }
  }
  .apply {
    padding: 0 3% 0;
    .van-cell {
      border-bottom: 1px solid #f4f4f4;
    }
    .van-cell::after {
      display: none;
    }
    .van-field__label {
      width: 7.2em;
      span {
        width: 96px !important;
        display: inline-block;
      }
    }
    .van-cell.van-field .van-cell__title.van-field__label > span {
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #212f6e;
      letter-spacing: 0;
    }
    .van-field__control::-webkit-input-placeholder {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #dfe0e6 !important;
      letter-spacing: 0;
      font-weight: normal;
      text-align: right;
    }
    .van-field__control::-moz-input-placeholder {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #dfe0e6 !important;
      font-weight: normal;
      letter-spacing: 0;
      text-align: right;
    }
    .van-field__control::-ms-input-placeholder {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #dfe0e6 !important;
      letter-spacing: 0;
      font-weight: normal;
      text-align: right;
    }
    .van-field__control {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #212f6e;
      letter-spacing: 0;
      text-align: right;
      font-weight: bolder;
    }
    .van-icon-arrow {
      color: #dfe0e6;
      font-weight: bolder;
      font-size: 14px;
    }
    .van-cell__title,
    .van-cell.van-field .van-cell__title.van-field__label > span {
      width: 64px;
      height: 22px;
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #212f6e;
      letter-spacing: 0;
    }
    .van-icon-eye-o,
    .van-icon-eye,
    .van-icon-smile-o,
    .van-icon-smile,
    .van-icon-location,
    .van-icon-location-o,
    .van-icon-like,
    .van-icon-like-o,
    .van-icon-fire-o,
    .van-icon-fire,
    .van-icon-setting {
      font-family: "iconfont" !important;
      font-size: 22px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #212f6e;
    }
    .van-icon-eye-o::before {
      content: "\e6ba";
    }
    .van-icon-eye::before {
      content: "\e6b8";
    }
    .van-icon-smile-o::before {
      content: "\e6bd";
    }
    .van-icon-smile::before {
      content: "\e6c1";
    }
    .van-icon-location::before {
      content: "\e6b4";
    }
    .van-icon-location-o::before {
      content: "\e6bb";
    }
    .van-icon-like::before {
      content: "\e6be";
    }
    .van-icon-like-o::before {
      content: "\e6db";
    }
    .van-icon-fire-o::before {
      content: "\e6e7";
    }
    .van-icon-fire::before {
      content: "\e6de";
    }
    .van-icon-setting::before {
      content: "\e6df";
    }

    .van-field__control::-webkit-input-placeholder {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #dfe0e6 !important;
      letter-spacing: 0;
      text-align: right;
    }
    .van-field__control::-moz-input-placeholder {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #dfe0e6 !important;
      letter-spacing: 0;
      text-align: right;
    }
    .van-field__control::-ms-input-placeholder {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #dfe0e6 !important;
      letter-spacing: 0;
      text-align: right;
    }
  }
  .applyList {
    .list {
      padding: 5% 5% 0;
      .list-item {
        background: #f8f8f8;
        border-radius: 5px;
        margin-bottom: 5%;
        padding: 3% 0 3% 6%;
        position: relative;
        p {
          height: 22px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #212f6e;
          letter-spacing: 0;
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
          height: 20px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          letter-spacing: 0;
          position: absolute;
          top: calc(50% - 10px);
          right: 5%;
          font-weight: bolder;
        }
        .shzClass {
          color: #7469f8;
        }
        .btgClass {
          color: #f86969;
        }
        .ytgClass {
          color: #12ddd6;
        }
        .dssClass {
          color: #757da3;
        }
      }
    }
    .van-ellipsis {
      height: 20px;
      font-family: PingFangSC-Medium;
      font-size: 15px;
      color: #212f6e;
      letter-spacing: 0;
      font-weight: bolder;
    }
    .van-cell {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #212f6e;
      letter-spacing: 0;
    }
    .van-dropdown-menu {
      border-bottom: 1px solid #f4f4f4;

      .van-dropdown-menu__bar {
        box-shadow: none;
      }
      .van-dropdown-item {
        position: static;
        height: 1000px;

        .van-overlay {
          top: 49px;
          left: 100%;
        }
        .van-popup--top {
          top: 49px;
          left: 100%;
        }
      }
    }
  }

  .bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    padding-bottom: 10px;
    padding: 0 5%;
    background: #fff;
    box-sizing: border-box;

    button {
      width: 100%;
      height: 44px;
      background: #7469f8;
      border-radius: 3px;
      color: #fff;
    }
  }
}
/* 审核人 */
.close-icon {
  background: url(../../../../../static/img/close.png) no-repeat center;
}
.confirm-icon {
  background: url(../../../../../static/img/confirm.png) no-repeat center;
}
.pop-title i {
  width: 22px;
  height: 22px;
  background-size: 22px 22px;
  padding: 10px;
}
.pop-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.person {
  padding: 15px;
}
.person button {
  border-radius: 3px;
  padding: 5px 15px;
  margin-right: 12px;
  margin-bottom: 10px;
}
.apply-pop .person .per-btn {
  background-color: #ecedfd;
  color: #7469f8;
}
.person .cur {
  background-color: #7469f8;
  color: #ecedfd;
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/exchangeK/item.vue