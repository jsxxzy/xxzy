<template>
  <div>
    <Header :title="$route.query.type == 0 ? '培养目标' : '详细说明'"></Header>
    <div class="courseDetails">
      <article 
        v-html="$route.query.type == 0 ? detailList.target : detailList.explain">
      </article>
    </div>
  </div>
</template>

<script>
  import { Api } from '../../../utils/axios'
  export default {
    data(){
      return{
        detailList:[]
      }
    },
    methods:{
      async getList(){
        const res = await Api.targetAndExplain()
        if(res.data[0]){
          this.detailList = res.data[0]
        }
      }
    },
    created(){
      this.getList()
    },
    
  }

</script>

<style lang="less" scoped>
.courseDetails{
  padding: 0 1.25rem;
}
</style>



// WEBPACK FOOTER //
// src/components/student/Cultivate/courseAdd.vue