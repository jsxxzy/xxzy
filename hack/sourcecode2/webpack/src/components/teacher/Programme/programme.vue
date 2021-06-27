<template>
	<div>
		<Header title="培养方案" :casLogin="casLogin"></Header>
		<NOdata title="暂无数据" v-if="resetList.length == 0"></NOdata>
		<Menu :title="item.name" v-for="(item,index) in resetList" :key="index" :route="item.path"/>
	</div>
</template>

<script>
import Menu from '../../common/menu'
import {Api} from '@/utils/axios'
	export default{
		data(){
			return{
				casLogin:sessionStorage.getItem('casLogin'),
				Identity:sessionStorage.getItem('Identity'),
				arrList9:[
					{name:"培养方案总纲",path:"/population",url:'js_pyfa_zg'},
					{name:"专业培养方案",path:'/major',url:'js_pyfa_zy'},
					{name:"专业教学进程",path:'/process',url:'js_pyfa_zyjxjc'},
					{name:"教学计划",path:'/plan',url:'js_pyfa_jxjh'}
				],
				i_id:'',
				resetList:[]
			}
		},
		created(){
			this.Change()
		},
		components:{
			Menu
		},
		methods:{
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
						if(item.url == 'js_pyfa'){
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
						this.arrList9.forEach(list => {
							if(item.url == list.url){
								item.path = list.path
							}
						});
					});
				}
			},
		},
	}
</script>


// WEBPACK FOOTER //
// src/components/teacher/Programme/programme.vue