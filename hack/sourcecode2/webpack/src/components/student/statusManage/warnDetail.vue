<template>
  <div>
    <Header title="学籍预警"></Header>
    <div class="warn">
      <p class="warn-ttl">{{this.curWarnList.warningName}}</p>
      <p class="warn-year">{{this.curWarnList.semester}}</p>
      <p class="warn-info">上课专业：{{this.curWarnList.majorName}}</p>
      <p class="warn-info">处理结果：{{this.curWarnList.resultName}}</p>
    </div>
  </div>
</template>

<script>
  import { Api } from '../../../utils/axios'
  export default{
    data(){
      return{
        curWarnList:[]
      }
    },
    methods:{
      async getList(){
        const params = {
          warningId : this.$route.query.id
        }
        const res = await Api.getWarningDetail(params)
        this.curWarnList = res.data[0]
      }
    },
    created(){
      this.getList()
    },
  }
</script>

<style lang="less" scoped>
  .warn{padding: 20px;}
  .warn .warn-ttl{font-size: 24px;color: @attendance-background-color-13;font-weight: 600;margin-bottom: 20px;}
  .warn .warn-year{font-size: 18px;color: @attendance-color-1;font-weight: 600;margin-bottom: 8px;}
  .warn .warn-info{font-size: 14px;color: @attendance-color-2;margin-bottom: 8px;}
</style>



// WEBPACK FOOTER //
// src/components/student/statusManage/warnDetail.vue