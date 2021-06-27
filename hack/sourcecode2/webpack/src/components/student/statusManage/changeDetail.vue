<template>
  <div>
    <Header title="异动详情"></Header>
    <div class="my-apply1">
      <p :class="this.status == '通过'? 'text1' : 'text2'">{{this.status}}</p>
      <p class="apply-sub">{{this.applyDetail.semesterName}}</p>
      <div class="info-text">
        <p>异动类别：<span>{{this.applyDetail.alienationType}}</span></p>
        <p>异动原因：<span>{{this.applyDetail.alienatioReason}}</span></p>
        <p>新学院：<span>{{this.applyDetail.newAcademy}}</span></p>
        <p>新专业：<span>{{this.applyDetail.newMajor}}</span></p>
        <p>新班级：<span>{{this.applyDetail.newClass}}</span></p>
        <p>新学籍：<span>{{this.applyDetail.newStudentStatue}}</span></p>
        <p>新状态：<span>{{this.applyDetail.newInschoolStatue}}</span></p><br>

        <p>原学院：<span>{{this.applyDetail.oldAcademy}}</span></p>
        <p>原专业：<span>{{this.applyDetail.oldMajor}}</span></p>
        <p>原班级：<span>{{this.applyDetail.oldClass}}</span></p>
        <p>原学籍：<span>{{this.applyDetail['oldStudent|Statue']}}</span></p>
        <p>原状态：<span>{{this.applyDetail.oldInschoolStatue}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Api } from '../../../utils/axios'
  export default{
    data(){
      return{
        applyDetail:[],
        status:''
      }
    },
    methods:{
      async getList(){
        const params = {
          alienationId:this.$route.query.id
        }
        const res = await Api.getAlienationDetail(params)
        this.applyDetail = res.data[0]
      }
    },
    created(){
        this.status = this.$route.query.status;
        this.getList()
    },
  }
</script>

<style lang="less" scoped>
  .my-apply1{padding: 20px;}
  .my-apply1 .text1{font-size: 24px;font-weight: 700;color: @attendance-background-color-13;}
  .my-apply1 .text2{font-size: 24px;font-weight: 700;color: @attendance-background-color-12;}
  .apply-sub{font-size: 18px;color: @attendance-color-1;font-weight: 600;margin: 20px 0 8px;}
  .my-apply1 .info-text{font-size: 14px;color: @attendance-color-2;line-height: 25px;}
  .info-text p span{font-weight: 700;}
</style>



// WEBPACK FOOTER //
// src/components/student/statusManage/changeDetail.vue