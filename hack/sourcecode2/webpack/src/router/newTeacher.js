// 调课申请
import exchangeK from "@/components/newPages/teacher/exchangeK/index";
import exchangeKItem from "@/components/newPages/teacher/exchangeK/item";
import exchangeKHistoryList from "@/components/newPages/teacher/exchangeK/historyList";
// 工作量查询
import workNum from "@/components/newPages/teacher/workNum/index";
// 教室借用
import roomBorrow from "@/components/newPages/teacher/roomBrrow/index";
import borrowList from "@/components/newPages/teacher/roomBrrow/borrowList";
import borrowBar from "@/components/newPages/teacher/roomBrrow/borrowBar";
import moreResearch from "@/components/newPages/teacher/roomBrrow/moreResearch";
import roomBorrowHistoryList from "@/components/newPages/teacher/roomBrrow/historyList";
// 成绩管理
import updateIndex from "@/components/newPages/teacher/grade/update/index";
import gradeUpdate from "@/components/newPages/teacher/grade/update/gradeUpdate";
import searchIndex from "@/components/newPages/teacher/grade/search/index";
import gradeItem from "@/components/newPages/teacher/grade/search/gradeItem";
// 培养方案
import pyfazgIndex from "@/components/newPages/teacher/train/pyfazgIndex";
import commonIndex from "@/components/newPages/teacher/train/commonIndex";
import teachingProcess from "@/components/newPages/teacher/train/teachingProcess";
import teachingPlan from "@/components/newPages/teacher/train/teachingPlan";
// 审核
import pass from "@/components/newPages/teacher/pass/index";
import passBar from "@/components/newPages/teacher/pass/passBar";
import passIndex from "@/components/newPages/teacher/pass/passIndex";
import passList from "@/components/newPages/teacher/pass/passList";
import unDeal from "@/components/newPages/teacher/pass/unDeal";
import deal from "@/components/newPages/teacher/pass/deal";
// //班级课表
import classTable from "@/components/newPages/teacher/classTable/index";

const newTeacherRoute = [
  // 调课申请
  {
    path: "/exchangeK/index",
    name: "exchangeK",
    component: exchangeK
  },
  {
    path: "/exchangeK/item",
    name: "exchangeKItem",
    component: exchangeKItem
  },
  // 调课申请记录
  {
    path: "/exchangeK/historList",
    name: "exchangeKHistoryList",
    component: exchangeKHistoryList
  },
  // 工作量查询
  {
    path: "/workNum/index",
    name: "workNum",
    component: workNum
  },
  // 教室借用
  {
    path: "/roomBorrow",
    component: borrowBar,
    redirect: "/bindex",
    children: [
      {
        path: "/bindex",
        name: "roomBrrow",
        component: roomBorrow
      },
      {
        path: "/bList",
        name: "bList",
        component: borrowList
      }
    ]
  },
  {
    path: "/moreResearch",
    name: "moreResearch",
    component: moreResearch
  },
  // 教室借用记录
  {
    path: "/roomBorrow/historyList",
    name: "roomBorrowHistoryList",
    component: roomBorrowHistoryList
  },
  // 成绩管理
  // 成绩修改
  {
    path: "/grade/update/index",
    name: "updateIndex",
    component: updateIndex
  },
  {
    path: "/grade/update",
    name: "gradeUpdate",
    component: gradeUpdate
  },
  // 成绩查询
  {
    path: "/grade/search/index",
    name: "searchIndex",
    component: searchIndex
  },
  {
    path: "/grade/item",
    name: "gradeItem",
    component: gradeItem
  },
  // 培养方案
  {
    path: "/train/indpyfazgIndexex",
    name: "pyfazgIndex",
    component: pyfazgIndex
  },
  {
    path: "/train/commonIndex",
    name: "commonIndex",
    component: commonIndex
  },
  // 专业教学进程
  {
    path: "/train/teachingProcess",
    name: "teachingProcess",
    component: teachingProcess
  },
  // 教学计划
  {
    path: "/train/teachingPlan",
    name: "teachingPlan",
    component: teachingPlan
  },
  // 审核
  {
    path: "/pass/index",
    name: "pass",
    component: pass
  },
  {
    path: "pass/passBar",
    component: passBar,
    redirect: "/pass/passIndex",
    children: [
      {
        path: "/pass/passIndex",
        name: "passIndex",
        component: passIndex
      },
      {
        path: "/pass/passList",
        name: "passList",
        component: passList
      }
    ]
  },
  {
    path: "/pass/unDeal",
    name: "unDeal",
    component: unDeal
  },
  {
    path: "/pass/deal",
    name: "deal",
    component: deal
  },
  // 班级课表
  {
    path: "/classTable/index",
    name: "classTable",
    component: classTable
  }
];
export default newTeacherRoute;



// WEBPACK FOOTER //
// ./src/router/newTeacher.js