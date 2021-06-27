<template>
  <div>
    <Header title="学籍异动"></Header>
    <NOdata v-if="this.changeList.length == 0 && isLoad" title="暂无异动信息~"></NOdata>
    <template v-else>
      <div class="grey-contain" v-for="(item,index) in changeList" :key="index" @click="changeDetail(item.alienationId,item.auditState)">
        <div>
          <p>{{item.semesterName}}</p>
          <span>异动类别：{{item.alienationType}}</span>
        </div>
        <p :class="item.auditState == '通过' ? 'text2' : 'text1'">{{item.auditState == '通过' ? '已通过' : item.auditState}}</p>
      </div>
    </template>
  </div>
</template>

<script>
  import { Api } from '../../../utils/axios'
  export default {
    data(){
      return{
        changeList:[],
        isLoad:false
      }
    },
    created(){
      this.getList()
    },
    methods:{
      async getList(){
        const res = await Api.getStatueAlienation()
        this.changeList = res.data;
        this.isLoad = true;
      },
      changeDetail(val,res){
        this.$router.push({
          path:'/student/changeDetail',
          query:{
            'id':val,
            'status':res
          }
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  .grey-contain{line-height: 22px;display: flex;justify-content: space-between;}
  .grey-contain p{font-weight: 600;}
  .grey-contain span{color: @attendance-color-2;font-size: 12px;}
  .grey-contain .text1{font-size: 14px;color: @attendance-background-color-13;font-weight: 700;}
  .grey-contain .text2{font-size: 14px;color: @attendance-background-color-12;font-weight: 700;}
</style>



// WEBPACK FOOTER //
// src/components/student/statusManage/change.vue