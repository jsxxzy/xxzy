<template>
  <div>
		<Header title="学籍管理" type="0" route='/homeIndex' :casLogin="casLogin"></Header>
		<NOdata title="暂无数据" v-if="resetList.length == 0"></NOdata>
		<router-link class="grey-contain" v-for="(item,index) in resetList" :key="index" :to="item.path">
			<p>{{item.name}}</p>
			<i class="arrow_link"></i>
		</router-link>
  </div>
</template>

<script>
  import { Api } from '@/utils/axios'
  export default {
    data(){
      return{
				Identity:sessionStorage.getItem('Identity'),
        casLogin:sessionStorage.getItem('casLogin'),
        data:[
          {path:'/student/curWarn',url:'xs_xjyj'},
          {path:'/student/change',url:'xs_xjyd'}
        ],
				i_id:'',
        resetList:[],
      }
    },
    created() {
      this.Change()

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
						if(item.url == 'xs_xjgl'){
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
						this.data.forEach(list => {
							if(item.url == list.url){
								item.path = list.path
							}
						});
					});
				}
			},
    }
  }
</script>

<style lang="less" scoped>
/* .grey-contain{border-left: 3px solid #7469F8;} */
.grey-contain{position: relative;}
.grey-contain::after{position: absolute;width: 3px;height: 100%;background-color: @attendance-background-color-1;content: '';left: 0;border-radius: 5px 0 0 5px}
  .grey-contain p{font-weight: 700;}
</style>



// WEBPACK FOOTER //
// src/components/student/statusManage/schoolRoll.vue