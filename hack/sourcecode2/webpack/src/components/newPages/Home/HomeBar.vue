<template>
  <div>
    <p
      class="black-title"
      v-if="
        (active != 1 && this.userType == '2') ||
          (active != 0 && this.userType != '2')
      "
    >
      {{ title }}
    </p>
    <router-view></router-view>
    <van-tabbar
      class="bottom-nav"
      v-model="active"
      active-color="#7469F8"
      inactive-color="#B3B9D0"
      route
    >
      <van-tabbar-item v-if="userType == '2'" replace to="/new/Table">
        <span class="nav-title">课表</span>
        <template #icon="props">
          <img :src="props.active ? icon[0].active : icon[0].inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/new/Home">
        <span class="nav-title">工具</span>
        <template #icon="props">
          <img :src="props.active ? icon[1].active : icon[1].inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/new/Msg">
        <span class="nav-title">消息</span>
        <template #icon="props">
          <img :src="props.active ? icon[2].active : icon[2].inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/new/person">
        <span class="nav-title">我的</span>
        <template #icon="props">
          <img :src="props.active ? icon[3].active : icon[3].inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      active: -1,
      userType: "",
      icon: [
        {
          active: "./static/image/time1.png",
          inactive: "./static/image/time.png"
        },
        {
          active: "./static/image/tool1.png",
          inactive: "./static/image/tool.png"
        },
        {
          active: "./static/image/msg1.png",
          inactive: "./static/image/msg.png"
        },
        {
          active: "./static/image/my1.png",
          inactive: "./static/image/my.png"
        }
      ]
    };
  },
  watch: {
    active(val) {
      if (this.userType == "2") {
        if (val == 3) {
          this.title = "我的";
        } else if (val == 2) {
          this.title = "通知";
        } else if (val == 1) {
          this.title = "";
        } else if (val == 0) {
          this.title = "课程表";
        }
      } else {
        if (val == 2) {
          this.title = "我的";
        } else if (val == 1) {
          this.title = "通知";
        } else if (val == 0) {
          this.title = "";
        }
      }
    }
  },
  methods: {
    // 判断用户类型更改设置
    userConfig() {
      this.userType = sessionStorage.getItem("Identity");
      if (this.userType == "2") {
        this.active = 1;
      } else {
        this.active = 0;
      }
    }
  },
  created() {
    // 判断用户类型更改设置
    this.userConfig();
  }
};
</script>
<style lang="less" scoped>
.bottom-nav {
  width: 100%;
  height: 49px;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

  .nav-title {
    width: 22px;
    height: 16px;
    font-family: PingFangSC-Regular;
    font-size: 11px;
    letter-spacing: 0;
    text-align: center;
  }
}
</style>
<style lang="less">
.bottom-nav {
  .van-icon-like,
  .van-icon-like-o {
    font-family: "iconfont" !important;
    font-size: 26px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .van-icon-like::before {
    content: "\e6b7";
  }
  .van-icon-like-o::before {
    content: "\e6c0";
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/Home/HomeBar.vue