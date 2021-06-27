// 实验室扫码
const laboratory = [
  {
    path:'/laboratory/index',
    name:'laboratoryIndex',
    meta: {
      title:'实验使用登记&安全检查'
    },
    component:() => import('@/components/pages/laboratory/index.vue')
  },
  {
    path:'/laboratory/repair',
    name:'laboratoryRepair',
    meta: {
      title:'实验室工位报修'
    },
    component:() => import('@/components/pages/laboratory/repair.vue')
  },
  {
    path:'/laboratory/sign',
    name:'laboratorySign',
    meta: {
      title:'实验室使用登记'
    },
    component:() => import('@/components/pages/laboratory/useSign/index.vue')
  },
  {
    path:'/laboratory/random',
    name:'laboratoryRandom',
    meta: {
      title:'随机检查'
    },
    component:() => import('@/components/pages/laboratory/random/index.vue')
  },
  {
    path:'/laboratory/safe',
    name:'laboratorySafe',
    meta: {
      title:'安全检查活动列表'
    },
    component:() => import('@/components/pages/laboratory/safety/index.vue')
  },
  // 项目清单
  {
    path:'/laboratory/list',
    name:'laboratoryList',
    meta: {
      title:'项目清单'
    },
    component:() => import('@/components/pages/laboratory/safety/list.vue')
  },
  {
    path:'/laboratory/pic',
    name:'laboratoryPic',
    meta: {
      title:'检查照片'
    },
    component:() => import('@/components/pages/laboratory/safety/pic.vue')
  },
  {
    path:'/laboratory/main',
    name:'laboratoryMain',
    meta: {
      title:'实验室安全检查提交'
    },
    component:() => import('@/components/pages/laboratory/safety/main.vue')
  },
  // 安全检查整改
  {
    path:'/laboratory/rectify',
    name:'laboratoryRectify',
    meta: {
      title:'安全检查整改'
    },
    component:() => import('@/components/pages/laboratory/rectify/index.vue')
  },
  {
    path:'/laboratory/way',
    name:'laboratoryWay',
    meta: {
      title:'整改教室'
    },
    component:() => import('@/components/pages/laboratory/rectify/way.vue')
  },
  {
    path:'/laboratory/rec',
    name:'laboratoryRec',
    meta: {
      title:'整改'
    },
    component:() => import('@/components/pages/laboratory/rectify/rec.vue')
  },
  {
    path:'/laboratory/pro',
    name:'laboratoryPro',
    meta: {
      title:'项目清单'
    },
    component:() => import('@/components/pages/laboratory/rectify/pro.vue')
  },
  {
    path:'/laboratory/pics',
    name:'laboratoryPics',
    meta: {
      title:'查看检查照片'
    },
    component:() => import('@/components/pages/laboratory/rectify/pic.vue')
  },
]
export default laboratory


// WEBPACK FOOTER //
// ./src/router/laboratory.js