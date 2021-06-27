<template>
  <div>
    <NOdata v-if="this.allWarnList.length == 0 && isLoad" title="暂无预警~"></NOdata>
    <template v-else>
      <div class="grey-contain" v-for="(item,index) in allWarnList" :key="index" @click="warnDetail(item.warningId)">
        <p>{{item.semester}}</p>
        <span style="margin-bottom:2px;">上课专业：{{item.majorName}}</span>
        <span>处理结果：{{item.resultName}}</span>
      </div>
    </template>
  </div>
</template>

<script>
  import { Api } from '../../../utils/axios'
  export default{
    data(){
      return{
        allWarnList:[],
        isLoad:false
      }
    },
    created(){
      this.getList()
    },
    methods:{
      async getList(){
        const params = {
          isCurrent:'0'
        }
        const res = await Api.getStatueWaring(params)
        this.allWarnList = res.data;
        this.isLoad = true;
      },
      warnDetail(id){
        this.$router.push({
          path:'/student/warnDetail',
          query:{
            'id':id
          }
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  .grey-contain{flex-direction: column;align-items: flex-start;justify-content: center;line-height: 17px;}
  .grey-contain p{font-weight: 600;line-height: 22px;margin-bottom: 4px;}
  .grey-contain span{color: @attendance-color-2;font-size: 12px;line-height: 17px;}
</style>



// WEBPACK FOOTER //
// src/components/student/statusManage/allWarn.vue