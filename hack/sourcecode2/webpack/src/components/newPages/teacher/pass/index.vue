<template>
  <div>
    <Header title="审核" type="0" route="/new/Home"></Header>
    <div class="pass">
      <div class="pass-head">
        <div @click="goUnDeal">
          <span class="iconfont icondaichuli"></span>
          待处理({{ num }})
        </div>
        <div @click="goDeal">
          <span class="iconfont iconyichuli"></span>
          已处理
        </div>
      </div>
      <div class="pass-tag">
        <van-grid :column-num="3">
          <van-grid-item
            v-for="(menu, index) of menuList"
            :key="index"
            @click="goPassIndex(menu)"
          >
            <span :class="menu.icon" :style="'color:' + menu.color"></span>
            <span class="item-value">{{ menu.name }}</span></van-grid-item
          >
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/utils/axios";
export default {
  data() {
    return {
      num: 0,
      menuList: [],
      pathList: [
        {
          name: "成绩录入审核",
          icon: "iconshouye14 iconfont",
          color: "#865FC1",
          path: "/pass/passIndex"
        },
        {
          name: "新增课程审核",
          icon: "iconshouye11 iconfont",
          color: "#FF8080",
          path: "/teacher/courseAudit?type=0"
        },
        {
          name: "培养方案审核",
          icon: "iconshouye21 iconfont",
          color: "#865FC1",
          path: "/teacher/guideIndex"
        },
        {
          name: "开课申请审核",
          icon: "iconshouye12 iconfont",
          color: "#FF8080",
          path: "/teacher/courseAudit?type=1"
        },
        {
          name: "学生信息核对审核",
          icon: "iconshouye1 iconfont",
          color: "#FFC327",
          path: "/teacher/bookIndex?id=2"
        },
        {
          name: "学籍异动审核",
          icon: "iconshouye9 iconfont",
          color: "#00C897",
          path: "/teacher/bookIndex?id=4"
        },
        {
          name: "调课审核",
          icon: "iconshouye10 iconfont",
          color: "#5E73FF",
          path: "/teacher/examine/adjustList?path=/pass/index"
        },
        {
          name: "教室借用审核",
          icon: "iconshouye25 iconfont",
          color: "#865FC1",
          path: "/teacher/examine/borrowingList?path=/pass/index"
        },
        {
          name: "毕业生信息审核",
          icon: "iconshouye15 iconfont",
          color: "#5E73FF",
          path: "/teacher/bookIndex?id=3"
        }
      ]
    };
  },
  methods: {
    // 获取待处理list
    async getUnDeal() {
      const res = await Api.getNotShenHeMsg();
      if (res.data) {
        this.num = res.data.length;
      } else {
        this.num = 0;
      }
    },
    // 跳转到待处理界面
    goUnDeal() {
      this.$router.push({
        path: "/pass/unDeal"
      });
    },
    // 跳转到待处理界面
    goDeal() {
      this.$router.push({
        path: "/pass/deal"
      });
    },
    // 跳转到审核界面
    goPassIndex(item) {
      this.$router.push({
        path: item.path,
        query: {
          path: "/pass/index"
        }
      });
    },
    // 获取菜单
    getMenuList() {
      let list = JSON.parse(sessionStorage.getItem("homeMenuList"));
      list[list.length - 1].child.forEach(item => {
        if (item.name == "审核") {
          item.child.forEach(val => {
            this.pathList.forEach(path => {
              if (val.name.trim() === path.name.trim()) {
                val.icon = path.icon;
                val.color = path.color;
                val.path = path.path;
              }
            });
            this.menuList = item.child;
          });
        }
      });
    }
  },
  created() {
    // 获取菜单
    this.getMenuList();
    // 获取数量
    this.getUnDeal();
  }
};
</script>
<style lang="less" scoped>
.pass {
  .pass-head {
    width: 335px;
    height: 80px;
    margin: 5% auto 2%;
    background-image: url("../../../../../static/image/head3.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    display: flex;
    padding: 3%;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;

    & > div {
      width: 50%;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;
      color: #fff;
      font-weight: lighter;
      font-size: 14px;
    }
  }
  .pass-head::after {
    content: "";
    height: 50%;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
    top: 25%;
    left: 50%;
  }
  .item-value {
    font-family: PingFangSC-Light;
    font-size: 12px;
    color: #212f6e;
    letter-spacing: 0;
    text-align: center;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/newPages/teacher/pass/index.vue