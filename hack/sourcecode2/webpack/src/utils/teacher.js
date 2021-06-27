import service from './request'
import {baseURL} from './baseUrl.js'
const parseFormDataParams = (data) => {
  const formData = new FormData()
  for (const name in data) {
    if (data.hasOwnProperty(name)) {
      if (data[name]) {
        formData.append(name, data[name])
      }
    }
  }
  return formData
}
const tApi = {
  queryMyClassList : query => {
    return service({
      url: '/teacher/myClassList',
      method: 'post',
      baseURL,
      params: query
    })
  },
  createChat : query => {
    return service({
      url: '/teacher/createChat',
      method: 'post',
      baseURL,
      params: query
    })
  },
  /** 
   * 审核
  */
 queryPlanVerifyList : query => {
  return service({
    url: '/examine/getjhwt_list',
    method: 'post',
    baseURL,
    params: query
  })
},
queryPlanCourserInfo : query => {
  return service({
    url: '/examine/getjhwtkcxx',
    method: 'post',
    baseURL,
    params: query
  })
},
queryPlanSemHoursInfo : query => {
  return service({
    url: '/examine/getjhwtxqxsxq',
    method: 'post',
    baseURL,
    params: query
  })
},
queryPlanHoursInfo : query => {
  return service({
    url: '/examine/getjhwtxsxq',
    method: 'post',
    baseURL,
    params: query
  })
},
// 书目申请
queryBookList : query => {
  return service({
    url: '/examine/jcsmsh_list',
    method: 'post',
    baseURL,
    params: query
  })
},
queryBookDetail : query => {
  return service({
    url: '/examine/jcsmsh_page',
    method: 'post',
    baseURL,
    params: query
  })
},
//学生用书征订审核列表
queryBookUseList : query => {
  return service({
    url: '/examine/xsyszdsh_list',
    method: 'post',
    baseURL,
    params: query
  })
},
queryBookUseDetail : query => {
  return service({
    url: '/examine/xsyszdsh_page',
    method: 'post',
    baseURL,
    params: query
  })
},
// 学生信息核对审核
queryInfoCheckList : query => {
  return service({
    url: '/examine/getxsxxhd',
    method: 'post',
    baseURL,
    params: query
  })
},
//学生信息核对审核详细
queryInfoCheckDetail : query => {
  return service({
    url: '/examine/getxsxxhdsh',
    method: 'post',
    baseURL,
    params: query
  })
},
// 毕业生信息核对审核
queryGraduateCheckList : query => {
  return service({
    url: '/examine/getbysxx',
    method: 'post',
    baseURL,
    params: query
  })
},
// 毕业生信息核对详细
queryGraduateCheckDetail : query => {
  return service({
    url: '/examine/getbysxxsh',
    method: 'post',
    baseURL,
    params: query
  })
},
//教务处审核列表
queryJwcCheckList : query => {
  return service({
    url: '/examine/getydjwc',
    method: 'post',
    baseURL,
    params: query
  })
},
//教务处审核详细
queryJwcCheckDetail : query => {
  return service({
    url: '/examine/getydjwcsh',
    method: 'post',
    baseURL,
    params: query
  })
},
//乘系数申请审核列表
queryMultipleList : query => {
  return service({
    url: '/examine/getcxssh_list',
    method: 'post',
    baseURL,
    params: query
  })
},
//乘系数申请审核详细信息
queryMultipleDetail : query => {
  return service({
    url: '/examine/getcxssh_info',
    method: 'post',
    baseURL,
    params: query
  })
},
//学生缓考审核列表
queryDelayList : query => {
  return service({
    url: '/examine/gethksh_list',
    method: 'post',
    baseURL,
    params: query
  })
},
//学生缓考审核详情
queryDelayDetail : query => {
  return service({
    url: '/examine/gethksh_info',
    method: 'post',
    baseURL,
    params: query
  })
},
//学生成绩确认审核列表
queryScoreConfirmList : query => {
  return service({
    url: '/examine/getcjqrsh_list',
    method: 'post',
    baseURL,
    params: query
  })
},
//学生成绩确认审核详细信息
queryScoreConfirmDetail : query => {
  return service({
    url: '/examine/getcjqrsh_info',
    method: 'post',
    baseURL,
    params: query
  })
},
// 实验室借用审核
queryLabBorrowList : query => {
  return service({
    url: '/examine/getsysh_list',
    method: 'post',
    baseURL,
    params: query
  })
},
// 教学进度审核列表
queryTeachProcessList : query => {
  return service({
    url: '/examine/getjxjd_list',
    method: 'post',
    baseURL,
    params: query
  })
},
// 教学进度审核基本信息
queryProcessBasicInfo : query => {
  return service({
    url: '/examine/getjxjdjbxx',
    method: 'post',
    baseURL,
    params: query
  })
},
// 教学进度审核进度详情
queryProcessDetail : query => {
  return service({
    url: '/examine/getjxjdjbxq',
    method: 'post',
    baseURL,
    params: query
  })
},
//查卷
queryTestPaperList : query => {
  return service({
    url: '/examine/cjcjshxx_query',
    method: 'post',
    baseURL,
    params: query
  })
},
queryTestPaperDetail : query => {
  return service({
    url: '/examine/cjcjshxx_ck',
    method: 'post',
    baseURL,
    params: query
  })
},
//成绩认定
queryScoreRdList : query => {
  return service({
    url: '/examine/cjrd_query',
    method: 'post',
    baseURL,
    params: query
  })
},
queryScoreRdDetail : query => {
  return service({
    url: '/examine/cjrd_query_ck',
    method: 'post',
    baseURL,
    params: query
  })
},
// 成绩修改
queryScoreAlterList : query => {
  return service({
    url: '/examine/cjxg_query',
    method: 'post',
    baseURL,
    params: query
  })
},
queryScoreAlterDetail : query => {
  return service({
    url: '/examine/cjxg_query_ck',
    method: 'post',
    baseURL,
    params: query
  })
},
// 考场查询
queryExamPlaceInfo : query => {
  return service({
    url: 'kaowu/getkccx',
    method: 'post',
    baseURL,
    params: query
  })
},
// 教室借用 借用流程说明
queryRoomBorrowLcsm : query => {
  return service({
    url: '/teacher/getJylcsm',
    method: 'post',
    baseURL,
    params: query
  })
},
}
export default tApi


// WEBPACK FOOTER //
// ./src/utils/teacher.js