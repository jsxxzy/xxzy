// 空闲教室
import restRooms from "@/components/newPages/student/restRooms/index";
import roomMore from "@/components/newPages/student/restRooms/roomMore";
// 培养方案
import trainIndex from "@/components/newPages/student/train/index";
import trainItem from "@/components/newPages/student/train/item";
// 辅修报名
import fxApplyIndex from "@/components/newPages/student/fxApply/index";
// 重修报名
import cxApplyIndex from "@/components/newPages/student/cxApply/index";
// 补考报名
import bkApplyIndex from "@/components/newPages/student/bkApply/index";
// 教学课堂反馈
import teachIndex from "@/components/newPages/student/classTeachAdvice/index";
import teachMore from "@/components/newPages/student/classTeachAdvice/more";
import teachContent from "@/components/newPages/student/classTeachAdvice/content";
// 学生教室借用
import roomBrrowIndex from "@/components/newPages/student/roomBrrow/index";

const newStudentRoute = [
   // 学生教室借用
   {
    path: "/roomBrrow/index",
    name: "roomBrrowIndex",
    component: roomBrrowIndex
  },
  // 空闲教室
  {
    path: "/restRooms/index",
    name: "restRooms",
    component: restRooms
  },
  {
    path: "/restRooms/roomMore",
    name: "roomMore",
    component: roomMore
  },
  // 培养方案
  {
    path: "/train/index",
    name: "trainIndex",
    component: trainIndex
  },
  {
    path: "/train/item",
    name: "trainItem",
    component: trainItem
  },
  // 辅修报名
  {
    path: "/fxApply/index",
    name: "fxApplyIndex",
    component: fxApplyIndex
  },
  // 重修报名
  {
    path: "/cxApply/index",
    name: "cxApplyIndex",
    component: cxApplyIndex
  },
  // 补考报名
  {
    path: "/bkApply/index",
    name: "bkApplyIndex",
    component: bkApplyIndex
  },
  // 教学课堂反馈
  {
    path: "/teachAdvice/index",
    name: "teachIndex",
    component: teachIndex
  },
  {
    path: "/teachAdvice/more",
    name: "teachMore",
    component: teachMore
  },
  {
    path: "/teachAdvice/content",
    name: "teachContent",
    component: teachContent
  }
];
export default newStudentRoute;



// WEBPACK FOOTER //
// ./src/router/newStudent.js