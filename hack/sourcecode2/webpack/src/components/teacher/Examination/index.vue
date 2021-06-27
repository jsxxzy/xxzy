<template>
  <div>
    <Header title="考务" type="0" route="/homeIndex" :casLogin="casLogin"></Header>
		<NOdata title="暂无数据" v-if="resetList.length == 0"></NOdata>
    <Menu :title="item.name" v-for="(item,index) in resetList" :key="index" :route="item.path"/>
  </div>
</template> 

<script>
import Menu from '../../common/menu'
import { Api } from '@/utils/axios'
export default {
  data() {
    return {
      Identity:sessionStorage.getItem('Identity'),
      casLogin: sessionStorage.getItem('casLogin'),
      changeList: [
        { name: '监考查询', path: '/invigilate' ,url:'js_kw_jkcx'},
        { name: '监考调代', path: '/teacher/examSearch' ,url:'js_kw_jktd'},
        { name: '随堂考试', path: '/teacher/classList' ,url:'js_kw_stks'},
        { name: '考场信息查询', path: '/teacher/examRoom' ,url:'js_kw_kcxxcx'},
      ],
      i_id:'',
      resetList:[]
    }
  },
  methods: {
    async Change(){
      const params = {
        xx0101id: sessionStorage.getItem('schoolCode'),
        type: this.Identity == '2' ? '0' : '',
        isqy: '',
        key: 'qzkj' 
      }
      const res = await Api.getHomeMenuApi(params)
      if(res.data.length > 0){
        res.data.forEach(item => {
          if(item.url == 'js_kw'){
            this.i_id = item.i_id
          }
        });
      }
      this.getAuth()
    },
    async getAuth(){
      const params = {
        I_ID:this.i_id
      }
      const res = await Api.getSubMenu(params)
      this.resetList = res.data
      if(res.data.length > 0){ 
        this.resetList.forEach(item => {
          this.changeList.forEach(list => {
            if(item.url == list.url){
              item.path = list.path
            }
          });
        });
      }
    },
  },
  created() {
    this.Change()
  },
  components:{
    Menu
  }
}
</script>


// WEBPACK FOOTER //
// src/components/teacher/Examination/index.vue