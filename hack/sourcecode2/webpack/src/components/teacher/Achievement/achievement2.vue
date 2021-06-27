<template>
	<div class="cjcx">
		<Header title="成绩查询"></Header>
		<h4 class="title">选择班级</h4>
		<Menu 
			:title="item.className" 
			v-for="(item,index) in List" 
			:key="index" 
			:route="item.route"
			:query="item.query"
		/>
		<NOdata v-if="List.length === 0"></NOdata>
	</div>
</template>

<script>
import { Api } from '@/utils/axios'
import Menu from '../../common/menu'
	export default{
		data(){
			return{
				arrlist:[],
				arrList:[],
				classId:'',
				className:'',
				classList:[],
				courseId:'',
				List:[]

			}
		},
		methods:{
			async Class_a(){
				const res = await Api.teachGetCjcxByjs()
				this.arrlist = res.data;
				for(var i in this.arrlist){
					if(this.arrlist[i].courseId == this.courseId){
						this.List = this.arrlist[i].classList
						this.List.forEach(item => {
							item.route = '/achievement3',
							item.query = {
								'classId':item.classId,
								'courseId':this.$route.query.courseId,
								'className':item.className
							}
						});
					}
				}
			},
		},
		created(){
			this.courseId = this.$route.query.courseId;
			this.Class_a();
		},
		components:{
			Menu
		}
	}
</script>

<style lang="less" scoped>
.cjcx{
	.title{
		font-size: 1.125rem;
		color: @attendance-background-color-1;
		padding: .625rem 1.25rem 1.25rem;
	}
}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Achievement/achievement2.vue