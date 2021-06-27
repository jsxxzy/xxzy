<template>
  <div οnlοad="opener.location.reload()">
      <Header title="等级考试报名" type="0" route="/homeIndex" :casLogin="casLogin"></Header>
      <NOdata title="暂无数据~" v-if="this.gradeList.length == 0 && isLoad"></NOdata>
      <template v-else>
        <div class="grey-contain" v-for="(item,index) in gradeList" :key="index">
          <div class="contain-left">
            <p class="contain-txt">{{item.examinationType}}({{item.examinationGrade}})</p>
            <span class="contain-txt1">截止时间：{{item.deadline}}</span>
            <div class="contain-txt1" v-if="!(schoolCode=='12425')">报名费用：<span style="color: #F86969;">¥{{item.cost}}</span></div>
            <div class="contain-txt1" v-if="schoolCode=='12425'">报名全报费用：<span style="color: #F86969;">¥{{item.cost}}</span></div>
            <div class="contain-txt1" v-if="schoolCode=='12425'">报名费用：<span style="color: #F86969;">¥{{item.bscost}}</span></div>
          </div>
          <button @click="goSign(index)">报名</button>
        </div>
      </template>
      <router-link class="delay-btns" to="/student/myExam">
        <button>查看我的报名申请</button>
      </router-link>
  </div>
</template>

<script>
  import { Api } from '../../utils/axios'
  export default {
    data(){
      return{
        casLogin:sessionStorage.getItem('casLogin'),
        gradeList:[],
        isLoad:false,
        schoolCode:''
      }
    },
    created(){
      this.getList()
      this.schoolCode=sessionStorage.getItem('schoolCode')
    },
    methods:{
      async getList(){
        const params = {
          alienationId:this.$route.query.id
        } 
        const res = await Api.getGradeExamination(params)
        this.gradeList = res.data;
        this.isLoad = true;
      },
      goSign(index){
        this.$router.push({
          path:'/student/gradeDetail',
          query:{
            info:JSON.stringify(this.gradeList[index]),
          }
        })
      }
    },
  }
</script>

<style lang="less" scoped>
.grey-contain{padding: 10px 20px;box-sizing: border-box;}
  .grey-contain button{background-color: @attendance-background-color-1;padding: 11px 0;border-radius: 3px;color: @attendance-color-3;width: 70px;}
  .grey-contain .contain-left{width: 75%;}
  .delay-btns{position: absolute;bottom: 0px;width: 100%;text-align: center;margin:20px 0;background-color: @attendance-color-3;}
  .delay-btns button{background-color: @attendance-background-color-7;color: @attendance-background-color-1;padding: 11px 0;width: 90%;border-radius: 3px;}
</style>



// WEBPACK FOOTER //
// src/components/student/gradeExam.vue