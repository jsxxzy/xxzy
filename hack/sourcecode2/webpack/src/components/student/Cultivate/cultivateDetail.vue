<template>
  <div>
    <Header title="培养方案明细"></Header>
    <Menu 
      :title="item.name" 
      v-for="(item,index) in menus" :key="index" 
      :route="item.path"/>
  </div>
</template>

<script>
import Menu from '../../common/menu'
  export default {
    data(){
      return{
        menus:[
          {name:'培养目标',path:'/student/courseAdd?type=0'},
          {name:'详细说明',path:'/student/courseAdd?type=1'},
          {name:'课程设置总表',path:'/student/courseSet'},
        ]
      }
    },
    components:{
      Menu
    }
  }
</script>



// WEBPACK FOOTER //
// src/components/student/Cultivate/cultivateDetail.vue