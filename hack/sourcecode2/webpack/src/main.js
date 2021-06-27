// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/font/iconfont.css';
import echarts from 'echarts'
import Moment from 'moment'
import store from './store'
import header from './components/common/header'
import noData from './components/common/noData'
Vue.prototype.$echarts = echarts
Vue.prototype.moment=Moment
import Vant, { Toast  } from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.use(Toast);
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.component("Header",header);
Vue.component("NOdata",noData);
import { GET_CONFIG } from "./utils/config";
import service from './utils/request'


import VueResource from 'vue-resource'
Vue.use(VueResource);

//使用钩子函数对路由进行权限跳转
router.beforeEach(async (to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }
  let allowList = ['/login','/','/loginSso','/casLogin','/bindLogin','/weChatLogin','/thirdLogin','/upload','/uploadFile','/test','/student/attendance']
  if(!sessionStorage.getItem('Token') && !allowList.includes(to.path)){
    Toast("请先登录!")
    setTimeout(() => {
      next('/login')
    },1500)
  }else{
    if(process.env.NODE_ENV === 'production'){
      let res = await GET_CONFIG()
      let rs = res.data
      if(rs.schoolCode){
        sessionStorage.setItem('schoolCode',rs.schoolCode)
      }
      //H5
      if(rs.ApiUrl && rs.SelectUrl){
        sessionStorage.setItem('isConfig',1)
        service.defaults.baseURL = rs.ApiUrl
        sessionStorage.setItem('SelectUrl',rs.SelectUrl)
      }
      // 获取菜单url
      sessionStorage.setItem('ApiPro',rs.ApiPro)
      //上传
      if(rs.UploadUrl){
        sessionStorage.setItem('uploadUrl',rs.UploadUrl)
      }
      //.net微信登录
      if(rs.weChatUrl){
        sessionStorage.setItem('weChatUrl',rs.weChatUrl)
      }
    }
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})




// WEBPACK FOOTER //
// ./src/main.js