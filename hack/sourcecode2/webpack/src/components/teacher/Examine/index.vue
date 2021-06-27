<template>
	<div>
		<Header title="审核" type="0" route="/homeIndex" :casLogin="casLogin"></Header>
		<div class="bod">
			<p class="class">选择审核类别</p>
			<NOdata title="暂未开放审核权限" v-if="resetList.length == 0 && dataList.length == 0"></NOdata>
			<Menu :title="item.name" v-for="item in resetList" :key="item.id" :route="item.path"/>
			<!-- 非配置 -->
		 	<!-- <Menu :title="item.name" v-for="(item,index) in dataList" :key="index" :route="item.path"/> -->
		</div>
	</div>
</template>

<script>
import Menu from '../../common/menu'
import { Api } from '@/utils/axios'
	export default{
		data(){
			return{
				Identity:sessionStorage.getItem('Identity'),
				casLogin:sessionStorage.getItem('casLogin'),
				changeList:[
					{name:'调课审核',path:'/teacher/examine/adjustList',url:'js_sh_tk'},
					{name:'教室借用审核',path:'/teacher/examine/borrowingList',url:'js_sh_js'},
					{name:'成绩录入审核',path:'/teacher/examine/searchScore',url:'js_sh_cj'},
					{name:'指导培养方案审核',path:'/teacher/guideIndex',url:'js_sh_pyfa'},
					{name:'新增课程审核',path:'/teacher/courseAudit?type=0',url:'js_sh_xzkc'},
					{name:'开课申请审核',path:'/teacher/courseAudit?type=1',url:'js_sh_kksq'},
          {name:'学生信息核对审核',path:'/teacher/bookIndex?id=2', url:'js_sh_xsxxhd'},
          {name:'毕业生信息核对审核',path:'/teacher/bookIndex?id=3', url:'js_sh_bysxx'},
					{name:'学籍异动教务处审核',path:'/teacher/bookIndex?id=4', url:'js_sh_xjyd'},
					{name:'计划微调审核',path:'/teacher/verifyIndex',url:'js_sh_jhwt'},
					{name:'实验室借用审核',path:'/teacher/bookIndex?id=11',url:'js_sh_sysjy'},
					{name:'教学进度审核',path:'/teacher/bookIndex?id=12',url:'js_sh_jxjd'},
					{name:'书目申请审核',path:'/teacher/bookIndex?id=0',url:'js_sh_smsq'},
					{name:'学生用书征订审核',path:'/teacher/bookIndex?id=1',url:'js_sh_xsyszd'}, 
					{name:'乘系数申请审核',path:'/teacher/bookIndex?id=5',url:'js_sh_cxssq'},
					{name:'学生缓考审核',path:'/teacher/bookIndex?id=6',url:'js_sh_xshk'},
					{name:'成绩确认审核',path:'/teacher/bookIndex?id=7',url:'js_sh_cjqr'},
					{name:'成绩查卷审核',path:'/teacher/bookIndex?id=8',url:'js_sh_cjcj'},
					{name:'成绩认定审核',path:'/teacher/bookIndex?id=9',url:'js_sh_cjrd'},
					{name:'成绩修改审核',path:'/teacher/bookIndex?id=10',url:'js_sh_cjxg'}
				],
				resetList:[],
				// 非配置
				dataList:[
					{name:'计划微调审核',path:'/teacher/verifyIndex'},
					{name:'实验室借用审核',path:'/teacher/bookIndex?id=11'},
					{name:'教学进度审核',path:'/teacher/bookIndex?id=12'},
					{name:'书目申请审核',path:'/teacher/bookIndex?id=0'},
					{name:'学生用书征订审核',path:'/teacher/bookIndex?id=1'},
					{name:'乘系数申请审核',path:'/teacher/bookIndex?id=5'},
					{name:'学生缓考审核',path:'/teacher/bookIndex?id=6'},
					{name:'成绩确认审核',path:'/teacher/bookIndex?id=7'},
					{name:'成绩查卷审核',path:'/teacher/bookIndex?id=8'},
					{name:'成绩认定审核',path:'/teacher/bookIndex?id=9'},
					{name:'成绩修改审核',path:'/teacher/bookIndex?id=10'},
				],
				i_id:''
			}
		},
		methods:{
			handle(e){
				this.$router.push(e.path)
			},
			async Change(){
				const params = {
					xx0101id: sessionStorage.getItem('schoolCode') || '',
					type: this.Identity == '2' ? '0' : '',
					isqy: '',
					key: 'qzkj'
				}
				const res = await Api.getHomeMenuApi(params)
				if(res.data.length > 0){
					res.data.forEach(item => {
						if(item.url == 'js_sh'){
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
			fn1(item){
				this.$router.push({
					path: item.path,
					query: {
						type:item.url == 'js_sh_kksq' ? '1' : item.url == 'js_sh_xzkc' ? '0' : ''
					}
				})
			}
		},
		created(){
			this.Change()
		},
		components:{
			Menu
		}
	}
</script>

<style scoped lang="less">
	.bod{
		margin: 60px auto 0;
		.class{
			color: @attendance-background-color-1;
			font-size: 18px;
			padding: 0 1.25rem 1.25rem;
			font-weight:600;
		}
	}

</style>



// WEBPACK FOOTER //
// src/components/teacher/Examine/index.vue