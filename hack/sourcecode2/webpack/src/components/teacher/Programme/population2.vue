<template>
	<div class="asid">
		<Header title="培养方案总纲"></Header>
		<div class="item">
			<span>{{arrList1.fosterEdition}}培养方案</span>
			<span>发布人：{{arrList1.publisher}}</span>
			<span>时间：{{arrList1.publishTime}}</span>
			<span>版本：{{arrList1.fosterEdition}}</span>
			<!-- <textarea name="" id="" cols="30" rows="10" v-model="content"></textarea> -->
    </div>
		<div v-html="arrList1.detail"></div>
	</div>
</template>

<script>
import {Api} from '@/utils/axios'
	export default {
		data() {
			return {
				arrList1: {},
				content:''
			}
		},
		methods:{
			async fn(val){
				const params = {
					versionId:val
				}
				const res = await Api.teachFosterOutlineDetail(params)
				this.arrList1 = res.data[0];
			}
		},
		created(){
			this.fn(this.$route.query.id)
		},
	}
</script>



<style lang="less" scoped>
	.asid{
		margin: 0 20px;
		.item{
			span{
				display: block;
				color: @attendance-color-2;
				font-size: 14px;
				margin: 7px 0;
				&:nth-child(1){
					color: @attendance-color-1;
					font-size: 18px;
					margin-top: 15px;
					font-weight:600;
				}
			}
			p{
				text-indent: 28px;
				width: 100%;
				height: 240px;
				padding: 0;
				color: @attendance-color-2;
				font-size: 14;
				border: none;
				outline: none;
			}
		}
	}
</style>



// WEBPACK FOOTER //
// src/components/teacher/Programme/population2.vue