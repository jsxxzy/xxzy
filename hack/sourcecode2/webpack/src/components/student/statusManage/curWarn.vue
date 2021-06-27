<template>
  <div>
    <NOdata v-if="this.curWarnList.length == 0 && isLoad" title="暂无预警~"></NOdata>
    <template v-else>
      <div class="grey-contain" v-for="(item,index) in curWarnList" :key="index" @click="warnDetail(item.warningId)">
        <p>{{item.semester}}</p>
        <span>上课专业：{{item.majorName}}</span>
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
        curWarnList:[],
        isLoad:false
      }
    },
    created(){
      this.getList()
    },
    methods:{
      async getList(){
        const params = {
          isCurrent:'1'
        }
        const res = await Api.getStatueWaring(params)
        this.curWarnList = res.data;
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
  .grey-contain{flex-direction: column;align-items: flex-start;justify-content: center;line-height: 22px;}
  .grey-contain p{font-weight: 600;}
  .grey-contain span{color: @attendance-color-2;font-size: 12px;}
  .warn-tab li{list-style: none;}
</style>



// WEBPACK FOOTER //
// src/components/student/statusManage/curWarn.vue