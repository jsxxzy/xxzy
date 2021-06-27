<template>
  <div class="note-class">
    <Header
      :title="$route.meta.title"
      type="0"
      route="/evaluateSerach"
    ></Header>

    <van-cell title="上传附件" value="">
      <template #right-icon>
        <button @click="jspjUpload()" class="eva-btn upload">上传</button>
      </template>
    </van-cell>
    <van-uploader v-model="imageList" multiple :max-count="0" />
    <div class="myFile">
      <van-uploader
        class="up"
        v-model="fileList"
        :after-read="afterRead"
        :max-size="30 * 1024 * 1024"
        @onOversize="onOversize"
      />
    </div>

    <div class="eva-buttons">
      <button class="pre-topic" @click="back()">
        上一步
      </button>
      <button @click="send()" class="eva-btn">下一步</button>
    </div>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";
import Vue from "vue";
import { Uploader } from "vant";
import { Cell } from "vant";

Vue.use(Cell);
Vue.use(Uploader);

export default {
  data() {
    return {
      file: {},
      fileList: [],
      formData: {},
      imageList: []
    };
  },
  methods: {
    afterRead(file, index) {
      this.formData.append("file", file.file);
    },

    onOversize(file) {
      this.$toast.fail("文件大小不能超过30M");
    },

    async jspjUpload() {
      if (this.fileList.length <= 0) {
        this.$toast.fail("请选择要上传的文件");
        return false;
      }
      const res = await Api.jspjUpload(this.formData);
      if (res.code == 1) {
        // this.send()
        this.$toast.success("上传成功~");
        this.$router.go(0);
      }
    },
    async jspjDownfile() {
      const res = await Api.jspjDownfile();
      if (res.code == 1) {
        // this.send()
        for (let item of res.data) {
          this.imageList.push({
            url: "data:image/" + item.hz + ";base64," + item.context,
            isImage: true
          });
        }
      }
    },
    send() {
      this.$router.push({
        path: "/evaluate31",
        query: {
          evaluationCategoriesId: this.$route.query.evaluationCategoriesId,
          courseId: this.$route.query.courseId,
          teacherId: this.$route.query.teacherId,
          noticeId: this.$route.query.noticeId,
          schoolClassificationId: this.$route.query.schoolClassificationId
        }
      });
    },
    back() {
      this.$router.back();
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
    async getSCFJ() {
      const res = await Api.teachTeachingEvaluationList({
        pj09id: this.getCookie("pj05id")
      });
    }
  },
  created() {
    this.formData = new FormData();
    this.jspjDownfile();
  }
};
</script>

<style lang="less" scoped>
.myFile {
  position: relative;
}
.up {
  position: absolute;
  right: 10px;
  top: 10px;
}
/deep/ .van-uploader__wrapper {
  padding-left: 10px;
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
.upload {
  background-color: @attendance-background-color-1;
  color: @attendance-color-3;
  border-radius: 3px;
  padding: 11px 0;
  width: 25%;
  height: 34px;
  padding: 0;
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Evaluate1/evaluate3-scfj.vue