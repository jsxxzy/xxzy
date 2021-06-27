<template>
  <div class="alter-teacher">
    <Header title="选择变更老师" :type="type" :isShowArrow="false"></Header>
    <div class="alter-find">
      <i @click="teaTap()"></i>
      <input type="text" placeholder="搜索老师姓名/工号" v-model="teaInfo">
    </div>
    <NOdata v-if="this.teacherList.length == 0" title="未查询到教师信息"></NOdata>
    <template v-else>
      <div class="alter-item" v-for="(item,index) in teachers" :key="index">
        <div>
          <h4>{{item.teacherName}}</h4>
          <p>工号：{{item.teacherNum}}</p>
        </div>
        <van-checkbox v-model="item.checked" checked-color="#7469F8"></van-checkbox>
        <!-- <el-checkbox v-model="item.checked"></el-checkbox> -->
      </div>
    </template>
    <div class="alter-buttons">
      <button class="clear" @click="clear()">取消</button>
      <button class="confirm"  @click="select()">确定</button>
    </div>
  </div>
</template>
<script>
import { Api } from '../../utils/axios'
export default {
  props: {
    isRadio:{
      type:Boolean,
      default:false
    },
    list:{
      type:Array,
      default:() => []
    }
  },
  data(){
    return{
      teacherList:[],
      teaInfo:'',
      teaIdList:[],
      teaNameList:[],
      route:'teacher',
      type:'1',
      teaNumList:[]
    }
  },
  created(){
    this.teaTap()
  },
  methods:{
    select(){
      this.teaIdList = []
      this.teaNameList = []
      this.teaNumList = []
      for(let i = 0;i < this.teachers.length;i++){
        if(this.teachers[i].checked){
          this.teaIdList.push(this.teachers[i].teacherId);
          this.teaNameList.push(this.teachers[i].teacherName)
          this.teaNumList.push(this.teachers[i].teacherNum)
        }
      }
      if(this.teaIdList.length == 0){
        this.$toast.fail('请选择变更老师')
        return false
      }
      if(this.isRadio && this.teaIdList.length > 1){
        this.$toast('只能选择一位老师!')
        return false
      }
      this.teacherId = this.teaIdList.toString()
      this.teacherName = this.teaNameList.toString()
      this.$emit('closePop',false,this.teaNumList.toString(),this.teacherName)
    },
    clear(){
      this.$emit('closePop',false)
      for(let i = 0;i < this.teachers.length;i++){
        if(this.teachers[i].checked){
          this.teachers[i].checked = false
        }
      }
    },
    async teaTap(){
      const params = {
        facultyId:this.teaInfo,
        departmentId:this.teaInfo,
        teacherName:this.teaInfo
      }
      const res = await Api.teachGetKxls(params)
      this.teacherList = res.data
    }
  },
  computed:{
    teachers:function(){
      var author = this.teaInfo;
      if(author){
        return this.teacherList.filter(function(product) {
          return Object.keys(product).some(function(key) {
            return String(product[key]).toLowerCase().indexOf(author) > -1
          })
        })
      }
      return this.teacherList
    }
  },     
}
</script>
<style lang="less">
.alter-teacher{
  padding: 0 20px;
  margin: 70px 0 20px;
  .alter-find{
    border-radius:3px;
    background-color: @attendance-background-color-6;
    padding: 11px 13px;display: flex;
    i{
      background: url(../../assets/images/search.png)no-repeat center;
      background-size: 22px 22px;width: 22px;height: 22px;
    }
    input{
      color: @attendance-color-2;
      padding: 0 11px;flex: 1;
      &::placeholder{
        color: @attendance-color-2;
      }
    }
  }
  .alter-item{
    padding: 0 20px;
    background-color: @attendance-background-color-10;
    border-radius:5px;height: 82px;margin: 21px 0 13px;
    display: flex;justify-content: space-between;align-items: center;
    h4{
      color: @attendance-color-1;font-size: 16px;line-height: 22px;margin-bottom: 8px;
    }
    p{
      color: @attendance-color-2;font-size: 12px;line-height: 17px;
    }
    /deep/.el-checkbox__inner{
      width: 18px;height: 18px;
      border-radius: 50%;
      border: 2px solid @attendance-border-color-4;
      &::after{
        left: 5px;top: 2px;border-width: 2px;
      }
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
      background: @attendance-background-color-1;
      border-color:@attendance-background-color-1;
    }
  }
  .alter-buttons{
    z-index: 9;
    background-color: @attendance-color-3;
    position: fixed;bottom: 0;padding: 20px 0;
    width: calc(~"100% - 40px");box-sizing: border-box;
    display: flex;justify-content: space-between;align-items: center;
    button{
      width: calc(~"50% - 10px");padding: 11px 0;border-radius: 3px;
    }
    button.clear{
      background-color: @attendance-background-color-7;
      color: @attendance-background-color-1;
    }
    button.confirm{
      background-color: @attendance-background-color-1;
      color: @attendance-color-3;
    }
  }
}
</style>






















// WEBPACK FOOTER //
// src/components/common/alterTeacher.vue